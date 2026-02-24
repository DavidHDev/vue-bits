<script setup lang="ts">
// Component created by Dominik Koch
// https://x.com/dominikkoch

import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

export type OrbitShape =
  | 'ellipse'
  | 'circle'
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'infinity'
  | 'wave'
  | 'custom';

interface OrbitImagesProps {
  images?: string[];
  altPrefix?: string;
  shape?: OrbitShape;
  customPath?: string;
  baseWidth?: number;
  radiusX?: number;
  radiusY?: number;
  radius?: number;
  starPoints?: number;
  starInnerRatio?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  direction?: 'normal' | 'reverse';
  fill?: boolean;
  width?: number | '100%';
  height?: number | 'auto';
  className?: string;
  showPath?: boolean;
  pathColor?: string;
  pathWidth?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  paused?: boolean;
  responsive?: boolean;
}

const props = withDefaults(defineProps<OrbitImagesProps>(), {
  images: () => [],
  altPrefix: 'Orbiting image',
  shape: 'ellipse',
  customPath: undefined,
  baseWidth: 1400,
  radiusX: 700,
  radiusY: 170,
  radius: 300,
  starPoints: 5,
  starInnerRatio: 0.5,
  rotation: -8,
  duration: 40,
  itemSize: 64,
  direction: 'normal',
  fill: true,
  width: 100,
  height: 100,
  className: '',
  showPath: false,
  pathColor: 'rgba(0,0,0,0.1)',
  pathWidth: 2,
  easing: 'linear',
  paused: false,
  responsive: false
});

const containerRef = ref<HTMLDivElement | null>(null);
const scale = ref(1);
const progress = ref(0);
let animationFrameId: number | null = null;
let lastTime: number | null = null;

const designCenterX = computed(() => props.baseWidth / 2);
const designCenterY = computed(() => props.baseWidth / 2);

function generateEllipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx: number, cy: number, r: number): string {
  return generateEllipsePath(cx, cy, r, r);
}

function generateSquarePath(cx: number, cy: number, size: number): string {
  const h = size / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`;
}

function generateRectanglePath(cx: number, cy: number, w: number, h: number): string {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
}

function generateTrianglePath(cx: number, cy: number, size: number): string {
  const height = (size * Math.sqrt(3)) / 2;
  const hs = size / 2;
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`;
}

function generateStarPath(cx: number, cy: number, outerR: number, innerR: number, points: number): string {
  const step = Math.PI / points;
  let path = '';
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return path + ' Z';
}

function generateHeartPath(cx: number, cy: number, size: number): string {
  const s = size / 30;
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`;
}

function generateInfinityPath(cx: number, cy: number, w: number, h: number): string {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`;
}

function generateWavePath(cx: number, cy: number, w: number, amplitude: number, waves: number): string {
  const pts: string[] = [];
  const segs = waves * 20;
  const hw = w / 2;
  for (let i = 0; i <= segs; i++) {
    const x = cx - hw + (w * i) / segs;
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  for (let i = segs; i >= 0; i--) {
    const x = cx - hw + (w * i) / segs;
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(`L ${x} ${y}`);
  }
  return pts.join(' ') + ' Z';
}

const path = computed(() => {
  const cx = designCenterX.value;
  const cy = designCenterY.value;

  switch (props.shape) {
    case 'circle':
      return generateCirclePath(cx, cy, props.radius);
    case 'ellipse':
      return generateEllipsePath(cx, cy, props.radiusX, props.radiusY);
    case 'square':
      return generateSquarePath(cx, cy, props.radius * 2);
    case 'rectangle':
      return generateRectanglePath(cx, cy, props.radiusX * 2, props.radiusY * 2);
    case 'triangle':
      return generateTrianglePath(cx, cy, props.radius * 2);
    case 'star':
      return generateStarPath(cx, cy, props.radius, props.radius * props.starInnerRatio, props.starPoints);
    case 'heart':
      return generateHeartPath(cx, cy, props.radius * 2);
    case 'infinity':
      return generateInfinityPath(cx, cy, props.radiusX * 2, props.radiusY * 2);
    case 'wave':
      return generateWavePath(cx, cy, props.radiusX * 2, props.radiusY, 3);
    case 'custom':
      return props.customPath || generateCirclePath(cx, cy, props.radius);
    default:
      return generateEllipsePath(cx, cy, props.radiusX, props.radiusY);
  }
});

const containerWidth = computed(() => {
  return props.responsive ? '100%' : (typeof props.width === 'number' ? `${props.width}px` : '100%');
});

const containerHeight = computed(() => {
  return props.responsive ? 'auto' : (typeof props.height === 'number' ? `${props.height}px` : (typeof props.width === 'number' ? `${props.width}px` : 'auto'));
});

function updateScale() {
  if (!props.responsive || !containerRef.value) return;
  scale.value = containerRef.value.clientWidth / props.baseWidth;
}

function applyEasing(t: number): number {
  switch (props.easing) {
    case 'easeIn':
      return t * t;
    case 'easeOut':
      return 1 - (1 - t) * (1 - t);
    case 'easeInOut':
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    case 'linear':
    default:
      return t;
  }
}

function animationLoop(currentTime: number) {
  if (props.paused) {
    lastTime = null;
    animationFrameId = requestAnimationFrame(animationLoop);
    return;
  }

  if (lastTime === null) {
    lastTime = currentTime;
  }

  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  const progressPerSecond = 100 / props.duration;
  const delta = props.direction === 'reverse' ? -progressPerSecond * deltaTime : progressPerSecond * deltaTime;
  
  progress.value = ((progress.value + delta) % 100 + 100) % 100;

  animationFrameId = requestAnimationFrame(animationLoop);
}

function startAnimation() {
  stopAnimation();
  lastTime = null;
  animationFrameId = requestAnimationFrame(animationLoop);
}

function stopAnimation() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function getOffsetDistance(index: number): string {
  const itemOffset = props.fill ? (index / props.images.length) * 100 : 0;
  const offset = (((progress.value + itemOffset) % 100) + 100) % 100;
  return `${offset}%`;
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateScale();
  startAnimation();

  if (props.responsive && containerRef.value) {
    resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  stopAnimation();
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(
  () => [props.duration, props.direction, props.paused],
  () => {
    if (!props.paused && animationFrameId === null) {
      startAnimation();
    }
  }
);

watch(
  () => props.responsive,
  (newVal) => {
    if (newVal && containerRef.value) {
      updateScale();
      if (!resizeObserver) {
        resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(containerRef.value);
      }
    } else if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
      scale.value = 1;
    }
  }
);

const offsetDistances = computed(() => {
  return props.images.map((_, index) => {
    const itemOffset = props.fill ? (index / props.images.length) * 100 : 0;
    const offset = (((progress.value + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });
});
</script>

<template>
  <div
    ref="containerRef"
    :class="`relative mx-auto ${props.className}`"
    :style="{
      width: containerWidth,
      height: containerHeight,
      aspectRatio: props.responsive ? '1 / 1' : undefined
    }"
    aria-hidden="true"
  >
    <div
      :class="props.responsive ? 'absolute left-1/2 top-1/2' : 'relative w-full h-full'"
      :style="{
        width: props.responsive ? `${props.baseWidth}px` : '100%',
        height: props.responsive ? `${props.baseWidth}px` : '100%',
        transform: props.responsive ? `translate(-50%, -50%) scale(${scale})` : undefined,
        transformOrigin: 'center center'
      }"
    >
      <div
        class="relative w-full h-full"
        :style="{
          transform: `rotate(${props.rotation}deg)`,
          transformOrigin: 'center center'
        }"
      >
        <!-- SVG Path for debugging -->
        <svg
          v-if="props.showPath"
          width="100%"
          height="100%"
          :viewBox="`0 0 ${props.baseWidth} ${props.baseWidth}`"
          class="absolute inset-0 pointer-events-none"
        >
          <path
            :d="path"
            fill="none"
            :stroke="props.pathColor"
            :stroke-width="props.pathWidth / scale"
          />
        </svg>

        <!-- Orbit Items -->
        <div
          v-for="(src, index) in props.images"
          :key="src"
          class="absolute will-change-transform select-none"
          :style="{
            width: `${props.itemSize}px`,
            height: `${props.itemSize}px`,
            offsetPath: `path('${path}')`,
            offsetRotate: '0deg',
            offsetAnchor: 'center center',
            offsetDistance: offsetDistances[index]
          }"
        >
          <div :style="{ transform: `rotate(${-props.rotation}deg)` }">
            <img
              :src="src"
              :alt="`${props.altPrefix} ${index + 1}`"
              :draggable="false"
              class="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Center Content Slot -->
    <div
      v-if="$slots.centerContent"
      class="absolute inset-0 flex items-center justify-center z-10"
    >
      <slot name="centerContent" />
    </div>
  </div>
</template>
