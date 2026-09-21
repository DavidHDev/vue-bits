<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId, watch, type CSSProperties } from 'vue';

export type HoldButtonSize = 'sm' | 'md' | 'lg';
export type HoldButtonDirection = 'right' | 'up';

interface HoldButtonProps {
  doneLabel?: string;
  backgroundColor?: string;
  fillColor?: string;
  textColor?: string;
  fillTextColor?: string;
  size?: HoldButtonSize;
  radius?: number;
  fillDirection?: HoldButtonDirection;
  holdTime?: number;
  releaseTime?: number;
  pressScale?: number;
  wave?: boolean;
  waveAmplitude?: number;
  glow?: boolean;
  resetAfter?: number;
  disabled?: boolean;
  className?: string;
}

type Phase = 'idle' | 'holding' | 'done';
type Input = 'pointer' | 'key' | null;

interface Gesture {
  pointerId: number | null;
  start: number;
  rect: DOMRect | null;
}

interface ReleaseOptions {
  drifted?: boolean;
}

const TAP_MS = 250;
const HIT_PAD = 10;
const LINEAR = (t: number) => t;
const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3);

const SIZES: Record<HoldButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-[22px] text-[15px]',
  lg: 'h-[52px] px-7 text-[17px]'
};

const LABEL_IDLE =
  '[grid-area:1/1] inline-flex items-center gap-2 whitespace-nowrap [transition:opacity_200ms_ease,filter_200ms_ease] group-data-[phase=done]:opacity-0 group-data-[phase=done]:blur-[2px]';
const LABEL_DONE =
  '[grid-area:1/1] inline-flex items-center gap-2 whitespace-nowrap [transition:opacity_200ms_ease,filter_200ms_ease] opacity-0 blur-[2px] group-data-[phase=done]:opacity-100 group-data-[phase=done]:blur-none';

const props = withDefaults(defineProps<HoldButtonProps>(), {
  doneLabel: 'Deleted',
  backgroundColor: '#27272a',
  fillColor: '#29ff27',
  textColor: '#f5f5f5',
  fillTextColor: '#000000',
  size: 'md',
  radius: 14,
  fillDirection: 'right',
  holdTime: 2000,
  releaseTime: 200,
  pressScale: 0.97,
  wave: true,
  waveAmplitude: 6,
  glow: true,
  resetAfter: 1200,
  disabled: false,
  className: ''
});

const emit = defineEmits<{ hold: []; tap: [] }>();

const phase = ref<Phase>('idle');
const input = ref<Input>(null);
let phaseNow: Phase = 'idle';
let inputNow: Input = null;
const buttonRef = ref<HTMLButtonElement | null>(null);
const gesture: Gesture = { pointerId: null, start: 0, rect: null };
const timers = { complete: 0, reset: 0 };
const hintId = useId();
let resizeObserver: ResizeObserver | null = null;

const go = (next: Phase, kind: Input = null) => {
  phaseNow = next;
  inputNow = kind;
  phase.value = next;
  input.value = kind;
};

const clearTimers = () => {
  clearTimeout(timers.complete);
  clearTimeout(timers.reset);
};

const motion = { raf: 0, p: 0, from: 0, to: 0, start: 0 };
const drive = (to: number, duration: number, ease: (t: number) => number) => {
  const m = motion;
  cancelAnimationFrame(m.raf);
  m.from = m.p;
  m.to = to;
  m.start = performance.now();
  const step = (now: number) => {
    const t = duration > 0 ? Math.min(1, (now - m.start) / duration) : 1;
    m.p = m.from + (m.to - m.from) * ease(t);
    buttonRef.value?.style.setProperty('--hb-p', m.p.toFixed(4));
    if (t < 1) {
      m.raf = requestAnimationFrame(step);
      return;
    }
    m.raf = 0;
    if (m.to === 1) complete();
  };
  m.raf = requestAnimationFrame(step);
};

const complete = () => {
  if (phaseNow !== 'holding') return;
  if (performance.now() - gesture.start < props.holdTime - 50) return;
  clearTimers();
  go('done', inputNow);
  emit('hold');
  if (props.resetAfter > 0) {
    timers.reset = window.setTimeout(() => {
      go('idle');
      drive(0, props.releaseTime, EASE_OUT);
    }, props.resetAfter);
  }
};

const begin = (kind: Input) => {
  if (props.disabled || phaseNow !== 'idle') return false;
  const button = buttonRef.value;
  if (!button) return false;
  gesture.start = performance.now();
  gesture.rect = button.getBoundingClientRect();
  go('holding', kind);
  drive(1, props.holdTime, LINEAR);
  timers.complete = window.setTimeout(complete, props.holdTime + 100);
  return true;
};

const release = ({ drifted = false }: ReleaseOptions = {}) => {
  if (phaseNow !== 'holding') return;
  clearTimers();
  const held = performance.now() - gesture.start;
  go('idle');
  drive(0, props.releaseTime, EASE_OUT);
  if (!drifted && held < TAP_MS) emit('tap');
};

const handlePointerDown = (e: PointerEvent) => {
  if (e.button !== 0 || !e.isPrimary || gesture.pointerId !== null) return;
  if (!begin('pointer')) return;
  gesture.pointerId = e.pointerId;
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
};

const endPointer = (e: PointerEvent, options?: ReleaseOptions) => {
  if (e.pointerId !== gesture.pointerId) return;
  gesture.pointerId = null;
  const el = e.currentTarget as HTMLElement;
  try {
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  } catch {
    // already released
  }
  release(options);
};

const handlePointerMove = (e: PointerEvent) => {
  if (e.pointerId !== gesture.pointerId) return;
  const r = gesture.rect;
  if (!r) return;
  const out =
    e.clientX < r.left - HIT_PAD ||
    e.clientX > r.right + HIT_PAD ||
    e.clientY < r.top - HIT_PAD ||
    e.clientY > r.bottom + HIT_PAD;
  if (out) endPointer(e, { drifted: true });
};

const handlePointerLeave = (e: PointerEvent) => {
  if (e.pointerType !== 'touch') endPointer(e, { drifted: true });
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (inputNow === 'key') release({ drifted: true });
    return;
  }
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    if (!e.repeat) begin('key');
  }
};

const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    if (inputNow === 'key') release();
  }
};

onMounted(() => {
  const button = buttonRef.value;
  if (!button) return;
  const measure = () => {
    button.style.setProperty('--hb-w', `${button.offsetWidth}px`);
    button.style.setProperty('--hb-h', `${button.offsetHeight}px`);
  };
  measure();
  resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(button);
});

watch(phase, (next, _prev, onCleanup) => {
  if (next !== 'holding') return;
  const cancel = () => release({ drifted: true });
  const onVisibility = () => {
    if (document.hidden) cancel();
  };
  window.addEventListener('blur', cancel);
  document.addEventListener('visibilitychange', onVisibility);
  onCleanup(() => {
    window.removeEventListener('blur', cancel);
    document.removeEventListener('visibilitychange', onVisibility);
  });
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  clearTimers();
  cancelAnimationFrame(motion.raf);
});

const direction = computed<HoldButtonDirection>(() => (props.fillDirection === 'up' ? 'up' : 'right'));

const cssVars = computed(
  () =>
    ({
      '--hb-radius': `${props.radius}px`,
      '--hb-bg': props.backgroundColor,
      '--hb-fill': props.fillColor,
      '--hb-text': props.textColor,
      '--hb-fill-text': props.fillTextColor,
      '--hb-hold': `${props.holdTime}ms`,
      '--hb-cycles': props.holdTime / 1100,
      '--hb-release': `${props.releaseTime}ms`,
      '--hb-press': props.pressScale,
      '--hb-wave': `${props.wave ? props.waveAmplitude : 0}px`,
      '--hb-ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)'
    }) as CSSProperties
);
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    :disabled="disabled"
    class="group inline-grid isolate relative place-items-center disabled:opacity-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] data-[glow=true]:data-[phase=done]:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_32px_-6px_color-mix(in_srgb,var(--hb-fill)_70%,transparent)] data-[glow=true]:data-[phase=holding]:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_32px_-6px_color-mix(in_srgb,var(--hb-fill)_70%,transparent)] m-0 border-0 outline-none focus-visible:outline-offset-[3px] font-medium leading-none tracking-[0.01em] [transition:transform_160ms_var(--hb-ease-out),background-color_160ms_ease,box-shadow_var(--hb-release)_var(--hb-ease-out)] data-[glow=true]:data-[phase=holding]:[transition:transform_160ms_var(--hb-ease-out),background-color_160ms_ease,box-shadow_var(--hb-hold)_linear] [-webkit-touch-callout:none] touch-manipulation cursor-pointer disabled:cursor-default disabled:pointer-events-none select-none hb-root contrast-more:[outline:1px_solid_var(--hb-text)] [-webkit-tap-highlight-color:transparent] [background:var(--hb-bg)] [border-radius:var(--hb-radius)] [color:var(--hb-text)] [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:[background:color-mix(in_srgb,var(--hb-bg)_92%,#fff)] data-[phase=holding]:data-[input=pointer]:[transform:scale(var(--hb-press))] focus-visible:[outline:2px_solid_var(--hb-fill)]"
    :class="[SIZES[size] || SIZES.md, className]"
    :data-phase="phase"
    :data-input="input ?? undefined"
    :data-direction="direction"
    :data-glow="glow ? 'true' : undefined"
    :aria-describedby="hintId"
    :style="cssVars"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="endPointer($event)"
    @pointercancel="endPointer($event, { drifted: true })"
    @lostpointercapture="endPointer($event, { drifted: true })"
    @pointerleave="handlePointerLeave"
    @keydown="handleKeyDown"
    @keyup="handleKeyUp"
    @contextmenu.prevent
  >
    <span
      class="z-0 absolute inset-0 opacity-0 group-data-[glow=true]:group-data-[phase=done]:[animation:hb-pulse_600ms_var(--hb-ease-out)_forwards] pointer-events-none hb-pulse [border-radius:var(--hb-radius)]"
      aria-hidden="true"
    />
    <span class="z-[2] relative place-items-center grid hb-label">
      <span :class="LABEL_IDLE" :aria-hidden="phase === 'done'">
        <span v-if="$slots.icon" class="[&>svg]:block inline-flex flex-none"><slot name="icon" /></span>
        <slot>Hold to delete</slot>
      </span>
      <span :class="LABEL_DONE" :aria-hidden="phase !== 'done'">
        <span v-if="$slots.doneIcon" class="[&>svg]:block inline-flex flex-none"><slot name="doneIcon" /></span>
        {{ doneLabel }}
      </span>
    </span>
    <span
      class="z-[3] absolute inset-0 pointer-events-none [clip-path:inset(0_round_var(--hb-radius))]"
      aria-hidden="true"
    >
      <span
        class="absolute inset-0 place-items-center grid [color:var(--hb-fill-text)] hb-fill [background:var(--hb-fill)]"
      >
        <span class="place-items-center grid hb-label">
          <span :class="LABEL_IDLE">
            <span v-if="$slots.icon" class="[&>svg]:block inline-flex flex-none"><slot name="icon" /></span>
            <slot>Hold to delete</slot>
          </span>
          <span :class="LABEL_DONE">
            <span v-if="$slots.doneIcon" class="[&>svg]:block inline-flex flex-none"><slot name="doneIcon" /></span>
            {{ doneLabel }}
          </span>
        </span>
      </span>
      <span
        class="absolute inset-0 place-items-center grid [color:var(--hb-fill-text)] hb-crest [background:var(--hb-fill)]"
      >
        <span class="place-items-center grid hb-label">
          <span :class="LABEL_IDLE">
            <span v-if="$slots.icon" class="[&>svg]:block inline-flex flex-none"><slot name="icon" /></span>
            <slot>Hold to delete</slot>
          </span>
          <span :class="LABEL_DONE">
            <span v-if="$slots.doneIcon" class="[&>svg]:block inline-flex flex-none"><slot name="doneIcon" /></span>
            {{ doneLabel }}
          </span>
        </span>
      </span>
    </span>
    <span :id="hintId" class="absolute w-px h-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]">
      Press and hold for {{ Math.round(holdTime / 100) / 10 }} seconds to confirm
    </span>
  </button>
</template>

<style>
.hb-root {
  --hb-w: 0px;
  --hb-h: 0px;
  --hb-cycles: 2;
  --hb-p: 0;
}
.hb-fill {
  clip-path: inset(
    0 calc((1 - var(--hb-p)) * (100% + 0.75 * var(--hb-wave)) - var(--hb-p) * 0.25 * var(--hb-wave)) 0 0
  );
}
.hb-root[data-direction='up'] .hb-fill {
  clip-path: inset(
    calc((1 - var(--hb-p)) * (100% + 0.75 * var(--hb-wave)) - var(--hb-p) * 0.25 * var(--hb-wave)) 0 0 0
  );
}
.hb-crest {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='200' viewBox='0 0 20 200' preserveAspectRatio='none'%3E%3Cpath d='M0 0H10C18 8 18 25.3 10 33.3S2 58.7 10 66.7S18 92 10 100S2 125.3 10 133.3S18 158.7 10 166.7S2 192 10 200H0Z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='200' viewBox='0 0 20 200' preserveAspectRatio='none'%3E%3Cpath d='M0 0H10C18 8 18 25.3 10 33.3S2 58.7 10 66.7S18 92 10 100S2 125.3 10 133.3S18 158.7 10 166.7S2 192 10 200H0Z'/%3E%3C/svg%3E");
  -webkit-mask-repeat: repeat-y;
  mask-repeat: repeat-y;
  -webkit-mask-size: var(--hb-wave) calc(var(--hb-h) * 2);
  mask-size: var(--hb-wave) calc(var(--hb-h) * 2);
  -webkit-mask-position-x: calc(-1 * var(--hb-wave) + var(--hb-p) * (var(--hb-w) + var(--hb-wave)));
  mask-position-x: calc(-1 * var(--hb-wave) + var(--hb-p) * (var(--hb-w) + var(--hb-wave)));
  -webkit-mask-position-y: calc(-1 * var(--hb-p) * var(--hb-cycles) * var(--hb-h));
  mask-position-y: calc(-1 * var(--hb-p) * var(--hb-cycles) * var(--hb-h));
}
.hb-root[data-direction='up'] .hb-crest {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='20' viewBox='0 0 200 20' preserveAspectRatio='none'%3E%3Cpath d='M0 20V10C12 2 38 2 50 10S88 18 100 10S138 2 150 10S188 18 200 10V20Z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='20' viewBox='0 0 200 20' preserveAspectRatio='none'%3E%3Cpath d='M0 20V10C12 2 38 2 50 10S88 18 100 10S138 2 150 10S188 18 200 10V20Z'/%3E%3C/svg%3E");
  -webkit-mask-repeat: repeat-x;
  mask-repeat: repeat-x;
  -webkit-mask-size: calc(var(--hb-w) * 2) var(--hb-wave);
  mask-size: calc(var(--hb-w) * 2) var(--hb-wave);
  -webkit-mask-position-x: calc(-1 * var(--hb-p) * var(--hb-cycles) * var(--hb-w));
  mask-position-x: calc(-1 * var(--hb-p) * var(--hb-cycles) * var(--hb-w));
  -webkit-mask-position-y: calc(var(--hb-h) - var(--hb-p) * (var(--hb-h) + var(--hb-wave)));
  mask-position-y: calc(var(--hb-h) - var(--hb-p) * (var(--hb-h) + var(--hb-wave)));
}
@keyframes hb-pulse {
  from {
    opacity: 1;
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--hb-fill) 55%, transparent);
  }
  to {
    opacity: 0;
    box-shadow: 0 0 0 14px color-mix(in srgb, var(--hb-fill) 0%, transparent);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hb-root {
    transform: none !important;
    transition:
      background-color 160ms ease,
      box-shadow var(--hb-release) ease !important;
  }
  .hb-fill {
    clip-path: inset(0) !important;
    opacity: 0;
    transition: opacity var(--hb-release) ease !important;
  }
  .hb-crest {
    display: none;
  }
  .hb-root[data-phase='holding'] .hb-fill,
  .hb-root[data-phase='done'] .hb-fill {
    opacity: 1;
    transition: opacity var(--hb-hold) linear !important;
  }
  .hb-pulse {
    animation: none !important;
  }
  .hb-label > span {
    filter: none !important;
    transition: opacity 200ms ease !important;
  }
}
</style>
