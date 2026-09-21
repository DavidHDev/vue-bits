<script setup lang="ts">
import {
  animate,
  motion,
  motionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type AnimationPlaybackControls,
  type MotionValue
} from 'motion-v';
import { computed, onUnmounted, ref, useId, watch, type CSSProperties } from 'vue';

interface SquishSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string;
  disabled?: boolean;
  trackColor?: string;
  trackOnColor?: string;
  thumbColor?: string;
  thumbOnColor?: string;
  width?: number;
  height?: number;
  radius?: number;
  speed?: number;
  stretch?: number;
  hoverScale?: number;
  colorDuration?: number;
  ariaLabel?: string;
  className?: string;
  id?: string;
}

interface Grip {
  id: number;
  grab: number | null;
  moved: boolean;
  startX: number;
  onAtPress: boolean;
  slop: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const FLOW_SPRING = { stiffness: 320, damping: 40, mass: 0.6 };
const SWELL_SPRING = { stiffness: 520, damping: 34, mass: 0.6 };
const MAX_STRETCH = 0.4;
const STRETCH_SPEED = 600;
const TAP_SLOP = { fine: 4, coarse: 8 };

const props = withDefaults(defineProps<SquishSwitchProps>(), {
  checked: undefined,
  defaultChecked: false,
  label: '',
  disabled: false,
  trackColor: '#27272a',
  trackOnColor: '#f5f5f5',
  thumbColor: '',
  thumbOnColor: '',
  width: 76,
  height: 38,
  radius: 19,
  speed: 50,
  stretch: 36,
  hoverScale: 1.035,
  colorDuration: 320,
  ariaLabel: undefined,
  className: '',
  id: undefined
});

const emit = defineEmits<{ change: [checked: boolean] }>();

const reduce = useReducedMotion();
const inset = computed(() => Math.max(3, Math.round(props.height * 0.11)));
const thumb = computed(() => props.height - inset.value * 2);
const min = computed(() => inset.value);
const max = computed(() => props.width - inset.value - thumb.value);
const mid = computed(() => (min.value + max.value) / 2);
const trackRadius = computed(() => Math.min(props.radius, props.height / 2));
const thumbRadius = computed(() => Math.max(2, trackRadius.value - inset.value));

const isControlled = computed(() => props.checked !== undefined);
const inner = ref(props.defaultChecked);
const on = computed(() => (isControlled.value ? !!props.checked : inner.value));
const dragging = ref(false);
const trackRef = ref<HTMLSpanElement | null>(null);
let grip: Grip | null = null;
let onNow = on.value;
let skipClick = false;
let skipTimer: ReturnType<typeof setTimeout> | undefined;
let controls: AnimationPlaybackControls | null = null;
const autoId = useId();
const buttonId = computed(() => props.id ?? autoId);

const x = motionValue(on.value ? max.value : min.value);
const flow = useSpring(useVelocity(x), FLOW_SPRING);
const swell = useSpring(1, SWELL_SPRING);
const stretchOf = (v: number) => {
  const gain = reduce.value ? 0 : clamp(props.stretch, 0, 100) / 100;
  return 1 + Math.min(MAX_STRETCH, Math.abs(v) / STRETCH_SPEED) * gain;
};
const scaleX = useTransform([flow, swell] as MotionValue<number>[], ([v, h]: number[]) => stretchOf(v) * h);
const scaleY = useTransform([flow, swell] as MotionValue<number>[], ([v, h]: number[]) => h / stretchOf(v));

const commit = (next: boolean) => {
  if (next === onNow) return;
  onNow = next;
  if (!isControlled.value) inner.value = next;
  emit('change', next);
};

watch(on, v => (onNow = v));
watch(
  [on, dragging, min, max, () => props.speed, reduce],
  () => {
    if (dragging.value) return;
    controls?.stop();
    const target = on.value ? max.value : min.value;
    if (reduce.value) {
      x.jump(target);
      return;
    }
    controls = animate(x, target, {
      type: 'spring',
      stiffness: 170 - (50 - clamp(props.speed, 0, 100)) * 1.1,
      damping: 21.5,
      mass: 0.9,
      restDelta: 0.001,
      restSpeed: 0.01
    });
  },
  { flush: 'post' }
);
onUnmounted(() => {
  controls?.stop();
  clearTimeout(skipTimer);
});

const localX = (clientX: number) => {
  const el = trackRef.value;
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  const scale = rect.width / (el.offsetWidth || rect.width) || 1;
  return (clientX - rect.left) / scale;
};
const down = (e: PointerEvent) => {
  if (props.disabled || grip || e.button !== 0) return;
  grip = {
    id: e.pointerId,
    grab: null,
    moved: false,
    startX: e.clientX,
    onAtPress: onNow,
    slop: e.pointerType === 'touch' ? TAP_SLOP.coarse : TAP_SLOP.fine
  };
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  dragging.value = true;
};
const move = (e: PointerEvent) => {
  const g = grip;
  if (!g || g.id !== e.pointerId) return;
  const lx = localX(e.clientX);
  if (g.grab === null) {
    g.grab = lx - x.get();
    return;
  }
  if (!g.moved && Math.abs(e.clientX - g.startX) > g.slop) g.moved = true;
  if (!g.moved) return;
  const nx = clamp(lx - g.grab, min.value, max.value);
  x.set(nx);
  commit(nx > mid.value);
};
const up = (pointerId: number, target: HTMLElement, cancelled: boolean) => {
  const g = grip;
  if (!g || g.id !== pointerId) return;
  grip = null;
  try {
    target.releasePointerCapture(pointerId);
  } catch {
    // already released
  }
  if (cancelled) commit(g.onAtPress);
  else if (!g.moved) commit(!onNow);
  skipClick = true;
  skipTimer = setTimeout(() => {
    skipClick = false;
  }, 0);
  dragging.value = false;
};
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && grip) up(grip.id, e.currentTarget as HTMLElement, true);
};
const click = () => {
  if (skipClick) {
    skipClick = false;
    return;
  }
  if (!props.disabled) commit(!onNow);
};
const onEnter = (e: PointerEvent) => {
  if (e.pointerType === 'mouse' && !props.disabled) swell.set(props.hoverScale);
};

const buttonStyle = computed(
  () =>
    ({
      '--ss-w': `${props.width}px`,
      '--ss-h': `${props.height}px`,
      '--ss-inset': `${inset.value}px`,
      '--ss-thumb': `${thumb.value}px`,
      '--ss-r': `${trackRadius.value}px`,
      '--ss-thumb-r': `${thumbRadius.value}px`,
      '--ss-track': props.trackColor,
      '--ss-track-on': props.trackOnColor,
      '--ss-thumb-color': props.thumbColor || `color-mix(in srgb, ${props.trackOnColor} 19%, ${props.trackColor})`,
      '--ss-thumb-on': props.thumbOnColor || props.trackColor,
      '--ss-fade': `${props.colorDuration}ms`
    }) as CSSProperties
);
</script>

<template>
  <span class="inline-flex items-center gap-2.5" :class="className">
    <button
      :id="buttonId"
      type="button"
      role="switch"
      :aria-checked="on"
      :aria-disabled="disabled || undefined"
      :aria-label="ariaLabel"
      class="group inline-block after:absolute relative after:-inset-2 bg-transparent aria-disabled:opacity-50 m-0 p-0 border-0 outline-none after:content-[''] [-webkit-touch-callout:none] touch-pan-y cursor-pointer data-[held]:cursor-grabbing aria-disabled:cursor-not-allowed select-none [-webkit-tap-highlight-color:transparent]"
      :data-on="on ? '' : undefined"
      :data-held="dragging ? '' : undefined"
      :style="buttonStyle"
      @pointerdown="down"
      @pointermove="move"
      @pointerup="up($event.pointerId, $event.currentTarget as HTMLElement, false)"
      @pointercancel="up($event.pointerId, $event.currentTarget as HTMLElement, true)"
      @pointerenter="onEnter"
      @pointerleave="swell.set(1)"
      @keydown="onKeyDown"
      @click="click"
    >
      <span
        ref="trackRef"
        class="block relative group-data-[on]:[background:var(--ss-track-on)] motion-reduce:[transition-duration:1ms] [width:var(--ss-w)] [height:var(--ss-h)] [border-radius:var(--ss-r)] [background:var(--ss-track)] [transition:background-color_var(--ss-fade)_ease]"
      >
        <motion.span
          class="left-0 absolute group-data-[on]:[background:var(--ss-thumb-on)] motion-reduce:[transition-duration:1ms] [top:var(--ss-inset)] [width:var(--ss-thumb)] [height:var(--ss-thumb)] [border-radius:var(--ss-thumb-r)] [background:var(--ss-thumb-color)] [transition:background-color_var(--ss-fade)_ease]"
          aria-hidden="true"
          :style="{ x, scaleX, scaleY }"
        />
      </span>
    </button>
    <label v-if="label" :for="buttonId" class="cursor-pointer select-none">{{ label }}</label>
  </span>
</template>
