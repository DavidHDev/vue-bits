<script lang="ts">
import type { CSSProperties } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js';

export type ModelViewerEnvironment =
  | 'apartment'
  | 'city'
  | 'dawn'
  | 'forest'
  | 'lobby'
  | 'night'
  | 'park'
  | 'studio'
  | 'sunset'
  | 'warehouse'
  | 'none';

export type ModelViewerIntro = 'rise' | 'spin' | 'fade' | 'none';

export interface ModelViewerHandle {
  capture: (type?: string) => string | null;
}

export type ModelViewerSettings = {
  autoRotate: boolean;
  autoRotateSpeed: number;
  autoRotateDelay: number;
  dragRotate: boolean;
  turntable: boolean;
  zoom: boolean;
  minZoom: number;
  maxZoom: number;
  hoverTilt: number;
  float: number;
  shadow: boolean;
  shadowOpacity: number;
  intro: ModelViewerIntro;
  startAngle: number;
  tilt: number;
  offsetX: number;
  offsetY: number;
  fit: number;
  resetOnDoubleClick: boolean;
  reducedMotion: boolean;
};

export interface ModelViewerProps {
  url: string;
  width?: number | string;
  height?: number | string;
  environment?: ModelViewerEnvironment;
  environmentIntensity?: number;
  exposure?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  autoRotateDelay?: number;
  dragRotate?: boolean;
  turntable?: boolean;
  zoom?: boolean;
  minZoom?: number;
  maxZoom?: number;
  hoverTilt?: number;
  float?: number;
  shadow?: boolean;
  shadowOpacity?: number;
  intro?: ModelViewerIntro;
  startAngle?: number;
  tilt?: number;
  offsetX?: number;
  offsetY?: number;
  fit?: number;
  resetOnDoubleClick?: boolean;
  className?: string;
  style?: CSSProperties;
  onModelLoaded?: () => void;
}

type Bounds = { scale: number; center: THREE.Vector3; radius: number; floor: number };

type Motion = {
  yaw: number;
  pitch: number;
  yawVelocity: number;
  pitchVelocity: number;
  zoom: number;
  zoomGoal: number;
  tiltX: number;
  tiltY: number;
  tiltGoalX: number;
  tiltGoalY: number;
  spinSpeed: number;
  idle: number;
  dragging: boolean;
  intro: number;
  clock: number;
  reset: { yaw: number; pitch: number } | null;
};

type ContactShadows = {
  group: THREE.Group;
  material: THREE.MeshBasicMaterial;
  render: (scene: THREE.Scene) => void;
  dispose: () => void;
};

type Stage = {
  object: THREE.Object3D;
  bounds: Bounds;
  place: THREE.Group;
  floatGroup: THREE.Group;
  tiltGroup: THREE.Group;
  spinGroup: THREE.Group;
  motion: Motion;
  shadows: ContactShadows | null;
};

type Viewer = {
  update: (settings: ModelViewerSettings) => void;
  setUrl: (url: string | undefined) => void;
  setEnvironment: (environment: ModelViewerEnvironment, intensity: number) => void;
  setExposure: (value: number) => void;
  capture: (type?: string) => string | null;
  destroy: () => void;
};

const FOV = 30;
const INTRO_SECONDS = 1.3;
const DRAG_SPEED = 0.0065;
const PITCH_LIMIT = (65 * Math.PI) / 180;
const ENVIRONMENT_ROOT = 'https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/';
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/';

const ENVIRONMENT_FILES: Record<Exclude<ModelViewerEnvironment, 'none'>, string> = {
  apartment: 'lebombo_1k.hdr',
  city: 'potsdamer_platz_1k.hdr',
  dawn: 'kiara_1_dawn_1k.hdr',
  forest: 'forest_slope_1k.hdr',
  lobby: 'st_fagans_interior_1k.hdr',
  night: 'dikhololo_night_1k.hdr',
  park: 'rooitou_park_1k.hdr',
  studio: 'studio_small_03_1k.hdr',
  sunset: 'venice_sunset_1k.hdr',
  warehouse: 'empty_warehouse_01_1k.hdr'
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const measured = new WeakMap<THREE.Object3D, Bounds>();
const announced = new WeakSet<THREE.Object3D>();
const models = new Map<string, Promise<THREE.Object3D>>();
const environments = new Map<string, Promise<THREE.DataTexture>>();
let dracoLoader: DRACOLoader | null = null;

const measure = (object: THREE.Object3D): Bounds => {
  const cached = measured.get(object);
  if (cached) return cached;
  const box = new THREE.Box3().setFromObject(object);
  const extent = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = 2 / Math.max(extent.x, extent.y, extent.z, 0.0001);
  const bounds = { scale, center, radius: (extent.length() / 2) * scale, floor: (extent.y / 2) * scale };
  measured.set(object, bounds);
  return bounds;
};

const loadModel = (url: string) => {
  const cached = models.get(url);
  if (cached) return cached;
  const extension = (url.split('?')[0].split('.').pop() ?? '').toLowerCase();
  let pending: Promise<THREE.Object3D>;
  if (extension === 'fbx') {
    pending = new FBXLoader().loadAsync(url);
  } else if (extension === 'obj') {
    pending = new OBJLoader().loadAsync(url);
  } else {
    const loader = new GLTFLoader();
    if (!dracoLoader) dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    loader.setDRACOLoader(dracoLoader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    pending = loader.loadAsync(url).then(gltf => gltf.scene);
  }
  models.set(url, pending);
  pending.catch(() => models.delete(url));
  return pending;
};

const loadEnvironment = (environment: Exclude<ModelViewerEnvironment, 'none'>) => {
  const file = ENVIRONMENT_FILES[environment];
  const cached = environments.get(file);
  if (cached) return cached;
  const pending = new HDRLoader()
    .setPath(ENVIRONMENT_ROOT)
    .loadAsync(file)
    .then(texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.LinearSRGBColorSpace;
      return texture;
    });
  environments.set(file, pending);
  pending.catch(() => environments.delete(file));
  return pending;
};

const createContactShadows = (
  gl: THREE.WebGLRenderer,
  {
    position,
    opacity,
    scale,
    blur,
    far,
    resolution,
    color
  }: {
    position: [number, number, number];
    opacity: number;
    scale: number;
    blur: number;
    far: number;
    resolution: number;
    color: string;
  }
): ContactShadows => {
  const width = scale;
  const height = scale;
  const renderTarget = new THREE.WebGLRenderTarget(resolution, resolution);
  const renderTargetBlur = new THREE.WebGLRenderTarget(resolution, resolution);
  renderTargetBlur.texture.generateMipmaps = renderTarget.texture.generateMipmaps = false;
  const planeGeometry = new THREE.PlaneGeometry(width, height).rotateX(Math.PI / 2);
  const blurPlane = new THREE.Mesh(planeGeometry);
  const depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.depthTest = depthMaterial.depthWrite = false;
  depthMaterial.onBeforeCompile = shader => {
    shader.uniforms = { ...shader.uniforms, ucolor: { value: new THREE.Color(color) } };
    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `uniform vec3 ucolor;
           void main() {
          `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4( vec3( 1.0 - fragCoordZ ), opacity );',
      'vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );'
    );
  };
  const horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader);
  const verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
  verticalBlurMaterial.depthTest = horizontalBlurMaterial.depthTest = false;

  const group = new THREE.Group();
  group.rotation.x = Math.PI / 2;
  group.position.set(...position);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    map: renderTarget.texture,
    opacity,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(planeGeometry, material);
  mesh.scale.set(1, -1, 1);
  mesh.rotation.set(-Math.PI / 2, 0, 0);
  const shadowCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, far);
  group.add(mesh, shadowCamera);

  const blurShadows = (amount: number) => {
    blurPlane.visible = true;
    blurPlane.material = horizontalBlurMaterial;
    horizontalBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
    horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256;
    gl.setRenderTarget(renderTargetBlur);
    gl.render(blurPlane, shadowCamera);
    blurPlane.material = verticalBlurMaterial;
    verticalBlurMaterial.uniforms.tDiffuse.value = renderTargetBlur.texture;
    verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256;
    gl.setRenderTarget(renderTarget);
    gl.render(blurPlane, shadowCamera);
    blurPlane.visible = false;
  };

  const render = (scene: THREE.Scene) => {
    const initialBackground = scene.background;
    const initialOverrideMaterial = scene.overrideMaterial;
    group.visible = false;
    scene.background = null;
    scene.overrideMaterial = depthMaterial;
    gl.setRenderTarget(renderTarget);
    gl.render(scene, shadowCamera);
    blurShadows(blur);
    blurShadows(blur * 0.4);
    gl.setRenderTarget(null);
    group.visible = true;
    scene.overrideMaterial = initialOverrideMaterial;
    scene.background = initialBackground;
  };

  const dispose = () => {
    group.removeFromParent();
    renderTarget.dispose();
    renderTargetBlur.dispose();
    planeGeometry.dispose();
    depthMaterial.dispose();
    horizontalBlurMaterial.dispose();
    verticalBlurMaterial.dispose();
    material.dispose();
  };

  return { group, material, render, dispose };
};

const createViewer = (
  canvas: HTMLCanvasElement,
  sizeElement: HTMLElement,
  container: HTMLElement,
  initial: ModelViewerSettings,
  onReady: () => void
): Viewer => {
  const gl = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  });
  gl.outputColorSpace = THREE.SRGBColorSpace;
  gl.toneMapping = THREE.NeutralToneMapping;
  gl.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 100);
  camera.position.set(0, 0, 6);
  const light = new THREE.DirectionalLight(0xffffff, 0.6);
  light.position.set(3, 5, 4);
  scene.add(light);

  let settings = initial;
  let stage: Stage | null = null;
  let visible = true;
  let disposed = false;
  let frame = 0;
  let previousTime = 0;
  let currentUrl: string | undefined;
  let modelToken = 0;
  let currentEnvironment: ModelViewerEnvironment | null = null;
  let environmentToken = 0;
  let environmentTexture: THREE.DataTexture | null = null;
  const size = { width: 0, height: 0 };

  const invalidate = () => {
    if (disposed || frame) return;
    frame = requestAnimationFrame(render);
  };

  const resize = (width: number, height: number) => {
    if (width === size.width && height === size.height) return;
    size.width = width;
    size.height = height;
    gl.setSize(width, height);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    invalidate();
  };

  const tick = (current: Stage, delta: number) => {
    const { place, floatGroup, tiltGroup, spinGroup, bounds } = current;
    const s = settings;
    const m = current.motion;
    const dt = Math.min(delta, 0.05);
    m.clock += dt;
    m.idle += dt;
    const reduce = s.reducedMotion;

    if (m.intro < 1) m.intro = reduce ? 1 : Math.min(1, m.intro + dt / INTRO_SECONDS);
    const eased = 1 - Math.pow(1 - m.intro, 3);

    if (m.reset) {
      m.yaw += (m.reset.yaw - m.yaw) * (1 - Math.exp(-dt * 7));
      m.pitch += (m.reset.pitch - m.pitch) * (1 - Math.exp(-dt * 7));
      if (Math.abs(m.reset.yaw - m.yaw) < 0.001 && Math.abs(m.reset.pitch - m.pitch) < 0.001) m.reset = null;
    } else if (!m.dragging) {
      const decay = Math.exp(-dt * 4.5);
      m.yaw += m.yawVelocity * dt;
      m.pitch = THREE.MathUtils.clamp(m.pitch + m.pitchVelocity * dt, -PITCH_LIMIT, PITCH_LIMIT);
      m.yawVelocity *= decay;
      m.pitchVelocity *= decay;
      if (s.turntable) m.pitch += (toRadians(s.tilt) - m.pitch) * (1 - Math.exp(-dt * 4));
    }

    const spinning = s.autoRotate && !reduce && !m.dragging && m.idle > s.autoRotateDelay;
    m.spinSpeed += ((spinning ? s.autoRotateSpeed : 0) - m.spinSpeed) * (1 - Math.exp(-dt * 2));
    m.yaw += m.spinSpeed * dt;

    m.zoom += (m.zoomGoal - m.zoom) * (1 - Math.exp(-dt * 8));
    m.tiltX += (m.tiltGoalX - m.tiltX) * (1 - Math.exp(-dt * 6));
    m.tiltY += (m.tiltGoalY - m.tiltY) * (1 - Math.exp(-dt * 6));

    const aspect = size.width / Math.max(size.height, 1);
    const halfView = Math.tan(toRadians(FOV) / 2);
    const fitDistance = bounds.radius / (Math.max(s.fit, 0.05) * halfView * Math.min(1, aspect));
    const distance = fitDistance / m.zoom;
    camera.position.set(0, 0, distance);
    camera.near = distance / 50;
    camera.far = distance * 50;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    const halfHeight = fitDistance * halfView;
    place.position.set(s.offsetX * halfHeight * aspect, s.offsetY * halfHeight, 0);

    const intro = s.intro;
    const rise = intro === 'rise' ? (1 - eased) * -0.45 : 0;
    const grow = intro === 'rise' ? 0.9 + 0.1 * eased : 1;
    const twist = intro === 'spin' ? (1 - eased) * -Math.PI * 1.2 : intro === 'rise' ? (1 - eased) * -0.5 : 0;
    const bob = reduce ? 0 : Math.sin(m.clock * 1.3) * s.float * 0.06;
    floatGroup.position.y = rise + bob;
    floatGroup.scale.setScalar(grow);
    tiltGroup.rotation.set(m.tiltX, m.tiltY, 0);
    spinGroup.rotation.set(m.pitch, m.yaw + twist, 0, 'YXZ');

    const settling =
      m.intro < 1 ||
      m.dragging ||
      !!m.reset ||
      Math.abs(m.yawVelocity) + Math.abs(m.pitchVelocity) > 0.0005 ||
      Math.abs(m.zoomGoal - m.zoom) > 0.0005 ||
      Math.abs(m.tiltGoalX - m.tiltX) + Math.abs(m.tiltGoalY - m.tiltY) > 0.0005 ||
      m.spinSpeed > 0.0005 ||
      (s.autoRotate && !reduce) ||
      (s.float > 0 && !reduce);
    return settling;
  };

  function render(now: number) {
    frame = 0;
    if (disposed) return;
    const delta = previousTime ? (now - previousTime) / 1000 : 0;
    previousTime = now;
    const settling = stage ? tick(stage, delta) : false;
    stage?.shadows?.render(scene);
    gl.render(scene, camera);
    if (settling && visible) invalidate();
  }

  const syncShadows = () => {
    if (!stage) return;
    if (settings.shadow && !stage.shadows) {
      const { bounds } = stage;
      stage.shadows = createContactShadows(gl, {
        position: [0, -bounds.floor - 0.08, 0],
        opacity: settings.shadowOpacity,
        scale: bounds.radius * 4,
        blur: 2.6,
        far: bounds.floor * 2 + 0.5,
        resolution: 512,
        color: '#000000'
      });
      stage.place.add(stage.shadows.group);
    } else if (!settings.shadow && stage.shadows) {
      stage.shadows.dispose();
      stage.shadows = null;
    }
    if (stage.shadows) stage.shadows.material.opacity = settings.shadowOpacity;
  };

  const clearStage = () => {
    if (!stage) return;
    stage.shadows?.dispose();
    stage.place.removeFromParent();
    stage = null;
  };

  const mountStage = (object: THREE.Object3D) => {
    const bounds = measure(object);
    const place = new THREE.Group();
    const floatGroup = new THREE.Group();
    const tiltGroup = new THREE.Group();
    const spinGroup = new THREE.Group();
    const fitGroup = new THREE.Group();
    fitGroup.scale.setScalar(bounds.scale);
    fitGroup.position.set(
      -bounds.center.x * bounds.scale,
      -bounds.center.y * bounds.scale,
      -bounds.center.z * bounds.scale
    );
    fitGroup.add(object);
    spinGroup.add(fitGroup);
    tiltGroup.add(spinGroup);
    floatGroup.add(tiltGroup);
    place.add(floatGroup);
    scene.add(place);
    const s = settings;
    stage = {
      object,
      bounds,
      place,
      floatGroup,
      tiltGroup,
      spinGroup,
      shadows: null,
      motion: {
        yaw: toRadians(s.startAngle),
        pitch: toRadians(s.tilt),
        yawVelocity: 0,
        pitchVelocity: 0,
        zoom: 1,
        zoomGoal: 1,
        tiltX: 0,
        tiltY: 0,
        tiltGoalX: 0,
        tiltGoalY: 0,
        spinSpeed: 0,
        idle: 0,
        dragging: false,
        intro: s.intro === 'none' ? 1 : 0,
        clock: 0,
        reset: null
      }
    };
    syncShadows();
    if (!announced.has(object)) {
      announced.add(object);
      onReady();
    }
    invalidate();
  };

  const pointers = new Map<number, { x: number; y: number; t: number }>();
  let pinchStart = 0;
  let zoomStart = 1;

  const onDown = (event: PointerEvent) => {
    if (!stage) return;
    const s = settings;
    const motion = stage.motion;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, t: event.timeStamp });
    if (pointers.size === 2 && s.zoom) {
      const [a, b] = [...pointers.values()];
      pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
      zoomStart = motion.zoomGoal;
      motion.dragging = false;
    } else if (pointers.size === 1 && s.dragRotate && (event.pointerType !== 'mouse' || event.button === 0)) {
      motion.dragging = true;
      motion.yawVelocity = 0;
      motion.pitchVelocity = 0;
      canvas.setPointerCapture?.(event.pointerId);
      canvas.style.cursor = 'grabbing';
    }
    motion.idle = 0;
    invalidate();
  };

  const onMove = (event: PointerEvent) => {
    if (!stage) return;
    const s = settings;
    const motion = stage.motion;
    const rect = canvas.getBoundingClientRect();
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      motion.tiltGoalX = ny * s.hoverTilt * 0.6;
      motion.tiltGoalY = nx * s.hoverTilt;
    }
    const last = pointers.get(event.pointerId);
    if (last) {
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      const elapsed = Math.max((event.timeStamp - last.t) / 1000, 1 / 240);
      last.x = event.clientX;
      last.y = event.clientY;
      last.t = event.timeStamp;
      if (pointers.size === 2 && s.zoom && pinchStart > 0) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        motion.zoomGoal = THREE.MathUtils.clamp((zoomStart * distance) / pinchStart, s.minZoom, s.maxZoom);
      } else if (motion.dragging) {
        const m = motion;
        m.yaw += dx * DRAG_SPEED;
        m.yawVelocity = m.yawVelocity * 0.4 + ((dx * DRAG_SPEED) / elapsed) * 0.6;
        if (!s.turntable) {
          m.pitch = THREE.MathUtils.clamp(m.pitch + dy * DRAG_SPEED, -PITCH_LIMIT, PITCH_LIMIT);
          m.pitchVelocity = m.pitchVelocity * 0.4 + ((dy * DRAG_SPEED) / elapsed) * 0.6;
        }
        m.idle = 0;
      }
    }
    invalidate();
  };

  const onUp = (event: PointerEvent) => {
    if (!stage) return;
    const motion = stage.motion;
    const last = pointers.get(event.pointerId);
    if (last && event.timeStamp - last.t > 80) {
      motion.yawVelocity = 0;
      motion.pitchVelocity = 0;
    }
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = 0;
    if (pointers.size === 0) {
      motion.dragging = false;
      canvas.style.cursor = '';
    }
    invalidate();
  };

  const onLeave = () => {
    if (!stage) return;
    stage.motion.tiltGoalX = 0;
    stage.motion.tiltGoalY = 0;
    invalidate();
  };

  const onWheel = (event: WheelEvent) => {
    if (!stage) return;
    const s = settings;
    if (!s.zoom || !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    const m = stage.motion;
    m.zoomGoal = THREE.MathUtils.clamp(m.zoomGoal * Math.exp(-event.deltaY * 0.01), s.minZoom, s.maxZoom);
    m.idle = 0;
    invalidate();
  };

  const onDoubleClick = () => {
    if (!stage) return;
    const s = settings;
    if (!s.resetOnDoubleClick) return;
    const m = stage.motion;
    const turns = Math.round((m.yaw - toRadians(s.startAngle)) / (Math.PI * 2));
    m.reset = { yaw: toRadians(s.startAngle) + turns * Math.PI * 2, pitch: toRadians(s.tilt) };
    m.zoomGoal = 1;
    m.yawVelocity = 0;
    m.pitchVelocity = 0;
    m.idle = 0;
    invalidate();
  };

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('dblclick', onDoubleClick);

  const resizeObserver = new ResizeObserver(() => {
    const rect = sizeElement.getBoundingClientRect();
    resize(rect.width, rect.height);
  });
  resizeObserver.observe(sizeElement);
  const initialRect = sizeElement.getBoundingClientRect();
  resize(initialRect.width, initialRect.height);

  const intersectionObserver = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (visible) invalidate();
  });
  intersectionObserver.observe(container);

  const setTexture = (texture: THREE.DataTexture | null) => {
    const previous = environmentTexture;
    environmentTexture = texture;
    scene.environment = texture;
    if (previous && previous !== texture) previous.dispose();
    invalidate();
  };

  return {
    update: next => {
      settings = next;
      syncShadows();
      invalidate();
    },
    setUrl: url => {
      if (url === currentUrl) return;
      currentUrl = url;
      const token = ++modelToken;
      clearStage();
      invalidate();
      if (!url) return;
      loadModel(url)
        .then(source => {
          if (disposed || token !== modelToken) return;
          mountStage(source.clone(true));
        })
        .catch(error => {
          if (!disposed && token === modelToken) console.error(error);
        });
    },
    setEnvironment: (environment, intensity) => {
      scene.environmentIntensity = intensity;
      if (environment === currentEnvironment) {
        invalidate();
        return;
      }
      currentEnvironment = environment;
      const token = ++environmentToken;
      if (environment === 'none') {
        setTexture(null);
        return;
      }
      loadEnvironment(environment)
        .then(texture => {
          if (disposed || token !== environmentToken) return;
          setTexture(texture);
        })
        .catch(error => {
          if (!disposed && token === environmentToken) console.error(error);
        });
    },
    setExposure: value => {
      gl.toneMappingExposure = value;
      invalidate();
    },
    capture: (type = 'image/png') => (disposed ? null : canvas.toDataURL(type)),
    destroy: () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('dblclick', onDoubleClick);
      clearStage();
      environmentTexture?.dispose();
      environmentTexture = null;
      scene.environment = null;
      gl.renderLists.dispose();
      gl.dispose();
      gl.forceContextLoss();
    }
  };
};
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';

const props = withDefaults(defineProps<ModelViewerProps>(), {
  width: 400,
  height: 400,
  environment: 'studio',
  environmentIntensity: 1,
  exposure: 1,
  autoRotate: true,
  autoRotateSpeed: 0.4,
  autoRotateDelay: 2,
  dragRotate: true,
  turntable: false,
  zoom: true,
  minZoom: 0.7,
  maxZoom: 2,
  hoverTilt: 0.15,
  float: 0.3,
  shadow: true,
  shadowOpacity: 0.45,
  intro: 'rise',
  startAngle: -30,
  tilt: 10,
  offsetX: 0,
  offsetY: 0,
  fit: 0.8,
  resetOnDoubleClick: true,
  className: '',
  style: undefined,
  onModelLoaded: undefined
});

const containerRef = ref<HTMLDivElement | null>(null);
const sizeRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const viewer = shallowRef<Viewer | null>(null);
const ready = ref(false);

const toSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const settings = computed<ModelViewerSettings>(() => ({
  autoRotate: props.autoRotate,
  autoRotateSpeed: props.autoRotateSpeed,
  autoRotateDelay: Math.max(0, props.autoRotateDelay),
  dragRotate: props.dragRotate,
  turntable: props.turntable,
  zoom: props.zoom,
  minZoom: Math.min(props.minZoom, props.maxZoom),
  maxZoom: Math.max(props.minZoom, props.maxZoom),
  hoverTilt: Math.max(0, props.hoverTilt),
  float: Math.max(0, props.float),
  shadow: props.shadow,
  shadowOpacity: props.shadowOpacity,
  intro: props.intro,
  startAngle: props.startAngle,
  tilt: props.tilt,
  offsetX: props.offsetX,
  offsetY: props.offsetY,
  fit: props.fit,
  resetOnDoubleClick: props.resetOnDoubleClick,
  reducedMotion: typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}));

const containerStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  width: toSize(props.width),
  height: toSize(props.height),
  ...props.style
}));

const canvasStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  pointerEvents: 'auto',
  touchAction: 'pan-y',
  cursor: props.dragRotate ? 'grab' : 'default',
  opacity: ready.value || props.intro === 'none' ? 1 : 0,
  transition: props.intro === 'none' ? 'none' : 'opacity 0.6s ease'
}));

const handleReady = () => {
  ready.value = true;
  props.onModelLoaded?.();
};

const capture = (type = 'image/png') => viewer.value?.capture(type) ?? null;

defineExpose<ModelViewerHandle>({ capture });

onMounted(() => {
  if (!canvasRef.value || !sizeRef.value || !containerRef.value) return;
  const instance = createViewer(canvasRef.value, sizeRef.value, containerRef.value, settings.value, handleReady);
  instance.setExposure(props.exposure);
  instance.setEnvironment(props.environment, props.environmentIntensity);
  viewer.value = instance;
  instance.setUrl(props.url);
});

onBeforeUnmount(() => {
  viewer.value?.destroy();
  viewer.value = null;
});

watch(settings, value => viewer.value?.update(value));
watch(
  () => props.exposure,
  value => viewer.value?.setExposure(value)
);
watch(
  () => [props.environment, props.environmentIntensity] as const,
  ([environment, intensity]) => viewer.value?.setEnvironment(environment, intensity)
);
watch(
  () => props.url,
  value => {
    ready.value = false;
    viewer.value?.setUrl(value);
  }
);
</script>

<template>
  <div ref="containerRef" :class="className" :style="containerStyle">
    <div :style="canvasStyle">
      <div ref="sizeRef" style="width: 100%; height: 100%">
        <canvas ref="canvasRef" style="display: block" />
      </div>
    </div>
  </div>
</template>
