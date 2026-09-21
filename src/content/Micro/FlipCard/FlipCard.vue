<script setup lang="ts">
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type MotionStyle
} from 'motion-v';
import { computed, onUnmounted, ref, watch, type CSSProperties } from 'vue';

export type FlipCardAxis = 'x' | 'y';

interface FlipCardProps {
  flipped?: boolean;
  defaultFlipped?: boolean;
  axis?: FlipCardAxis;
  flipOnClick?: boolean;
  draggable?: boolean;
  dragDistance?: number;
  tilt?: boolean;
  tiltMax?: number;
  glare?: boolean;
  glareOpacity?: number;
  hoverScale?: number;
  perspective?: number;
  stiffness?: number;
  damping?: number;
  width?: number;
  height?: number;
  radius?: number;
  background?: string;
  color?: string;
  shadow?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

interface Grip {
  id: number;
  x: number;
  y: number;
  base: number;
  moved: boolean;
  slop: number;
  hist: { t: number; v: number }[];
}

const SLOP = { fine: 4, coarse: 8 };
const TILT_SPRING = { stiffness: 240, damping: 24, mass: 0.6 };
const LIFT_SPRING = { stiffness: 320, damping: 26 };
const FLING = 0.16;
const HISTORY_MS = 90;
const GLARE_CLASS =
  'pointer-events-none absolute inset-0 [opacity:var(--fc-sheen,0)] [background:radial-gradient(circle_farthest-side_at_var(--fc-gx,50%)_var(--fc-gy,50%),rgba(255,255,255,var(--fc-glare))_0%,rgba(255,255,255,calc(var(--fc-glare)*0.76))_12%,rgba(255,255,255,calc(var(--fc-glare)*0.5))_26%,rgba(255,255,255,calc(var(--fc-glare)*0.28))_42%,rgba(255,255,255,calc(var(--fc-glare)*0.12))_60%,rgba(255,255,255,calc(var(--fc-glare)*0.04))_78%,rgba(255,255,255,0)_100%)]';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const snap = (deg: number) => Math.round(deg / 180) * 180;
const isBack = (deg: number) => Math.abs(Math.round(deg / 180)) % 2 === 1;

const props = withDefaults(defineProps<FlipCardProps>(), {
  flipped: undefined,
  defaultFlipped: false,
  axis: 'y',
  flipOnClick: true,
  draggable: true,
  dragDistance: 0,
  tilt: true,
  tiltMax: 12,
  glare: true,
  glareOpacity: 0.22,
  hoverScale: 1.03,
  perspective: 1100,
  stiffness: 170,
  damping: 20,
  width: 300,
  height: 400,
  radius: 22,
  background: '#27272a',
  color: '#f5f5f5',
  shadow: true,
  shadowColor: '#000000',
  shadowOpacity: 0.45,
  disabled: false,
  ariaLabel: 'Flip card',
  className: ''
});

const emit = defineEmits<{ flipChange: [flipped: boolean] }>();

const reduce = useReducedMotion();
const controlled = computed(() => props.flipped !== undefined);
const inner = ref(props.defaultFlipped);
const dragging = ref(false);
const shown = computed(() => (controlled.value ? !!props.flipped : inner.value));
let shownNow = shown.value;
const rootRef = ref<HTMLDivElement | null>(null);
let grip: Grip | null = null;
let spin: AnimationPlaybackControls | null = null;
let target = shown.value ? 180 : 0;

const turn = useMotionValue(shown.value ? 180 : 0);
const tiltX = useSpring(0, TILT_SPRING);
const tiltY = useSpring(0, TILT_SPRING);
const lift = useSpring(1, LIFT_SPRING);
const sheen = useSpring(0, LIFT_SPRING);
const gx = useMotionValue(50);
const gy = useMotionValue(50);

const turnY = useTransform(
  [turn, tiltX, tiltY, lift],
  ([t, x, y, l]: number[]) => `perspective(${props.perspective}px) scale(${l}) rotateX(${x}deg) rotateY(${t + y}deg)`
);
const turnX = useTransform(
  [turn, tiltX, tiltY, lift],
  ([t, x, y, l]: number[]) => `perspective(${props.perspective}px) scale(${l}) rotateY(${y}deg) rotateX(${t + x}deg)`
);
const facing = useTransform(turn, (t: number) => Math.abs(Math.cos((t * Math.PI) / 180)));
const spread = useTransform(facing, (f: number) => 0.08 + 0.92 * f);
const shade = useTransform(facing, (f: number) => 0.1 + 0.9 * f * f);
const gxPct = useTransform(gx, (v: number) => `${v}%`);
const gyPct = useTransform(gy, (v: number) => `${v}%`);

const settle = (to: number, velocity: number, instant: boolean) => {
  spin?.stop();
  target = to;
  if (instant || reduce.value) turn.jump(to);
  else
    spin = animate(turn, to, {
      type: 'spring',
      stiffness: props.stiffness,
      damping: props.damping,
      velocity,
      restDelta: 0.05
    });
  const next = isBack(to);
  if (next === shownNow) return;
  shownNow = next;
  if (!controlled.value) inner.value = next;
  emit('flipChange', next);
};
const flip = (instant: boolean) => {
  const base = snap(turn.get());
  settle(isBack(base) ? base - 180 : base + 180, 0, instant);
};
const rest = () => {
  tiltX.set(0);
  tiltY.set(0);
  sheen.set(0);
  lift.set(1);
};

watch(
  () => props.flipped,
  flipped => {
    if (flipped === undefined || isBack(target) === flipped) return;
    spin?.stop();
    target = isBack(target) ? target - 180 : target + 180;
    shownNow = flipped;
    if (reduce.value) turn.jump(target);
    else
      spin = animate(turn, target, {
        type: 'spring',
        stiffness: props.stiffness,
        damping: props.damping,
        restDelta: 0.05
      });
  }
);
watch(
  () => props.disabled,
  disabled => {
    if (disabled) rest();
  }
);
onUnmounted(() => spin?.stop());

const onPointerDown = (e: PointerEvent) => {
  if (props.disabled || e.button !== 0 || grip) return;
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  spin?.stop();
  grip = {
    id: e.pointerId,
    x: e.clientX,
    y: e.clientY,
    base: turn.get(),
    moved: false,
    slop: e.pointerType === 'touch' ? SLOP.coarse : SLOP.fine,
    hist: []
  };
  if (!reduce.value) lift.set(props.hoverScale);
};
const onPointerMove = (e: PointerEvent) => {
  const g = grip;
  if (g && g.id === e.pointerId) {
    const d = props.axis === 'x' ? e.clientY - g.y : e.clientX - g.x;
    if (!g.moved) {
      if (Math.abs(d) < g.slop || !props.draggable || reduce.value) return;
      g.moved = true;
      dragging.value = true;
      tiltX.set(0);
      tiltY.set(0);
      sheen.set(0);
    }
    const span = props.dragDistance > 0 ? props.dragDistance : props.axis === 'x' ? props.height : props.width;
    const deg = g.base + (props.axis === 'x' ? -1 : 1) * (d / span) * 180;
    turn.set(deg);
    const now = performance.now();
    g.hist.push({ t: now, v: deg });
    while (g.hist.length > 2 && now - g.hist[0].t > HISTORY_MS) g.hist.shift();
    return;
  }
  if (!props.tilt || reduce.value || props.disabled || e.pointerType === 'touch') return;
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const px = clamp((e.clientX - r.left) / r.width, 0, 1);
  const py = clamp((e.clientY - r.top) / r.height, 0, 1);
  tiltX.set((0.5 - py) * 2 * props.tiltMax);
  tiltY.set((px - 0.5) * 2 * props.tiltMax);
  gx.set(px * 100);
  gy.set(py * 100);
  sheen.set(1);
};
const release = (e: PointerEvent, cancelled: boolean) => {
  const g = grip;
  if (!g || g.id !== e.pointerId) return;
  grip = null;
  const el = e.currentTarget as HTMLElement;
  try {
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  } catch {
    // already released
  }
  dragging.value = false;
  if (e.pointerType === 'touch' || !rootRef.value?.matches(':hover')) rest();
  if (!g.moved) {
    if (!cancelled && props.flipOnClick) flip(false);
    else settle(target, 0, false);
    return;
  }
  const here = turn.get();
  let velocity = 0;
  const a = g.hist[0];
  const b = g.hist[g.hist.length - 1];
  if (!cancelled && a && b && b.t > a.t && performance.now() - b.t < 60) velocity = ((b.v - a.v) / (b.t - a.t)) * 1000;
  const to = cancelled ? snap(g.base) : clamp(snap(here + velocity * FLING), snap(here) - 180, snap(here) + 180);
  settle(to, velocity, false);
};
const onPointerEnter = (e: PointerEvent) => {
  if (!reduce.value && !props.disabled && e.pointerType !== 'touch') lift.set(props.hoverScale);
};
const onPointerLeave = () => {
  if (!grip) rest();
};
const onKeyDown = (e: KeyboardEvent) => {
  if (props.disabled || (e.key !== 'Enter' && e.key !== ' ')) return;
  e.preventDefault();
  if (!e.repeat) flip(true);
};
const onClick = (e: MouseEvent) => {
  if (!props.disabled && e.detail === 0) flip(true);
};

const rotorStyle = computed(
  () =>
    ({
      transform: props.axis === 'x' ? turnX : turnY,
      '--fc-gx': gxPct,
      '--fc-gy': gyPct,
      '--fc-sheen': sheen
    }) as unknown as MotionStyle
);
const shadowStyle = computed(() =>
  props.axis === 'x' ? { scaleY: spread, opacity: shade } : { scaleX: spread, opacity: shade }
);

const rootStyle = computed(
  () =>
    ({
      '--fc-w': `${props.width}px`,
      '--fc-h': `${props.height}px`,
      '--fc-radius': `${props.radius}px`,
      '--fc-bg': props.background,
      '--fc-ink': props.color,
      '--fc-shadow': props.shadowColor,
      '--fc-shadow-o': props.shadowOpacity,
      '--fc-glare': props.glareOpacity
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="rootRef"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-pressed="shown"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    class="group relative inline-block data-[draggable]:cursor-grab data-[dragging]:cursor-grabbing data-[disabled]:cursor-default data-[disabled]:opacity-60 max-w-full data-[axis=x]:touch-pan-x outline-none cursor-pointer select-none touch-pan-y [width:var(--fc-w)] [height:var(--fc-h)] [border-radius:var(--fc-radius)] [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]"
    :class="className"
    :data-axis="axis"
    :data-draggable="draggable && !disabled && !reduce ? '' : undefined"
    :data-dragging="dragging ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-fade="reduce ? (shown ? 'back' : 'front') : undefined"
    :style="rootStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="release($event, false)"
    @pointercancel="release($event, true)"
    @lostpointercapture="release($event, true)"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @keydown="onKeyDown"
    @click="onClick"
    @dragstart.prevent
  >
    <motion.span
      v-if="shadow"
      class="absolute pointer-events-none [inset:12%_9%_-5%] [border-radius:var(--fc-radius)] [background:color-mix(in_srgb,var(--fc-shadow)_calc(var(--fc-shadow-o)*100%),transparent)] [filter:blur(22px)]"
      aria-hidden="true"
      :style="shadowStyle"
    />
    <motion.div class="absolute inset-0 [transform-style:preserve-3d]" :style="reduce ? undefined : rotorStyle">
      <div
        class="absolute inset-0 group-data-[fade=front]:opacity-100! group-data-[fade]:opacity-0 overflow-hidden [border-radius:var(--fc-radius)] [background:var(--fc-bg)] [color:var(--fc-ink)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [&_img]:[-webkit-user-drag:none] group-data-[fade]:[backface-visibility:visible] group-data-[fade]:[-webkit-backface-visibility:visible] group-data-[fade]:[transition:opacity_200ms_ease]"
        :aria-hidden="shown"
        :inert="shown"
      >
        <slot name="front" />
        <span v-if="glare" :class="GLARE_CLASS" aria-hidden="true" />
      </div>
      <div
        class="absolute inset-0 group-data-[fade=back]:opacity-100! group-data-[fade]:opacity-0 overflow-hidden [border-radius:var(--fc-radius)] [background:var(--fc-bg)] [color:var(--fc-ink)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [&_img]:[-webkit-user-drag:none] group-data-[fade]:[backface-visibility:visible] group-data-[fade]:[-webkit-backface-visibility:visible] group-data-[fade]:[transition:opacity_200ms_ease] [transform:rotateY(180deg)] group-data-[axis=x]:[transform:rotateX(180deg)] group-data-[fade]:[transform:none]!"
        :aria-hidden="!shown"
        :inert="!shown"
      >
        <slot name="back" />
        <span v-if="glare" :class="GLARE_CLASS" aria-hidden="true" />
      </div>
    </motion.div>
  </div>
</template>
