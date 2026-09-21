<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties, type ComponentPublicInstance } from 'vue';

export type PixelSwapPattern =
  | 'random'
  | 'center'
  | 'edges'
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'diagonal'
  | 'spiral';

export type PixelSwapTrigger = 'hover' | 'click' | 'manual';

interface PixelSwapProps {
  pixelSize?: number;
  gap?: number;
  pixelRadius?: number;
  pixelSpin?: number;
  pixelScale?: number;
  fade?: boolean;
  duration?: number;
  pixelDuration?: number;
  pattern?: PixelSwapPattern;
  randomness?: number;
  easing?: string;
  trigger?: PixelSwapTrigger;
  initialActive?: boolean;
  active?: boolean;
  aspectRatio?: string;
  className?: string;
  style?: CSSProperties;
}

interface Pixel {
  id: number;
  left: number;
  top: number;
  offset: number;
}

interface Grid {
  pixels: Pixel[];
  size: number;
  gap: number;
  width: number;
  height: number;
}

interface Transition {
  to: boolean;
  grid: Grid;
}

const MAX_PIXELS = 220;
const KEYFRAME_STEPS = 14;

const PATTERNS: Record<PixelSwapPattern, (x: number, y: number) => number | null> = {
  random: () => null,
  center: (x, y) => Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2,
  edges: (x, y) => Math.min(x, 1 - x, y, 1 - y) * 2,
  'left-to-right': x => x,
  'right-to-left': x => 1 - x,
  'top-to-bottom': (_x, y) => y,
  'bottom-to-top': (_x, y) => 1 - y,
  diagonal: (x, y) => (x + y) / 2,
  spiral: (x, y) => {
    const angle = (Math.atan2(y - 0.5, x - 0.5) + Math.PI) / (Math.PI * 2);
    const radius = Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
    return (angle + radius) % 1;
  }
};

const EASINGS: Record<string, number[]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1]
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const noise = (seed: number): number => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const makeEasing = (value: string): ((progress: number) => number) => {
  const match = /cubic-bezier\(([^)]+)\)/.exec(value);
  const points = match ? match[1].split(',').map(Number) : EASINGS[value];
  if (!points || points.length !== 4 || points.some(Number.isNaN)) return makeEasing('ease');

  const [x1, y1, x2, y2] = points;
  if (x1 === y1 && x2 === y2) return (progress: number) => progress;

  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  return (progress: number) => {
    let t = progress;
    for (let i = 0; i < 5; i += 1) {
      const slope = (3 * ax * t + 2 * bx) * t + cx;
      if (!slope) break;
      t -= (((ax * t + bx) * t + cx) * t - progress) / slope;
    }
    t = clamp(t, 0, 1);
    return ((ay * t + by) * t + cy) * t;
  };
};

const coverScale = (size: number, gap: number, radius: number): number => {
  const p = clamp(radius, 0, 50) / 100;
  const corner = Math.SQRT1_2 / (Math.SQRT2 * (0.5 - p) + p);
  return ((size + gap) / size) * Math.max(1, corner);
};

const buildGrid = ({
  width,
  height,
  pixelSize,
  gap,
  pattern,
  randomness
}: {
  width: number;
  height: number;
  pixelSize: number;
  gap: number;
  pattern: PixelSwapPattern;
  randomness: number;
}): Grid => {
  let size = pixelSize;
  let columns = Math.max(1, Math.ceil((width + gap) / (size + gap)));
  let rows = Math.max(1, Math.ceil((height + gap) / (size + gap)));

  if (columns * rows > MAX_PIXELS) {
    size = Math.ceil(size * Math.sqrt((columns * rows) / MAX_PIXELS));
    columns = Math.max(1, Math.ceil((width + gap) / (size + gap)));
    rows = Math.max(1, Math.ceil((height + gap) / (size + gap)));
  }

  const stride = size + gap;
  const originX = (width - (columns * stride - gap)) / 2;
  const originY = (height - (rows * stride - gap)) / 2;
  const order = PATTERNS[pattern] ?? PATTERNS.random;
  const mix = clamp(randomness, 0, 1);
  const pixels: Pixel[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const x = columns <= 1 ? 0.5 : column / (columns - 1);
      const y = rows <= 1 ? 0.5 : row / (rows - 1);
      const base = order(x, y);
      const random = noise(index + 1);

      pixels.push({
        id: index,
        left: originX + column * stride,
        top: originY + row * stride,
        offset: base === null ? random : base * (1 - mix) + random * mix
      });
    }
  }

  return { pixels, size, gap, width, height };
};

const buildKeyframes = ({
  ease,
  startScale,
  endScale,
  spin,
  fade
}: {
  ease: (progress: number) => number;
  startScale: number;
  endScale: number;
  spin: number;
  fade: boolean;
}) => {
  const windowFrames: Keyframe[] = [];
  const content: Keyframe[] = [];

  for (let step = 0; step <= KEYFRAME_STEPS; step += 1) {
    const progress = step / KEYFRAME_STEPS;
    const eased = ease(progress);
    const scale = startScale + (endScale - startScale) * eased;
    const angle = spin * (1 - eased);

    windowFrames.push({
      offset: progress,
      opacity: fade ? Math.min(1, eased * 1.6) : 1,
      transform: `rotate(${angle}deg) scale(${scale})`
    });
    content.push({
      offset: progress,
      transform: `scale(${1 / scale}) rotate(${-angle}deg)`
    });
  }

  return { window: windowFrames, content };
};

const props = withDefaults(defineProps<PixelSwapProps>(), {
  pixelSize: 64,
  gap: 0,
  pixelRadius: 0,
  pixelSpin: 0,
  pixelScale: 0.35,
  fade: true,
  duration: 1400,
  pixelDuration: 450,
  pattern: 'random',
  randomness: 0,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  trigger: 'hover',
  initialActive: false,
  active: undefined,
  aspectRatio: '16 / 10',
  className: ''
});

const emit = defineEmits<{
  activeChange: [active: boolean];
  complete: [active: boolean];
}>();

const internalActive = ref(props.initialActive);
const shownActive = ref(props.active ?? props.initialActive);
const transition = ref<Transition | null>(null);
const box = ref({ width: 0, height: 0 });

const containerRef = ref<HTMLDivElement | null>(null);
const layerEls: Array<HTMLDivElement | null> = [null, null];
const pixelEls: Array<HTMLDivElement | null> = [];
const pixelRefCallbacks = new Map<number, (el: Element | ComponentPublicInstance | null) => void>();

const getPixelRefCallback = (index: number) => {
  let callback = pixelRefCallbacks.get(index);
  if (!callback) {
    callback = (el: Element | ComponentPublicInstance | null) => {
      pixelEls[index] = (el as HTMLDivElement | null) ?? null;
    };
    pixelRefCallbacks.set(index, callback);
  }
  return callback;
};

const setLayerRef = (index: number) => (el: Element | ComponentPublicInstance | null) => {
  layerEls[index] = (el as HTMLDivElement | null) ?? null;
};

const desiredActive = computed(() => props.active ?? internalActive.value);
const incomingIndex = computed(() => (transition.value?.to ? 1 : 0));
const isShown = (index: number) => index === (shownActive.value ? 1 : 0);

const grid = computed<Grid>(() =>
  buildGrid({
    width: box.value.width,
    height: box.value.height,
    pixelSize: Math.max(8, Math.round(props.pixelSize)),
    gap: Math.max(0, Math.round(props.gap)),
    pattern: props.pattern,
    randomness: props.randomness
  })
);

let animations: Animation[] = [];
let timer = 0;

const stopAnimations = () => {
  animations.forEach(animation => animation.cancel());
  animations = [];
  pixelEls.forEach(pixel => pixel?.replaceChildren());
  if (timer) window.clearTimeout(timer);
  timer = 0;
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;

  const measure = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    if (box.value.width !== width || box.value.height !== height) {
      box.value = { width, height };
    }
  };

  measure();
  resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(container);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  stopAnimations();
});

watch(
  () => [desiredActive.value, shownActive.value, transition.value],
  () => {
    if (transition.value || desiredActive.value === shownActive.value) return;
    transition.value = { to: desiredActive.value, grid: grid.value };
  }
);

watch(
  transition,
  (_next, _prev, onCleanup) => {
    const currentTransition = transition.value;
    if (!currentTransition) return;

    const settings = {
      duration: props.duration,
      pixelDuration: props.pixelDuration,
      pixelSpin: props.pixelSpin,
      pixelScale: props.pixelScale,
      pixelRadius: props.pixelRadius,
      fade: props.fade,
      easing: props.easing
    };
    const frozenGrid = currentTransition.grid;
    const to = currentTransition.to;

    const finish = () => {
      stopAnimations();
      shownActive.value = to;
      transition.value = null;
      emit('complete', to);
    };

    const source = layerEls[to ? 1 : 0];
    if (!source || !frozenGrid.pixels.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      onCleanup(() => stopAnimations());
      return;
    }

    const total = Math.max(200, settings.duration);
    const pixelMs = clamp(settings.pixelDuration, 60, total);
    const spread = Math.max(0, total - pixelMs);
    const endScale = coverScale(frozenGrid.size, frozenGrid.gap, settings.pixelRadius);
    const keyframes = buildKeyframes({
      ease: makeEasing(settings.easing),
      startScale: clamp(settings.pixelScale, 0.05, 1) * endScale,
      endScale,
      spin: settings.pixelSpin,
      fade: settings.fade
    });

    frozenGrid.pixels.forEach((pixel, index) => {
      const pixelElement = pixelEls[index];
      if (!pixelElement) return;

      const content = document.createElement('div');
      content.className = 'absolute';
      content.style.left = `${-pixel.left}px`;
      content.style.top = `${-pixel.top}px`;
      content.style.width = `${frozenGrid.width}px`;
      content.style.height = `${frozenGrid.height}px`;
      const originX = pixel.left + frozenGrid.size / 2;
      const originY = pixel.top + frozenGrid.size / 2;
      content.style.transformOrigin = `${originX}px ${originY}px`;

      const clone = source.cloneNode(true) as HTMLElement;
      clone.classList.remove('invisible');
      clone.dataset.visible = 'true';
      clone.removeAttribute('aria-hidden');
      content.appendChild(clone);
      pixelElement.replaceChildren(content);

      const timing: KeyframeAnimationOptions = {
        duration: pixelMs,
        delay: pixel.offset * spread,
        easing: 'linear',
        fill: 'both'
      };
      animations.push(pixelElement.animate(keyframes.window, timing), content.animate(keyframes.content, timing));
    });

    timer = window.setTimeout(finish, total);
    onCleanup(() => stopAnimations());
  },
  { flush: 'post' }
);

const requestActive = (next: boolean) => {
  if (props.active === undefined) internalActive.value = next;
  emit('activeChange', next);
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    requestActive(!desiredActive.value);
  }
};

const interactionHandlers = computed(() => {
  if (props.trigger === 'hover') {
    return {
      mouseenter: () => requestActive(true),
      mouseleave: () => requestActive(false),
      focus: () => requestActive(true),
      blur: () => requestActive(false)
    };
  }
  if (props.trigger === 'click') {
    return {
      click: () => requestActive(!desiredActive.value),
      keydown: onKeyDown
    };
  }
  return {};
});
</script>

<template>
  <div
    ref="containerRef"
    class="isolate relative outline-none w-full overflow-hidden"
    :class="className"
    :style="{ aspectRatio, ...(style || {}) }"
    :data-active="shownActive"
    :data-transitioning="!!transition"
    v-on="interactionHandlers"
    :tabindex="trigger === 'hover' || trigger === 'click' ? 0 : undefined"
    :role="trigger === 'click' ? 'button' : undefined"
  >
    <div
      :ref="setLayerRef(0)"
      class="data-[visible=false]:invisible absolute inset-0 w-full h-full"
      :data-visible="isShown(0) && !(transition && 0 === incomingIndex)"
      :style="{ zIndex: isShown(0) ? 2 : 1 }"
      :aria-hidden="!isShown(0)"
    >
      <slot name="first" />
    </div>
    <div
      :ref="setLayerRef(1)"
      class="data-[visible=false]:invisible absolute inset-0 w-full h-full"
      :data-visible="isShown(1) && !(transition && 1 === incomingIndex)"
      :style="{ zIndex: isShown(1) ? 2 : 1 }"
      :aria-hidden="!isShown(1)"
    >
      <slot name="second" />
    </div>

    <div v-if="transition" class="z-[3] absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        v-for="(pixel, index) in transition.grid.pixels"
        :key="pixel.id"
        :ref="getPixelRefCallback(index)"
        class="absolute opacity-0 overflow-hidden [contain:paint]"
        :style="{
          left: `${pixel.left}px`,
          top: `${pixel.top}px`,
          width: `${transition.grid.size}px`,
          height: `${transition.grid.size}px`,
          borderRadius: `${clamp(pixelRadius, 0, 50)}%`
        }"
      />
    </div>
  </div>
</template>
