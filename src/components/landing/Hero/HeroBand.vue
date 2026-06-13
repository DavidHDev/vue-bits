<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, watch } from 'vue';

type Props = {
  class?: string;
  color?: string;
  rotation?: number;
  speed?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  noise?: number;
  bandWidth?: number;
  yOffset?: number;
  fadeTop?: number;
  mouseInfluence?: number;
  iterations?: number;
  intensity?: number;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
  color: '#FF3E00',
  rotation: 0,
  speed: 0.2,
  scale: 1,
  frequency: 1,
  warpStrength: 11,
  noise: 0.05,
  bandWidth: 1.4,
  yOffset: 0,
  fadeTop: 0.3,
  mouseInfluence: 0.3,
  iterations: 1,
  intensity: 1.0
});

const frag = `
precision mediump float;
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform vec3 uColor;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform float uNoise;
uniform float uBandWidth;
uniform float uYOffset;
uniform float uFadeTop;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform int uIterations;
uniform float uIntensity;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 uv = vUv;
  uv.y += uYOffset;
  vec2 p = uv * 2.0 - 1.0;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  float aspect = uCanvas.x / uCanvas.y;
  vec2 q = vec2(rp.x * aspect, rp.y);
  float invScale = 1.0 / max(uScale, 0.0001);
  q *= invScale;
  q /= 0.5 + 0.2 * dot(q, q);
  q += (uPointer - rp) * uMouseInfluence * 0.2;
  q += 0.2 * cos(t) - 7.56;

  for (int i = 0; i < 5; i++) {
    if (i >= uIterations) break;
    vec2 r = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q = q + (r - q) * uWarpStrength;
  }

  float m = length(q + sin(5.0 * q.y * uFrequency - 3.0 * t) * 0.25);

  float w = 1.0 - exp(-6.0 / exp(6.0 * m));
  w = pow(clamp(w, 0.0, 1.0), uBandWidth);
  w *= smoothstep(uFadeTop, 0.0, vUv.y);
  w *= uIntensity;

  vec3 col = uColor * w;
  col += (fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * uNoise;
  col = clamp(col, 0.0, 1.0) * w;

  gl_FragColor = vec4(col, w);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

function toVec3(hex: string) {
  const h = hex.replace('#', '').trim();

  return new THREE.Vector3(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255
  );
}

const container = ref<HTMLDivElement | null>(null);

let renderer: THREE.WebGLRenderer | null = null;
let material: THREE.ShaderMaterial | null = null;
let resizeObserver: ResizeObserver | null = null;
let raf: number | null = null;

const pointerTarget = new THREE.Vector2(0, 0);
const pointerCurrent = new THREE.Vector2(0, 0);

let rect = {
  left: 0,
  top: 0,
  width: 1,
  height: 1
};

function updateUniforms() {
  if (!material) return;

  material.uniforms.uSpeed.value = props.speed;
  material.uniforms.uScale.value = props.scale;
  material.uniforms.uFrequency.value = props.frequency;
  material.uniforms.uWarpStrength.value = props.warpStrength;
  material.uniforms.uNoise.value = props.noise;
  material.uniforms.uBandWidth.value = props.bandWidth;
  material.uniforms.uYOffset.value = props.yOffset;
  material.uniforms.uFadeTop.value = props.fadeTop;
  material.uniforms.uMouseInfluence.value = props.mouseInfluence;
  material.uniforms.uIterations.value = props.iterations;
  material.uniforms.uIntensity.value = props.intensity;

  (material.uniforms.uColor.value as THREE.Vector3).copy(toVec3(props.color));

  const rad = (props.rotation * Math.PI) / 180;

  (material.uniforms.uRot.value as THREE.Vector2).set(Math.cos(rad), Math.sin(rad));
}

onMounted(() => {
  if (!container.value) return;

  const currentContainer = container.value;

  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.PlaneGeometry(2, 2);

  material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpeed: { value: props.speed },
      uRot: { value: new THREE.Vector2(1, 0) },
      uColor: { value: new THREE.Vector3(1, 0.24, 0) },
      uScale: { value: props.scale },
      uFrequency: { value: props.frequency },
      uWarpStrength: { value: props.warpStrength },
      uNoise: { value: props.noise },
      uBandWidth: { value: props.bandWidth },
      uYOffset: { value: props.yOffset },
      uFadeTop: { value: props.fadeTop },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: props.mouseInfluence },
      uIterations: { value: props.iterations },
      uIntensity: { value: props.intensity }
    },
    premultipliedAlpha: true,
    transparent: true
  });

  scene.add(new THREE.Mesh(geometry, material));

  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      alpha: true
    });
  } catch {
    return;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  renderer.setClearColor(0x000000, 0);

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';

  currentContainer.appendChild(renderer.domElement);

  const clock = new THREE.Clock();

  const handleResize = () => {
    if (!renderer || !material) return;

    const w = currentContainer.clientWidth || 1;
    const h = currentContainer.clientHeight || 1;

    renderer.setSize(w, h, false);

    (material.uniforms.uCanvas.value as THREE.Vector2).set(w, h);

    rect = currentContainer.getBoundingClientRect();
  };

  handleResize();

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentContainer);
  } else {
    window.addEventListener('resize', handleResize);
  }

  const handlePointer = (e: MouseEvent) => {
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;

    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    pointerTarget.set(x, y);
  };

  window.addEventListener('mousemove', handlePointer, {
    passive: true
  });

  const loop = () => {
    if (!renderer || !material) return;

    const dt = clock.getDelta();

    material.uniforms.uTime.value = clock.elapsedTime;

    const amt = Math.min(1, dt * 4);

    pointerCurrent.lerp(pointerTarget, amt);

    (material.uniforms.uPointer.value as THREE.Vector2).copy(pointerCurrent);

    renderer.render(scene, camera);

    raf = requestAnimationFrame(loop);
  };

  updateUniforms();

  raf = requestAnimationFrame(loop);

  onUnmounted(() => {
    if (raf !== null) {
      cancelAnimationFrame(raf);
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', handleResize);
    }

    window.removeEventListener('mousemove', handlePointer);

    geometry.dispose();

    material?.dispose();

    renderer?.dispose();

    renderer?.forceContextLoss();

    if (renderer?.domElement.parentElement === currentContainer) {
      currentContainer.removeChild(renderer.domElement);
    }

    material = null;
    renderer = null;
  });
});

watch(
  () => [
    props.color,
    props.rotation,
    props.speed,
    props.scale,
    props.frequency,
    props.warpStrength,
    props.noise,
    props.bandWidth,
    props.yOffset,
    props.fadeTop,
    props.mouseInfluence,
    props.iterations,
    props.intensity
  ],
  () => {
    updateUniforms();
  },
  {
    deep: true
  }
);
</script>

<template>
  <div ref="container" :class="props.class" />
</template>
