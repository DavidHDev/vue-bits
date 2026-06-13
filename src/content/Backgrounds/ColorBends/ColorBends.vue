<template>
  <div
    ref="containerRef"
    :class="`w-full h-full relative overflow-hidden ${props.className ?? ''}`"
    :style="props.style"
  />
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

interface ColorBendsProps {
  className?: string;
  style?: CSSProperties;
  rotation?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;
  autoRotate?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
  iterations?: number;
  intensity?: number;
  bandWidth?: number;
}

const props = withDefaults(defineProps<ColorBendsProps>(), {
  rotation: 90,
  speed: 0.2,
  colors: () => [],
  transparent: true,
  autoRotate: 0,
  scale: 1,
  frequency: 1,
  warpStrength: 1,
  mouseInfluence: 1,
  parallax: 0.5,
  noise: 0.15,
  iterations: 1,
  intensity: 1.5,
  bandWidth: 6
});

const MAX_COLORS = 8 as const;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    for (int j = 0; j < 5; j++) {
      if (j >= uIterations - 1) break;
      vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
      q += (rr - q) * 0.15;
    }

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3); // strong response across 0..1
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0); // allow >1 to amplify displacement
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    col *= uIntensity;

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const containerRef = ref<HTMLDivElement | null>(null);
const rendererRef = ref<THREE.WebGLRenderer | null>(null);
const rafRef = ref<number | null>(null);
const materialRef = ref<THREE.ShaderMaterial | null>(null);
const resizeObserverRef = ref<ResizeObserver | null>(null);
const rotationRef = ref<number>(props.rotation);
const autoRotateRef = ref<number>(props.autoRotate);
const pointerTargetRef = ref<THREE.Vector2>(new THREE.Vector2(0, 0));
const pointerCurrentRef = ref<THREE.Vector2>(new THREE.Vector2(0, 0));
const pointerSmoothRef = ref<number>(8);

let cleanup: (() => void) | null = null;
const init = () => {
  const container = containerRef.value!;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.PlaneGeometry(2, 2);
  const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));
  const material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpeed: { value: props.speed },
      uRot: { value: new THREE.Vector2(1, 0) },
      uColorCount: { value: 0 },
      uColors: { value: uColorsArray },
      uTransparent: { value: props.transparent ? 1 : 0 },
      uScale: { value: props.scale },
      uFrequency: { value: props.frequency },
      uWarpStrength: { value: props.warpStrength },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: props.mouseInfluence },
      uParallax: { value: props.parallax },
      uNoise: { value: props.noise },
      uIterations: { value: props.iterations },
      uIntensity: { value: props.intensity },
      uBandWidth: { value: props.bandWidth }
    },
    premultipliedAlpha: true,
    transparent: true
  });
  materialRef.value = material;

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true
  });
  rendererRef.value = renderer;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, props.transparent ? 0 : 1);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const clock = new THREE.Clock();

  const handleResize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    (material.uniforms.uCanvas.value as THREE.Vector2).set(w, h);
  };

  handleResize();

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    resizeObserverRef.value = ro;
  } else {
    (window as Window).addEventListener('resize', handleResize);
  }

  const loop = () => {
    const dt = clock.getDelta();
    const elapsed = clock.elapsedTime;
    material.uniforms.uTime.value = elapsed;

    const deg = (rotationRef.value % 360) + autoRotateRef.value * elapsed;
    const rad = (deg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    (material.uniforms.uRot.value as THREE.Vector2).set(c, s);

    const cur = pointerCurrentRef.value;
    const tgt = pointerTargetRef.value;
    const amt = Math.min(1, dt * pointerSmoothRef.value);
    cur.lerp(tgt, amt);
    (material.uniforms.uPointer.value as THREE.Vector2).copy(cur);
    renderer.render(scene, camera);
    rafRef.value = requestAnimationFrame(loop);
  };
  rafRef.value = requestAnimationFrame(loop);

  const handlePointerMove = (e: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
    pointerTargetRef.value.set(x, y);
  };

  container.addEventListener('pointermove', handlePointerMove);

  cleanup = () => {
    if (rafRef.value !== null) cancelAnimationFrame(rafRef.value);
    if (resizeObserverRef.value) resizeObserverRef.value.disconnect();
    else (window as Window).removeEventListener('resize', handleResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement && renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
    container.removeEventListener('pointermove', handlePointerMove);
  };
};

const applyProps = () => {
  const material = materialRef.value;
  const renderer = rendererRef.value;
  if (!material) return;

  rotationRef.value = props.rotation;
  autoRotateRef.value = props.autoRotate;
  material.uniforms.uSpeed.value = props.speed;
  material.uniforms.uScale.value = props.scale;
  material.uniforms.uFrequency.value = props.frequency;
  material.uniforms.uWarpStrength.value = props.warpStrength;
  material.uniforms.uMouseInfluence.value = props.mouseInfluence;
  material.uniforms.uParallax.value = props.parallax;
  material.uniforms.uNoise.value = props.noise;
  material.uniforms.uIterations.value = props.iterations;
  material.uniforms.uIntensity.value = props.intensity;
  material.uniforms.uBandWidth.value = props.bandWidth;

  const toVec3 = (hex: string) => {
    const h = hex.replace('#', '').trim();
    const v =
      h.length === 3
        ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
        : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
  };

  const arr = (props.colors || []).filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
  for (let i = 0; i < MAX_COLORS; i++) {
    const vec = (material.uniforms.uColors.value as THREE.Vector3[])[i];
    if (i < arr.length) vec.copy(arr[i]);
    else vec.set(0, 0, 0);
  }
  material.uniforms.uColorCount.value = arr.length;

  material.uniforms.uTransparent.value = props.transparent ? 1 : 0;
  if (renderer) renderer.setClearColor(0x000000, props.transparent ? 0 : 1);
};

onMounted(() => {
  init();
  applyProps();
});

onBeforeUnmount(() => {
  cleanup?.();
});

watch(
  () => [
    props.rotation,
    props.autoRotate,
    props.speed,
    props.scale,
    props.frequency,
    props.warpStrength,
    props.mouseInfluence,
    props.parallax,
    props.noise,
    props.iterations,
    props.intensity,
    props.bandWidth,
    props.colors,
    props.transparent
  ],
  () => {
    applyProps();
  },
  { deep: true }
);
</script>
