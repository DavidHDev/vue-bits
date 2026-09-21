<script setup lang="ts">
import { ArrowUp02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { animate, motionValue, useReducedMotion, type AnimationPlaybackControls } from 'motion-v';
import { computed, onMounted, onUnmounted, ref, useId, watch, type CSSProperties } from 'vue';

export type SlingAxis = 'any' | 'horizontal' | 'vertical';

interface SlingButtonProps {
  padColor?: string;
  iconColor?: string;
  accentColor?: string;
  wellColor?: string;
  bandColor?: string;
  size?: number;
  strokeWidth?: number;
  armAt?: number;
  maxPull?: number;
  launchSpeed?: number;
  recoil?: number;
  flight?: number;
  particles?: number;
  spread?: number;
  axis?: SlingAxis;
  tapSends?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

interface Sample {
  x: number;
  y: number;
  t: number;
}

interface Grip {
  id: number;
  startX: number;
  startY: number;
  scale: number;
  moved: boolean;
  hist: Sample[];
  rawOrigin: { x: number; y: number };
  slop: number;
}

const GAP = 4;
const SLOP = { fine: 4, coarse: 8 };
const FINGER_MAX = 3000;
const HAND_MAX = 6000;
const CANCEL = 0.5;
const POWER_CAP = 1.5;
const DOT_MS = 300;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rubberband = (o: number, dim: number, c = 0.55) => (o * dim * c) / (dim + c * Math.abs(o));

const props = withDefaults(defineProps<SlingButtonProps>(), {
  padColor: '#f5f5f5',
  iconColor: '#18181b',
  accentColor: '#f5f5f5',
  wellColor: '#27272a',
  bandColor: '#52525b',
  size: 56,
  strokeWidth: 3,
  armAt: 48,
  maxPull: 160,
  launchSpeed: 2600,
  recoil: 0.2,
  flight: 120,
  particles: 14,
  spread: 60,
  axis: 'any',
  tapSends: true,
  disabled: false,
  ariaLabel: 'Send',
  className: ''
});

const emit = defineEmits<{ send: [] }>();

const reduce = useReducedMotion();
const R = computed(() => props.maxPull);
const ARM = computed(() => Math.min(props.armAt, 0.8 * R.value));
const wellR = computed(() => props.size / 2 + GAP + props.strokeWidth);
const padR = computed(() => props.size / 2 - props.strokeWidth / 2);
const H = computed(() => wellR.value + props.strokeWidth + 2);
const DOT = computed(() => Math.max(6, Math.round(props.size / 7)));
const count = computed(() => Math.max(0, Math.round(props.particles)));

const held = ref(false);
const armed = ref(false);
const sent = ref(false);
const rootRef = ref<HTMLSpanElement | null>(null);
const padRef = ref<HTMLButtonElement | null>(null);
const padWrapRef = ref<HTMLSpanElement | null>(null);
const fxRef = ref<SVGGElement | null>(null);
const bandRef = ref<SVGPathElement | null>(null);
const hotRef = ref<SVGPathElement | null>(null);
const arcRef = ref<SVGCircleElement | null>(null);
const iconRef = ref<HTMLSpanElement | null>(null);
const dotEls: (HTMLSpanElement | null)[] = [];

let power = 0;
let grip: Grip | null = null;
let dir = { ux: 0, uy: -1 };
let animX: AnimationPlaybackControls | null = null;
let animY: AnimationPlaybackControls | null = null;
let armedNow = false;
let dotPending = false;
let dotTimer: ReturnType<typeof setTimeout> | undefined;
let paintQueued = false;
let skipClick = false;
let sentTimer: ReturnType<typeof setTimeout> | undefined;
let settleTimer: ReturnType<typeof setTimeout> | undefined;
const offs: (() => void)[] = [];
const hintId = useId();

const px = motionValue(0);
const py = motionValue(0);

const relaxIcon = () => {
  const icon = iconRef.value;
  if (!icon) return;
  icon.style.transition = reduce.value ? 'none' : 'transform 360ms cubic-bezier(0.23, 1, 0.32, 1)';
  icon.style.transform = 'rotate(0deg)';
};
const aimIcon = (ux: number, uy: number, dist: number) => {
  const icon = iconRef.value;
  if (!icon) return;
  const angle = (Math.atan2(-uy, -ux) * 180) / Math.PI + 90;
  icon.style.transition = 'none';
  icon.style.transform = `rotate(${angle * clamp(dist / 12, 0, 1)}deg)`;
};

const launchDot = () => {
  dotPending = false;
  clearTimeout(dotTimer);
  const { ux, uy } = dir;
  relaxIcon();
  const base = Math.atan2(-uy, -ux);
  const cone = (props.spread * Math.PI) / 180;
  const push = 0.85 + 0.35 * power;
  const well = wellR.value;
  dotEls.slice(0, count.value).forEach((dot, i) => {
    if (!dot) return;
    const lead = i === 0;
    const angle = base + (lead ? 0 : (Math.random() + Math.random() - 1) * (cone / 2));
    const cx = Math.cos(angle);
    const cy = Math.sin(angle);
    const reach = (lead ? props.flight : props.flight * (0.3 + Math.random())) * push;
    const drift = lead ? 0 : (Math.random() - 0.5) * props.flight * 0.4;
    const scale = lead ? 1 : 0.3 + Math.random() * 0.6;
    const shrink = lead ? 0.6 : scale * (0.2 + Math.random() * 0.4);
    const duration = lead ? DOT_MS : DOT_MS * (0.7 + Math.random());
    const delay = lead ? 0 : Math.random() * 70;
    const to = well + reach;
    dot.animate(
      [
        { transform: `translate(${cx * well}px, ${cy * well}px) scale(${scale})` },
        { transform: `translate(${cx * to - cy * drift}px, ${cy * to + cx * drift}px) scale(${shrink})` }
      ],
      { duration, delay, easing: EASE_OUT, fill: 'none' }
    );
    dot.animate(
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.55 },
        { opacity: 0, offset: 1 }
      ],
      { duration, delay, easing: 'linear', fill: 'none' }
    );
  });
};

// band, arc and pad follow the motion values by hand so a pull never waits on a render
const paint = () => {
  paintQueued = false;
  const band = bandRef.value;
  const hot = hotRef.value;
  const arc = arcRef.value;
  const fx = fxRef.value;
  if (!band || !hot || !arc || !fx) return;
  const x = px.get();
  const y = py.get();
  const { ux, uy } = dir;
  const proj = x * ux + y * uy;
  const p = clamp(proj / ARM.value, 0, 1);
  const dist = Math.hypot(x, y);
  let d = '';
  if (dist > 0.5) {
    const a = Math.atan2(y, x);
    const b = Math.acos(clamp((wellR.value - padR.value) / dist, -1, 1));
    d = [a + b, a - b]
      .map(t => {
        const cx = Math.cos(t);
        const cy = Math.sin(t);
        return `M${(wellR.value * cx).toFixed(2)},${(wellR.value * cy).toFixed(2)}L${(x + padR.value * cx).toFixed(2)},${(y + padR.value * cy).toFixed(2)}`;
      })
      .join('');
  }
  band.setAttribute('d', d);
  hot.setAttribute('d', d);
  hot.style.opacity = String(p);
  fx.style.opacity = String(clamp(proj / 6, 0, 1));
  arc.setAttribute('stroke-dasharray', `${p} ${1 - p}`);
  arc.setAttribute('stroke-dashoffset', String(p / 2));
  arc.style.opacity = p > 0.01 ? '1' : '0';
  if (grip) aimIcon(ux, uy, dist);
  arc.setAttribute('transform', `rotate(${(Math.atan2(-uy, -ux) * 180) / Math.PI})`);
  if (dotPending && proj <= props.size / 4) launchDot();
};
const schedulePaint = () => {
  if (paintQueued) return;
  paintQueued = true;
  requestAnimationFrame(paint);
};
const movePad = () => {
  if (padWrapRef.value) padWrapRef.value.style.transform = `translate(${px.get()}px, ${py.get()}px)`;
  schedulePaint();
};

onMounted(() => {
  offs.push(px.on('change', movePad), py.on('change', movePad));
  paint();
});
watch(
  () => [props.size, props.strokeWidth, props.armAt, props.maxPull, props.axis],
  () => {
    animX?.stop();
    animY?.stop();
    px.jump(0);
    py.jump(0);
    movePad();
    paint();
  },
  { flush: 'post' }
);

const settle = (v0: { x: number; y: number }) => {
  if (reduce.value) {
    const fx = fxRef.value;
    if (fx) {
      fx.style.transition = 'opacity 200ms ease';
      fx.style.opacity = '0';
    }
    settleTimer = setTimeout(() => {
      px.jump(0);
      py.jump(0);
      if (fx) fx.style.transition = '';
    }, 200);
    return;
  }
  animX = animate(px, 0, { type: 'spring', duration: 0.4, bounce: props.recoil, velocity: v0.x });
  animY = animate(py, 0, { type: 'spring', duration: 0.4, bounce: props.recoil, velocity: v0.y });
};

const onPointerDown = (e: PointerEvent) => {
  if (props.disabled || grip || e.button !== 0) return;
  const el = rootRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const scale = rect.width / (el.offsetWidth || rect.width) || 1;
  animX?.stop();
  animY?.stop();
  const x = px.get();
  const y = py.get();
  const dNow = Math.hypot(x, y);
  const dClamped = Math.min(dNow, 0.95 * R.value);
  const rawNow = dNow > 0.5 ? (R.value * dClamped) / (R.value - dClamped) : 0;
  grip = {
    id: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    scale,
    moved: false,
    hist: [],
    rawOrigin: dNow > 0.5 ? { x: (rawNow * x) / dNow, y: (rawNow * y) / dNow } : { x: 0, y: 0 },
    slop: e.pointerType === 'touch' ? SLOP.coarse : SLOP.fine
  };
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  held.value = true;
};

const onPointerMove = (e: PointerEvent) => {
  const g = grip;
  if (!g || g.id !== e.pointerId) return;
  const dx = (e.clientX - g.startX) / g.scale;
  const dy = (e.clientY - g.startY) / g.scale;
  let rx = g.rawOrigin.x + dx;
  let ry = g.rawOrigin.y + dy;
  if (props.axis === 'horizontal') ry = rubberband(ry, props.size / 4);
  else if (props.axis === 'vertical') rx = rubberband(rx, props.size / 4);
  if (!g.moved && Math.hypot(dx, dy) > g.slop) g.moved = true;
  const raw = Math.hypot(rx, ry);
  if (raw < 0.01) return;
  const d = (R.value * raw) / (R.value + raw);
  const ux = rx / raw;
  const uy = ry / raw;
  dir = { ux, uy };
  px.set(d * ux);
  py.set(d * uy);
  const t = performance.now();
  g.hist.push({ x: d * ux, y: d * uy, t });
  while (g.hist.length > 4 || t - g.hist[0].t > 80) g.hist.shift();
  const isArmed = d >= ARM.value;
  if (isArmed !== armedNow) {
    armedNow = isArmed;
    armed.value = isArmed;
  }
};

const release = (pointerId: number, cancelled: boolean) => {
  const g = grip;
  if (!g || g.id !== pointerId) return;
  grip = null;
  skipClick = true;
  try {
    padRef.value?.releasePointerCapture(pointerId);
  } catch {
    // already released
  }
  const d = Math.hypot(px.get(), py.get());
  const p = d / ARM.value;
  const { ux, uy } = dir;
  let vx = 0;
  let vy = 0;
  if (!cancelled && g.hist.length > 1) {
    const a = g.hist[0];
    const b = g.hist[g.hist.length - 1];
    const dt = b.t - a.t;
    if (dt > 0 && performance.now() - b.t < 50) {
      vx = ((b.x - a.x) / dt) * 1000;
      vy = ((b.y - a.y) / dt) * 1000;
    }
  }
  const fm = Math.hypot(vx, vy);
  if (fm > FINGER_MAX) {
    vx *= FINGER_MAX / fm;
    vy *= FINGER_MAX / fm;
  }
  if (!g.moved) {
    relaxIcon();
    if (props.tapSends && !cancelled) emit('send');
  } else {
    const fire = armedNow && !cancelled;
    const launch = fire ? props.launchSpeed * Math.min(p, POWER_CAP) : CANCEL * props.launchSpeed * Math.min(p, 1);
    let v0x = vx - ux * launch;
    let v0y = vy - uy * launch;
    const m = Math.hypot(v0x, v0y);
    if (m > HAND_MAX) {
      v0x *= HAND_MAX / m;
      v0y *= HAND_MAX / m;
    }
    if (!fire) relaxIcon();
    if (fire) {
      emit('send');
      if (reduce.value) {
        sent.value = true;
        sentTimer = setTimeout(() => (sent.value = false), 200);
      } else {
        power = clamp((Math.min(p, POWER_CAP) - 1) / (POWER_CAP - 1), 0, 1);
        dotPending = true;
        dotTimer = setTimeout(launchDot, 150);
      }
    }
    settle({ x: v0x, y: v0y });
  }
  armedNow = false;
  held.value = false;
  armed.value = false;
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && grip) release(grip.id, true);
};
const onClick = () => {
  if (skipClick) {
    skipClick = false;
    return;
  }
  if (!props.disabled) emit('send');
};

onUnmounted(() => {
  animX?.stop();
  animY?.stop();
  clearTimeout(dotTimer);
  clearTimeout(sentTimer);
  clearTimeout(settleTimer);
  offs.forEach(off => off());
});

const rootStyle = computed(
  () =>
    ({
      '--sl-size': `${props.size}px`,
      '--sl-svg': `${2 * H.value}px`,
      '--sl-pad': props.padColor,
      '--sl-icon': props.iconColor,
      '--sl-accent': props.accentColor,
      '--sl-well': props.wellColor,
      '--sl-band': props.bandColor,
      '--sl-stroke': `${props.strokeWidth}px`,
      '--sl-dot': `${DOT.value}px`
    }) as CSSProperties
);
</script>

<template>
  <span
    ref="rootRef"
    class="group/root inline-block relative [width:var(--sl-size)] [height:var(--sl-size)]"
    :class="className"
    :data-armed="armed ? '' : undefined"
    :data-sent="sent ? '' : undefined"
    :style="rootStyle"
  >
    <svg
      class="top-1/2 left-1/2 absolute overflow-visible pointer-events-none [width:var(--sl-svg)] [height:var(--sl-svg)] [margin:calc(var(--sl-svg)/-2)_0_0_calc(var(--sl-svg)/-2)] [shape-rendering:geometricPrecision]"
      :viewBox="`${-H} ${-H} ${2 * H} ${2 * H}`"
      aria-hidden="true"
    >
      <g ref="fxRef" style="opacity: 0">
        <path
          ref="bandRef"
          class="fill-none group-data-[armed]/root:[stroke-width:calc(var(--sl-stroke)*1.5)] [stroke:var(--sl-band)] [stroke-linecap:round] [stroke-width:var(--sl-stroke)] [transition:stroke-width_160ms_cubic-bezier(0.23,1,0.32,1)]"
        />
        <path
          ref="hotRef"
          class="fill-none group-data-[armed]/root:[stroke-width:calc(var(--sl-stroke)*1.5)] [stroke:var(--sl-accent)] [stroke-linecap:round] [stroke-width:var(--sl-stroke)] [transition:stroke-width_160ms_cubic-bezier(0.23,1,0.32,1)]"
        />
      </g>
      <circle
        class="group-data-[sent]/root:[fill:var(--sl-accent)] [fill:var(--sl-well)] [transition:fill_200ms_ease]"
        :r="wellR"
      />
      <circle
        ref="arcRef"
        class="fill-none group-data-[armed]/root:[stroke-width:calc(var(--sl-stroke)*1.5)] [stroke:var(--sl-accent)] [stroke-linecap:butt] [stroke-width:var(--sl-stroke)] [transition:stroke-width_160ms_cubic-bezier(0.23,1,0.32,1)]"
        :r="wellR"
        pathLength="1"
        stroke-dasharray="0 1"
        style="opacity: 0"
      />
    </svg>
    <span
      v-for="i in count"
      :key="i"
      :ref="el => (dotEls[i - 1] = el as HTMLSpanElement | null)"
      class="top-1/2 left-1/2 absolute opacity-0 rounded-full pointer-events-none [width:var(--sl-dot)] [height:var(--sl-dot)] [margin:calc(var(--sl-dot)/-2)_0_0_calc(var(--sl-dot)/-2)] [background:var(--sl-accent)]"
      aria-hidden="true"
    />
    <span ref="padWrapRef" class="absolute inset-0">
      <button
        ref="padRef"
        type="button"
        class="group/pad block after:absolute relative after:-inset-1.5 bg-transparent aria-disabled:opacity-50 m-0 p-0 border-0 rounded-full after:rounded-full outline-none w-full h-full after:content-[''] [-webkit-touch-callout:none] touch-none cursor-grab data-[held]:cursor-grabbing aria-disabled:cursor-not-allowed select-none [-webkit-tap-highlight-color:transparent]"
        :aria-label="ariaLabel"
        :aria-describedby="hintId"
        :aria-disabled="disabled || undefined"
        :data-held="held ? '' : undefined"
        :data-armed="armed ? '' : undefined"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="release($event.pointerId, false)"
        @pointercancel="release($event.pointerId, true)"
        @lostpointercapture="release($event.pointerId, true)"
        @keydown="onKeyDown"
        @click="onClick"
      >
        <span
          class="flex justify-center items-center rounded-full w-full h-full motion-reduce:transform-none! motion-reduce:transition-none group-data-[held]/pad:[transform:scale(0.97)] group-data-[armed]/pad:[transform:scale(1.04)] [background:var(--sl-pad)] [color:var(--sl-icon)] [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover/pad:group-not-data-[held]/pad:group-not-aria-disabled/pad:[transform:scale(1.02)]"
        >
          <span ref="iconRef" class="inline-flex will-change-transform">
            <slot>
              <HugeiconsIcon :icon="ArrowUp02Icon as IconArray" :size="Math.round(size * 0.4)" :stroke-width="2.2" />
            </slot>
          </span>
        </span>
      </button>
    </span>
    <span :id="hintId" class="sr-only">Press Enter to send, or drag away and release.</span>
  </span>
</template>
