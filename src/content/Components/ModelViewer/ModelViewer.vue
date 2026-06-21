<template>
  <div ref="containerRef" class="model-viewer" :style="containerStyle">
    <button v-if="showScreenshotButton" type="button" class="model-viewer-screenshot" @click="captureScreenshot">
      Take Screenshot
    </button>

    <div v-if="!isLoaded" class="model-viewer-loader">
      <img
        v-if="placeholderSrc"
        :src="placeholderSrc"
        width="128"
        height="128"
        class="model-viewer-placeholder"
        alt=""
      />
      <span v-else class="model-viewer-progress">Loading…</span>
    </div>

    <TresCanvas
      shadows
      :preserve-drawing-buffer="true"
      :tone-mapping="ACESFilmicToneMapping"
      :output-color-space="SRGBColorSpace"
      @ready="handleReady"
    >
      <TresPerspectiveCamera :position="[0, 0, camZ]" :fov="50" :near="0.01" :far="100" />

      <Environment v-if="environmentPreset !== 'none'" :preset="scenePreset" :background="false" />

      <TresAmbientLight :intensity="ambientIntensity" />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="keyLightIntensity" cast-shadow />
      <TresDirectionalLight :position="[-5, 2, 5]" :intensity="fillLightIntensity" />
      <TresDirectionalLight :position="[0, 4, -5]" :intensity="rimLightIntensity" />

      <TresGroup ref="contactGroupRef">
        <ContactShadows :position="[0, -0.5, 0]" :opacity="0.35" :scale="10" :blur="2" />
      </TresGroup>

      <ModelInner
        :url="url"
        :x-off="modelXOffset"
        :y-off="modelYOffset"
        :pivot="pivot"
        :init-yaw="initYaw"
        :init-pitch="initPitch"
        :min-zoom="minZoomDistance"
        :max-zoom="maxZoomDistance"
        :enable-mouse-parallax="enableMouseParallax"
        :enable-manual-rotation="enableManualRotation"
        :enable-hover-rotation="enableHoverRotation"
        :enable-manual-zoom="enableManualZoom"
        :auto-frame="autoFrame"
        :fade-in="fadeIn"
        :auto-rotate="autoRotate"
        :auto-rotate-speed="autoRotateSpeed"
        @loaded="handleLoaded"
      />

      <DesktopControls
        v-if="!isTouch"
        :pivot="pivot"
        :min="minZoomDistance"
        :max="maxZoomDistance"
        :zoom-enabled="enableManualZoom"
      />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TresCanvas, useLoop, useTres } from '@tresjs/core';
import { ContactShadows, Environment, OrbitControls, useFBX, useGLTF } from '@tresjs/cientos';

export interface ModelViewerProps {
  url: string;
  width?: number | string;
  height?: number | string;
  modelXOffset?: number;
  modelYOffset?: number;
  defaultRotationX?: number;
  defaultRotationY?: number;
  defaultZoom?: number;
  minZoomDistance?: number;
  maxZoomDistance?: number;
  enableMouseParallax?: boolean;
  enableManualRotation?: boolean;
  enableHoverRotation?: boolean;
  enableManualZoom?: boolean;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
  environmentPreset?: 'city' | 'sunset' | 'night' | 'dawn' | 'studio' | 'hangar' | 'urban' | 'modern' | 'none';
  autoFrame?: boolean;
  placeholderSrc?: string;
  showScreenshotButton?: boolean;
  fadeIn?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

const props = withDefaults(defineProps<ModelViewerProps>(), {
  width: 400,
  height: 400,
  modelXOffset: 0,
  modelYOffset: 0,
  defaultRotationX: -50,
  defaultRotationY: 20,
  defaultZoom: 0.5,
  minZoomDistance: 0.5,
  maxZoomDistance: 10,
  enableMouseParallax: true,
  enableManualRotation: true,
  enableHoverRotation: true,
  enableManualZoom: true,
  ambientIntensity: 0.3,
  keyLightIntensity: 1,
  fillLightIntensity: 0.5,
  rimLightIntensity: 0.8,
  environmentPreset: 'city',
  autoFrame: false,
  placeholderSrc: '',
  showScreenshotButton: true,
  fadeIn: false,
  autoRotate: false,
  autoRotateSpeed: 0.35
});

const emit = defineEmits<{ (e: 'modelLoaded'): void }>();

const deg2rad = (d: number) => (d * Math.PI) / 180;
const ROTATE_SPEED = 0.005;
const INERTIA = 0.925;
const PARALLAX_MAG = 0.05;
const PARALLAX_EASE = 0.12;
const HOVER_MAG = deg2rad(6);
const HOVER_EASE = 0.15;
const DECIDE = 8;
const FADE_SPEED = 3;

const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const contactGroupRef = useTemplateRef<THREE.Group>('contactGroupRef');

const isLoaded = shallowRef(false);
const pivot = new THREE.Vector3();

let tres: ReturnType<typeof useTres> | null = null;

const toCssSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const containerStyle = computed(() => ({
  width: toCssSize(props.width),
  height: toCssSize(props.height),
  touchAction: 'pan-y pinch-zoom' as const
}));

const initYaw = computed(() => deg2rad(props.defaultRotationX));
const initPitch = computed(() => deg2rad(props.defaultRotationY));
const camZ = computed(() => Math.min(Math.max(props.defaultZoom, props.minZoomDistance), props.maxZoomDistance));

// `none` is handled by the `v-if`; this narrows the type for the cientos <Environment> preset prop.
const scenePreset = computed(() => props.environmentPreset as Exclude<ModelViewerProps['environmentPreset'], 'none'>);

const handleReady = (context: ReturnType<typeof useTres>) => {
  tres = context;
};

const handleLoaded = () => {
  isLoaded.value = true;
  emit('modelLoaded');
};

const captureScreenshot = () => {
  if (!tres) return;
  const renderer = tres.renderer.value;
  const scene = tres.scene.value;
  const camera = tres.camera.value;
  if (!renderer || !scene || !camera) return;

  renderer.shadowMap.enabled = false;
  const restore: { light: THREE.Light; cast: boolean }[] = [];
  scene.traverse((object: THREE.Object3D) => {
    const light = object as THREE.Light;
    if (light.isLight && 'castShadow' in light) {
      restore.push({ light, cast: light.castShadow });
      light.castShadow = false;
    }
  });

  const contactGroup = contactGroupRef.value;
  if (contactGroup) contactGroup.visible = false;

  renderer.render(scene, camera);
  const dataUrl = renderer.domElement.toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.download = 'model.png';
  anchor.href = dataUrl;
  anchor.click();

  renderer.shadowMap.enabled = true;
  restore.forEach(({ light, cast }) => (light.castShadow = cast));
  if (contactGroup) contactGroup.visible = true;
};

/* -------------------------------------------------------------------------- */
/*  ModelInner — loads the model and drives rotation / parallax / hover.       */
/*  Must live inside <TresCanvas> so it can inject the Tres context.           */
/* -------------------------------------------------------------------------- */
const ModelInner = defineComponent({
  name: 'ModelInner',
  props: {
    url: { type: String, required: true },
    xOff: { type: Number, default: 0 },
    yOff: { type: Number, default: 0 },
    pivot: { type: Object as () => THREE.Vector3, required: true },
    initYaw: { type: Number, default: 0 },
    initPitch: { type: Number, default: 0 },
    minZoom: { type: Number, default: 0.5 },
    maxZoom: { type: Number, default: 10 },
    enableMouseParallax: { type: Boolean, default: true },
    enableManualRotation: { type: Boolean, default: true },
    enableHoverRotation: { type: Boolean, default: true },
    enableManualZoom: { type: Boolean, default: true },
    autoFrame: { type: Boolean, default: false },
    fadeIn: { type: Boolean, default: false },
    autoRotate: { type: Boolean, default: false },
    autoRotateSpeed: { type: Number, default: 0.35 }
  },
  emits: ['loaded'],
  setup(innerProps, { emit: innerEmit }) {
    const { camera, renderer } = useTres();
    const outerRef = shallowRef<THREE.Group | null>(null);
    const innerRef = shallowRef<THREE.Group | null>(null);
    const content = shallowRef<THREE.Object3D | null>(null);
    const pivotW = new THREE.Vector3();
    const ndcScratch = new THREE.Vector3();

    const setOpacity = (root: THREE.Object3D, value: number) => {
      root.traverse((object: THREE.Object3D) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        const material = mesh.material as THREE.Material | THREE.Material[];
        if (Array.isArray(material)) material.forEach(m => (m.opacity = value));
        else if (material) material.opacity = value;
      });
    };

    const vel = { x: 0, y: 0 };
    const tPar = { x: 0, y: 0 };
    const cPar = { x: 0, y: 0 };
    const tHov = { x: 0, y: 0 };
    const cHov = { x: 0, y: 0 };

    const cleanups: Array<() => void> = [];

    const loadModel = async (): Promise<THREE.Object3D | null> => {
      const ext = innerProps.url.split('.').pop()?.toLowerCase();
      if (ext === 'glb' || ext === 'gltf') {
        const gltf = await useGLTF(innerProps.url);
        return gltf.scene.clone();
      }
      if (ext === 'fbx') {
        const fbx = await useFBX(innerProps.url);
        return fbx.clone();
      }
      if (ext === 'obj') {
        return new OBJLoader().loadAsync(innerProps.url);
      }
      console.error('ModelViewer: unsupported format:', ext);
      return null;
    };

    const layout = () => {
      const group = innerRef.value;
      const outer = outerRef.value;
      if (!group || !outer || !content.value) return;

      // Measure from a clean transform: the render loop may already have nudged the
      // outer group, and setFromObject() uses world-space bounds, so reset first.
      outer.position.set(0, 0, 0);
      outer.rotation.set(0, 0, 0);
      outer.updateWorldMatrix(true, true);
      group.updateWorldMatrix(true, true);
      const sphere = new THREE.Box3().setFromObject(group).getBoundingSphere(new THREE.Sphere());
      const scale = 1 / (sphere.radius * 2);
      group.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);
      group.scale.setScalar(scale);

      group.traverse((object: THREE.Object3D) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (innerProps.fadeIn) {
            const material = mesh.material as THREE.Material | THREE.Material[];
            (Array.isArray(material) ? material : [material]).forEach(m => {
              if (!m) return;
              m.transparent = true;
              m.opacity = 0;
            });
          }
        }
      });

      group.getWorldPosition(pivotW);
      innerProps.pivot.copy(pivotW);
      outer.rotation.set(innerProps.initPitch, innerProps.initYaw, 0);

      const cam = camera.value as THREE.PerspectiveCamera | undefined;
      if (innerProps.autoFrame && cam?.isPerspectiveCamera) {
        const fitRadius = sphere.radius * scale;
        const distance = (fitRadius * 1.2) / Math.sin((cam.fov * Math.PI) / 180 / 2);
        cam.position.set(pivotW.x, pivotW.y, pivotW.z + distance);
        cam.near = distance / 10;
        cam.far = distance * 10;
        cam.updateProjectionMatrix();
      }

      if (innerProps.fadeIn) {
        fadeProgress = 0;
      } else {
        innerEmit('loaded');
      }
    };

    // Defer layout() until the render loop confirms the model is actually mounted
    // into the group (see onBeforeRender). On first mount the <primitive> can be
    // inserted a frame or two after `content` is set, so a plain nextTick would
    // measure an empty group — the bug that "fixes itself" after a remount.
    let pendingLayout = false;
    let fadeProgress = -1; // -1 = inactive; 0..1 = fading in
    loadModel().then(object => {
      content.value = object;
      if (object) pendingLayout = true;
      else innerEmit('loaded');
    });

    /* Manual rotation (desktop pointer drag) */
    const setupDesktopRotation = () => {
      const el = renderer.value?.domElement;
      if (!el || !innerProps.enableManualRotation || isTouch) return;

      let dragging = false;
      let lastX = 0;
      let lastY = 0;

      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        window.addEventListener('pointerup', onPointerUp);
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!dragging || !outerRef.value) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        outerRef.value.rotation.y += dx * ROTATE_SPEED;
        outerRef.value.rotation.x += dy * ROTATE_SPEED;
        vel.x = dx * ROTATE_SPEED;
        vel.y = dy * ROTATE_SPEED;
      };
      const onPointerUp = () => {
        dragging = false;
      };

      el.addEventListener('pointerdown', onPointerDown);
      el.addEventListener('pointermove', onPointerMove);
      cleanups.push(() => {
        el.removeEventListener('pointerdown', onPointerDown);
        el.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      });
    };

    /* Touch interaction: drag to rotate, pinch to zoom */
    const setupTouch = () => {
      const el = renderer.value?.domElement;
      if (!el || !isTouch) return;

      const points = new Map<number, { x: number; y: number }>();
      type Mode = 'idle' | 'decide' | 'rotate' | 'pinch';
      let mode: Mode = 'idle';
      let startX = 0;
      let startY = 0;
      let lastX = 0;
      let lastY = 0;
      let startDist = 0;
      let startZ = 0;

      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType !== 'touch') return;
        points.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (points.size === 1) {
          mode = 'decide';
          startX = lastX = e.clientX;
          startY = lastY = e.clientY;
        } else if (points.size === 2 && innerProps.enableManualZoom) {
          mode = 'pinch';
          const [p1, p2] = [...points.values()];
          startDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          startZ = camera.value?.position.z ?? 0;
          e.preventDefault();
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        const point = points.get(e.pointerId);
        if (!point) return;
        point.x = e.clientX;
        point.y = e.clientY;

        if (mode === 'decide') {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          if (Math.abs(dx) > DECIDE || Math.abs(dy) > DECIDE) {
            if (innerProps.enableManualRotation && Math.abs(dx) > Math.abs(dy)) {
              mode = 'rotate';
              el.setPointerCapture(e.pointerId);
            } else {
              mode = 'idle';
              points.clear();
            }
          }
        }

        if (mode === 'rotate' && outerRef.value) {
          e.preventDefault();
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
          outerRef.value.rotation.y += dx * ROTATE_SPEED;
          outerRef.value.rotation.x += dy * ROTATE_SPEED;
          vel.x = dx * ROTATE_SPEED;
          vel.y = dy * ROTATE_SPEED;
        } else if (mode === 'pinch' && points.size === 2 && camera.value) {
          e.preventDefault();
          const [p1, p2] = [...points.values()];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          const ratio = startDist / dist;
          camera.value.position.z = THREE.MathUtils.clamp(startZ * ratio, innerProps.minZoom, innerProps.maxZoom);
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        points.delete(e.pointerId);
        if (mode === 'rotate' && points.size === 0) mode = 'idle';
        if (mode === 'pinch' && points.size < 2) mode = 'idle';
      };

      el.addEventListener('pointerdown', onPointerDown, { passive: true });
      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp, { passive: true });
      window.addEventListener('pointercancel', onPointerUp, { passive: true });
      cleanups.push(() => {
        el.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      });
    };

    /* Mouse parallax + hover rotation targets */
    const setupParallax = () => {
      if (isTouch) return;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        if (innerProps.enableMouseParallax) {
          tPar.x = -nx * PARALLAX_MAG;
          tPar.y = -ny * PARALLAX_MAG;
        }
        if (innerProps.enableHoverRotation) {
          tHov.x = ny * HOVER_MAG;
          tHov.y = nx * HOVER_MAG;
        }
      };
      window.addEventListener('pointermove', onMove);
      cleanups.push(() => window.removeEventListener('pointermove', onMove));
    };

    onMounted(() => {
      setupDesktopRotation();
      setupTouch();
      setupParallax();
    });

    onBeforeUnmount(() => {
      cleanups.forEach(fn => fn());
      cleanups.length = 0;
      if (content.value) {
        content.value.traverse((object: THREE.Object3D) => {
          const mesh = object as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.geometry?.dispose();
            const material = mesh.material as THREE.Material | THREE.Material[];
            if (Array.isArray(material)) material.forEach(m => m.dispose());
            else material?.dispose();
          }
        });
      }
    });

    const { onBeforeRender } = useLoop();
    onBeforeRender(({ delta }) => {
      const outer = outerRef.value;
      const cam = camera.value;
      if (!outer || !cam) return;

      // One-time layout, run only once the model is genuinely in the group.
      if (pendingLayout && innerRef.value && innerRef.value.children.length > 0) {
        pendingLayout = false;
        layout();
      }

      // Frame-synced fade-in (frame-rate independent via delta).
      if (fadeProgress >= 0) {
        fadeProgress = Math.min(fadeProgress + delta * FADE_SPEED, 1);
        if (innerRef.value) setOpacity(innerRef.value, fadeProgress);
        if (fadeProgress >= 1) {
          fadeProgress = -1;
          innerEmit('loaded');
        }
      }

      cPar.x += (tPar.x - cPar.x) * PARALLAX_EASE;
      cPar.y += (tPar.y - cPar.y) * PARALLAX_EASE;

      const prevHoverX = cHov.x;
      const prevHoverY = cHov.y;
      cHov.x += (tHov.x - cHov.x) * HOVER_EASE;
      cHov.y += (tHov.y - cHov.y) * HOVER_EASE;

      const ndc = ndcScratch.copy(pivotW).project(cam);
      ndc.x += innerProps.xOff + cPar.x;
      ndc.y += innerProps.yOff + cPar.y;
      outer.position.copy(ndc.unproject(cam));

      outer.rotation.x += cHov.x - prevHoverX;
      outer.rotation.y += cHov.y - prevHoverY;

      if (innerProps.autoRotate) {
        outer.rotation.y += innerProps.autoRotateSpeed * delta;
      }

      outer.rotation.y += vel.x;
      outer.rotation.x += vel.y;
      vel.x *= INERTIA;
      vel.y *= INERTIA;
    });

    return () =>
      h('TresGroup', { ref: outerRef }, [
        h('TresGroup', { ref: innerRef }, [content.value ? h('primitive', { object: content.value }) : null])
      ]);
  }
});

/* -------------------------------------------------------------------------- */
/*  DesktopControls — zoom-only OrbitControls whose target tracks the pivot.   */
/* -------------------------------------------------------------------------- */
const DesktopControls = defineComponent({
  name: 'DesktopControls',
  props: {
    pivot: { type: Object as () => THREE.Vector3, required: true },
    min: { type: Number, default: 0.5 },
    max: { type: Number, default: 10 },
    zoomEnabled: { type: Boolean, default: true }
  },
  setup(controlProps) {
    const controlsRef = shallowRef<{ instance?: { value?: unknown } | unknown } | null>(null);

    const { onBeforeRender } = useLoop();
    onBeforeRender(() => {
      const exposed = controlsRef.value as { instance?: unknown } | null;
      const maybe = exposed?.instance as { value?: unknown } | undefined;
      const control = (maybe && 'value' in maybe ? maybe.value : maybe) as { target?: THREE.Vector3 } | undefined;
      if (control?.target?.copy) control.target.copy(controlProps.pivot);
    });

    return () =>
      h(OrbitControls, {
        ref: controlsRef,
        makeDefault: true,
        enablePan: false,
        enableRotate: false,
        enableZoom: controlProps.zoomEnabled,
        minDistance: controlProps.min,
        maxDistance: controlProps.max
      });
  }
});
</script>

<style scoped>
.model-viewer {
  position: relative;
}

.model-viewer :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.model-viewer-screenshot {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  padding: 0.5rem 1rem;
  border: 1px solid #fff;
  border-radius: 0.75rem;
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.model-viewer-screenshot:hover {
  background: #fff;
  color: #000;
}

.model-viewer-loader {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.model-viewer-placeholder {
  border-radius: 0.5rem;
  filter: blur(16px);
}

.model-viewer-progress {
  color: #fff;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}
</style>
