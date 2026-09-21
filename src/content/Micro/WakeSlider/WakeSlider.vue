<script setup lang="ts">
import { frame, motionValue, useReducedMotion, useSpring, useVelocity } from 'motion-v';
import { computed, onMounted, onUnmounted, onUpdated, ref, watch, type CSSProperties } from 'vue';

interface WakeSliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  bars?: number;
  height?: number;
  restHeight?: number;
  gap?: number;
  fillColor?: string;
  trackColor?: string;
  crestColor?: string;
  sensitivity?: number;
  reach?: number;
  skew?: number;
  glide?: number;
  smoothing?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const SETTLE = 9.23;
const FULL_SPEED = 320;
const MIN_REACH = 1.5;
const FLAT = 0.002;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoothstep = (s: number) => s * s * (3 - 2 * s);
const toPct = (v: number, min: number, max: number) => (max > min ? ((v - min) / (max - min)) * 100 : 0);
const snap = (v: number, min: number, max: number, step: number) => {
  if (!(max > min)) return min;
  if (!(step > 0)) return clamp(v, min, max);
  const lastWhole = min + Math.floor(+((max - min) / step).toFixed(6)) * step;
  const grid = clamp(Math.round((v - min) / step) * step + min, min, lastWhole);
  return +(lastWhole < max && Math.abs(v - max) <= Math.abs(v - grid) ? max : grid).toFixed(6);
};

const props = withDefaults(defineProps<WakeSliderProps>(), {
  value: undefined,
  defaultValue: 50,
  min: 0,
  max: 100,
  step: 1,
  bars: 32,
  height: 56,
  restHeight: 12,
  gap: 4,
  fillColor: '#f5f5f5',
  trackColor: '#27272a',
  crestColor: '',
  sensitivity: 1,
  reach: 6,
  skew: 0.6,
  glide: 0.3,
  smoothing: 100,
  showValue: false,
  formatValue: undefined,
  disabled: false,
  ariaLabel: 'Value',
  className: ''
});

const emit = defineEmits<{ change: [value: number] }>();

const inner = ref(props.defaultValue);
const value = computed(() => clamp(props.value ?? inner.value, props.min, props.max));
const pct = computed(() => toPct(value.value, props.min, props.max));
const reduce = useReducedMotion();
const format = (v: number) => (props.formatValue ? props.formatValue(v) : String(v));
const rest = computed(() => Math.min(props.restHeight, props.height - 1) / props.height);

const rootRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const handleRef = ref<HTMLButtonElement | null>(null);
const barEls: (HTMLSpanElement | null)[] = [];
const crestEls: (HTMLSpanElement | null)[] = [];
let pointerId: number | null = null;
let lastAmp = 0;
let latest = value.value;

const target = motionValue(pct.value);
// springs are built once, so a new glide or smoothing needs a remount (the demo keys on them)
const w0 = SETTLE / props.glide;
const head = useSpring(target, { stiffness: w0 * w0, damping: 2 * w0, mass: 1 });
const rawSpeed = useVelocity(head);
const wv = 2000 / props.smoothing;
const speed = useSpring(rawSpeed, { stiffness: wv * wv, damping: 2.5 * wv, mass: 1 });

const setBar = (i: number, el: unknown) => {
  barEls[i] = el as HTMLSpanElement | null;
};
const setCrest = (i: number, el: unknown) => {
  crestEls[i] = el as HTMLSpanElement | null;
};

// bars are painted by hand every frame so the wake never waits on a Vue render
const paint = (force = false) => {
  const bars = props.bars;
  const h = ((reduce.value ? target.get() : head.get()) / 100) * (bars - 1);
  const v = reduce.value ? 0 : speed.get();
  const amp = smoothstep(clamp((Math.abs(v) * props.sensitivity) / FULL_SPEED, 0, 1));
  const dir = Math.sign(v) || 1;
  const r = MIN_REACH + (props.reach - MIN_REACH) * amp;
  const behind = r * (1 + props.skew);
  const ahead = r * (1 - 0.5 * props.skew);
  const lit = Math.round(h);
  const flat = !force && amp < FLAT && lastAmp < FLAT;
  const rs = rest.value;
  for (let i = 0; i < bars; i++) {
    const el = barEls[i];
    if (!el) continue;
    const on = i <= lit ? 'true' : 'false';
    if (el.dataset.on !== on) el.dataset.on = on;
    if (flat) continue;
    const d = i - h;
    const R = d * dir < 0 ? behind : ahead;
    const lift = Math.abs(d) < R ? amp * Math.cos((Math.PI * d) / (2 * R)) ** 2 : 0;
    el.style.transform = `scaleY(${rs + lift * (1 - rs)})`;
    const crest = crestEls[i];
    if (crest) crest.style.opacity = String(lift);
  }
  lastAmp = amp;
};
const run = () => paint();
const schedule = () => frame.render(run, false, true);
const offs: (() => void)[] = [];

onMounted(() => {
  offs.push(head.on('change', schedule), speed.on('change', schedule));
  paint(true);
});
onUpdated(() => paint(true));
watch(pct, p => target.set(p));
watch([() => props.bars, rest, reduce], () => paint(true), { flush: 'post' });
onUnmounted(() => {
  offs.forEach(off => off());
  head.stop();
  speed.stop();
  target.stop();
});

const commit = (next: number) => {
  const clean = snap(next, props.min, props.max, props.step);
  if (clean === latest) return;
  latest = clean;
  if (props.value === undefined) inner.value = clean;
  emit('change', clean);
};
watch(value, v => (latest = v));
const commitFromX = (x: number) => {
  const track = trackRef.value;
  if (!track) return;
  const rect = track.getBoundingClientRect();
  if (!rect.width) return;
  let ratio = clamp((x - rect.left) / rect.width, 0, 1);
  if (getComputedStyle(track).direction === 'rtl') ratio = 1 - ratio;
  commit(props.min + ratio * (props.max - props.min));
};
const onPointerDown = (e: PointerEvent) => {
  if (props.disabled || pointerId !== null) return;
  pointerId = e.pointerId;
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  rootRef.value?.removeAttribute('data-instant');
  handleRef.value?.focus({ preventScroll: true });
  commitFromX(e.clientX);
};
const onPointerMove = (e: PointerEvent) => {
  if (e.pointerId === pointerId) commitFromX(e.clientX);
};
const endDrag = (e: PointerEvent) => {
  if (e.pointerId !== pointerId) return;
  try {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  } catch {
    // already released
  }
  pointerId = null;
};
const onKeyDown = (e: KeyboardEvent) => {
  if (props.disabled) return;
  const { step, min, max } = props;
  const v = value.value;
  const jumps: Record<string, number> = {
    ArrowRight: v + step,
    ArrowUp: v + step,
    ArrowLeft: v - step,
    ArrowDown: v - step,
    PageUp: v + step * 10,
    PageDown: v - step * 10,
    Home: min,
    End: max
  };
  if (!(e.key in jumps)) return;
  e.preventDefault();
  const clean = snap(jumps[e.key], min, max, step);
  const p = toPct(clean, min, max);
  rootRef.value?.setAttribute('data-instant', 'true');
  head.jump(p);
  speed.jump(0);
  target.jump(p);
  commit(clean);
};

const rootStyle = computed(
  () =>
    ({
      '--ws-fill': props.fillColor,
      '--ws-track': props.trackColor,
      '--ws-crest': props.crestColor || props.fillColor,
      '--ws-height': `${props.height}px`,
      '--ws-gap': `${props.gap}px`,
      '--ws-rest': rest.value
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="rootRef"
    class="group inline-flex items-center gap-3 aria-disabled:opacity-50 w-full aria-disabled:pointer-events-none [color:inherit]"
    :class="className"
    :aria-disabled="disabled || undefined"
    :style="rootStyle"
  >
    <div
      ref="trackRef"
      class="relative flex flex-1 items-center gap-[var(--ws-gap)] h-[var(--ws-height)] min-h-11 [-webkit-touch-callout:none] touch-none [@media(hover:hover)_and_(pointer:fine)]:active:cursor-grabbing [@media(hover:hover)_and_(pointer:fine)]:cursor-grab select-none [-webkit-tap-highlight-color:transparent]"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @lostpointercapture="endDrag"
    >
      <span
        v-for="i in bars"
        :key="i"
        :ref="el => setBar(i - 1, el)"
        class="relative flex-1 bg-[var(--ws-track)] data-[on=true]:bg-[var(--ws-fill)] rounded-full min-w-0 h-[var(--ws-height)] origin-center [transform:scaleY(var(--ws-rest))] [transition:background-color_120ms_ease] group-data-[instant=true]:[transition-duration:0ms] motion-reduce:[transform:scaleY(var(--ws-rest))]!"
      >
        <span
          v-if="crestColor"
          :ref="el => setCrest(i - 1, el)"
          class="absolute inset-0 bg-[var(--ws-crest)] opacity-0 rounded-[inherit]"
        />
      </span>
      <button
        ref="handleRef"
        type="button"
        role="slider"
        class="absolute inset-0 bg-transparent m-0 p-0 border-0 rounded-xl outline-none touch-none cursor-[inherit] [-webkit-tap-highlight-color:transparent]"
        :tabindex="disabled ? -1 : 0"
        :aria-label="ariaLabel"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="value"
        :aria-valuetext="format(value)"
        :aria-disabled="disabled || undefined"
        @keydown="onKeyDown"
      />
    </div>
    <span v-if="showValue" class="opacity-60 min-w-[3ch] tabular-nums text-[13px] text-right" aria-hidden="true">
      {{ format(value) }}
    </span>
  </div>
</template>
