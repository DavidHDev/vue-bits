<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';
import * as THREE from 'three';

interface GooeyFilterConfig {
  id: string;
  strength: number;
}

interface PixelTrailProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  color?: string;
  gooeyFilter?: GooeyFilterConfig;
  className?: string;
}

const props = withDefaults(defineProps<PixelTrailProps>(), {
  gridSize: 40,
  trailSize: 0.1,
  maxAge: 250,
  interpolate: 5,
  color: '#ffffff',
  gooeyFilter: undefined,
  className: ''
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let mesh: THREE.Mesh | null = null;
let animationFrameId: number | null = null;
let lastTime = 0;
let containerWidth = 0;
let containerHeight = 0;

// Trail texture system (matching React's useTrailTexture config)
const TEXTURE_SIZE = 512; // React uses size: 512
const INTENSITY = 0.2;
const MIN_FORCE = 0.3;
const SMOOTHING = 0;

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  force: number;
}

let trailCanvas: HTMLCanvasElement | null = null;
let trailCtx: CanvasRenderingContext2D | null = null;
let trailTexture: THREE.CanvasTexture | null = null;
let trail: TrailPoint[] = [];
let force = 0;

// Smooth average for force calculation (from drei)
function smoothAverage(current: number, measurement: number, smoothing: number = 0.9): number {
  return measurement * smoothing + current * (1.0 - smoothing);
}

// Vertex shader
const vertexShader = `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Fragment shader for pixel grid (identical to React)
const fragmentShader = `
  uniform vec2 resolution;
  uniform sampler2D mouseTrail;
  uniform float gridSize;
  uniform vec3 pixelColor;

  vec2 coverUv(vec2 uv) {
    vec2 s = resolution.xy / max(resolution.x, resolution.y);
    vec2 newUv = (uv - 0.5) * s + 0.5;
    return clamp(newUv, 0.0, 1.0);
  }

  void main() {
    vec2 screenUv = gl_FragCoord.xy / resolution;
    vec2 uv = coverUv(screenUv);

    vec2 gridUv = fract(uv * gridSize);
    vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

    float trail = texture2D(mouseTrail, gridUvCenter).r;

    gl_FragColor = vec4(pixelColor, trail);
  }
`;

function hexToRgb(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

// Apply coverUv transformation to convert screen coords to texture coords
// Must match the shader's coverUv EXACTLY
function screenToTextureUv(screenX: number, screenY: number): { x: number; y: number } {
  // Match shader: vec2 s = resolution.xy / max(resolution.x, resolution.y);
  const maxDim = Math.max(containerWidth, containerHeight);
  const sx = containerWidth / maxDim;
  const sy = containerHeight / maxDim;

  // Match shader: vec2 newUv = (uv - 0.5) * s + 0.5;
  const x = (screenX - 0.5) * sx + 0.5;
  const y = (screenY - 0.5) * sy + 0.5;

  return {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y))
  };
}

function initTrailTexture() {
  trailCanvas = document.createElement('canvas');
  trailCanvas.width = trailCanvas.height = TEXTURE_SIZE;
  trailCtx = trailCanvas.getContext('2d')!;
  trailCtx.fillStyle = 'black';
  trailCtx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  trailTexture = new THREE.CanvasTexture(trailCanvas);
  trailTexture.minFilter = THREE.NearestFilter;
  trailTexture.magFilter = THREE.NearestFilter;
  trailTexture.wrapS = THREE.ClampToEdgeWrapping;
  trailTexture.wrapT = THREE.ClampToEdgeWrapping;
}

function clearTrail() {
  if (!trailCtx) return;
  trailCtx.globalCompositeOperation = 'source-over';
  trailCtx.fillStyle = 'black';
  trailCtx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
}

function addTouch(point: { x: number; y: number }) {
  const last = trail[trail.length - 1];

  if (last) {
    const dx = last.x - point.x;
    const dy = last.y - point.y;
    const dd = dx * dx + dy * dy;

    const newForce = Math.max(MIN_FORCE, Math.min(dd * 10000, 1));
    force = smoothAverage(newForce, force, SMOOTHING);

    // Interpolation (matching drei's logic)
    if (props.interpolate > 0) {
      const lines = Math.ceil(dd / Math.pow((props.trailSize * 0.5) / props.interpolate, 2));

      if (lines > 1) {
        for (let i = 1; i < lines; i++) {
          trail.push({
            x: last.x - (dx / lines) * i,
            y: last.y - (dy / lines) * i,
            age: 0,
            force: newForce
          });
        }
      }
    }
  }

  trail.push({ x: point.x, y: point.y, age: 0, force });
}

function drawTouch(point: TrailPoint) {
  if (!trailCtx) return;

  const pos = {
    x: point.x * TEXTURE_SIZE,
    y: (1 - point.y) * TEXTURE_SIZE
  };

  // Calculate intensity based on age (matching drei's logic)
  // React uses linear easing: ease = (x) => x (identity function)
  let intensity = 1;
  if (point.age < props.maxAge * 0.3) {
    // Fade in phase (0 to 30% of maxAge)
    intensity = point.age / (props.maxAge * 0.3);
  } else {
    // Fade out phase (30% to 100% of maxAge)
    intensity = 1 - (point.age - props.maxAge * 0.3) / (props.maxAge * 0.7);
  }

  intensity *= point.force;

  // Apply blending
  trailCtx.globalCompositeOperation = 'screen';

  const radius = TEXTURE_SIZE * props.trailSize * intensity;

  if (radius <= 0) return;

  const grd = trailCtx.createRadialGradient(
    pos.x,
    pos.y,
    Math.max(0, radius * 0.25),
    pos.x,
    pos.y,
    Math.max(0, radius)
  );
  grd.addColorStop(0, `rgba(255, 255, 255, ${INTENSITY})`);
  grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

  trailCtx.beginPath();
  trailCtx.fillStyle = grd;
  trailCtx.arc(pos.x, pos.y, Math.max(0, radius), 0, Math.PI * 2);
  trailCtx.fill();
}

function updateTrailTexture(delta: number) {
  if (!trailCtx || !trailTexture) return;

  clearTrail();

  // Age points and remove old ones
  trail = trail.filter(point => {
    point.age += delta * 1000;
    return point.age <= props.maxAge;
  });

  // Reset force when empty
  if (!trail.length) force = 0;

  // Draw all points
  trail.forEach(point => drawTouch(point));

  trailTexture.needsUpdate = true;
}

function setupScene() {
  const container = containerRef.value;
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;
  containerWidth = width;
  containerHeight = height;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Initialize trail texture
  initTrailTexture();

  // Main renderer
  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(dpr);
  container.appendChild(renderer.domElement);

  // Main scene
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  // Main mesh with pixel shader
  const pixelColor = hexToRgb(props.color);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      resolution: { value: new THREE.Vector2(width * dpr, height * dpr) },
      mouseTrail: { value: trailTexture },
      gridSize: { value: props.gridSize },
      pixelColor: { value: new THREE.Vector3(pixelColor.r, pixelColor.g, pixelColor.b) }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Event listeners
  container.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('resize', handleResize);

  // Start animation
  trail = [];
  force = 0;
  lastTime = performance.now();
  animate();
}

function handlePointerMove(event: PointerEvent) {
  const container = containerRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const screenX = (event.clientX - rect.left) / rect.width;
  const screenY = 1 - (event.clientY - rect.top) / rect.height;

  // Convert screen coordinates to texture UV space (apply coverUv transformation)
  const uv = screenToTextureUv(screenX, screenY);

  // Add touch point
  addTouch(uv);
}

function handleResize() {
  const container = containerRef.value;
  if (!container || !renderer || !mesh) return;

  const width = container.clientWidth;
  const height = container.clientHeight;
  containerWidth = width;
  containerHeight = height;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  renderer.setSize(width, height);

  const material = mesh.material as THREE.ShaderMaterial;
  material.uniforms.resolution.value.set(width * dpr, height * dpr);
}

function animate() {
  if (!renderer || !scene || !camera || !mesh) return;

  animationFrameId = requestAnimationFrame(animate);

  // Calculate delta time
  const currentTime = performance.now();
  const delta = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Update trail texture with delta time
  updateTrailTexture(delta);

  // Render
  renderer.render(scene, camera);
}

function cleanup() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  const container = containerRef.value;
  if (container) {
    container.removeEventListener('pointermove', handlePointerMove);
  }
  window.removeEventListener('resize', handleResize);

  // Clear trail data
  trail = [];
  force = 0;

  if (renderer) {
    if (container && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
    renderer.dispose();
    renderer = null;
  }

  if (trailTexture) {
    trailTexture.dispose();
    trailTexture = null;
  }

  if (mesh) {
    (mesh.material as THREE.ShaderMaterial).dispose();
    mesh.geometry.dispose();
    mesh = null;
  }

  trailCanvas = null;
  trailCtx = null;
  scene = null;
  camera = null;
}

onMounted(setupScene);
onUnmounted(cleanup);

watch(
  () => [props.gridSize, props.trailSize, props.maxAge, props.interpolate, props.color],
  () => {
    cleanup();
    setupScene();
  },
  { deep: true }
);
</script>

<template>
  <div class="relative w-full h-full">
    <svg v-if="props.gooeyFilter" class="absolute overflow-hidden z-[1]">
      <defs>
        <filter :id="props.gooeyFilter.id">
          <feGaussianBlur in="SourceGraphic" :stdDeviation="props.gooeyFilter.strength" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>

    <div
      ref="containerRef"
      :class="['absolute z-[1] w-full h-full', props.className]"
      :style="props.gooeyFilter ? { filter: `url(#${props.gooeyFilter.id})` } : undefined"
    />
  </div>
</template>
