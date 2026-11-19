<script setup lang="ts">
import {
  computed,
  createTextVNode,
  h,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useId,
  watch,
  type CSSProperties,
  type FunctionalComponent
} from 'vue';

export type CurvedLoopShape = 'arc' | 'wave' | 'circle' | 'line';

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
  pauseOnHover?: boolean;
  color?: string;
  edgeFade?: number;
  shape?: CurvedLoopShape;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  outline?: boolean;
  separator?: string;
  separatorColor?: string;
  scrollBoost?: number;
}

interface DragState {
  active: boolean;
  x: number;
  time: number;
  scale: number;
  velocity: number;
  ring: boolean;
  radius: number;
  angle: number;
  cx: number;
  cy: number;
}

interface Geometry {
  d: string;
  viewBox: string;
  radius: number;
  repeats: number;
  span: number;
}

const props = withDefaults(defineProps<CurvedLoopProps>(), {
  marqueeText: '',
  speed: 2,
  className: undefined,
  curveAmount: 400,
  direction: 'left',
  interactive: true,
  pauseOnHover: false,
  color: 'currentColor',
  edgeFade: 0,
  shape: 'arc',
  fontSize: 96,
  fontWeight: 700,
  letterSpacing: 0,
  outline: false,
  separator: '',
  separatorColor: undefined,
  scrollBoost: 0
});

const VIEW_WIDTH = 1440;
const VIEW_HEIGHT = 120;
const MAX_FLING = 4000;
const WAVE_LENGTH = 960;
const RING_RADIUS = 2.2;
const TAU = Math.PI * 2;

const wrapOffset = (value: number, length: number) =>
  length > 0 ? (((value % length) + length) % length) - length : value;

const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

const edgeMask = (amount: number, span: number) => {
  const size = Math.min(Math.max(amount, 0), 1) * 50 * span;
  if (size <= 0) return undefined;
  const start = 50 - span * 50;
  const steps = 10;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const alpha = (t * t * t * (t * (t * 6 - 15) + 10)).toFixed(3);
    left.push(`rgba(0, 0, 0, ${alpha}) ${(start + t * size).toFixed(2)}%`);
    right.unshift(`rgba(0, 0, 0, ${alpha}) ${(100 - start - t * size).toFixed(2)}%`);
  }
  return `linear-gradient(to right, ${[...left, ...right].join(', ')})`;
};

const wavePath = (amplitude: number, baseline: number) => {
  const from = -100;
  const to = VIEW_WIDTH + 100;
  const k = TAU / WAVE_LENGTH;
  const y = (x: number) => baseline + amplitude * Math.cos(k * (x - VIEW_WIDTH / 2));
  const slope = (x: number) => -amplitude * k * Math.sin(k * (x - VIEW_WIDTH / 2));
  const count = Math.ceil((to - from) / (WAVE_LENGTH / 8));
  const step = (to - from) / count;
  const f = (n: number) => n.toFixed(2);
  let d = `M${f(from)},${f(y(from))}`;
  for (let i = 0; i < count; i++) {
    const x0 = from + i * step;
    const x1 = x0 + step;
    d += ` C${f(x0 + step / 3)},${f(y(x0) + (slope(x0) * step) / 3)} ${f(x1 - step / 3)},${f(y(x1) - (slope(x1) * step) / 3)} ${f(x1)},${f(y(x1))}`;
  }
  return d;
};

const getGeometry = (shape: CurvedLoopShape, curveAmount: number, fontSize: number, spacing: number): Geometry => {
  if (shape === 'circle') {
    const repeats = spacing > 0 ? Math.max(1, Math.round((TAU * fontSize * RING_RADIUS) / spacing)) : 1;
    const radius = spacing > 0 ? (repeats * spacing) / TAU : fontSize * RING_RADIUS;
    const half = radius + fontSize;
    return {
      d: `M${-radius},0 A${radius},${radius} 0 1,1 ${radius},0 A${radius},${radius} 0 1,1 ${-radius},0`,
      viewBox: `${-half} ${-half} ${half * 2} ${half * 2}`,
      radius,
      repeats,
      span: Math.min(1, (fontSize * (RING_RADIUS + 1) * 2) / VIEW_WIDTH)
    };
  }
  const flat = { viewBox: `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`, radius: 0, repeats: 0, span: 1 };
  const baseline = VIEW_HEIGHT / 2 + fontSize * 0.36;
  if (shape === 'line') return { ...flat, d: `M-100,${baseline} L${VIEW_WIDTH + 100},${baseline}` };
  if (shape === 'wave') return { ...flat, d: wavePath(curveAmount * 0.25, baseline) };
  return { ...flat, d: `M-100,40 Q500,${40 + curveAmount} 1540,40` };
};

const body = computed(() => props.marqueeText.replace(/\s+$/, ''));
const mark = computed(() => String(props.separator ?? '').trim());
const text = computed(() => (mark.value ? `${body.value} ${mark.value} ` : `${body.value} `));
const pathId = `curve-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

const jacketRef = ref<HTMLDivElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const measureRef = ref<SVGTextElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);
let textPaths: SVGTextPathElement[] = [];

const spacing = ref(0);
const pathLength = ref(0);
const dragging = ref(false);

let spacingValue = 0;
let offset = 0;
let velocity = 0;
let currentDirection: 'left' | 'right' = props.direction;
let hovering = false;
const scrollState = { distance: 0, level: 0 };
let drag: DragState = {
  active: false,
  x: 0,
  time: 0,
  scale: 1,
  velocity: 0,
  ring: false,
  radius: 0,
  angle: 0,
  cx: 0,
  cy: 0
};

const ring = computed(() => props.shape === 'circle');
const geometry = computed(() => getGeometry(props.shape, props.curveAmount, props.fontSize, spacing.value));
const ready = computed(() => spacing.value > 0);
const copies = computed(() =>
  ready.value
    ? ring.value
      ? geometry.value.repeats + 1
      : Math.ceil((pathLength.value || 1800) / spacing.value) + 2
    : 1
);
const mask = computed(() => edgeMask(props.edgeFade, geometry.value.span));

const maskId = `${pathId}-outline`;
const accent = computed(() => Boolean(mark.value && props.separatorColor));
const plain = computed(() => text.value.repeat(copies.value));

const Repeat: FunctionalComponent<{ markProps: Record<string, string | undefined> }> = ({ markProps }) =>
  Array.from({ length: copies.value }, () => [
    createTextVNode(`${body.value} `),
    h('tspan', markProps, mark.value),
    createTextVNode(' ')
  ]).flat();
Repeat.props = ['markProps'];

const jacketStyle = computed<CSSProperties>(() => ({
  visibility: ready.value ? 'visible' : 'hidden',
  cursor: props.interactive ? (dragging.value ? 'grabbing' : 'grab') : 'auto',
  touchAction: props.interactive ? 'pan-y' : 'auto',
  maskImage: mask.value,
  WebkitMaskImage: mask.value
}));

const svgStyle = computed<CSSProperties>(() => ({
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  letterSpacing: `${props.letterSpacing}px`,
  ...(ring.value ? { width: `${(geometry.value.span * 100).toFixed(3)}%`, aspectRatio: '1' } : null)
}));

const applyOffset = () => {
  const value = `${offset}px`;
  for (const node of textPaths) node.setAttribute('startOffset', value);
};

const syncTextPaths = () => {
  textPaths = svgRef.value ? Array.from(svgRef.value.querySelectorAll('textPath')) : [];
  applyOffset();
};

watch(
  () => props.direction,
  value => {
    currentDirection = value;
  }
);

let stopMeasure: (() => void) | null = null;
const startMeasure = () => {
  stopMeasure?.();
  const measure = () => {
    if (measureRef.value) spacing.value = measureRef.value.getComputedTextLength();
  };
  measure();
  let active = true;
  const fonts = document.fonts;
  fonts?.ready.then(() => active && measure());
  fonts?.addEventListener?.('loadingdone', measure);
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
  if (observer && svgRef.value) observer.observe(svgRef.value);
  stopMeasure = () => {
    active = false;
    fonts?.removeEventListener?.('loadingdone', measure);
    observer?.disconnect();
  };
};

watch(
  [text, () => props.className, () => props.fontSize, () => props.fontWeight, () => props.letterSpacing],
  startMeasure,
  { flush: 'post' }
);

const measurePath = () => {
  if (pathRef.value) pathLength.value = pathRef.value.getTotalLength();
};

watch(() => geometry.value.d, measurePath, { flush: 'post' });

watch(
  spacing,
  value => {
    if (value <= 0) return;
    spacingValue = value;
    offset = wrapOffset(offset, value);
  },
  { flush: 'sync' }
);

let stopScroll: (() => void) | null = null;
const startScroll = () => {
  stopScroll?.();
  stopScroll = null;
  if (!props.scrollBoost) return;
  const positions = new Map<Window | Element, number>([[window, window.scrollY]]);
  const onScroll = (event: Event) => {
    const target = event.target instanceof Element ? event.target : window;
    if (target instanceof Element && !target.contains(jacketRef.value)) return;
    const position = target instanceof Element ? target.scrollTop : window.scrollY;
    const previous = positions.get(target);
    positions.set(target, position);
    if (previous !== undefined) scrollState.distance += Math.abs(position - previous);
  };
  window.addEventListener('scroll', onScroll, { passive: true, capture: true });
  stopScroll = () => window.removeEventListener('scroll', onScroll, { capture: true });
};

watch(() => props.scrollBoost, startScroll);

let stopLoop: (() => void) | null = null;
const startLoop = () => {
  stopLoop?.();
  stopLoop = null;
  if (!ready.value) return;
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let frame = 0;
  let last = 0;
  let visible = true;

  const tick = (now: number) => {
    frame = 0;
    if (!visible) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    const scroll = scrollState;
    const rate = dt > 0 ? scroll.distance / dt : 0;
    scroll.distance = 0;
    scroll.level += (rate - scroll.level) * (1 - Math.exp(-dt * (rate > scroll.level ? 10 : 2.4)));
    if (!drag.active) {
      const base = props.speed;
      const pause = props.pauseOnHover;
      const boost = props.scrollBoost;
      const sign = currentDirection === 'right' ? 1 : -1;
      const halted = reduceMotion || (pause && hovering);
      const target = halted ? 0 : sign * base * 60;
      const extra = halted ? 0 : sign * scroll.level * boost * 0.3;
      velocity += (target - velocity) * (1 - Math.exp(-dt * 3));
      const step = (velocity + extra) * dt;
      if (Math.abs(step) > 0.0001) {
        offset = wrapOffset(offset + step, spacingValue);
        for (const node of textPaths) node.setAttribute('startOffset', `${offset}px`);
      }
    }
    frame = requestAnimationFrame(tick);
  };

  const observer =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !frame) {
            last = 0;
            scrollState.level = 0;
            frame = requestAnimationFrame(tick);
          }
        })
      : null;
  if (observer && jacketRef.value) observer.observe(jacketRef.value);
  frame = requestAnimationFrame(tick);

  stopLoop = () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
  };
};

watch(ready, startLoop, { flush: 'post' });

onMounted(() => {
  startMeasure();
  measurePath();
  syncTextPaths();
  startScroll();
  startLoop();
});

onUpdated(syncTextPaths);

onBeforeUnmount(() => {
  stopMeasure?.();
  stopScroll?.();
  stopLoop?.();
});

const onPointerDown = (e: PointerEvent) => {
  if (!props.interactive || !ready.value) return;
  const rect = svgRef.value?.getBoundingClientRect();
  const width = rect?.width || VIEW_WIDTH;
  const cx = rect ? rect.left + rect.width / 2 : e.clientX;
  const cy = rect ? rect.top + rect.height / 2 : e.clientY;
  drag = {
    active: true,
    x: e.clientX,
    time: performance.now(),
    scale: VIEW_WIDTH / width,
    velocity: 0,
    ring: ring.value,
    radius: geometry.value.radius,
    angle: Math.atan2(e.clientY - cy, e.clientX - cx),
    cx,
    cy
  };
  velocity = 0;
  dragging.value = true;
  (e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId);
};

const onPointerMove = (e: PointerEvent) => {
  if (!drag.active) return;
  const now = performance.now();
  let delta = (e.clientX - drag.x) * drag.scale;
  if (drag.ring) {
    const angle = Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx);
    delta = wrapAngle(angle - drag.angle) * drag.radius;
    drag.angle = angle;
  }
  const dt = Math.max(now - drag.time, 1) / 1000;
  drag.x = e.clientX;
  drag.time = now;
  drag.velocity = drag.velocity * 0.5 + (delta / dt) * 0.5;
  offset = wrapOffset(offset + delta, spacingValue);
  applyOffset();
};

const endDrag = () => {
  if (!drag.active) return;
  drag.active = false;
  dragging.value = false;
  const fling = performance.now() - drag.time > 100 ? 0 : Math.max(-MAX_FLING, Math.min(MAX_FLING, drag.velocity));
  velocity = fling;
  if (Math.abs(fling) > 60) currentDirection = fling > 0 ? 'right' : 'left';
};

const onPointerEnter = () => {
  hovering = true;
};

const onPointerLeave = () => {
  hovering = false;
  endDrag();
};
</script>

<template>
  <div
    ref="jacketRef"
    class="curved-loop-jacket"
    :style="jacketStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
    @lostpointercapture="endDrag"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <svg
      ref="svgRef"
      class="curved-loop-svg"
      :viewBox="geometry.viewBox"
      :style="svgStyle"
      role="img"
      :aria-label="marqueeText"
    >
      <text
        ref="measureRef"
        xml:space="preserve"
        :class="className"
        style="visibility: hidden; opacity: 0; pointer-events: none"
        v-text="text"
      />
      <defs>
        <path ref="pathRef" :id="pathId" :d="geometry.d" fill="none" stroke="transparent" />
        <mask
          v-if="ready && outline"
          :id="maskId"
          maskUnits="userSpaceOnUse"
          :x="-VIEW_WIDTH"
          :y="-VIEW_WIDTH"
          :width="VIEW_WIDTH * 3"
          :height="VIEW_WIDTH * 3"
        >
          <rect :x="-VIEW_WIDTH" :y="-VIEW_WIDTH" :width="VIEW_WIDTH * 3" :height="VIEW_WIDTH * 3" fill="#fff" />
          <text xml:space="preserve" :class="className" fill="#000">
            <textPath :href="`#${pathId}`" xml:space="preserve" v-text="plain" />
          </text>
        </mask>
      </defs>
      <template v-if="ready">
        <text
          v-if="outline"
          xml:space="preserve"
          :class="className"
          fill="none"
          :stroke="color"
          :stroke-width="fontSize * 0.05"
          stroke-linejoin="round"
          :mask="`url(#${maskId})`"
        >
          <textPath v-if="accent" :href="`#${pathId}`" xml:space="preserve">
            <Repeat :mark-props="{ stroke: 'none' }" />
          </textPath>
          <textPath v-else :href="`#${pathId}`" xml:space="preserve" v-text="plain" />
        </text>
        <text v-else xml:space="preserve" :class="className" :fill="color">
          <textPath v-if="accent" :href="`#${pathId}`" xml:space="preserve">
            <Repeat :mark-props="{ fill: separatorColor }" />
          </textPath>
          <textPath v-else :href="`#${pathId}`" xml:space="preserve" v-text="plain" />
        </text>
      </template>
      <text v-if="ready && outline && accent" xml:space="preserve" :class="className" fill="none" aria-hidden="true">
        <textPath :href="`#${pathId}`" xml:space="preserve">
          <Repeat :mark-props="{ fill: separatorColor }" />
        </textPath>
      </text>
    </svg>
  </div>
</template>

<style>
.curved-loop-jacket {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.curved-loop-svg {
  width: 100%;
  aspect-ratio: 100 / 12;
  overflow: visible;
  display: block;
  fill: currentColor;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-transform: uppercase;
  line-height: 1;
}
</style>
