<script setup lang="ts">
import { animate, useMotionValue, useReducedMotion } from 'motion-v';
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue';

const R = 80;
const DEAD = 44;
const K = 12;
const V_FULL = 4;
const V_FLICK = 2;
const TAU_FOLLOW = 0.06;
const TAU_V = 0.05;
const DECEL = 0.99;
const DRAG_PX = 10;
const STALE_MS = 80;

export interface CometDialChangeDetail {
  velocity: number;
  bounce: number;
}

interface CometDialProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  accent?: string;
  ink?: string;
  size?: number;
  sweep?: number;
  thickness?: number;
  speed?: number;
  tapBounce?: number;
  flickBounce?: number;
  momentum?: number;
  cometReach?: number;
  cometWidth?: number;
  disabled?: boolean;
  className?: string;
}

type Sample = [number, number];

interface Grip {
  id: number;
  at: number | null;
  hist: Sample[];
  side: 'hi' | 'lo' | null;
  moved: boolean;
  x0: number;
  y0: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const velocityOf = (hist: Sample[]) => {
  if (hist.length < 2) return 0;
  const a = hist[0];
  const b = hist[hist.length - 1];
  return ((b[1] - a[1]) / Math.max(1, b[0] - a[0])) * 1000;
};
const decimalsOf = (step: number) => {
  const s = String(step);
  const i = s.indexOf('.');
  return i === -1 ? 0 : s.length - i - 1;
};
const pointAt = (deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [100 + Math.cos(a) * R, 100 + Math.sin(a) * R];
};
const arcPath = (a0: number, a1: number) => {
  const [x0, y0] = pointAt(a0);
  const [x1, y1] = pointAt(a1);
  return `M ${x0.toFixed(3)} ${y0.toFixed(3)} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(3)} ${y1.toFixed(3)}`;
};

const props = withDefaults(defineProps<CometDialProps>(), {
  value: undefined,
  defaultValue: 62,
  min: 0,
  max: 100,
  step: 1,
  unit: '%',
  label: 'Level',
  accent: '#f5f5f5',
  ink: '#fdfdfd',
  size: 250,
  sweep: 320,
  thickness: 5,
  speed: 25,
  tapBounce: 0.2,
  flickBounce: 0.1,
  momentum: 1,
  cometReach: 180,
  cometWidth: 12,
  disabled: false,
  className: ''
});

const emit = defineEmits<{
  change: [value: number];
  changeEnd: [value: number, detail: CometDialChangeDetail];
}>();

const reduce = useReducedMotion();
const dragging = ref(false);
const svgRef = ref<SVGSVGElement | null>(null);
const litRef = ref<SVGPathElement | null>(null);
const headRef = ref<SVGCircleElement | null>(null);
const figure = ref<HTMLSpanElement | null>(null);
const comet: (SVGPathElement | null)[] = [];

let target = clamp(props.value ?? props.defaultValue, props.min, props.max);
let grip: Grip | null = null;
let unbind: (() => void) | null = null;
const loop = { raf: 0, last: 0, v: 0, rPrev: null as number | null, text: '', valueText: '' };
const reading = useMotionValue(target);

const range = computed(() => Math.max(1e-9, props.max - props.min));
const gap = computed(() => 360 - props.sweep);
const start = computed(() => 90 + gap.value / 2);
const end = computed(() => start.value + props.sweep);
const decimals = computed(() => decimalsOf(props.step));
const stiffness = computed(() => 200 + (clamp(props.speed, 0, 100) / 100) * 700);
const critical = computed(() => 2 * Math.sqrt(stiffness.value));

const snap = (v: number) =>
  props.step > 0
    ? clamp(Math.round((v - props.min) / props.step) * props.step + props.min, props.min, props.max)
    : clamp(v, props.min, props.max);

const commit = (v: number, finished: boolean, detail?: CometDialChangeDetail) => {
  const s = snap(v);
  if (s !== target) {
    target = s;
    emit('change', s);
  }
  if (finished) emit('changeEnd', s, detail ?? { velocity: 0, bounce: props.tapBounce });
};

const tick = (now: number) => paint(now);
const wake = () => {
  if (loop.raf) return;
  loop.last = performance.now();
  loop.rPrev = null;
  loop.raf = requestAnimationFrame(tick);
};
const launch = (to: number, bounce: number, velocity = reading.getVelocity()) => {
  reading.stop();
  if (reduce.value) {
    reading.jump(to);
    wake();
    return;
  }
  animate(reading, to, {
    type: 'spring',
    stiffness: stiffness.value,
    damping: critical.value * (1 - clamp(bounce, 0, 0.9)),
    mass: 1,
    velocity
  });
  wake();
};

function paint(now: number) {
  const svg = svgRef.value;
  if (!svg) {
    loop.raf = 0;
    return;
  }
  const dt = clamp((now - loop.last) / 1000, 0, 0.05);
  loop.last = now;
  const g = grip;
  if (g && g.at != null) {
    if (reduce.value) reading.jump(g.at);
    else reading.set(reading.get() + (g.at - reading.get()) * (1 - Math.exp(-dt / TAU_FOLLOW)));
  }
  const r = reading.get();
  const vRaw = loop.rPrev == null || dt === 0 || reduce.value ? 0 : (r - loop.rPrev) / dt / range.value;
  loop.rPrev = r;
  loop.v += (vRaw - loop.v) * (1 - Math.exp(-dt / TAU_V));
  const v = loop.v;
  const s = clamp(Math.abs(v) / V_FULL, 0, 1);
  const dir = Math.sign(v) || 1;
  const f = clamp((r - props.min) / range.value, 0, 1);
  const ang = start.value + f * props.sweep;
  if (litRef.value) litRef.value.setAttribute('d', f > 0.0005 ? arcPath(start.value, ang) : '');
  if (headRef.value) {
    const [cx, cy] = pointAt(ang);
    headRef.value.setAttribute('cx', cx.toFixed(3));
    headRef.value.setAttribute('cy', cy.toFixed(3));
  }
  const seg = (props.cometReach * s) / K;
  for (let j = 0; j < K; j++) {
    const el = comet[j];
    if (!el) continue;
    let a0 = dir > 0 ? ang - (j + 1) * seg : ang + j * seg;
    let a1 = dir > 0 ? ang - j * seg : ang + (j + 1) * seg;
    a0 = clamp(a0, start.value, end.value);
    a1 = clamp(a1, start.value, end.value);
    if (seg < 0.01 || a1 - a0 < 0.01) {
      if (el.style.opacity !== '0') el.style.opacity = '0';
      continue;
    }
    const w = 1 - j / K;
    el.setAttribute('d', arcPath(a0, a1));
    el.setAttribute('stroke-width', (props.thickness + props.cometWidth * w * s).toFixed(2));
    el.style.opacity = (w * s).toFixed(3);
  }
  const shown = clamp(r, props.min, props.max).toFixed(decimals.value);
  if (shown !== loop.text) {
    loop.text = shown;
    if (figure.value) figure.value.textContent = shown;
    svg.setAttribute('aria-valuenow', shown);
  }
  const valueText = `${target}${props.unit}`;
  if (valueText !== loop.valueText) {
    loop.valueText = valueText;
    svg.setAttribute('aria-valuetext', valueText);
  }
  const moving = !!g || reading.isAnimating() || Math.abs(v) > 0.002;
  if (!moving) {
    for (const el of comet) if (el && el.style.opacity !== '0') el.style.opacity = '0';
  }
  loop.raf = moving ? requestAnimationFrame(tick) : 0;
}

const localPoint = (cx: number, cy: number): [number, number] => {
  const b = (svgRef.value as SVGSVGElement).getBoundingClientRect();
  return [((cx - b.left) / b.width) * 200 - 100, ((cy - b.top) / b.height) * 200 - 100];
};
const angleAt = (cx: number, cy: number) => {
  const [x, y] = localPoint(cx, cy);
  let rel = ((Math.atan2(y, x) * 180) / Math.PI - start.value + 720) % 360;
  const g = grip;
  if (rel > props.sweep) {
    rel = g && g.side ? (g.side === 'hi' ? props.sweep : 0) : rel < props.sweep + gap.value / 2 ? props.sweep : 0;
  } else if (g) g.side = rel > props.sweep / 2 ? 'hi' : 'lo';
  return props.min + (rel / props.sweep) * range.value;
};

const move = (e: PointerEvent) => {
  const g = grip;
  if (!g || g.id !== e.pointerId) return;
  if (!g.moved) {
    if (Math.hypot(e.clientX - g.x0, e.clientY - g.y0) < DRAG_PX) return;
    g.moved = true;
    reading.stop();
  }
  g.at = angleAt(e.clientX, e.clientY);
  g.hist.push([performance.now(), g.at]);
  if (g.hist.length > 4) g.hist.shift();
  commit(g.at, false);
  wake();
};
const up = (e: PointerEvent) => {
  const g = grip;
  if (!g || g.id !== e.pointerId) return;
  grip = null;
  unbind?.();
  unbind = null;
  dragging.value = false;
  try {
    svgRef.value?.releasePointerCapture(e.pointerId);
  } catch {
    // pointer already released
  }
  if (!g.moved) {
    commit(target, true);
    return;
  }
  const stale = performance.now() - g.hist[g.hist.length - 1][0] > STALE_MS;
  const v = e.type === 'pointercancel' || stale ? 0 : velocityOf(g.hist);
  const bounce =
    props.tapBounce + (props.flickBounce - props.tapBounce) * clamp(Math.abs(v) / range.value / V_FLICK, 0, 1);
  const to = snap((g.at ?? target) + (v / 1000) * (DECEL / (1 - DECEL)) * props.momentum);
  commit(to, true, { velocity: v, bounce });
  launch(to, bounce, v);
};

const down = (e: PointerEvent) => {
  if (props.disabled || grip || e.button > 0) return;
  const [x, y] = localPoint(e.clientX, e.clientY);
  if (Math.hypot(x, y) < DEAD) return;
  e.preventDefault();
  const svg = svgRef.value as SVGSVGElement;
  try {
    svg.setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  svg.focus({ preventScroll: true });
  grip = { id: e.pointerId, at: null, hist: [], side: null, moved: false, x0: e.clientX, y0: e.clientY };
  const at = angleAt(e.clientX, e.clientY);
  grip.hist.push([performance.now(), at]);
  dragging.value = true;
  commit(at, false);
  launch(snap(at), props.tapBounce);
  const onMove = (ev: PointerEvent) => {
    if (ev.isTrusted) move(ev);
  };
  const onUp = (ev: PointerEvent) => {
    if (ev.isTrusted) up(ev);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  unbind = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
  };
};

const key = (e: KeyboardEvent) => {
  if (props.disabled) return;
  const t = target;
  const big = e.shiftKey ? 10 : 1;
  let to: number;
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      to = t + props.step * big;
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      to = t - props.step * big;
      break;
    case 'PageUp':
      to = t + props.step * 10;
      break;
    case 'PageDown':
      to = t - props.step * 10;
      break;
    case 'Home':
      to = props.min;
      break;
    case 'End':
      to = props.max;
      break;
    default:
      return;
  }
  e.preventDefault();
  to = snap(to);
  reading.stop();
  reading.jump(to);
  commit(to, true);
  wake();
};

const repaint = () => {
  loop.text = '';
  loop.valueText = '';
  paint(performance.now());
};
onMounted(repaint);
watch(
  () => [
    props.min,
    props.max,
    props.step,
    props.sweep,
    props.thickness,
    props.cometReach,
    props.cometWidth,
    props.unit
  ],
  repaint,
  { flush: 'post' }
);
watch(
  () => props.value,
  v => {
    if (v === undefined || grip) return;
    const s = snap(v);
    if (s === target) return;
    target = s;
    launch(s, props.tapBounce);
  }
);
onUnmounted(() => {
  cancelAnimationFrame(loop.raf);
  unbind?.();
  reading.stop();
});

const rootStyle = computed(
  () =>
    ({
      '--cd-accent': props.accent,
      '--cd-ink': props.ink,
      '--cd-size': `${props.size}px`,
      '--cd-figure': `${Math.round(props.size * 0.16)}px`
    }) as CSSProperties
);
</script>

<template>
  <div
    class="group relative data-[disabled]:opacity-55 [-webkit-touch-callout:none] select-none [-webkit-tap-highlight-color:transparent] [width:var(--cd-size)] [height:var(--cd-size)] [color:var(--cd-ink)]"
    :class="className"
    :data-dragging="dragging ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :style="rootStyle"
  >
    <svg
      ref="svgRef"
      class="block absolute inset-0 rounded-full outline-none w-full h-full touch-none cursor-grab group-data-[disabled]:cursor-default group-data-[dragging]:cursor-grabbing group-data-[disabled]:pointer-events-none"
      viewBox="0 0 200 200"
      role="slider"
      :tabindex="disabled ? -1 : 0"
      :aria-label="label"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-disabled="disabled || undefined"
      @pointerdown="down"
      @keydown="key"
    >
      <path
        class="opacity-[0.24] fill-none [stroke-linecap:round] [stroke:var(--cd-ink)]"
        :d="arcPath(start, end)"
        :stroke-width="thickness"
      />
      <path
        ref="litRef"
        class="opacity-70 fill-none [stroke-linecap:round] [stroke:var(--cd-accent)]"
        :stroke-width="thickness"
      />
      <g class="[&_path]:fill-none [&_path]:[stroke-linecap:round] [&_path]:[stroke:var(--cd-accent)]">
        <path v-for="j in K" :key="j" :ref="el => (comet[j - 1] = el as SVGPathElement | null)" style="opacity: 0" />
      </g>
      <circle ref="headRef" class="[fill:var(--cd-accent)]" :r="thickness * 1.8" />
    </svg>
    <div class="absolute inset-0 place-items-center grid pointer-events-none" aria-hidden="true">
      <span
        class="inline-flex items-baseline gap-[0.06em] font-medium tabular-nums leading-none tracking-[-0.04em] [font-size:var(--cd-figure)]"
      >
        <span ref="figure" />
        <span v-if="unit" class="opacity-50 text-[0.5em]">{{ unit }}</span>
      </span>
    </div>
  </div>
</template>
