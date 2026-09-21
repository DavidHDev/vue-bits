<script setup lang="ts">
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { animate, motionValue, useReducedMotion } from 'motion-v';
import { onMounted, onUnmounted, ref, useSlots, watch, type CSSProperties } from 'vue';

export type SwipeToastCloseReason = 'timeout' | 'swipe' | 'action' | 'close' | 'escape' | 'programmatic';
export type SwipeToastFuse = 'bottom' | 'top' | 'none';
export type SwipeToastPhase = 'open' | 'closing' | 'gone';

interface SwipeToastProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  open?: boolean;
  background?: string;
  color?: string;
  fuseColor?: string;
  width?: number;
  radius?: number;
  slideMs?: number;
  settleBounce?: number;
  swipeDistance?: number;
  duration?: number;
  fuse?: SwipeToastFuse;
  pauseOnHover?: boolean;
  closeButton?: boolean;
  inline?: boolean;
  dismissible?: boolean;
  className?: string;
}

type Sample = [number, number];

interface Drag {
  id: number;
  startY: number;
  grab: number | null;
  moved: boolean;
  hist: Sample[];
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const FLICK = 0.11;
const DEAD_ZONE = 3;
const RESIST_PX = 24;
const COLLAPSE_MS = 200;
const EXIT = 0.7;
const BURN = [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }];
const HAS_STARTING_STYLE = typeof window !== 'undefined' && 'CSSStartingStyleRule' in window;

const rubberband = (over: number, dim: number, c = 0.55) => (over * dim * c) / (dim + c * Math.abs(over));
const velocityOf = (hist: Sample[]) => {
  if (hist.length < 2) return 0;
  const [t0, y0] = hist[0];
  const [t1, y1] = hist[hist.length - 1];
  return performance.now() - t1 > 100 ? 0 : (y1 - y0) / Math.max(1, t1 - t0);
};

const props = withDefaults(defineProps<SwipeToastProps>(), {
  title: 'File archived',
  description: '',
  actionLabel: '',
  open: true,
  background: '#27272a',
  color: '#f5f5f5',
  fuseColor: '#f5a524',
  width: 356,
  radius: 12,
  slideMs: 400,
  settleBounce: 0.2,
  swipeDistance: 40,
  duration: 4000,
  fuse: 'bottom',
  pauseOnHover: true,
  closeButton: false,
  inline: false,
  dismissible: true,
  className: ''
});

const emit = defineEmits<{ action: []; close: [reason: SwipeToastCloseReason] }>();

const slots = useSlots();
const reduce = useReducedMotion();
const phase = ref<SwipeToastPhase>('open');
const instant = ref(false);
const mounted = ref(HAS_STARTING_STYLE);
const cardRef = ref<HTMLDivElement | null>(null);
const fuseRef = ref<HTMLElement | null>(null);

let anim: Animation | null = null;
let drag: Drag | null = null;
const flags = { hover: false, interacting: false, focus: false, hidden: false };
let lastInput: 'pointer' | 'keyboard' = 'pointer';
let pendingClose: SwipeToastCloseReason | null = null;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let leaving = false;
let frame = 0;
const offs: (() => void)[] = [];

const y = motionValue(0);
const fade = motionValue(1);

const syncFuse = () => {
  const a = anim;
  if (!a) return;
  if (flags.hover || flags.interacting || flags.focus || flags.hidden) a.pause();
  else if (a.playState === 'paused') a.play();
};
const finish = (why: SwipeToastCloseReason) => {
  phase.value = 'gone';
  leaving = false;
  if (props.inline) closeTimer = setTimeout(() => emit('close', why), COLLAPSE_MS);
  else emit('close', why);
};
const close = (why: SwipeToastCloseReason) => {
  if (phase.value !== 'open' || leaving) return;
  if (drag) {
    pendingClose = why;
    return;
  }
  anim?.pause();
  const now = why === 'escape' || ((why === 'action' || why === 'close') && lastInput === 'keyboard');
  instant.value = now;
  phase.value = 'closing';
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => finish(why), now ? 0 : props.slideMs * EXIT + 60);
};
const rescue = () => {
  clearTimeout(closeTimer);
  instant.value = false;
  y.set(0);
  fade.set(1);
  phase.value = 'open';
};

watch(
  () => props.open,
  open => {
    if (!open) close('programmatic');
    else if (phase.value !== 'open') rescue();
  },
  { immediate: true }
);
watch(
  [phase, () => props.duration],
  (_v, _o, onCleanup) => {
    if (phase.value !== 'open' || props.duration <= 0 || !fuseRef.value) return;
    anim?.cancel();
    const a = fuseRef.value.animate(BURN, { duration: props.duration, easing: 'linear', fill: 'forwards' });
    a.onfinish = () => close('timeout');
    anim = a;
    syncFuse();
    onCleanup(() => {
      a.onfinish = null;
      a.pause();
    });
  },
  { flush: 'post', immediate: true }
);
watch(
  () => props.pauseOnHover,
  on => {
    if (!on) {
      flags.hover = false;
      syncFuse();
    }
  }
);

onMounted(() => {
  if (!HAS_STARTING_STYLE) frame = requestAnimationFrame(() => (mounted.value = true));
  // the card's transform and opacity are written by hand so a drag never triggers a Vue render
  offs.push(
    y.on('change', v => {
      if (cardRef.value) cardRef.value.style.transform = `translateY(${v}px)`;
    }),
    fade.on('change', v => {
      if (cardRef.value) cardRef.value.style.opacity = String(v);
    })
  );
  const onVisibility = () => {
    flags.hidden = document.hidden;
    syncFuse();
  };
  document.addEventListener('visibilitychange', onVisibility);
  offs.push(() => document.removeEventListener('visibilitychange', onVisibility));
});
onUnmounted(() => {
  cancelAnimationFrame(frame);
  clearTimeout(closeTimer);
  anim?.cancel();
  offs.forEach(off => off());
  y.stop();
  fade.stop();
});

const swipeOut = (dy: number, v: number) => {
  anim?.pause();
  leaving = true;
  pendingClose = null;
  if (!reduce.value && cardRef.value) {
    animate(y, dy + cardRef.value.offsetHeight, { type: 'spring', duration: 0.3, bounce: 0, velocity: v * 1000 });
  }
  animate(fade, 0, { duration: 0.2, ease: EASE_OUT }).then(() => finish('swipe'));
};
const onPointerDown = (e: PointerEvent) => {
  lastInput = 'pointer';
  if (e.button !== 0 || !props.dismissible || drag || leaving || (e.target as HTMLElement).closest('button')) return;
  if (phase.value === 'closing') rescue();
  try {
    cardRef.value?.setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  y.stop();
  drag = { id: e.pointerId, startY: e.clientY, grab: null, moved: false, hist: [[performance.now(), y.get()]] };
  flags.interacting = true;
  syncFuse();
};
const onPointerMove = (e: PointerEvent) => {
  const d = drag;
  if (!d || d.id !== e.pointerId) return;
  if (d.grab === null) {
    if (Math.abs(e.clientY - d.startY) < DEAD_ZONE) return;
    d.grab = e.clientY - y.get();
    if (cardRef.value) cardRef.value.dataset.swiping = '';
  }
  const raw = e.clientY - d.grab;
  const next = raw >= 0 ? raw : rubberband(raw, RESIST_PX);
  y.set(next);
  d.moved = true;
  d.hist.push([performance.now(), next]);
  if (d.hist.length > 4) d.hist.shift();
};
const onPointerUp = (e: PointerEvent) => {
  const d = drag;
  if (!d || d.id !== e.pointerId) return;
  drag = null;
  if (cardRef.value) delete cardRef.value.dataset.swiping;
  try {
    cardRef.value?.releasePointerCapture(e.pointerId);
  } catch {
    // already released
  }
  flags.interacting = false;
  const dy = y.get();
  const v = velocityOf(d.hist);
  if (dy > 0 && (v > FLICK || (dy >= props.swipeDistance && v >= 0))) {
    swipeOut(dy, v);
    return;
  }
  if (d.moved) {
    animate(
      y,
      0,
      reduce.value
        ? { duration: 0.2, ease: EASE_OUT }
        : { type: 'spring', duration: 0.5, bounce: props.settleBounce, velocity: v * 1000 }
    );
  }
  const queued = pendingClose;
  pendingClose = null;
  if (queued) close(queued);
  else syncFuse();
};
const onPointerEnter = (e: PointerEvent) => {
  if (props.pauseOnHover && e.pointerType === 'mouse') {
    flags.hover = true;
    syncFuse();
  }
};
const onPointerLeave = (e: PointerEvent) => {
  if (e.pointerType === 'mouse') {
    flags.hover = false;
    syncFuse();
  }
};
const onFocusIn = () => {
  flags.focus = true;
  syncFuse();
};
const onFocusOut = (e: FocusEvent) => {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) {
    flags.focus = false;
    syncFuse();
  }
};
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') lastInput = 'keyboard';
  if (e.key === 'Escape' && props.dismissible) {
    e.stopPropagation();
    close('escape');
  }
};
const onAction = () => {
  emit('action');
  close('action');
};

const cancelIcon = Cancel01Icon as unknown as IconArray;

const rootStyle = () =>
  ({
    '--st-bg': props.background,
    '--st-ink': props.color,
    '--st-fuse': props.fuseColor,
    '--st-w': `${props.width}px`,
    '--st-radius': `${props.radius}px`,
    '--st-slide': `${props.slideMs}ms`,
    '--st-gap': '10px'
  }) as CSSProperties;
</script>

<template>
  <div
    class="group data-[inline=false]:right-8 max-[600px]:data-[inline=false]:right-4 data-[inline=false]:bottom-[calc(32px+env(safe-area-inset-bottom,0px))] max-[600px]:data-[inline=false]:bottom-[calc(16px+env(safe-area-inset-bottom,0px))] data-[inline=false]:z-[999999999] data-[inline=false]:fixed grid w-[min(var(--st-w),100%)] max-[600px]:data-[inline=false]:w-[min(var(--st-w),calc(100vw-32px))] data-[inline=false]:w-[min(var(--st-w),calc(100vw-64px))] text-[13px] leading-normal [grid-template-rows:1fr] [color:var(--st-ink)] data-[inline=true]:[transition:grid-template-rows_var(--st-slide)_cubic-bezier(0.23,1,0.32,1)] data-[inline=true]:starting:[grid-template-rows:0fr] data-[inline=true]:data-[mounted=false]:[grid-template-rows:0fr] data-[inline=true]:data-[phase=closing]:[grid-template-rows:0fr] data-[inline=true]:data-[phase=gone]:[grid-template-rows:0fr] data-[inline=true]:data-[phase=closing]:[transition-duration:calc(var(--st-slide)*0.7)] data-[inline=true]:data-[phase=gone]:[transition-duration:200ms]"
    :class="className"
    :data-phase="phase"
    :data-inline="inline ? 'true' : 'false'"
    :data-fuse="duration > 0 ? fuse : 'none'"
    :data-dismissible="dismissible ? 'true' : 'false'"
    :data-instant="instant ? '' : undefined"
    :data-mounted="mounted ? 'true' : 'false'"
    :style="rootStyle()"
  >
    <div class="min-h-0">
      <div
        class="group-data-[phase=gone]:invisible opacity-100 starting:opacity-0 group-data-[mounted=false]:opacity-0 group-data-[phase=closing]:opacity-0 group-data-[phase=gone]:opacity-0 group-data-[inline=true]:mt-[var(--st-gap)] [transform:translateY(0)] [transition:transform_var(--st-slide)_cubic-bezier(0.23,1,0.32,1),opacity_calc(var(--st-slide)*0.6)_ease] starting:[transform:translateY(100%)] group-data-[mounted=false]:[transform:translateY(100%)] group-data-[phase=closing]:[transform:translateY(100%)] group-data-[phase=closing]:[transition:transform_calc(var(--st-slide)*0.7)_cubic-bezier(0.23,1,0.32,1),opacity_calc(var(--st-slide)*0.5)_ease] group-data-[phase=gone]:[transform:translateY(100%)] group-data-[instant]:[transition-duration:0s] motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
      >
        <div
          ref="cardRef"
          class="relative flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.1)] p-4 outline-none overflow-hidden [-webkit-touch-callout:none] touch-none group-data-[dismissible=false]:touch-auto cursor-grab data-[swiping]:cursor-grabbing group-data-[dismissible=false]:cursor-default select-none [-webkit-tap-highlight-color:transparent] [background:var(--st-bg)] [border-radius:var(--st-radius)]"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          tabindex="0"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @pointerenter="onPointerEnter"
          @pointerleave="onPointerLeave"
          @focusin="onFocusIn"
          @focusout="onFocusOut"
          @keydown="onKeyDown"
        >
          <span
            v-if="slots.icon"
            class="inline-flex flex-none w-[18px] [&_svg]:w-full h-[18px] [&_svg]:h-full"
            aria-hidden="true"
          >
            <slot name="icon" />
          </span>
          <span class="flex flex-col flex-auto gap-px min-w-0">
            <span class="font-medium leading-normal">{{ title }}</span>
            <span
              v-if="description"
              class="font-normal leading-[1.4] [color:color-mix(in_srgb,var(--st-ink)_66%,transparent)]"
            >
              {{ description }}
            </span>
          </span>
          <button
            v-if="actionLabel"
            type="button"
            class="flex-none [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-[0.88] px-2 border-0 rounded-[5px] outline-none h-6 font-medium text-xs touch-manipulation cursor-pointer [-webkit-tap-highlight-color:transparent] [background:var(--st-ink)] [color:var(--st-bg)] [font-family:inherit] [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1),opacity_160ms_ease] active:[transform:scale(0.97)] motion-reduce:active:[transform:none]"
            @click="onAction"
          >
            {{ actionLabel }}
          </button>
          <button
            v-if="closeButton"
            type="button"
            class="before:absolute relative before:-inset-2 flex-none place-items-center grid bg-transparent border-0 rounded-[5px] outline-none w-6 h-6 text-inherit before:content-[''] touch-manipulation cursor-pointer [-webkit-tap-highlight-color:transparent] [font-family:inherit] [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1),background-color_160ms_ease] active:[transform:scale(0.97)] motion-reduce:active:[transform:none] [@media(hover:hover)_and_(pointer:fine)]:hover:[background:color-mix(in_srgb,var(--st-ink)_10%,transparent)]"
            aria-label="Close"
            @click="close('close')"
          >
            <HugeiconsIcon :icon="cancelIcon" :size="12" :stroke-width="2.5" />
          </button>
          <i
            ref="fuseRef"
            class="group-data-[fuse=top]:top-0 right-0 bottom-0 group-data-[fuse=top]:bottom-auto left-0 absolute group-data-[fuse=none]:opacity-0 h-0.5 origin-left pointer-events-none [background:linear-gradient(90deg,transparent_0%,color-mix(in_srgb,var(--st-fuse)_18%,transparent)_9%,color-mix(in_srgb,var(--st-fuse)_50%,transparent)_18%,color-mix(in_srgb,var(--st-fuse)_84%,transparent)_28%,var(--st-fuse)_38%,var(--st-fuse)_62%,color-mix(in_srgb,var(--st-fuse)_84%,transparent)_72%,color-mix(in_srgb,var(--st-fuse)_50%,transparent)_82%,color-mix(in_srgb,var(--st-fuse)_18%,transparent)_91%,transparent_100%)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
