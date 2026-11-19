<template>
  <div
    ref="rootRef"
    :class="['pixelated-image-card', className]"
    :style="rootStyle"
    :tabindex="0"
    :role="hover ? undefined : 'button'"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown"
    @click="onClick"
    @focusin="onFocus"
    @focusout="onBlur"
    @keydown="onKeyDown"
  >
    <div v-if="padded" :style="{ paddingTop: ratio }" />
    <div ref="firstRef" class="pixelated-image-card__default" :style="FIRST_STYLE">
      <slot name="firstContent" />
    </div>
    <div ref="secondRef" class="pixelated-image-card__active" :style="SECOND_STYLE">
      <slot name="secondContent" />
    </div>
    <canvas ref="canvasRef" class="pixelated-image-card__pixels" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

export type PixelTransitionPattern = 'random' | 'dither' | 'ripple' | 'wipe';
export type PixelTransitionAnimation = 'pop' | 'grow' | 'fade';
export type PixelTransitionShape = 'square' | 'rounded' | 'circle';

interface PixelTransitionProps {
  gridSize?: number;
  pixelColor?: string;
  mosaic?: number;
  animationStepDuration?: number;
  pattern?: PixelTransitionPattern;
  randomness?: number;
  pixelAnimation?: PixelTransitionAnimation;
  pixelShape?: PixelTransitionShape;
  gap?: number;
  fps?: number;
  trigger?: 'hover' | 'click';
  active?: boolean;
  once?: boolean;
  onActiveChange?: (active: boolean) => void;
  aspectRatio?: string;
  className?: string;
  style?: CSSProperties;
}

type Point = { x: number; y: number };
type Edge = 'left' | 'right' | 'top' | 'bottom';
type Control = { go: (next: boolean, point: Point | null) => void; goal: () => number };

const props = withDefaults(defineProps<PixelTransitionProps>(), {
  gridSize: 10,
  pixelColor: '#ffffff',
  mosaic: 0,
  animationStepDuration: 0.4,
  pattern: 'random',
  randomness: 0.3,
  pixelAnimation: 'pop',
  pixelShape: 'square',
  gap: 0,
  fps: 0,
  trigger: 'hover',
  active: undefined,
  once: false,
  onActiveChange: undefined,
  aspectRatio: '100%',
  className: '',
  style: undefined
});

const PATTERNS: PixelTransitionPattern[] = ['random', 'dither', 'ripple', 'wipe'];
const ANIMATIONS: PixelTransitionAnimation[] = ['pop', 'grow', 'fade'];
const SHAPES: PixelTransitionShape[] = ['square', 'rounded', 'circle'];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const WINDOW = 0.35;
const SEAL = 0.22;
const TONES = 5;
const LEVELS = 16;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smooth = (t: number) => t * t * (3 - 2 * t);

const hash = (x: number, y: number, seed: number) => {
  let h = Math.imul(x + 1, 0x27d4eb2d) ^ Math.imul(y + 1, 0x165667b1) ^ Math.imul(seed + 1, 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const rootRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const firstRef = ref<HTMLDivElement | null>(null);
const secondRef = ref<HTMLDivElement | null>(null);

const initial = props.active ? 1 : 0;
const FIRST_STYLE: CSSProperties = initial === 0 ? {} : { visibility: 'hidden' };
const SECOND_STYLE: CSSProperties = initial === 1 ? {} : { visibility: 'hidden' };

let control: Control | null = null;
let pendingPoint: Point | null = null;
let hovering = false;
let focused = false;
let pointerType = 'mouse';

const settings = computed(() => ({
  gridSize: clamp(Math.round(props.gridSize), 2, 80),
  pixelColor: props.pixelColor,
  mosaic: clamp(props.mosaic, 0, 1),
  duration: Math.max(0.05, props.animationStepDuration),
  pattern: PATTERNS.includes(props.pattern) ? props.pattern : ('random' as PixelTransitionPattern),
  randomness: clamp(props.randomness, 0, 1),
  animation: ANIMATIONS.includes(props.pixelAnimation) ? props.pixelAnimation : ('pop' as PixelTransitionAnimation),
  shape: SHAPES.includes(props.pixelShape) ? props.pixelShape : ('square' as PixelTransitionShape),
  gap: Math.max(0, props.gap),
  fps: clamp(props.fps, 0, 120),
  once: props.once
}));

const hover = computed(() => props.trigger !== 'click');
const ratio = computed(() => String(props.aspectRatio).trim());
const padded = computed(() => ratio.value.endsWith('%'));
const rootStyle = computed<CSSProperties | undefined>(() =>
  padded.value ? props.style : { aspectRatio: ratio.value, ...props.style }
);

let cleanup: (() => void) | null = null;

onMounted(() => {
  const root = rootRef.value;
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext('2d');
  if (!root || !canvas || !ctx) return;

  const probe = document.createElement('canvas');
  probe.width = 1;
  probe.height = 1;
  const probeCtx = probe.getContext('2d', { willReadFrequently: true });
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const state = {
    progress: 0,
    base: initial,
    goal: initial,
    shown: initial,
    seed: 1,
    originX: 0.5,
    originY: 0.5,
    edge: 'left' as Edge,
    tones: ['#ffffff'] as string[],
    toneKey: '',
    dpr: 1
  };
  let raf = 0;
  let last = 0;
  let drawnAt = 0;
  let alive = true;

  const resolveTones = () => {
    const s = settings.value;
    canvas.style.color = s.pixelColor;
    const color = getComputedStyle(canvas).color;
    canvas.style.color = '';
    let rgba = [255, 255, 255, 1];
    if (probeCtx) {
      probeCtx.clearRect(0, 0, 1, 1);
      probeCtx.fillStyle = color;
      probeCtx.fillRect(0, 0, 1, 1);
      const data = probeCtx.getImageData(0, 0, 1, 1).data;
      rgba = [data[0], data[1], data[2], data[3] / 255];
    }
    const target = (0.2126 * rgba[0] + 0.7152 * rgba[1] + 0.0722 * rgba[2]) / 255 > 0.5 ? 0 : 255;
    state.tones = Array.from({ length: TONES }, (_, index) => {
      const mix = s.mosaic * 0.5 * (index / (TONES - 1));
      const [r, g, b] = rgba.slice(0, 3).map(value => Math.round(value + (target - value) * mix));
      return `rgba(${r}, ${g}, ${b}, ${rgba[3]})`;
    });
    state.toneKey = `${s.pixelColor}|${s.mosaic}`;
  };

  const show = (index: number) => {
    state.shown = index;
    if (firstRef.value) firstRef.value.style.visibility = index === 0 ? '' : 'hidden';
    if (secondRef.value) secondRef.value.style.visibility = index === 1 ? '' : 'hidden';
  };

  const draw = () => {
    const s = settings.value;
    const { width, height } = canvas;
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, width, height);
    const progress = state.progress;
    if (progress <= 0 || progress >= 1) return;
    if (state.toneKey !== `${s.pixelColor}|${s.mosaic}`) resolveTones();

    const covering = progress < 0.5;
    const local = covering ? progress * 2 : progress * 2 - 1;
    const seal = covering ? smooth(clamp((local - 1 + SEAL) / SEAL, 0, 1)) : 1 - smooth(clamp(local / SEAL, 0, 1));
    const cols = s.gridSize;
    const cell = width / cols;
    const rows = Math.ceil(height / cell);
    const top = (height - rows * cell) / 2;
    const gap = Math.min(cell * 0.8, s.gap * state.dpr) * (1 - seal);
    const ox = state.originX * width;
    const oy = state.originY * height;
    const far = Math.max(
      Math.hypot(ox, oy),
      Math.hypot(width - ox, oy),
      Math.hypot(ox, height - oy),
      Math.hypot(width - ox, height - oy)
    );
    const paths = new Map<number, Path2D>();

    for (let row = 0; row < rows; row++) {
      const y0 = top + row * cell;
      const cy = y0 + cell / 2;
      for (let col = 0; col < cols; col++) {
        const x0 = col * cell;
        const cx = x0 + cell / 2;
        const noise = hash(col, row, state.seed);
        let delay = noise;
        if (s.pattern === 'dither') delay = (BAYER[(row & 3) * 4 + (col & 3)] + noise) / 16;
        else if (s.pattern !== 'random') {
          let base;
          if (s.pattern === 'ripple') base = Math.hypot(cx - ox, cy - oy) / Math.max(1, far);
          else if (state.edge === 'left') base = cx / width;
          else if (state.edge === 'right') base = 1 - cx / width;
          else if (state.edge === 'top') base = cy / height;
          else base = 1 - cy / height;
          delay = clamp(base, 0, 1) * (1 - s.randomness) + noise * s.randomness;
        }

        let amount;
        if (s.animation === 'pop') amount = local >= delay === covering ? 1 : 0;
        else {
          const t = smooth(clamp((local - delay * (1 - WINDOW)) / WINDOW, 0, 1));
          amount = covering ? t : 1 - t;
        }
        if (amount <= 0.002) continue;

        const size = (s.animation === 'grow' ? cell * amount : cell) - gap;
        if (size <= 0) continue;
        const level = s.animation === 'fade' ? Math.max(1, Math.round(amount * LEVELS)) : LEVELS;
        const tone = s.mosaic > 0 ? Math.floor(hash(col, row, 7) * TONES) : 0;
        const key = tone * (LEVELS + 1) + level;
        let path = paths.get(key);
        if (!path) {
          path = new Path2D();
          paths.set(key, path);
        }

        if (s.shape === 'circle') {
          const radius = (size / 2) * (1 + 0.45 * seal);
          path.moveTo(cx + radius, cy);
          path.arc(cx, cy, radius, 0, Math.PI * 2);
        } else if (s.shape === 'rounded' && seal < 1 && path.roundRect) {
          path.roundRect(cx - size / 2, cy - size / 2, size, size, size * 0.3 * (1 - seal));
        } else if (size >= cell - 0.01) {
          const left = Math.round(x0);
          const upper = Math.round(y0);
          path.rect(left, upper, Math.round(x0 + cell) - left, Math.round(y0 + cell) - upper);
        } else {
          path.rect(cx - size / 2, cy - size / 2, size, size);
        }
      }
    }

    paths.forEach((path, key) => {
      ctx.globalAlpha = (key % (LEVELS + 1)) / LEVELS;
      ctx.fillStyle = state.tones[Math.floor(key / (LEVELS + 1))] ?? state.tones[0];
      ctx.fill(path);
    });
    ctx.globalAlpha = 1;
  };

  const paint = () => {
    const index = state.progress >= 0.5 ? 1 - state.base : state.base;
    if (index !== state.shown) show(index);
    draw();
  };

  const frame = (now: number) => {
    raf = 0;
    if (!alive) return;
    const s = settings.value;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    const aim = state.goal === state.base ? 0 : 1;
    const step = reduce ? 1 : dt / (2 * s.duration);
    state.progress = aim > state.progress ? Math.min(aim, state.progress + step) : Math.max(aim, state.progress - step);
    const settled = state.progress === aim;
    if (settled && aim === 1) {
      state.base = 1 - state.base;
      state.progress = 0;
    }
    if (settled || !s.fps || now - drawnAt >= 1000 / s.fps - 2) {
      drawnAt = now;
      paint();
    }
    if (!settled) raf = requestAnimationFrame(frame);
  };

  const start = (point: Point | null) => {
    const rect = root.getBoundingClientRect();
    const x = point ? clamp((point.x - rect.left) / Math.max(1, rect.width), 0, 1) : 0.5;
    const y = point ? clamp((point.y - rect.top) / Math.max(1, rect.height), 0, 1) : 0.5;
    state.originX = x;
    state.originY = y;
    state.seed = Math.floor(Math.random() * 65536);
    if (!point) state.edge = 'left';
    else {
      const sides: [Edge, number][] = [
        ['left', x * rect.width],
        ['right', (1 - x) * rect.width],
        ['top', y * rect.height],
        ['bottom', (1 - y) * rect.height]
      ];
      state.edge = sides.reduce((best, side) => (side[1] < best[1] ? side : best))[0];
    }
    resolveTones();
  };

  const go = (next: boolean, point: Point | null) => {
    const goal = next ? 1 : 0;
    if (goal === state.goal) return;
    if (!goal && settings.value.once) return;
    state.goal = goal;
    if (state.progress === 0 && goal !== state.base) start(point);
    if (raf) return;
    last = 0;
    drawnAt = 0;
    raf = requestAnimationFrame(frame);
  };

  control = { go, goal: () => state.goal };

  const resize = () => {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(root.clientWidth * state.dpr));
    canvas.height = Math.max(1, Math.round(root.clientHeight * state.dpr));
    draw();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  resize();

  cleanup = () => {
    alive = false;
    cancelAnimationFrame(raf);
    control = null;
    resizeObserver.disconnect();
  };
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});

watch(
  () => props.active,
  active => {
    if (active === undefined) return;
    control?.go(active, pendingPoint);
    pendingPoint = null;
  }
);

const request = (next: boolean, point: Point | null) => {
  if (!control || (!next && props.once && control.goal() === 1)) return;
  if (props.active === undefined) control.go(next, point);
  else pendingPoint = point;
  props.onActiveChange?.(next);
};

const pointOf = (event: PointerEvent | MouseEvent): Point => ({ x: event.clientX, y: event.clientY });

const onPointerEnter = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return;
  hovering = true;
  if (hover.value) request(true, pointOf(event));
};

const onPointerLeave = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return;
  hovering = false;
  if (hover.value && !focused) request(false, pointOf(event));
};

const onPointerDown = (event: PointerEvent) => {
  pointerType = event.pointerType;
};

const onClick = (event: MouseEvent) => {
  if (hover.value && pointerType !== 'touch') return;
  request(control?.goal() !== 1, pointOf(event));
};

const onFocus = (event: FocusEvent) => {
  const current = event.currentTarget as HTMLElement;
  if (!hover.value || current.contains(event.relatedTarget as Node | null)) return;
  if (!(event.target as HTMLElement).matches(':focus-visible')) return;
  focused = true;
  request(true, null);
};

const onBlur = (event: FocusEvent) => {
  const current = event.currentTarget as HTMLElement;
  if (!focused || current.contains(event.relatedTarget as Node | null)) return;
  focused = false;
  if (!hovering) request(false, null);
};

const onKeyDown = (event: KeyboardEvent) => {
  if (hover.value || event.target !== event.currentTarget) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  request(control?.goal() !== 1, null);
};
</script>

<style>
.pixelated-image-card {
  position: relative;
  width: 300px;
  max-width: 100%;
  overflow: hidden;
  border-radius: 16px;
  isolation: isolate;
  -webkit-tap-highlight-color: transparent;
}

.pixelated-image-card:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.pixelated-image-card__default,
.pixelated-image-card__active {
  position: absolute;
  inset: 0;
}

.pixelated-image-card__pixels {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
