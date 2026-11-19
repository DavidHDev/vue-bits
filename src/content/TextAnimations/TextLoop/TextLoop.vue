<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch, type CSSProperties } from 'vue';
import { gsap } from 'gsap';

export type TextLoopShape = 'wave' | 'circle' | 'infinity' | 'arch' | 'line';
export type TextLoopDirection = 'forward' | 'reverse';

interface TextLoopProps {
  text?: string;
  shape?: TextLoopShape;
  path?: string;
  speed?: number;
  direction?: TextLoopDirection;
  separator?: string;
  curviness?: number;
  tilt?: number;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  edgeFade?: number;
  pauseOnHover?: boolean;
  cross?: boolean;
  crossColor?: string;
  crossAngle?: number;
  draggable?: boolean;
  scrollBoost?: number;
  outline?: boolean;
  outlineWidth?: number;
  className?: string;
  style?: CSSProperties;
}

interface Metrics {
  length: number;
  reps: number;
  crossLength: number;
  crossReps: number;
}

interface FadeStop {
  offset: number;
  opacity: number;
}

const VIEW_W = 1200;
const VIEW_H = 520;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;
const FADE_STEPS = 8;
const MAX_FLING = 2600;
const MAX_BOOST = 1600;

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const wrap = (v: number, length: number) => ((v % length) + length) % length;

const circleRadius = (curviness: number, ribbonWidth: number) =>
  Math.min(90 + Math.max(0, curviness) * 0.95, Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD));

const buildPath = (shape: TextLoopShape, curviness: number, ribbonWidth: number, mirrored = false): string => {
  const c = Math.max(0, curviness);
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);
  const flip = mirrored ? -1 : 1;

  switch (shape) {
    case 'circle': {
      const r = circleRadius(curviness, ribbonWidth);
      if (mirrored) {
        const rx = r * 1.22;
        const ry = r * 0.42;
        return `M ${CX - rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX + rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX - rx} ${CY} Z`;
      }
      return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`;
    }
    case 'infinity': {
      const r = 150 + c * 1.4;
      const h = Math.min(60 + c * 0.95, room);
      return [
        `M ${CX} ${CY}`,
        `C ${CX + r * 0.55} ${CY - h} ${CX + r} ${CY - h} ${CX + r} ${CY}`,
        `C ${CX + r} ${CY + h} ${CX + r * 0.55} ${CY + h} ${CX} ${CY}`,
        `C ${CX - r * 0.55} ${CY - h} ${CX - r} ${CY - h} ${CX - r} ${CY}`,
        `C ${CX - r} ${CY + h} ${CX - r * 0.55} ${CY + h} ${CX} ${CY}`,
        'Z'
      ].join(' ');
    }
    case 'arch': {
      const rise = Math.min(120 + c * 1.1, room * 2) * flip;
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;
    }
    case 'line':
      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;
    case 'wave':
    default: {
      const a = Math.min(c * 2.2, room * 2) * flip;
      return `M -320 ${CY} Q -160 ${CY - a} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;
    }
  }
};

const buildFade = (edgeFade: number): FadeStop[] => {
  const width = Math.min(1, Math.max(0, edgeFade)) * 0.3;
  if (width <= 0) return [];
  const stops: FadeStop[] = [];
  for (let i = 0; i <= FADE_STEPS; i++) {
    const t = i / FADE_STEPS;
    stops.push({ offset: t * width, opacity: smootherstep(t) });
  }
  for (let i = FADE_STEPS; i >= 0; i--) {
    const t = i / FADE_STEPS;
    stops.push({ offset: 1 - t * width, opacity: smootherstep(t) });
  }
  return stops;
};

const parseHex = (value?: string): number[] | null => {
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(String(value || '').trim());
  if (!match) return null;
  const hex = match[1].length === 3 ? match[1].replace(/./g, ch => ch + ch) : match[1];
  return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
};

const tint = (color: string, amount: number): string => {
  const rgb = parseHex(color);
  if (!rgb) return color;
  return `#${rgb
    .map(v =>
      Math.round(v + (255 - v) * amount)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
};

const inkOn = (color: string): string => {
  const rgb = parseHex(color);
  if (!rgb) return '#ffffff';
  const [r, g, b] = rgb.map(v => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.2 ? '#111111' : '#ffffff';
};

const props = withDefaults(defineProps<TextLoopProps>(), {
  text: 'Vue ✦ Bits',
  shape: 'wave',
  path: undefined,
  speed: 90,
  direction: 'forward',
  separator: '✦',
  curviness: 90,
  tilt: 0,
  fontSize: 46,
  fontWeight: 800,
  letterSpacing: 2,
  uppercase: true,
  color: undefined,
  ribbon: true,
  ribbonColor: '#42b883',
  ribbonWidth: 86,
  edgeFade: 0,
  pauseOnHover: true,
  cross: false,
  crossColor: undefined,
  crossAngle: 16,
  draggable: false,
  scrollBoost: 0,
  outline: false,
  outlineWidth: 1.5,
  className: '',
  style: () => ({})
});

const rootRef = ref<HTMLDivElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);
const crossPathRef = ref<SVGPathElement | null>(null);
const measureRef = ref<SVGTextElement | null>(null);
const headRef = ref<SVGTextPathElement | null>(null);
const tailRef = ref<SVGTextPathElement | null>(null);
const crossHeadRef = ref<SVGTextPathElement | null>(null);
const crossTailRef = ref<SVGTextPathElement | null>(null);
let progress = 0;

const metrics = ref<Metrics>({ length: 0, reps: 1, crossLength: 0, crossReps: 1 });

const rawId = useId();
const pathId = `text-loop-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
const crossId = `${pathId}-cross`;
const fadeId = `${pathId}-fade`;
const maskId = `${pathId}-mask`;
const shadowId = `${pathId}-shadow`;
const underId = `${pathId}-under`;

const custom = computed(() => Boolean(props.path));
const d = computed(() => props.path || buildPath(props.shape, props.curviness, props.ribbonWidth));
const crossD = computed(() => {
  if (!props.cross) return '';
  if (props.path) return props.path;
  return buildPath(
    props.shape,
    props.curviness,
    props.ribbonWidth,
    props.shape === 'wave' || props.shape === 'arch' || props.shape === 'circle'
  );
});
const fade = computed(() => buildFade(props.edgeFade));
const fill = computed(() => props.color || (props.ribbon ? '#ffffff' : 'currentColor'));

const half = computed(() => (props.cross ? props.crossAngle / 2 : 0));
const mainAngle = computed(() => props.tilt + half.value);
const crossAngleDeg = computed(() => props.tilt - half.value);
const mainTransform = computed(() => (mainAngle.value ? `rotate(${mainAngle.value} ${CX} ${CY})` : undefined));
const crossTransform = computed(() => (crossAngleDeg.value ? `rotate(${crossAngleDeg.value} ${CX} ${CY})` : undefined));
const crossTape = computed(() => props.crossColor || tint(props.ribbonColor, 0.62));
const crossFill = computed(() => (props.ribbon ? inkOn(crossTape.value) : props.crossColor || 'currentColor'));
const crossDim = computed(() => (!props.ribbon && !props.crossColor ? 0.45 : 1));

const unit = computed(() => {
  const base = props.uppercase ? String(props.text).toUpperCase() : String(props.text);
  const gap = props.separator ? ` ${props.separator} ` : '   ';
  return `${base}${gap}`;
});

const textStyle = computed<CSSProperties>(() => ({
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  letterSpacing: `${props.letterSpacing}px`
}));

let measureCancel: (() => void) | null = null;

const measure = () => {
  measureCancel?.();
  const pathEl = pathRef.value;
  const measureEl = measureRef.value;
  if (!pathEl || !measureEl) return;

  let cancelled = false;
  measureCancel = () => {
    cancelled = true;
  };

  const run = () => {
    if (cancelled) return;
    let length = 0;
    let unitWidth = 0;
    let crossLength = 0;
    try {
      length = pathEl.getTotalLength();
      unitWidth = measureEl.getComputedTextLength();
      crossLength = crossPathRef.value ? crossPathRef.value.getTotalLength() : 0;
    } catch {
      return;
    }
    if (!length) return;

    const repsFor = (total: number) => (unitWidth > 0 ? Math.max(1, Math.round(total / unitWidth)) : 1);
    const next = { length, reps: repsFor(length), crossLength, crossReps: repsFor(crossLength) };
    const prev = metrics.value;
    if (
      prev.length === next.length &&
      prev.reps === next.reps &&
      prev.crossLength === next.crossLength &&
      prev.crossReps === next.crossReps
    )
      return;
    metrics.value = next;
  };

  run();
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(run).catch(() => {});
  }
};

let animCleanup: (() => void) | null = null;

const setupAnimation = () => {
  animCleanup?.();
  animCleanup = null;

  const { length, crossLength } = metrics.value;
  const head = headRef.value;
  const tail = tailRef.value;
  const root = rootRef.value;
  const svg = svgRef.value;
  if (!head || !tail || !root || !svg || !length) return;

  const crossHead = crossHeadRef.value;
  const crossTail = crossTailRef.value;
  const crossPaths = props.cross && crossHead && crossTail && crossLength > 0 ? [crossHead, crossTail] : null;

  let travel = progress * length;
  const apply = () => {
    const offset = wrap(travel, length);
    progress = offset / length;
    head.setAttribute('startOffset', String(offset));
    tail.setAttribute('startOffset', String(offset - length));
    if (crossPaths) {
      const crossOffset = wrap(-travel, crossLength);
      crossPaths[0].setAttribute('startOffset', String(crossOffset));
      crossPaths[1].setAttribute('startOffset', String(crossOffset - crossLength));
    }
  };
  apply();

  const reduced = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
  const sign = props.direction === 'reverse' ? -1 : 1;
  const base = reduced ? 0 : Math.max(0, props.speed) * sign;
  const hover = { scale: 1 };
  const angle = (mainAngle.value * Math.PI) / 180;
  const circular = !custom.value && props.shape === 'circle';
  const radius = circleRadius(props.curviness, props.ribbonWidth);
  const scrollBoost = props.scrollBoost;
  const boosting = scrollBoost > 0 && !reduced;

  let fling = 0;
  let boost = 0;
  let scrollVelocity = 0;
  let scrollAt = 0;
  let scrollPos = 0;
  let scrollSource: EventTarget | null = null;
  let dragging = false;
  let pointerId: number | null = null;
  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  let velocity = 0;
  let center = { x: 0, y: 0 };
  let running = false;

  const tick = (_: number, deltaMs: number) => {
    if (dragging) return;
    const dt = Math.min(0.05, deltaMs / 1000);
    fling *= Math.exp(-dt / 0.55);
    if (boosting) {
      if (performance.now() - scrollAt > 90) scrollVelocity *= Math.exp(-dt / 0.12);
      const target = clamp(scrollVelocity * scrollBoost * 0.35 * sign, -MAX_BOOST, MAX_BOOST);
      boost += (target - boost) * (1 - Math.exp(-dt / 0.18));
    }
    const v = base * hover.scale + fling + boost;
    if (Math.abs(v) < 0.01) return;
    travel += v * dt;
    apply();
  };

  const start = () => {
    if (running || reduced) return;
    running = true;
    gsap.ticker.add(tick);
  };
  const stop = () => {
    if (!running) return;
    running = false;
    gsap.ticker.remove(tick);
  };

  const glide = (hovered: boolean) =>
    gsap.to(hover, {
      scale: hovered ? 0 : 1,
      duration: hovered ? 0.6 : 0.9,
      ease: hovered ? 'power2.out' : 'power2.inOut',
      overwrite: true
    });
  const onEnter = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') glide(true);
  };
  const onLeave = () => glide(false);

  const onDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging = true;
    pointerId = event.pointerId;
    root.setPointerCapture?.(event.pointerId);
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = performance.now();
    velocity = base * hover.scale + fling + boost;
    const rect = svg.getBoundingClientRect();
    center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    root.style.cursor = 'grabbing';
  };
  const onMove = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const now = performance.now();
    let delta: number;
    if (circular) {
      let turn =
        Math.atan2(event.clientY - center.y, event.clientX - center.x) - Math.atan2(lastY - center.y, lastX - center.x);
      if (turn > Math.PI) turn -= Math.PI * 2;
      if (turn < -Math.PI) turn += Math.PI * 2;
      delta = turn * radius;
    } else {
      const scale = VIEW_W / (svg.getBoundingClientRect().width || VIEW_W);
      delta = ((event.clientX - lastX) * Math.cos(angle) + (event.clientY - lastY) * Math.sin(angle)) * scale;
    }
    travel += delta;
    apply();
    const dt = Math.max(1, now - lastT) / 1000;
    velocity = velocity * 0.6 + (delta / dt) * 0.4;
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = now;
  };
  const onUp = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
    root.style.cursor = '';
    if (reduced) return;
    const release = performance.now() - lastT > 90 ? 0 : clamp(velocity, -MAX_FLING, MAX_FLING);
    fling = release - (base * hover.scale + boost);
  };

  const onScroll = (event: Event) => {
    const source = event.target;
    const isPage = source === document || source === document.documentElement || source === document.body;
    if (!isPage && !(source instanceof Node && source.contains(root))) return;
    const pos = isPage ? window.scrollY : (source as Element).scrollTop;
    const now = performance.now();
    if (source !== scrollSource || now - scrollAt > 200) {
      scrollSource = source;
      scrollPos = pos;
      scrollAt = now;
      return;
    }
    const instant = (pos - scrollPos) / (Math.max(8, now - scrollAt) / 1000);
    scrollVelocity = scrollVelocity * 0.5 + instant * 0.5;
    scrollPos = pos;
    scrollAt = now;
  };

  if (props.pauseOnHover) {
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
  }
  if (props.draggable) {
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
  }
  if (boosting) window.addEventListener('scroll', onScroll, { capture: true, passive: true });

  const observer =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) start();
          else stop();
        })
      : null;
  if (observer) observer.observe(root);
  else start();

  animCleanup = () => {
    observer?.disconnect();
    stop();
    gsap.killTweensOf(hover);
    root.style.cursor = '';
    root.removeEventListener('pointerenter', onEnter);
    root.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('pointerdown', onDown);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerup', onUp);
    root.removeEventListener('pointercancel', onUp);
    window.removeEventListener('scroll', onScroll, { capture: true });
  };
};

onMounted(() => {
  measure();
  setupAnimation();
});

watch([d, crossD, unit, () => props.fontSize, () => props.fontWeight, () => props.letterSpacing], measure, {
  flush: 'post'
});

watch(
  [
    metrics,
    () => props.speed,
    () => props.direction,
    () => props.pauseOnHover,
    () => props.draggable,
    () => props.scrollBoost,
    () => props.cross,
    custom,
    () => props.shape,
    mainAngle,
    () => props.curviness,
    () => props.ribbonWidth
  ],
  setupAnimation,
  { flush: 'post' }
);

onBeforeUnmount(() => {
  measureCancel?.();
  animCleanup?.();
  animCleanup = null;
});

const loopText = computed(() => unit.value.repeat(metrics.value.reps));
const crossText = computed(() => unit.value.repeat(metrics.value.crossReps));
const fitLength = computed(() => metrics.value.length || undefined);
const crossFit = computed(() => metrics.value.crossLength || undefined);
const paint = (ink: string, opacity: number): Record<string, string | number> =>
  props.outline
    ? {
        fill: 'none',
        stroke: ink,
        'stroke-opacity': opacity,
        'stroke-width': props.outlineWidth,
        'stroke-linejoin': 'round'
      }
    : { fill: ink, 'fill-opacity': opacity };
const mainPaint = computed(() => paint(fill.value, 1));
const crossPaint = computed(() => paint(crossFill.value, crossDim.value));
</script>

<template>
  <div ref="rootRef" :class="`text-loop ${draggable ? 'text-loop--draggable' : ''} ${className}`.trim()" :style="style">
    <svg
      ref="svgRef"
      class="text-loop-svg"
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="text"
    >
      <defs>
        <linearGradient v-if="fade.length > 0" :id="fadeId" x1="0" y1="0" x2="1" y2="0">
          <stop
            v-for="(stop, i) in fade"
            :key="i"
            :offset="stop.offset"
            stop-color="#ffffff"
            :stop-opacity="stop.opacity"
          />
        </linearGradient>
        <mask
          v-if="fade.length > 0"
          :id="maskId"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          :width="VIEW_W"
          :height="VIEW_H"
        >
          <rect :width="VIEW_W" :height="VIEW_H" :fill="`url(#${fadeId})`" />
        </mask>
        <filter
          v-if="cross && ribbon"
          :id="shadowId"
          filterUnits="userSpaceOnUse"
          :x="-VIEW_W"
          :y="-VIEW_H"
          :width="VIEW_W * 3"
          :height="VIEW_H * 3"
        >
          <feGaussianBlur :stdDeviation="Math.max(4, ribbonWidth * 0.11)" />
        </filter>
        <mask
          v-if="cross && ribbon"
          :id="underId"
          maskUnits="userSpaceOnUse"
          :x="-VIEW_W"
          :y="-VIEW_H"
          :width="VIEW_W * 3"
          :height="VIEW_H * 3"
        >
          <g :transform="crossTransform">
            <path
              :d="crossD"
              fill="none"
              stroke="#ffffff"
              :stroke-width="ribbonWidth"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </mask>
      </defs>

      <text ref="measureRef" class="text-loop-measure" :style="textStyle" aria-hidden="true">{{ unit }}</text>

      <g :mask="fade.length > 0 ? `url(#${maskId})` : undefined">
        <g v-if="cross" :transform="crossTransform">
          <path
            ref="crossPathRef"
            :id="crossId"
            :d="crossD"
            fill="none"
            :stroke="ribbon ? crossTape : 'none'"
            :stroke-width="ribbon ? ribbonWidth : 0"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <text
            class="text-loop-text"
            :style="textStyle"
            v-bind="crossPaint"
            dominant-baseline="central"
            aria-hidden="true"
            :textLength="crossFit"
            lengthAdjust="spacing"
          >
            <textPath ref="crossHeadRef" :href="`#${crossId}`" startOffset="0">{{ crossText }}</textPath>
          </text>

          <text
            class="text-loop-text"
            :style="textStyle"
            v-bind="crossPaint"
            dominant-baseline="central"
            aria-hidden="true"
            :textLength="crossFit"
            lengthAdjust="spacing"
          >
            <textPath ref="crossTailRef" :href="`#${crossId}`" startOffset="0">{{ crossText }}</textPath>
          </text>
        </g>

        <g v-if="cross && ribbon" :mask="`url(#${underId})`">
          <g :filter="`url(#${shadowId})`" :transform="`translate(0 ${Math.max(4, ribbonWidth * 0.08)})`">
            <g :transform="mainTransform">
              <path
                :d="d"
                fill="none"
                stroke="#000000"
                :stroke-opacity="0.42"
                :stroke-width="ribbonWidth"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </g>
        </g>

        <g :transform="mainTransform">
          <path
            ref="pathRef"
            :id="pathId"
            :d="d"
            fill="none"
            :stroke="ribbon ? ribbonColor : 'none'"
            :stroke-width="ribbon ? ribbonWidth : 0"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <text
            class="text-loop-text"
            :style="textStyle"
            v-bind="mainPaint"
            dominant-baseline="central"
            aria-hidden="true"
            :textLength="fitLength"
            lengthAdjust="spacing"
          >
            <textPath ref="headRef" :href="`#${pathId}`" startOffset="0">{{ loopText }}</textPath>
          </text>

          <text
            class="text-loop-text"
            :style="textStyle"
            v-bind="mainPaint"
            dominant-baseline="central"
            aria-hidden="true"
            :textLength="fitLength"
            lengthAdjust="spacing"
          >
            <textPath ref="tailRef" :href="`#${pathId}`" startOffset="0">{{ loopText }}</textPath>
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style>
.text-loop {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.text-loop--draggable {
  cursor: grab;
  touch-action: pan-y;
}

.text-loop-svg {
  display: block;
  width: 100%;
  height: auto;
}

.text-loop-text {
  user-select: none;
}

.text-loop-measure {
  visibility: hidden;
  pointer-events: none;
}
</style>
