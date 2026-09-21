<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties, type ComponentPublicInstance } from 'vue';

export interface InfiniteSpiralItem {
  id?: string | number;
  src: string;
  alt?: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  label?: string;
}

interface InfiniteSpiralProps {
  items?: Array<string | InfiniteSpiralItem>;
  speed?: number;
  direction?: 'up' | 'down';
  animationMode?: 'auto' | 'drag' | 'scroll' | 'all';
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  verticalSpacing?: number;
  perspective?: number;
  cardsPerTurn?: number;
  rotation?: number;
  cardTilt?: number;
  cardRadius?: number;
  centerScale?: number;
  edgeFade?: number;
  edgeBlur?: number;
  pauseOnHover?: boolean;
  imageFit?: CSSProperties['objectFit'];
  grayscale?: number;
  className?: string;
}

type NormalizedItem = InfiniteSpiralItem & { alt: string };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

const props = withDefaults(defineProps<InfiniteSpiralProps>(), {
  items: () => [],
  speed: 0.55,
  direction: 'up',
  animationMode: 'auto',
  radius: 170,
  cardWidth: 100,
  cardHeight: 100,
  verticalSpacing: 60,
  perspective: 1000,
  cardsPerTurn: 7,
  rotation: 0,
  cardTilt: 0,
  cardRadius: 10,
  centerScale: 1.2,
  edgeFade: 0.3,
  edgeBlur: 6,
  pauseOnHover: true,
  imageFit: 'cover',
  grayscale: 0,
  className: ''
});

const rootRef = ref<HTMLDivElement | null>(null);

const normalizedItems = computed<NormalizedItem[]>(() =>
  props.items.map((item, index) =>
    typeof item === 'string'
      ? { src: item, alt: `Spiral image ${index + 1}` }
      : { alt: `Spiral image ${index + 1}`, ...item }
  )
);

let progress = 0;
let targetProgress = 0;
let autoSpeed = 0;
const hovered = ref(false);
let visible = true;
let dragging = false;
let lastPointerY = 0;
let dragMoved = false;
const cardEls: Array<HTMLAnchorElement | HTMLDivElement | null> = [];
const cardRefCallbacks = new Map<number, (el: Element | ComponentPublicInstance | null) => void>();

const getCardRefCallback = (index: number) => {
  let callback = cardRefCallbacks.get(index);
  if (!callback) {
    callback = (el: Element | ComponentPublicInstance | null) => {
      cardEls[index] = (el as HTMLAnchorElement | HTMLDivElement | null) ?? null;
    };
    cardRefCallbacks.set(index, callback);
  }
  return callback;
};

let teardown: (() => void) | null = null;

const setupAnimation = () => {
  const root = rootRef.value;
  if (!root || normalizedItems.value.length === 0) return;

  let frameId = 0;
  let previousTime = performance.now();
  let bounds = root.getBoundingClientRect();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollEnabled = props.animationMode === 'scroll' || props.animationMode === 'all';
  const scrollSpeedMultiplier = Math.max(props.speed, 0) / 0.55;
  let lastScrollY = window.scrollY;

  const resizeObserver = new ResizeObserver(() => {
    bounds = root.getBoundingClientRect();
  });
  resizeObserver.observe(root);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  intersectionObserver.observe(root);

  const handleScroll = () => {
    const nextScrollY = window.scrollY;
    const scrollDelta = nextScrollY - lastScrollY;
    lastScrollY = nextScrollY;
    if (!scrollEnabled || !visible || scrollDelta === 0) return;
    targetProgress += clamp((scrollDelta * scrollSpeedMultiplier) / Math.max(props.verticalSpacing * 2, 1), -1.5, 1.5);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  const render = (time: number) => {
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    const autoEnabled = props.animationMode === 'auto' || props.animationMode === 'all';
    const motionPaused = dragging || (props.pauseOnHover && hovered.value);
    const directionMultiplier = props.direction === 'down' ? -1 : 1;
    const desiredAutoSpeed =
      autoEnabled && visible && !reducedMotion.matches && !motionPaused ? props.speed * directionMultiplier : 0;
    const speedBlend = 1 - Math.exp(-delta * 7);
    autoSpeed += (desiredAutoSpeed - autoSpeed) * speedBlend;
    targetProgress += autoSpeed * delta;

    const followBlend = 1 - Math.exp(-delta * (dragging ? 22 : 11));
    progress += (targetProgress - progress) * followBlend;

    const count = normalizedItems.value.length;
    const half = count / 2;
    const width = Math.max(bounds.width, 1);
    const height = Math.max(bounds.height, 1);
    const fit = Math.min(1, width / (props.cardWidth * 2.8), height / (props.cardHeight * 2.35));
    const responsiveRadius = Math.min(props.radius, Math.max(72, width * 0.36)) * fit;
    const fadeStart = clamp(1 - props.edgeFade, 0, 0.98);
    const turnSize = Math.max(props.cardsPerTurn, 1);

    cardEls.forEach((card, index) => {
      if (!card) return;
      const offset = modulo(index - progress + half, count) - half;
      const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
      const opacity = 1 - smoothstep(fadeStart, 1, edge);
      const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
      const scale = (1 + (props.centerScale - 1) * focus) * fit;
      const angle = offset * (360 / turnSize) + props.rotation;
      const angleRadians = (angle * Math.PI) / 180;
      const x = Math.sin(angleRadians) * responsiveRadius;
      const z = Math.cos(angleRadians) * responsiveRadius;
      const depthScale = clamp(props.perspective / Math.max(props.perspective - z, 1), 0.72, 1.45);
      const visualScale = scale * depthScale;
      const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
      const blur = props.edgeBlur * smoothstep(0.35, 1, edge);
      card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${offset * props.verticalSpacing * fit}px, 0) rotateZ(${props.cardTilt}deg) scale(${visualScale})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : 'none';
      card.style.zIndex = String(Math.round(depth * 100000) + index);
      card.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none';
    });
    frameId = requestAnimationFrame(render);
  };

  frameId = requestAnimationFrame(render);

  teardown = () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    window.removeEventListener('scroll', handleScroll);
  };
};

onMounted(() => {
  setupAnimation();
});

onUnmounted(() => {
  teardown?.();
  teardown = null;
});

watch(
  () => [
    normalizedItems.value,
    props.speed,
    props.direction,
    props.animationMode,
    props.radius,
    props.perspective,
    props.cardWidth,
    props.cardHeight,
    props.verticalSpacing,
    props.cardsPerTurn,
    props.rotation,
    props.cardTilt,
    props.centerScale,
    props.edgeFade,
    props.edgeBlur,
    props.pauseOnHover
  ],
  () => {
    teardown?.();
    teardown = null;
    setupAnimation();
  }
);

const rootStyle = computed<CSSProperties>(
  () =>
    ({
      perspective: `${props.perspective}px`,
      '--spiral-width': `${props.cardWidth}px`,
      '--spiral-height': `${props.cardHeight}px`,
      '--spiral-radius': `${props.cardRadius}px`,
      cursor: props.animationMode === 'drag' || props.animationMode === 'all' ? 'grab' : 'default',
      touchAction: props.animationMode === 'drag' || props.animationMode === 'all' ? 'pan-x' : 'auto',
      userSelect: props.animationMode === 'drag' || props.animationMode === 'all' ? 'none' : 'auto'
    }) as CSSProperties
);

const dragEnabled = computed(() => props.animationMode === 'drag' || props.animationMode === 'all');

const stopDragging = (event: PointerEvent) => {
  if (!dragging) return;
  dragging = false;
  const target = event.currentTarget as HTMLDivElement;
  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId);
  }
  target.style.cursor = dragEnabled.value ? 'grab' : 'default';
};

const handlePointerDown = (event: PointerEvent) => {
  if (!dragEnabled.value || event.button !== 0) return;
  dragging = true;
  dragMoved = false;
  lastPointerY = event.clientY;
  targetProgress = progress;
  const target = event.currentTarget as HTMLDivElement;
  target.setPointerCapture(event.pointerId);
  target.style.cursor = 'grabbing';
};

const handlePointerMove = (event: PointerEvent) => {
  if (!dragging) return;
  const pointerDelta = event.clientY - lastPointerY;
  lastPointerY = event.clientY;
  if (Math.abs(pointerDelta) > 0.5) dragMoved = true;
  targetProgress -= pointerDelta / Math.max(props.verticalSpacing, 1);
};

const handleClickCapture = (event: MouseEvent) => {
  if (!dragMoved) return;
  event.preventDefault();
  event.stopPropagation();
  dragMoved = false;
};

const cardStyle = computed<CSSProperties>(() => ({
  width: props.cardWidth,
  height: props.cardHeight,
  borderRadius: props.cardRadius
}));

const imageStyle = computed<CSSProperties>(() => ({
  width: props.cardWidth,
  height: props.cardHeight,
  maxWidth: 'none',
  maxHeight: 'none',
  objectFit: props.imageFit,
  filter: `grayscale(${Math.min(1, Math.max(0, props.grayscale))})`
}));

const itemClassName =
  'absolute left-1/2 top-1/2 block h-[var(--spiral-height)] w-[var(--spiral-width)] overflow-hidden rounded-[var(--spiral-radius)] border border-white/25 bg-white/10 shadow-[0_14px_38px_rgba(8,6,18,0.2)] [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform,opacity,filter] motion-reduce:transition-none';
</script>

<template>
  <div
    ref="rootRef"
    class="isolate relative w-full h-full min-h-80 overflow-hidden"
    :class="className"
    :style="rootStyle"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="stopDragging"
    @pointercancel="stopDragging"
    @click.capture="handleClickCapture"
  >
    <div class="absolute inset-0 [transform-style:preserve-3d]" role="list" aria-label="Infinite spiral gallery">
      <component
        :is="item.href ? 'a' : 'div'"
        v-for="(item, index) in normalizedItems"
        :key="item.id ?? `${item.src}-${index}`"
        :ref="getCardRefCallback(index)"
        :class="itemClassName"
        :style="cardStyle"
        :href="item.href"
        :target="item.href ? item.target : undefined"
        :rel="item.href && item.target === '_blank' ? 'noreferrer' : undefined"
        role="listitem"
        :aria-label="item.label ?? item.alt"
      >
        <img
          class="block absolute inset-0 w-full h-full object-center select-none"
          :src="item.src"
          :alt="item.alt"
          :loading="index < 6 ? 'eager' : 'lazy'"
          :draggable="false"
          :style="imageStyle"
        />
      </component>
    </div>
  </div>
</template>
