<script setup lang="ts">
import { Notification03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionStyle
} from 'motion-v';
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties, type ComponentPublicInstance } from 'vue';

export type BellToggleSize = 'sm' | 'md' | 'lg';

interface BellToggleProps {
  offLabel?: string;
  onLabel?: string;
  label?: string;
  color?: string;
  background?: string;
  onColor?: string;
  onBackground?: string;
  size?: BellToggleSize;
  radius?: number;
  ringAmplitude?: number;
  ringPasses?: number;
  ringDecay?: number;
  ringDuration?: number;
  ringPivot?: number;
  crossfadeMs?: number;
  revealBounce?: number;
  count?: number;
  badge?: boolean;
  badgeColor?: string;
  badgeTextColor?: string;
  waves?: boolean;
  clapper?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  disabled?: boolean;
  className?: string;
}

const SPRING_UI = { type: 'spring' as const, duration: 0.3, bounce: 0 };
const SEG_EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
const WARP = 0.6;
const SIZES: Record<string, [number, number, number, number, number]> = {
  sm: [36, 12.5, 14, 15, 8],
  md: [44, 13.5, 16, 19, 9],
  lg: [52, 15, 18, 23, 10]
};
const WOBBLE = { amplitude: 0.4, passes: 3, duration: 420 };
const BELL_BODY = 'M6 16.5V10a6 6 0 0 1 12 0v6.5l1.6 2.3H4.4L6 16.5z';

const passOffset = (k: number, passes: number) => 1 - Math.pow(1 - (k + 2 / 3) / (passes + 1), WARP);
const ringKeyframes = (from: number, amplitude: number, passes: number, decay: number): Keyframe[] => {
  const frames: Keyframe[] = [{ transform: `rotate(${from}deg)`, offset: 0, easing: SEG_EASE }];
  for (let k = 0; k < passes; k++) {
    const angle = amplitude * Math.pow(1 - k / passes, decay) * (k % 2 ? 1 : -1);
    frames.push({ transform: `rotate(${angle.toFixed(2)}deg)`, offset: passOffset(k, passes), easing: SEG_EASE });
  }
  frames.push({ transform: 'rotate(0deg)', offset: 1 });
  return frames;
};
const liveAngle = (el: Element) => {
  const tf = getComputedStyle(el).transform;
  if (!tf || tf === 'none') return 0;
  const m = new DOMMatrix(tf);
  return (Math.atan2(m.b, m.a) * 180) / Math.PI;
};

const props = withDefaults(defineProps<BellToggleProps>(), {
  offLabel: 'Notify me',
  onLabel: "You'll be notified",
  color: '#f5f5f5',
  background: '#27272a',
  onColor: '#18181b',
  onBackground: '#f5f5f5',
  size: 'md',
  radius: 22,
  ringAmplitude: 17,
  ringPasses: 5,
  ringDecay: 1,
  ringDuration: 820,
  ringPivot: 16,
  crossfadeMs: 200,
  revealBounce: 0,
  count: 0,
  badge: true,
  badgeColor: '#ef4444',
  badgeTextColor: '#ffffff',
  waves: true,
  clapper: false,
  pressed: undefined,
  defaultPressed: false,
  disabled: false,
  className: ''
});

const emit = defineEmits<{ change: [pressed: boolean] }>();

const inner = ref(props.defaultPressed);
const on = computed(() => props.pressed ?? inner.value);
const reduce = useReducedMotion();

const rootRef = ref<ComponentPublicInstance | null>(null);
const glyphRef = ref<HTMLSpanElement | null>(null);
const clapperRef = ref<HTMLSpanElement | null>(null);
const waveLeft = ref<SVGSVGElement | null>(null);
const waveRight = ref<SVGSVGElement | null>(null);
const offRef = ref<HTMLSpanElement | null>(null);
const onRef = ref<HTMLSpanElement | null>(null);

let lastInput: 'pointer' | 'keyboard' = 'pointer';
let pending: 'pointer' | 'keyboard' | null = null;
let spring: AnimationPlaybackControls | null = null;
let prevCount = props.count;

const sizeValues = computed(() => SIZES[props.size] ?? SIZES.md);

const t = useMotionValue(on.value ? 1 : 0);
const wOff = useMotionValue(0);
const wOn = useMotionValue(0);
const clip = useTransform([t, wOff, wOn], ([v, a, b]: number[]) => `${Math.max(a, b) - (a + (b - a) * v)}px`);

let widthObserver: ResizeObserver | null = null;

const measureWidths = () => {
  if (offRef.value) wOff.set(offRef.value.offsetWidth);
  if (onRef.value) wOn.set(onRef.value.offsetWidth);
};

const setupWidthObserver = () => {
  widthObserver?.disconnect();
  measureWidths();
  widthObserver = new ResizeObserver(measureWidths);
  if (offRef.value) widthObserver.observe(offRef.value);
  if (onRef.value) widthObserver.observe(onRef.value);
  document.fonts?.ready.then(measureWidths);
};

onMounted(() => setupWidthObserver());
onUnmounted(() => widthObserver?.disconnect());
watch(
  () => [props.offLabel, props.onLabel, props.size],
  () => setupWidthObserver(),
  { flush: 'post' }
);

const swing = (amplitude: number, passes: number, duration: number) => {
  const el = glyphRef.value;
  if (!el) return;
  el.getAnimations().forEach(a => a.cancel());
  el.animate(ringKeyframes(liveAngle(el), amplitude, passes, props.ringDecay), { duration, easing: 'linear' });
  const c = clapperRef.value;
  if (c) {
    c.getAnimations().forEach(a => a.cancel());
    c.animate(ringKeyframes(liveAngle(c), amplitude * 1.6, passes, props.ringDecay), {
      duration,
      delay: 70,
      easing: 'linear'
    });
  }
  if (!props.waves) return;
  for (let k = 0; k < passes; k++) {
    const side = k % 2 ? waveRight.value : waveLeft.value;
    if (!side) continue;
    const strength = Math.pow(1 - k / passes, props.ringDecay);
    side.animate(
      [
        { opacity: 0, transform: 'scale(0.55)' },
        { opacity: 0.9 * strength, offset: 0.3 },
        { opacity: 0, transform: 'scale(1.25)' }
      ],
      { duration: 380, delay: passOffset(k, passes) * duration, easing: 'ease-out' }
    );
  }
};

onUnmounted(() => spring?.stop());

watch(on, () => {
  const pointer = pending === 'pointer' && !reduce.value;
  pending = null;
  spring?.stop();
  if (pointer) spring = animate(t, on.value ? 1 : 0, { ...SPRING_UI, bounce: props.revealBounce });
  else t.jump(on.value ? 1 : 0);
  if (on.value && pointer) swing(props.ringAmplitude, props.ringPasses, props.ringDuration);
});

watch(
  () => props.count,
  () => {
    const was = prevCount;
    prevCount = props.count;
    if (props.count > was && on.value && !reduce.value) {
      swing(props.ringAmplitude * WOBBLE.amplitude, WOBBLE.passes, WOBBLE.duration);
    }
  }
);

const toggle = () => {
  pending = lastInput;
  const wasOn = on.value;
  if (props.pressed === undefined) inner.value = !wasOn;
  emit('change', !wasOn);
};
const press = (e: PointerEvent) => {
  lastInput = 'pointer';
  const el = rootRef.value?.$el as HTMLElement | undefined;
  if (e.button === 0 && !props.disabled && el) el.dataset.pressed = '';
};
const release = () => {
  const el = rootRef.value?.$el as HTMLElement | undefined;
  if (el) delete el.dataset.pressed;
};
const key = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') lastInput = 'keyboard';
};

const showBadge = computed(() => props.badge && on.value && props.count > 0);
const iconSize = computed(() => sizeValues.value[2]);

const rootStyle = computed<MotionStyle & CSSProperties>(
  () =>
    ({
      '--bt-clip': clip,
      '--bt-color': props.color,
      '--bt-bg': props.background,
      '--bt-on-color': props.onColor,
      '--bt-on-bg': props.onBackground,
      '--bt-badge': props.badgeColor,
      '--bt-badge-ink': props.badgeTextColor,
      '--bt-radius': `${props.radius}px`,
      '--bt-fade': `${props.crossfadeMs}ms`,
      '--bt-pivot': `${props.ringPivot}%`,
      '--bt-h': `${sizeValues.value[0]}px`,
      '--bt-fs': `${sizeValues.value[1]}px`,
      '--bt-icon': `${sizeValues.value[2]}px`,
      '--bt-px': `${sizeValues.value[3]}px`,
      '--bt-gap': `${sizeValues.value[4]}px`
    }) as unknown as MotionStyle & CSSProperties
);
</script>

<template>
  <motion.span
    ref="rootRef"
    class="group inline-grid relative grid-cols-[max-content] data-[disabled]:opacity-55 data-[disabled]:data-[pressed]:[transform:none] data-[pressed]:[transform:scale(0.97)] motion-reduce:data-[pressed]:[transform:none] [-webkit-touch-callout:none] select-none [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1)]"
    :class="className"
    :data-on="on ? 'true' : 'false'"
    :data-disabled="disabled ? '' : undefined"
    :style="rootStyle"
  >
    <button
      type="button"
      class="inline-flex items-center m-0 border-0 outline-none font-medium leading-none tracking-[0.01em] whitespace-nowrap touch-manipulation cursor-pointer disabled:cursor-default [-webkit-tap-highlight-color:transparent] [font-family:inherit] [grid-area:1/1] [gap:var(--bt-gap)] [height:var(--bt-h)] [padding:0_var(--bt-px)] [border-radius:var(--bt-radius)] [background:var(--bt-bg)] [color:var(--bt-color)] [font-size:var(--bt-fs)] [clip-path:inset(0_var(--bt-clip)_0_0_round_var(--bt-radius))] [transition:background-color_var(--bt-fade)_ease,color_var(--bt-fade)_ease] group-data-[on=true]:[background:var(--bt-on-bg)] group-data-[on=true]:[color:var(--bt-on-color)] [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:[background:color-mix(in_srgb,var(--bt-color)_6%,var(--bt-bg))] [@media(hover:hover)_and_(pointer:fine)]:group-data-[on=true]:enabled:hover:[background:color-mix(in_srgb,var(--bt-on-color)_6%,var(--bt-on-bg))]"
      :aria-pressed="on"
      :aria-label="label ?? offLabel"
      :disabled="disabled"
      @pointerdown="press"
      @pointerup="release"
      @pointercancel="release"
      @pointerleave="release"
      @keydown="key"
      @click="toggle"
    >
      <span class="inline-grid relative flex-none [width:var(--bt-icon)] [height:var(--bt-icon)]" aria-hidden="true">
        <span
          ref="glyphRef"
          class="inline-grid place-items-center [&_svg]:w-full [&_svg]:h-full [grid-area:1/1] [width:var(--bt-icon)] [height:var(--bt-icon)] [transform-origin:50%_var(--bt-pivot)]"
        >
          <svg
            v-if="clapper"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path :d="BELL_BODY" />
            <path d="M12 2.5V4" />
          </svg>
          <slot v-else name="icon">
            <HugeiconsIcon :icon="Notification03Icon" :size="iconSize" :stroke-width="2" />
          </slot>
        </span>
        <span
          v-if="clapper"
          ref="clapperRef"
          class="[&_svg]:block absolute inset-0 [&_svg]:w-full [&_svg]:h-full pointer-events-none [transform-origin:50%_var(--bt-pivot)]"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="20.4" r="1.7" fill="currentColor" />
          </svg>
        </span>
        <template v-if="waves">
          <svg
            ref="waveLeft"
            class="-top-[3px] right-[calc(100%-2px)] absolute opacity-0 fill-none stroke-current w-3.5 h-3.5 origin-bottom-right pointer-events-none [stroke-linecap:round] [stroke-width:1.6]"
            viewBox="0 0 14 14"
          >
            <path d="M14 8a6 6 0 0 0-6 6" />
            <path d="M14 4A10 10 0 0 0 4 14" />
          </svg>
          <svg
            ref="waveRight"
            class="-top-[3px] left-[calc(100%-2px)] absolute opacity-0 fill-none stroke-current w-3.5 h-3.5 origin-bottom-left pointer-events-none [stroke-linecap:round] [stroke-width:1.6]"
            viewBox="0 0 14 14"
          >
            <path d="M0 8a6 6 0 0 1 6 6" />
            <path d="M0 4a10 10 0 0 1 10 10" />
          </svg>
        </template>
        <span
          v-if="badge"
          class="-top-1.5 -right-[7px] box-border absolute place-items-center grid opacity-0 data-[show]:opacity-100 px-[3px] rounded-[7px] min-w-3.5 h-3.5 font-semibold text-[9.5px] leading-none pointer-events-none [background:var(--bt-badge)] [color:var(--bt-badge-ink)] [transform:translateY(5px)_scale(0.6)] [transition:transform_180ms_cubic-bezier(0.23,1,0.32,1),opacity_140ms_ease] data-[show]:[transform:translateY(0)_scale(1)] data-[show]:[transition:transform_280ms_cubic-bezier(0.34,1.56,0.64,1),opacity_120ms_ease] motion-reduce:[transform:none]! motion-reduce:[transition:opacity_140ms_ease]!"
          :data-show="showBadge ? '' : undefined"
        >
          <span
            :key="count"
            class="block opacity-100 starting:opacity-0 [transform:translateY(0)] starting:[transform:translateY(5px)] [transition:opacity_200ms_ease,transform_200ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
          >
            {{ count > 9 ? '9+' : count }}
          </span>
        </span>
      </span>
      <span class="inline-grid grid-cols-[max-content] h-[18px] leading-[18px]" aria-hidden="true">
        <span
          ref="offRef"
          class="justify-self-start opacity-0 group-data-[on=false]:opacity-100 blur-[2px] motion-reduce:blur-none! group-data-[on=false]:blur-none [grid-area:1/1] [transition:opacity_var(--bt-fade)_ease,filter_var(--bt-fade)_ease] motion-reduce:[transition:opacity_var(--bt-fade)_ease]"
        >
          {{ offLabel }}
        </span>
        <span
          ref="onRef"
          class="justify-self-start opacity-0 group-data-[on=true]:opacity-100 blur-[2px] motion-reduce:blur-none! group-data-[on=true]:blur-none [grid-area:1/1] [transition:opacity_var(--bt-fade)_ease,filter_var(--bt-fade)_ease] motion-reduce:[transition:opacity_var(--bt-fade)_ease]"
        >
          {{ onLabel }}
        </span>
      </span>
    </button>
  </motion.span>
</template>
