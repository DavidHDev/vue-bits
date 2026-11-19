<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

export type PixelSwapPattern =
  | 'pointer'
  | 'random'
  | 'center'
  | 'edges'
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'diagonal'
  | 'spiral';

export type PixelSwapTrigger = 'hover' | 'click' | 'none';

interface PixelSwapProps {
  pattern?: PixelSwapPattern;
  pixelSize?: number;
  gap?: number;
  pixelRadius?: number;
  pixelScale?: number;
  pixelSpin?: number;
  duration?: number;
  pixelDuration?: number;
  randomness?: number;
  bounce?: number;
  trigger?: PixelSwapTrigger;
  intro?: boolean;
  initialActive?: boolean;
  active?: boolean;
  aspectRatio?: string;
  className?: string;
  style?: CSSProperties;
}

interface Point {
  x: number;
  y: number;
}

interface Grid {
  count: number;
  size: number;
  stride: number;
  gap: number;
  width: number;
  height: number;
  cx: Float32Array;
  cy: Float32Array;
  gx: Float32Array;
  gy: Float32Array;
}

interface Engine {
  mode: 'intro' | 'swap';
  grid: Grid;
  value: Float32Array;
  velocity: Float32Array;
  flipAt: Float64Array;
  target: Uint8Array;
  desired: number;
  last: number;
  running: boolean;
  raf: number;
}

const MAX_PIXELS = 600;
const STEP = 1 / 240;
const PATTERNS = [
  'pointer',
  'random',
  'center',
  'edges',
  'left-to-right',
  'right-to-left',
  'top-to-bottom',
  'bottom-to-top',
  'diagonal',
  'spiral'
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const hash = (index: number) => {
  let h = Math.imul(index + 1, 0x27d4eb2d);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const round = (value: number) => Math.round(value * 10) / 10;

const buildGrid = (width: number, height: number, pixelSize: number, gap: number): Grid => {
  let size = pixelSize;
  let columns = Math.max(1, Math.ceil((width + gap) / (size + gap)));
  let rows = Math.max(1, Math.ceil((height + gap) / (size + gap)));
  if (columns * rows > MAX_PIXELS) {
    size = Math.ceil(size * Math.sqrt((columns * rows) / MAX_PIXELS));
    columns = Math.max(1, Math.ceil((width + gap) / (size + gap)));
    rows = Math.max(1, Math.ceil((height + gap) / (size + gap)));
  }
  const stride = size + gap;
  const startX = (width - (columns * stride - gap)) / 2;
  const startY = (height - (rows * stride - gap)) / 2;
  const count = columns * rows;
  const cx = new Float32Array(count);
  const cy = new Float32Array(count);
  const gx = new Float32Array(count);
  const gy = new Float32Array(count);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;
      cx[index] = startX + column * stride + size / 2;
      cy[index] = startY + row * stride + size / 2;
      gx[index] = columns > 1 ? column / (columns - 1) : 0.5;
      gy[index] = rows > 1 ? row / (rows - 1) : 0.5;
    }
  }
  return { count, size, stride, gap, width, height, cx, cy, gx, gy };
};

const orderOf = (grid: Grid, index: number, pattern: string, point: Point | null) => {
  const x = grid.gx[index];
  const y = grid.gy[index];
  if (pattern === 'random') return hash(index + 11);
  if (pattern === 'center') return Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
  if (pattern === 'edges') return 1 - Math.min(x, 1 - x, y, 1 - y) * 2;
  if (pattern === 'left-to-right') return x;
  if (pattern === 'right-to-left') return 1 - x;
  if (pattern === 'top-to-bottom') return y;
  if (pattern === 'bottom-to-top') return 1 - y;
  if (pattern === 'diagonal') return (x + y) / 2;
  if (pattern === 'spiral') {
    const angle = (Math.atan2(y - 0.5, x - 0.5) + Math.PI) / (Math.PI * 2);
    return (angle + Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2) / 2;
  }
  const px = point ? point.x : grid.width / 2;
  const py = point ? point.y : grid.height / 2;
  const reach = Math.max(
    Math.hypot(px, py),
    Math.hypot(grid.width - px, py),
    Math.hypot(px, grid.height - py),
    Math.hypot(grid.width - px, grid.height - py),
    1
  );
  return Math.hypot(grid.cx[index] - px, grid.cy[index] - py) / reach;
};

const pixelPath = (x: number, y: number, half: number, radius: number, angle: number) => {
  if (!angle) {
    const x0 = round(x - half);
    const x1 = round(x + half);
    const y0 = round(y - half);
    const y1 = round(y + half);
    if (radius < 0.2) return `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
    const r = round(radius);
    return `M${round(x0 + r)} ${y0}H${round(x1 - r)}A${r} ${r} 0 0 1 ${x1} ${round(y0 + r)}V${round(y1 - r)}A${r} ${r} 0 0 1 ${round(x1 - r)} ${y1}H${round(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${round(y1 - r)}V${round(y0 + r)}A${r} ${r} 0 0 1 ${round(x0 + r)} ${y0}Z`;
  }
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const at = (u: number, v: number) => `${round(x + u * cos - v * sin)} ${round(y + u * sin + v * cos)}`;
  const h = half;
  if (radius < 0.2) return `M${at(-h, -h)}L${at(h, -h)}L${at(h, h)}L${at(-h, h)}Z`;
  const r = round(radius);
  const k = h - radius;
  return `M${at(-k, -h)}L${at(k, -h)}A${r} ${r} 0 0 1 ${at(h, -k)}L${at(h, k)}A${r} ${r} 0 0 1 ${at(k, h)}L${at(-k, h)}A${r} ${r} 0 0 1 ${at(-h, k)}L${at(-h, -k)}A${r} ${r} 0 0 1 ${at(-k, -h)}Z`;
};

const props = withDefaults(defineProps<PixelSwapProps>(), {
  pattern: 'pointer',
  pixelSize: 48,
  gap: 0,
  pixelRadius: 0,
  pixelScale: 0,
  pixelSpin: 0,
  duration: 400,
  pixelDuration: 350,
  randomness: 0.2,
  bounce: 0.3,
  trigger: 'hover',
  intro: true,
  initialActive: false,
  active: undefined,
  aspectRatio: '16 / 10',
  className: ''
});

const emit = defineEmits<{
  activeChange: [active: boolean];
  complete: [active: boolean];
}>();

defineSlots<{
  firstContent?: () => unknown;
  secondContent?: () => unknown;
}>();

const controlled = computed(() => props.active !== undefined);
const shown = ref(props.active !== undefined ? props.active : props.initialActive);
const rootRef = ref<HTMLDivElement | null>(null);
const firstLayerRef = ref<HTMLDivElement | null>(null);
const secondLayerRef = ref<HTMLDivElement | null>(null);
let shownValue = shown.value;
let desired = shown.value;
let pointValue: Point | null = null;
let engine: Engine | null = null;
let waiting = false;

const settings = computed(() => ({
  pattern: PATTERNS.includes(props.pattern) ? props.pattern : 'pointer',
  pixelSize: Math.max(8, Math.round(props.pixelSize)),
  gap: Math.max(0, props.gap),
  pixelRadius: clamp(props.pixelRadius, 0, 50),
  pixelScale: clamp(props.pixelScale, 0, 0.9),
  pixelSpin: (clamp(props.pixelSpin, -360, 360) * Math.PI) / 180,
  duration: Math.max(0, props.duration),
  pixelDuration: Math.max(60, props.pixelDuration),
  randomness: clamp(props.randomness, 0, 1),
  bounce: clamp(props.bounce, 0, 1)
}));

const setLayer = (index: number, visible: boolean, clip: string) => {
  const layer = index === 0 ? firstLayerRef.value : secondLayerRef.value;
  if (!layer) return;
  layer.setAttribute('data-visible', String(visible));
  layer.style.clipPath = clip || '';
};

const finish = () => {
  const current = engine;
  if (!current) return;
  current.running = false;
  rootRef.value?.removeAttribute('data-swapping');
  if (current.mode === 'intro') {
    setLayer(0, !shownValue, '');
    current.mode = 'swap';
    if (desired !== shownValue) request(desired, pointValue);
    return;
  }
  const target = current.desired === 1;
  setLayer(1, target, '');
  setLayer(0, !target, '');
  shownValue = target;
  shown.value = target;
  emit('complete', target);
};

const frame = (now: number) => {
  const current = engine;
  if (!current) return;
  const s = settings.value;
  const grid = current.grid;
  const { value, velocity, flipAt, target } = current;
  const elapsed = clamp((now - current.last) / 1000, 0, 1 / 20);
  current.last = now;
  const omega = (Math.PI * 2) / (s.pixelDuration / 1000);
  const zeta = clamp(1 - s.bounce, 0.15, 1);
  const steps = Math.max(1, Math.ceil(elapsed / STEP));
  const dt = elapsed / steps;
  const pop = s.pixelScale;
  const half = grid.size / 2;
  const cover = grid.gap / 2 + 0.5;
  let moving = false;
  let path = '';

  for (let i = 0; i < grid.count; i++) {
    if (now >= flipAt[i] && target[i] !== current.desired) {
      target[i] = current.desired;
      if (target[i] === 1 && value[i] < pop) value[i] = pop;
    }
    let x = value[i];
    let v = velocity[i];
    const goal = target[i];
    for (let n = 0; n < steps; n++) {
      v += (-omega * omega * (x - goal) - 2 * zeta * omega * v) * dt;
      x += v * dt;
    }
    if (goal === 0 && x <= pop) {
      x = 0;
      v = 0;
    }
    if (Math.abs(x - goal) > 0.001 || Math.abs(v) > 0.01 || now < flipAt[i]) moving = true;
    else {
      x = goal;
      v = 0;
    }
    value[i] = x;
    velocity[i] = v;
    if (x <= 0.002) continue;
    const size = Math.min(x * 1.08, 1.25) * (half + cover * smoothstep(0.6, 0.93, x));
    const radius = Math.min(size, (s.pixelRadius / 50) * size * (1 - smoothstep(0.6, 0.93, x)));
    path += pixelPath(grid.cx[i], grid.cy[i], size, radius, s.pixelSpin * (1 - x));
  }

  const index = current.mode === 'intro' ? 0 : 1;
  setLayer(index, path !== '', path ? `path('${path}')` : '');

  if (moving) current.raf = requestAnimationFrame(frame);
  else finish();
};

const launch = (mode: Engine['mode'], to: boolean, point: Point | null) => {
  const root = rootRef.value;
  const s = settings.value;
  let current: Engine | null = engine;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const width = root?.clientWidth ?? 0;
  const height = root?.clientHeight ?? 0;
  if (!root || reduce || !width || !height) return false;

  const now = performance.now();
  if (!current?.running) {
    const grid = buildGrid(width, height, s.pixelSize, s.gap);
    const start = mode === 'intro' ? 0 : shownValue ? 1 : 0;
    current = {
      mode,
      grid,
      value: new Float32Array(grid.count).fill(start),
      velocity: new Float32Array(grid.count),
      flipAt: new Float64Array(grid.count),
      target: new Uint8Array(grid.count).fill(start),
      desired: start,
      last: now,
      running: true,
      raf: engine?.raf ?? 0
    };
    engine = current;
  }
  current.desired = to ? 1 : 0;
  const grid = current.grid;
  const orders = new Float32Array(grid.count);
  let first = Infinity;
  for (let i = 0; i < grid.count; i++) {
    orders[i] = orderOf(grid, i, s.pattern, point) * (1 - s.randomness) + hash(i) * s.randomness;
    const settled = current.target[i] === current.desired && Math.abs(current.value[i] - current.desired) < 0.001;
    if (!settled) first = Math.min(first, orders[i]);
  }
  if (first === Infinity) first = 0;
  for (let i = 0; i < grid.count; i++) current.flipAt[i] = now + Math.max(0, orders[i] - first) * s.duration;
  root.setAttribute('data-swapping', '');
  if (mode === 'swap') setLayer(0, true, '');
  cancelAnimationFrame(current.raf);
  current.raf = requestAnimationFrame(frame);
  return true;
};

function request(to: boolean, point: Point | null) {
  if (waiting || (engine?.running && engine.mode === 'intro')) return;
  if (!engine?.running && shownValue === to) return;
  if (launch('swap', to, point)) return;
  setLayer(1, to, '');
  setLayer(0, !to, '');
  shownValue = to;
  shown.value = to;
  emit('complete', to);
}

const ask = (next: boolean, point: Point | null) => {
  desired = next;
  pointValue = point;
  emit('activeChange', next);
  if (!controlled.value) request(next, point);
};

let introCleanup: (() => void) | null = null;

onMounted(() => {
  if (!props.intro || shownValue) return;
  const images = [...(firstLayerRef.value?.querySelectorAll('img') ?? [])].filter(image => !image.complete);
  let started = false;
  let timer = 0;
  const begin = () => {
    if (started) return;
    started = true;
    clearTimeout(timer);
    waiting = false;
    if (launch('intro', true, null)) return;
    setLayer(0, true, '');
    if (desired !== shownValue) request(desired, pointValue);
  };
  setLayer(0, false, '');
  if (!images.length) {
    begin();
    return;
  }
  waiting = true;
  let left = images.length;
  const settle = () => {
    left -= 1;
    if (left <= 0) begin();
  };
  images.forEach(image => {
    image.addEventListener('load', settle, { once: true });
    image.addEventListener('error', settle, { once: true });
  });
  timer = window.setTimeout(begin, 3000);
  introCleanup = () => {
    started = true;
    clearTimeout(timer);
    waiting = false;
    images.forEach(image => {
      image.removeEventListener('load', settle);
      image.removeEventListener('error', settle);
    });
  };
});

const syncActive = (next: boolean | undefined) => {
  if (next === undefined) return;
  desired = next;
  request(next, pointValue);
};

onMounted(() => syncActive(props.active));

watch(
  () => props.active,
  next => syncActive(next)
);

onBeforeUnmount(() => {
  introCleanup?.();
  const current = engine;
  if (!current) return;
  cancelAnimationFrame(current.raf);
  current.running = false;
});

const pointOf = (event: MouseEvent): Point | null => {
  const rect = rootRef.value?.getBoundingClientRect();
  if (!rect || (event.detail === 0 && event.clientX === 0 && event.clientY === 0)) return null;
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
};

const listeners = computed((): Record<string, (event: never) => void> => {
  if (props.trigger === 'hover') {
    return {
      pointerenter: (event: PointerEvent) => {
        if (event.pointerType !== 'touch') ask(true, pointOf(event));
      },
      pointerleave: (event: PointerEvent) => {
        if (event.pointerType !== 'touch') ask(false, pointOf(event));
      },
      click: (event: MouseEvent) => {
        const touch = 'pointerType' in event && (event as PointerEvent).pointerType === 'touch';
        if (event.detail === 0 || touch) ask(!desired, pointOf(event));
      },
      focusin: (event: FocusEvent) => {
        const target = event.currentTarget as HTMLElement;
        if (event.target === target && target.matches(':focus-visible')) ask(true, null);
      },
      focusout: () => ask(false, null)
    };
  }
  if (props.trigger === 'click') {
    return {
      click: (event: MouseEvent) => ask(!desired, pointOf(event)),
      keydown: (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        ask(!desired, null);
      }
    };
  }
  return {};
});

const attributes = computed(() => {
  if (props.trigger === 'hover') return { tabindex: 0 };
  if (props.trigger === 'click') return { role: 'button', tabindex: 0, 'aria-pressed': shown.value };
  return {};
});
</script>

<template>
  <div
    ref="rootRef"
    :class="['pixel-swap', className].filter(Boolean).join(' ')"
    :style="{ aspectRatio, ...(style || {}) }"
    :data-active="shown ? '' : undefined"
    v-bind="attributes"
    v-on="listeners"
  >
    <div
      ref="firstLayerRef"
      class="pixel-swap__layer"
      style="z-index: 0"
      :data-visible="String(!shown)"
      :aria-hidden="shown"
    >
      <slot name="firstContent" />
    </div>
    <div
      ref="secondLayerRef"
      class="pixel-swap__layer"
      style="z-index: 1"
      :data-visible="String(shown)"
      :aria-hidden="!shown"
    >
      <slot name="secondContent" />
    </div>
  </div>
</template>

<style>
.pixel-swap {
  position: relative;
  width: 100%;
  overflow: hidden;
  isolation: isolate;
  outline: none;
}

.pixel-swap:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.pixel-swap__layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.pixel-swap__layer[data-visible='false'] {
  visibility: hidden;
}
</style>
