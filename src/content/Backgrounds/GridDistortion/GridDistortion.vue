<script setup lang="ts">
import * as THREE from 'three';
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

interface GridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
  className?: string;
}

const props = withDefaults(defineProps<GridDistortionProps>(), {
  grid: 15,
  mouse: 0.1,
  strength: 0.15,
  relaxation: 0.9,
  className: ''
});

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}
`;

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const sceneRef = ref<THREE.Scene | null>(null);
const rendererRef = ref<THREE.WebGLRenderer | null>(null);
const cameraRef = ref<THREE.OrthographicCamera | null>(null);
const planeRef = ref<THREE.Mesh | null>(null);
const imageAspectRef = ref<number>(1);
const animationIdRef = ref<number | null>(null);
const resizeObserverRef = ref<ResizeObserver | null>(null);

let cleanup: (() => void) | null = null;
const init = () => {
  const container = containerRef.value;
  if (!container) return;

  const scene = new THREE.Scene();
  sceneRef.value = scene;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  rendererRef.value = renderer;

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
  camera.position.z = 2;
  cameraRef.value = camera;

  const uniforms = {
    time: { value: 0 },
    resolution: { value: new THREE.Vector4() },
    uTexture: { value: null as THREE.Texture | null },
    uDataTexture: { value: null as THREE.DataTexture | null }
  };

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(props.imageSrc, texture => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    imageAspectRef.value = texture.image.width / texture.image.height;
    uniforms.uTexture.value = texture;
    handleResize();
  });

  const size = props.grid;
  const data = new Float32Array(4 * size * size);
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = Math.random() * 255 - 125;
    data[i * 4 + 1] = Math.random() * 255 - 125;
  }

  const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
  dataTexture.needsUpdate = true;
  uniforms.uDataTexture.value = dataTexture;

  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
  const plane = new THREE.Mesh(geometry, material);
  planeRef.value = plane;
  scene.add(plane);

  const handleResize = () => {
    if (!container || !renderer || !camera) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) return;

    const containerAspect = width / height;

    renderer.setSize(width, height);

    if (plane) {
      plane.scale.set(containerAspect, 1, 1);
    }

    const frustumHeight = 1;
    const frustumWidth = frustumHeight * containerAspect;
    camera.left = -frustumWidth / 2;
    camera.right = frustumWidth / 2;
    camera.top = frustumHeight / 2;
    camera.bottom = -frustumHeight / 2;
    camera.updateProjectionMatrix();

    uniforms.resolution.value.set(width, height, 1, 1);
  };

  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    resizeObserverRef.value = resizeObserver;
  } else {
    window.addEventListener('resize', handleResize);
  }

  const mouseState = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vX: 0,
    vY: 0
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    mouseState.vX = x - mouseState.prevX;
    mouseState.vY = y - mouseState.prevY;
    Object.assign(mouseState, { x, y, prevX: x, prevY: y });
  };

  const handleMouseLeave = () => {
    if (dataTexture) {
      dataTexture.needsUpdate = true;
    }
    Object.assign(mouseState, {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0
    });
  };

  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseleave', handleMouseLeave);

  handleResize();

  const animate = () => {
    animationIdRef.value = requestAnimationFrame(animate);

    if (!renderer || !scene || !camera) return;

    uniforms.time.value += 0.05;

    if (!(dataTexture.image.data instanceof Float32Array)) {
      console.error('dataTexture.image.data is not a Float32Array');
      return;
    }
    const data: Float32Array = dataTexture.image.data;
    for (let i = 0; i < size * size; i++) {
      data[i * 4] *= props.relaxation;
      data[i * 4 + 1] *= props.relaxation;
    }

    const gridMouseX = size * mouseState.x;
    const gridMouseY = size * mouseState.y;
    const maxDist = size * props.mouse;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const distSq = Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
        if (distSq < maxDist * maxDist) {
          const index = 4 * (i + size * j);
          const power = Math.min(maxDist / Math.sqrt(distSq), 10);
          data[index] += props.strength * 100 * mouseState.vX * power;
          data[index + 1] -= props.strength * 100 * mouseState.vY * power;
        }
      }
    }

    dataTexture.needsUpdate = true;
    renderer.render(scene, camera);
  };

  animate();

  cleanup = () => {
    if (animationIdRef.value) {
      cancelAnimationFrame(animationIdRef.value);
    }

    if (resizeObserverRef.value) {
      resizeObserverRef.value.disconnect();
    } else {
      window.removeEventListener('resize', handleResize);
    }

    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseleave', handleMouseLeave);

    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    }

    if (geometry) geometry.dispose();
    if (material) material.dispose();
    if (dataTexture) dataTexture.dispose();
    if (uniforms.uTexture.value) uniforms.uTexture.value.dispose();

    sceneRef.value = null;
    rendererRef.value = null;
    cameraRef.value = null;
    planeRef.value = null;
  };
};

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  cleanup?.();
});

watch(
  () => props,
  () => {
    cleanup?.();
    init();
  },
  { deep: true }
);
</script>

<template>
  <div ref="containerRef" :class="[props.className, 'w-full h-full relative overflow-hidden min-h-0 min-w-0']" />
</template>
