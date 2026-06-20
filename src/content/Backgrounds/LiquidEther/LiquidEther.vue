<template>
  <div ref="mountRef" :class="`w-full h-full relative overflow-hidden ${className || ''}`" :style="style" />
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue';

interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

interface SimOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

interface ShaderPassProps {
  material?: THREE.ShaderMaterialParameters;
  output?: THREE.WebGLRenderTarget | null;
  output0?: THREE.WebGLRenderTarget | null;
  output1?: THREE.WebGLRenderTarget | null;
}

interface CommonSimProps {
  cellScale: THREE.Vector2;
  boundarySpace?: THREE.Vector2;
  dt: number;
  fboSize?: THREE.Vector2;
}

interface AdvectionSimProps extends CommonSimProps {
  src: THREE.WebGLRenderTarget;
  dst: THREE.WebGLRenderTarget;
}

interface ExternalForceSimProps {
  cellScale: THREE.Vector2;
  cursor_size: number;
  dst: THREE.WebGLRenderTarget;
}

interface ViscousSimProps extends CommonSimProps {
  viscous: number;
  src: THREE.WebGLRenderTarget;
  dst: THREE.WebGLRenderTarget;
  dst_: THREE.WebGLRenderTarget;
}

interface DivergenceSimProps extends CommonSimProps {
  src: THREE.WebGLRenderTarget;
  dst: THREE.WebGLRenderTarget;
}

interface PoissonSimProps extends CommonSimProps {
  src: THREE.WebGLRenderTarget;
  dst: THREE.WebGLRenderTarget;
  dst_: THREE.WebGLRenderTarget;
}

interface PressureSimProps extends CommonSimProps {
  src_p: THREE.WebGLRenderTarget;
  src_v: THREE.WebGLRenderTarget;
  dst: THREE.WebGLRenderTarget;
}

const props = withDefaults(defineProps<LiquidEtherProps>(), {
  mouseForce: 20,
  cursorSize: 100,
  isViscous: false,
  viscous: 30,
  iterationsViscous: 32,
  iterationsPoisson: 32,
  dt: 0.014,
  BFECC: true,
  resolution: 0.5,
  isBounce: false,
  colors: () => ['#5227FF', '#FF9FFC', '#B19EEF'],
  style: () => ({}),
  className: '',
  autoDemo: true,
  autoSpeed: 0.5,
  autoIntensity: 2.2,
  takeoverDuration: 0.25,
  autoResumeDelay: 1000,
  autoRampDuration: 0.6
});

const mountRef = ref<HTMLDivElement | null>(null);
const intersectionObserverRef = ref<IntersectionObserver | null>(null);
const isVisibleRef = ref<boolean>(true);
const rafRef = ref<number | null>(null);
const resizeObserverRef = ref<ResizeObserver | null>(null);
const resizeRafRef = ref<number | null>(null);

const initWebGL = () => {
  if (!mountRef.value) return;

  function makePaletteTexture(stops: string[]): THREE.DataTexture {
    let arr: string[];
    if (Array.isArray(stops) && stops.length > 0) {
      arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
    } else {
      arr = ['#ffffff', '#ffffff'];
    }
    const w = arr.length;
    const data = new Uint8Array(w * 4);
    for (let i = 0; i < w; i++) {
      const c = new THREE.Color(arr[i]);
      data[i * 4 + 0] = Math.round(c.r * 255);
      data[i * 4 + 1] = Math.round(c.g * 255);
      data[i * 4 + 2] = Math.round(c.b * 255);
      data[i * 4 + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }

  const paletteTex = makePaletteTexture(props.colors);
  const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

  class CommonClass {
    width = 0;
    height = 0;
    aspect = 1;
    pixelRatio = 1;
    time = 0;
    delta = 0;
    container: HTMLElement | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    clock: THREE.Clock | null = null;

    init(container: HTMLElement) {
      this.container = container;
      this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      this.resize();
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.autoClear = false;
      this.renderer.setClearColor(new THREE.Color(0x000000), 0);
      this.renderer.setPixelRatio(this.pixelRatio);
      this.renderer.setSize(this.width, this.height);
      const el = this.renderer.domElement;
      el.style.width = '100%';
      el.style.height = '100%';
      el.style.display = 'block';
      this.clock = new THREE.Clock();
      this.clock.start();
    }

    resize() {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      this.width = Math.max(1, Math.floor(rect.width));
      this.height = Math.max(1, Math.floor(rect.height));
      this.aspect = this.width / this.height;
      if (this.renderer) this.renderer.setSize(this.width, this.height, false);
    }

    update() {
      if (!this.clock) return;
      this.delta = this.clock.getDelta();
      this.time += this.delta;
    }
  }
  const Common = new CommonClass();

  class MouseClass {
    mouseMoved = false;
    coords = new THREE.Vector2();
    coords_old = new THREE.Vector2();
    diff = new THREE.Vector2();
    timer: number | null = null;
    container: HTMLElement | null = null;
    isHoverInside = false;
    hasUserControl = false;
    isAutoActive = false;
    autoIntensity = 2.0;
    takeoverActive = false;
    takeoverStartTime = 0;
    takeoverDuration = 0.25;
    takeoverFrom = new THREE.Vector2();
    takeoverTo = new THREE.Vector2();
    onInteract: (() => void) | null = null;

    private _onMouseMove = this.onDocumentMouseMove.bind(this);
    private _onTouchStart = this.onDocumentTouchStart.bind(this);
    private _onTouchMove = this.onDocumentTouchMove.bind(this);
    private _onMouseEnter = this.onMouseEnter.bind(this);
    private _onMouseLeave = this.onMouseLeave.bind(this);
    private _onTouchEnd = this.onTouchEnd.bind(this);

    init(container: HTMLElement) {
      this.container = container;
      container.addEventListener('mousemove', this._onMouseMove);
      container.addEventListener('touchstart', this._onTouchStart, { passive: true });
      container.addEventListener('touchmove', this._onTouchMove, { passive: true });
      container.addEventListener('mouseenter', this._onMouseEnter);
      container.addEventListener('mouseleave', this._onMouseLeave);
      container.addEventListener('touchend', this._onTouchEnd);
    }

    dispose() {
      const c = this.container;
      if (!c) return;
      c.removeEventListener('mousemove', this._onMouseMove);
      c.removeEventListener('touchstart', this._onTouchStart);
      c.removeEventListener('touchmove', this._onTouchMove);
      c.removeEventListener('mouseenter', this._onMouseEnter);
      c.removeEventListener('mouseleave', this._onMouseLeave);
      c.removeEventListener('touchend', this._onTouchEnd);
    }

    setCoords(x: number, y: number) {
      if (!this.container) return;
      if (this.timer) window.clearTimeout(this.timer);
      const rect = this.container.getBoundingClientRect();
      const nx = (x - rect.left) / rect.width;
      const ny = (y - rect.top) / rect.height;
      this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
      this.mouseMoved = true;
      this.timer = window.setTimeout(() => {
        this.mouseMoved = false;
      }, 100);
    }

    setNormalized(nx: number, ny: number) {
      this.coords.set(nx, ny);
      this.mouseMoved = true;
    }

    onDocumentMouseMove(event: MouseEvent) {
      if (this.onInteract) this.onInteract();
      if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;
        this.takeoverFrom.copy(this.coords);
        this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
        this.takeoverStartTime = performance.now();
        this.takeoverActive = true;
        this.hasUserControl = true;
        this.isAutoActive = false;
        return;
      }
      this.setCoords(event.clientX, event.clientY);
      this.hasUserControl = true;
    }

    onDocumentTouchStart(event: TouchEvent) {
      if (event.touches.length === 1) {
        const t = event.touches[0];
        if (this.onInteract) this.onInteract();
        this.setCoords(t.pageX, t.pageY);
        this.hasUserControl = true;
      }
    }

    onDocumentTouchMove(event: TouchEvent) {
      if (event.touches.length === 1) {
        const t = event.touches[0];
        if (this.onInteract) this.onInteract();
        this.setCoords(t.pageX, t.pageY);
      }
    }

    onTouchEnd() {
      this.isHoverInside = false;
    }
    onMouseEnter() {
      this.isHoverInside = true;
    }
    onMouseLeave() {
      this.isHoverInside = false;
    }

    update() {
      if (this.takeoverActive) {
        const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
        if (t >= 1) {
          this.takeoverActive = false;
          this.coords.copy(this.takeoverTo);
          this.coords_old.copy(this.coords);
          this.diff.set(0, 0);
        } else {
          const k = t * t * (3 - 2 * t);
          this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
        }
      }
      this.diff.subVectors(this.coords, this.coords_old);
      this.coords_old.copy(this.coords);
      if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
      if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
    }
  }
  const Mouse = new MouseClass();

  class AutoDriver {
    mouse: MouseClass;
    manager: WebGLManager;
    enabled: boolean;
    speed: number;
    resumeDelay: number;
    rampDurationMs: number;
    active = false;
    current = new THREE.Vector2(0, 0);
    target = new THREE.Vector2();
    lastTime = performance.now();
    activationTime = 0;
    margin = 0.2;
    private _tmpDir = new THREE.Vector2();

    constructor(
      mouse: MouseClass,
      manager: WebGLManager,
      opts: { enabled: boolean; speed: number; resumeDelay: number; rampDuration: number }
    ) {
      this.mouse = mouse;
      this.manager = manager;
      this.enabled = opts.enabled;
      this.speed = opts.speed;
      this.resumeDelay = opts.resumeDelay || 3000;
      this.rampDurationMs = (opts.rampDuration || 0) * 1000;
      this.pickNewTarget();
    }

    pickNewTarget() {
      const r = Math.random;
      this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin));
    }

    forceStop() {
      this.active = false;
      this.mouse.isAutoActive = false;
    }

    update() {
      if (!this.enabled) return;
      const now = performance.now();
      const idle = now - this.manager.lastUserInteraction;
      if (idle < this.resumeDelay || this.mouse.isHoverInside) {
        if (this.active) this.forceStop();
        return;
      }
      if (!this.active) {
        this.active = true;
        this.current.copy(this.mouse.coords);
        this.lastTime = now;
        this.activationTime = now;
      }
      this.mouse.isAutoActive = true;
      let dtSec = (now - this.lastTime) / 1000;
      this.lastTime = now;
      if (dtSec > 0.2) dtSec = 0.016;
      const dir = this._tmpDir.subVectors(this.target, this.current);
      const dist = dir.length();
      if (dist < 0.01) {
        this.pickNewTarget();
        return;
      }
      dir.normalize();
      let ramp = 1;
      if (this.rampDurationMs > 0) {
        const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
        ramp = t * t * (3 - 2 * t);
      }
      const step = this.speed * dtSec * ramp;
      const move = Math.min(step, dist);
      this.current.addScaledVector(dir, move);
      this.mouse.setNormalized(this.current.x, this.current.y);
    }
  }

  const face_vert = `
    attribute vec3 position;
    uniform vec2 px;
    uniform vec2 boundarySpace;
    varying vec2 uv;
    precision highp float;
    void main(){
      vec3 pos = position;
      vec2 scale = 1.0 - boundarySpace * 2.0;
      pos.xy = pos.xy * scale;
      uv = vec2(0.5)+(pos.xy)*0.5;
      gl_Position = vec4(pos, 1.0);
    }
  `;

  const line_vert = `
    attribute vec3 position;
    uniform vec2 px;
    precision highp float;
    varying vec2 uv;
    void main(){
      vec3 pos = position;
      uv = 0.5 + pos.xy * 0.5;
      vec2 n = sign(pos.xy);
      pos.xy = abs(pos.xy) - px * 1.0;
      pos.xy *= n;
      gl_Position = vec4(pos, 1.0);
    }
  `;

  const mouse_vert = `
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
        vec2 pos = position.xy * scale * 2.0 * px + center;
        vUv = uv;
        gl_Position = vec4(pos, 0.0, 1.0);
      }
  `;

  const advection_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform bool isBFECC;
      uniform vec2 fboSize;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
      vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
      if(isBFECC == false){
          vec2 vel = texture2D(velocity, uv).xy;
          vec2 uv2 = uv - vel * dt * ratio;
          vec2 newVel = texture2D(velocity, uv2).xy;
          gl_FragColor = vec4(newVel, 0.0, 0.0);
      } else {
          vec2 spot_new = uv;
          vec2 vel_old = texture2D(velocity, uv).xy;
          vec2 spot_old = spot_new - vel_old * dt * ratio;
          vec2 vel_new1 = texture2D(velocity, spot_old).xy;
          vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
          vec2 error = spot_new2 - spot_new;
          vec2 spot_new3 = spot_new - error / 2.0;
          vec2 vel_2 = texture2D(velocity, spot_new3).xy;
          vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
          vec2 newVel2 = texture2D(velocity, spot_old2).xy; 
          gl_FragColor = vec4(newVel2, 0.0, 0.0);
      }
  }`;

  const color_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform sampler2D palette;
      uniform vec4 bgColor;
      varying vec2 uv;
      void main(){
      vec2 vel = texture2D(velocity, uv).xy;
      float lenv = clamp(length(vel), 0.0, 1.0);
      vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
      vec3 outRGB = mix(bgColor.rgb, c, lenv);
      float outA = mix(bgColor.a, 1.0, lenv);
      gl_FragColor = vec4(outRGB, outA);
  }`;

  const divergence_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
      float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
      float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
      float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
      float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
      float divergence = (x1 - x0 + y1 - y0) / 2.0;
      gl_FragColor = vec4(divergence / dt);
  }`;

  const externalForce_frag = `
      precision highp float;
      uniform vec2 force;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
      vec2 circle = (vUv - 0.5) * 2.0;
      float d = 1.0 - min(length(circle), 1.0);
      d *= d;
      gl_FragColor = vec4(force * d, 0.0, 1.0);
  }`;

  const poisson_frag = `
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D divergence;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
      float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
      float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
      float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
      float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
      float div = texture2D(divergence, uv).r;
      float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
      gl_FragColor = vec4(newP);
  }`;

  const pressure_frag = `
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D velocity;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main(){
      float step = 1.0;
      float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
      float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
      float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
      float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
      vec2 v = texture2D(velocity, uv).xy;
      vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
      v = v - gradP * dt;
      gl_FragColor = vec4(v, 0.0, 1.0);
  }`;

  const viscous_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform sampler2D velocity_new;
      uniform float v;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main(){
      vec2 old = texture2D(velocity, uv).xy;
      vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
      vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
      vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
      vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
      vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
      newv /= 4.0 * (1.0 + v * dt);
      gl_FragColor = vec4(newv, 0.0, 0.0);
  }`;

  class ShaderPass {
    props: ShaderPassProps;
    uniforms?: Record<string, THREE.IUniform>;
    scene: THREE.Scene | null = null;
    camera: THREE.Camera | null = null;
    material: THREE.RawShaderMaterial | null = null;
    geometry: THREE.BufferGeometry | null = null;
    plane: THREE.Mesh | null = null;

    constructor(props: ShaderPassProps) {
      this.props = props;
      this.uniforms = this.props.material?.uniforms;
    }

    init() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.Camera();
      if (this.props.material) {
        this.material = new THREE.RawShaderMaterial(this.props.material);
        this.geometry = new THREE.PlaneGeometry(2, 2);
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
      }
    }

    update() {
      if (!Common.renderer || !this.scene || !this.camera) return;
      Common.renderer.setRenderTarget(this.props.output || null);
      Common.renderer.render(this.scene, this.camera);
      Common.renderer.setRenderTarget(null);
    }
  }

  class Advection extends ShaderPass {
    line!: THREE.LineSegments;

    constructor(simProps: AdvectionSimProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: advection_frag,
          uniforms: {
            boundarySpace: { value: simProps.cellScale },
            px: { value: simProps.cellScale },
            fboSize: { value: simProps.fboSize },
            velocity: { value: simProps.src.texture },
            dt: { value: simProps.dt },
            isBFECC: { value: true }
          }
        },
        output: simProps.dst
      });
      this.init();
    }

    init() {
      super.init();
      const boundaryG = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0
      ]);
      boundaryG.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      const boundaryM = new THREE.RawShaderMaterial({
        vertexShader: line_vert,
        fragmentShader: advection_frag,
        uniforms: this.uniforms!
      });
      this.line = new THREE.LineSegments(boundaryG, boundaryM);
      this.scene!.add(this.line);
    }

    updateArgs(args: { dt: number; isBounce: boolean; BFECC: boolean }) {
      if (!this.uniforms) return;
      this.uniforms.dt.value = args.dt;
      this.line.visible = args.isBounce;
      this.uniforms.isBFECC.value = args.BFECC;
      super.update();
    }
  }

  class ExternalForce extends ShaderPass {
    mouseMesh!: THREE.Mesh;

    constructor(simProps: ExternalForceSimProps) {
      super({ output: simProps.dst });
      this.initForce(simProps);
    }

    initForce(simProps: ExternalForceSimProps) {
      super.init();
      const mouseG = new THREE.PlaneGeometry(1, 1);
      const mouseM = new THREE.RawShaderMaterial({
        vertexShader: mouse_vert,
        fragmentShader: externalForce_frag,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          px: { value: simProps.cellScale },
          force: { value: new THREE.Vector2(0, 0) },
          center: { value: new THREE.Vector2(0, 0) },
          scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) }
        }
      });
      this.mouseMesh = new THREE.Mesh(mouseG, mouseM);
      this.scene!.add(this.mouseMesh);
    }

    updateArgs(args: { mouse_force: number; cursor_size: number; cellScale: THREE.Vector2 }) {
      const forceX = (Mouse.diff.x / 2) * args.mouse_force;
      const forceY = (Mouse.diff.y / 2) * args.mouse_force;
      const cursorSizeX = args.cursor_size * args.cellScale.x;
      const cursorSizeY = args.cursor_size * args.cellScale.y;
      const centerX = Math.min(
        Math.max(Mouse.coords.x, -1 + cursorSizeX + args.cellScale.x * 2),
        1 - cursorSizeX - args.cellScale.x * 2
      );
      const centerY = Math.min(
        Math.max(Mouse.coords.y, -1 + cursorSizeY + args.cellScale.y * 2),
        1 - cursorSizeY - args.cellScale.y * 2
      );

      const uniforms = (this.mouseMesh.material as THREE.RawShaderMaterial).uniforms;
      uniforms.force.value.set(forceX, forceY);
      uniforms.center.value.set(centerX, centerY);
      uniforms.scale.value.set(args.cursor_size, args.cursor_size);
      super.update();
    }
  }

  class Viscous extends ShaderPass {
    constructor(simProps: ViscousSimProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: viscous_frag,
          uniforms: {
            boundarySpace: { value: simProps.boundarySpace },
            velocity: { value: simProps.src.texture },
            velocity_new: { value: simProps.dst_.texture },
            v: { value: simProps.viscous },
            px: { value: simProps.cellScale },
            dt: { value: simProps.dt }
          }
        },
        output0: simProps.dst_,
        output1: simProps.dst
      });
      this.init();
    }

    updateArgs(args: { viscous: number; iterations: number; dt: number }): THREE.WebGLRenderTarget {
      if (!this.uniforms) return this.props.output1!;
      let fbo_out = this.props.output1!;
      this.uniforms.v.value = args.viscous;
      this.uniforms.dt.value = args.dt;

      for (let i = 0; i < args.iterations; i++) {
        const isEven = i % 2 === 0;
        const fbo_in = isEven ? this.props.output0! : this.props.output1!;
        fbo_out = isEven ? this.props.output1! : this.props.output0!;
        this.uniforms.velocity_new.value = fbo_in.texture;
        this.props.output = fbo_out;
        super.update();
      }
      return fbo_out;
    }
  }

  class Divergence extends ShaderPass {
    constructor(simProps: DivergenceSimProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: divergence_frag,
          uniforms: {
            boundarySpace: { value: simProps.boundarySpace },
            velocity: { value: simProps.src.texture },
            px: { value: simProps.cellScale },
            dt: { value: simProps.dt }
          }
        },
        output: simProps.dst
      });
      this.init();
    }

    updateArgs(args: { vel: THREE.WebGLRenderTarget }) {
      if (this.uniforms) this.uniforms.velocity.value = args.vel.texture;
      super.update();
    }
  }

  class Poisson extends ShaderPass {
    constructor(simProps: PoissonSimProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: poisson_frag,
          uniforms: {
            boundarySpace: { value: simProps.boundarySpace },
            pressure: { value: simProps.dst_.texture },
            divergence: { value: simProps.src.texture },
            px: { value: simProps.cellScale }
          }
        },
        output0: simProps.dst_,
        output1: simProps.dst
      });
      this.init();
    }

    updateArgs(args: { iterations: number }): THREE.WebGLRenderTarget {
      let p_out = this.props.output1!;
      for (let i = 0; i < args.iterations; i++) {
        const isEven = i % 2 === 0;
        const p_in = isEven ? this.props.output0! : this.props.output1!;
        p_out = isEven ? this.props.output1! : this.props.output0!;
        if (this.uniforms) this.uniforms.pressure.value = p_in.texture;
        this.props.output = p_out;
        super.update();
      }
      return p_out;
    }
  }

  class Pressure extends ShaderPass {
    constructor(simProps: PressureSimProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: pressure_frag,
          uniforms: {
            boundarySpace: { value: simProps.boundarySpace },
            pressure: { value: simProps.src_p.texture },
            velocity: { value: simProps.src_v.texture },
            px: { value: simProps.cellScale },
            dt: { value: simProps.dt }
          }
        },
        output: simProps.dst
      });
      this.init();
    }

    updateArgs(args: { vel: THREE.WebGLRenderTarget; pressure: THREE.WebGLRenderTarget }) {
      if (this.uniforms) {
        this.uniforms.velocity.value = args.vel.texture;
        this.uniforms.pressure.value = args.pressure.texture;
      }
      super.update();
    }
  }

  class Simulation {
    options: SimOptions;
    fbos: Record<string, THREE.WebGLRenderTarget> = {};
    fboSize = new THREE.Vector2();
    cellScale = new THREE.Vector2();
    boundarySpace = new THREE.Vector2();
    advection!: Advection;
    externalForce!: ExternalForce;
    viscous!: Viscous;
    divergence!: Divergence;
    poisson!: Poisson;
    pressure!: Pressure;

    constructor(options?: Partial<SimOptions>) {
      this.options = {
        iterations_poisson: 32,
        iterations_viscous: 32,
        mouse_force: 20,
        resolution: 0.5,
        cursor_size: 100,
        viscous: 30,
        isBounce: false,
        dt: 0.014,
        isViscous: false,
        BFECC: true,
        ...options
      };
      this.init();
    }

    init() {
      this.calcSize();
      this.createAllFBO();
      this.createShaderPass();
    }

    getFloatType(): THREE.TextureDataType {
      return /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
    }

    createAllFBO() {
      const type = this.getFloatType();
      const keys = ['vel_0', 'vel_1', 'vel_viscous0', 'vel_viscous1', 'div', 'pressure_0', 'pressure_1'];
      keys.forEach(key => {
        this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, {
          type,
          depthBuffer: false,
          stencilBuffer: false,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping,
          wrapT: THREE.ClampToEdgeWrapping
        });
      });
    }

    createShaderPass() {
      const common = { cellScale: this.cellScale, dt: this.options.dt, boundarySpace: this.boundarySpace };
      this.advection = new Advection({ ...common, fboSize: this.fboSize, src: this.fbos.vel_0, dst: this.fbos.vel_1 });
      this.externalForce = new ExternalForce({
        cellScale: this.cellScale,
        cursor_size: this.options.cursor_size,
        dst: this.fbos.vel_1
      });
      this.viscous = new Viscous({
        ...common,
        viscous: this.options.viscous,
        src: this.fbos.vel_1,
        dst: this.fbos.vel_viscous1,
        dst_: this.fbos.vel_viscous0
      });
      this.divergence = new Divergence({ ...common, src: this.fbos.vel_viscous0, dst: this.fbos.div });
      this.poisson = new Poisson({
        ...common,
        src: this.fbos.div,
        dst: this.fbos.pressure_1,
        dst_: this.fbos.pressure_0
      });
      this.pressure = new Pressure({
        ...common,
        src_p: this.fbos.pressure_0,
        src_v: this.fbos.vel_viscous0,
        dst: this.fbos.vel_0
      });
    }

    calcSize() {
      const w = Math.max(1, Math.round(this.options.resolution * Common.width));
      const h = Math.max(1, Math.round(this.options.resolution * Common.height));
      this.cellScale.set(1 / w, 1 / h);
      this.fboSize.set(w, h);
    }

    resize() {
      this.calcSize();
      Object.values(this.fbos).forEach(fbo => fbo.setSize(this.fboSize.x, this.fboSize.y));
    }

    update() {
      if (this.options.isBounce) this.boundarySpace.set(0, 0);
      else this.boundarySpace.copy(this.cellScale);

      this.advection.updateArgs({ dt: this.options.dt, isBounce: this.options.isBounce, BFECC: this.options.BFECC });
      this.externalForce.updateArgs({
        cursor_size: this.options.cursor_size,
        mouse_force: this.options.mouse_force,
        cellScale: this.cellScale
      });

      let vel = this.fbos.vel_1;
      if (this.options.isViscous) {
        vel = this.viscous.updateArgs({
          viscous: this.options.viscous,
          iterations: this.options.iterations_viscous,
          dt: this.options.dt
        });
      }
      this.divergence.updateArgs({ vel });
      const pressure = this.poisson.updateArgs({ iterations: this.options.iterations_poisson });
      this.pressure.updateArgs({ vel, pressure });
    }
  }

  class Output {
    simulation: Simulation;
    scene: THREE.Scene;
    camera: THREE.Camera;
    outputMesh: THREE.Mesh;

    constructor() {
      this.simulation = new Simulation();
      this.scene = new THREE.Scene();
      this.camera = new THREE.Camera();
      this.outputMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.RawShaderMaterial({
          vertexShader: face_vert,
          fragmentShader: color_frag,
          transparent: true,
          depthWrite: false,
          uniforms: {
            velocity: { value: this.simulation.fbos.vel_0.texture },
            boundarySpace: { value: new THREE.Vector2() },
            palette: { value: paletteTex },
            bgColor: { value: bgVec4 }
          }
        })
      );
      this.scene.add(this.outputMesh);
    }

    resize() {
      this.simulation.resize();
    }
    update() {
      this.simulation.update();
      this.render();
    }
    render() {
      if (!Common.renderer) return;
      Common.renderer.setRenderTarget(null);
      Common.renderer.render(this.scene, this.camera);
    }
  }

  interface WebGLManagerConfig {
    $wrapper: HTMLElement;
    autoDemo: boolean;
    autoSpeed: number;
    autoIntensity: number;
    takeoverDuration: number;
    autoResumeDelay: number;
    autoRampDuration: number;
  }

  class WebGLManager {
    config: WebGLManagerConfig;
    output!: Output;
    autoDriver?: AutoDriver;
    lastUserInteraction = performance.now();
    running = false;
    private _loop = this.loop.bind(this);
    private _resize = this.resize.bind(this);
    private _onVisibility?: () => void;

    constructor(config: WebGLManagerConfig) {
      this.config = config;
      Common.init(config.$wrapper);
      Mouse.init(config.$wrapper);
      Mouse.autoIntensity = config.autoIntensity;
      Mouse.takeoverDuration = config.takeoverDuration;
      Mouse.onInteract = () => {
        this.lastUserInteraction = performance.now();
        if (this.autoDriver) this.autoDriver.forceStop();
      };
      this.autoDriver = new AutoDriver(Mouse, this, {
        enabled: config.autoDemo,
        speed: config.autoSpeed,
        resumeDelay: config.autoResumeDelay,
        rampDuration: config.autoRampDuration
      });
      this.init();
      window.addEventListener('resize', this._resize);
      this._onVisibility = () => {
        if (document.hidden) this.pause();
        else if (isVisibleRef.value) this.start();
      };
      document.addEventListener('visibilitychange', this._onVisibility);
    }

    init() {
      if (!Common.renderer) return;
      this.config.$wrapper.prepend(Common.renderer.domElement);
      this.output = new Output();
    }

    resize() {
      Common.resize();
      this.output.resize();
    }
    render() {
      if (this.autoDriver) this.autoDriver.update();
      Mouse.update();
      Common.update();
      this.output.update();
    }
    loop() {
      if (!this.running) return;
      this.render();
      rafRef.value = requestAnimationFrame(this._loop);
    }
    start() {
      if (this.running) return;
      this.running = true;
      this._loop();
    }
    pause() {
      this.running = false;
      if (rafRef.value) cancelAnimationFrame(rafRef.value);
      rafRef.value = null;
    }

    dispose() {
      window.removeEventListener('resize', this._resize);
      if (this._onVisibility) document.removeEventListener('visibilitychange', this._onVisibility);
      Mouse.dispose();
      if (Common.renderer) {
        const canvas = Common.renderer.domElement;
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        Common.renderer.dispose();
      }
    }
  }

  const webgl = new WebGLManager({
    $wrapper: mountRef.value,
    autoDemo: props.autoDemo,
    autoSpeed: props.autoSpeed,
    autoIntensity: props.autoIntensity,
    takeoverDuration: props.takeoverDuration,
    autoResumeDelay: props.autoResumeDelay,
    autoRampDuration: props.autoRampDuration
  });

  const updateSimOptions = () => {
    const sim = webgl.output.simulation;
    const prevRes = sim.options.resolution;
    Object.assign(sim.options, {
      mouse_force: props.mouseForce,
      cursor_size: props.cursorSize,
      isViscous: props.isViscous,
      viscous: props.viscous,
      iterations_viscous: props.iterationsViscous,
      iterations_poisson: props.iterationsPoisson,
      dt: props.dt,
      BFECC: props.BFECC,
      resolution: props.resolution,
      isBounce: props.isBounce
    });
    if (webgl.autoDriver) {
      webgl.autoDriver.enabled = props.autoDemo;
      webgl.autoDriver.speed = props.autoSpeed;
      webgl.autoDriver.resumeDelay = props.autoResumeDelay;
      webgl.autoDriver.rampDurationMs = props.autoRampDuration * 1000;
    }
    if (props.resolution !== prevRes) sim.resize();
  };

  updateSimOptions();
  webgl.start();

  const io = new IntersectionObserver(
    entries => {
      const isVisible = entries[0].isIntersecting;
      isVisibleRef.value = isVisible;
      if (isVisible && !document.hidden) webgl.start();
      else webgl.pause();
    },
    { threshold: [0, 0.01] }
  );
  io.observe(mountRef.value);
  intersectionObserverRef.value = io;

  const ro = new ResizeObserver(() => {
    if (resizeRafRef.value) cancelAnimationFrame(resizeRafRef.value);
    resizeRafRef.value = requestAnimationFrame(() => webgl.resize());
  });
  ro.observe(mountRef.value);
  resizeObserverRef.value = ro;

  return webgl;
};

let activeWebGL: ReturnType<typeof initWebGL> | null = null;

watch(
  () => [
    props.mouseForce,
    props.cursorSize,
    props.isViscous,
    props.viscous,
    props.iterationsViscous,
    props.iterationsPoisson,
    props.dt,
    props.BFECC,
    props.resolution,
    props.isBounce,
    props.autoDemo,
    props.autoSpeed,
    props.autoIntensity,
    props.takeoverDuration,
    props.autoResumeDelay,
    props.autoRampDuration
  ],
  () => {
    if (activeWebGL) {
      const sim = activeWebGL.output.simulation;
      const prevRes = sim.options.resolution;
      Object.assign(sim.options, {
        mouse_force: props.mouseForce,
        cursor_size: props.cursorSize,
        isViscous: props.isViscous,
        viscous: props.viscous,
        iterations_viscous: props.iterationsViscous,
        iterations_poisson: props.iterationsPoisson,
        dt: props.dt,
        BFECC: props.BFECC,
        resolution: props.resolution,
        isBounce: props.isBounce
      });
      if (activeWebGL.autoDriver) {
        activeWebGL.autoDriver.enabled = props.autoDemo;
        activeWebGL.autoDriver.speed = props.autoSpeed;
        activeWebGL.autoDriver.resumeDelay = props.autoResumeDelay;
        activeWebGL.autoDriver.rampDurationMs = props.autoRampDuration * 1000;
      }
      if (props.resolution !== prevRes) sim.resize();
    }
  }
);

onMounted(() => {
  activeWebGL = initWebGL();
});

onUnmounted(() => {
  if (resizeRafRef.value) cancelAnimationFrame(resizeRafRef.value);
  resizeObserverRef.value?.disconnect();
  intersectionObserverRef.value?.disconnect();
  activeWebGL?.dispose();
  activeWebGL = null;
});
</script>
