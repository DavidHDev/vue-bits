<script setup lang="ts">
import { Archive02Icon, Tick02Icon, Undo02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, onMounted, onUnmounted, ref, useId, watch, type CSSProperties } from 'vue';

export type FusePosition = 'outline' | 'bottom' | 'top';
export type FuseCommitOn = 'press' | 'fuseEnd';
export type FuseSettle = 'reset' | 'stay';
export type FusePhase = 'idle' | 'armed' | 'settled';
export type FuseSize = 'sm' | 'md' | 'lg';

interface FuseButtonProps {
  label?: string;
  undoLabel?: string;
  doneLabel?: string;
  color?: string;
  background?: string;
  fuseColor?: string;
  size?: FuseSize;
  radius?: number;
  undoWindow?: number;
  fuse?: FusePosition;
  fuseThickness?: number;
  crossfadeMs?: number;
  commitOn?: FuseCommitOn;
  pauseOnHover?: boolean;
  settle?: FuseSettle;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const LINE: Keyframe[] = [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }];
const OUTLINE: Keyframe[] = [{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }];
const SIZES: Record<FuseSize, { height: number; font: number; icon: number; px: number }> = {
  sm: { height: 36, font: 13, icon: 14, px: 16 },
  md: { height: 44, font: 14, icon: 15, px: 20 },
  lg: { height: 52, font: 15, icon: 17, px: 24 }
};
const FACE_CLASS =
  'relative [grid-area:1/1] inline-flex h-full w-full min-w-0 items-center justify-center gap-2 m-0 border-0 bg-transparent px-[var(--fb-px)] whitespace-nowrap cursor-pointer invisible opacity-0 [filter:blur(2px)] [color:inherit] [font:inherit] [letter-spacing:inherit] [transition:opacity_var(--fb-fade)_ease,filter_var(--fb-fade)_ease,visibility_0s_linear_var(--fb-fade),background-color_160ms_ease] motion-reduce:[filter:none] motion-reduce:[transition:opacity_var(--fb-fade)_ease,visibility_0s_linear_var(--fb-fade)] group-data-[instant]:[transition-duration:0s]';

const props = withDefaults(defineProps<FuseButtonProps>(), {
  label: 'Archive',
  undoLabel: 'Undo',
  doneLabel: 'Archived',
  color: '#f5f5f5',
  background: '#27272a',
  fuseColor: '#f5a524',
  size: 'md',
  radius: 22,
  undoWindow: 4000,
  fuse: 'outline',
  fuseThickness: 1.5,
  crossfadeMs: 200,
  commitOn: 'press',
  pauseOnHover: true,
  settle: 'reset',
  disabled: false,
  className: '',
  type: 'button'
});

const emit = defineEmits<{
  commit: [reason: FuseCommitOn];
  undo: [];
  fuseEnd: [];
  phaseChange: [phase: FusePhase];
}>();

const phase = ref<FusePhase>('idle');
const instant = ref(false);
const rootRef = ref<HTMLSpanElement | null>(null);
const idleRef = ref<HTMLButtonElement | null>(null);
const undoRef = ref<HTMLButtonElement | null>(null);
const lineRef = ref<HTMLElement | null>(null);
const rimRef = ref<SVGRectElement | null>(null);

let anim: Animation | null = null;
const pause = { hover: false, hidden: false, canHoverPause: false };
let lastInput: 'pointer' | 'keyboard' = 'pointer';
let windowMs = props.undoWindow;
const statusId = useId();
const preset = computed(() => SIZES[props.size] || SIZES.md);

const go = (next: FusePhase) => {
  instant.value = lastInput === 'keyboard';
  phase.value = next;
  emit('phaseChange', next);
};

const syncPlayState = () => {
  const a = anim;
  if (!a) return;
  if (pause.hover || pause.hidden) {
    if (a.playState === 'running') a.pause();
  } else if (a.playState === 'paused') {
    a.play();
  }
};

const light = (from = 0) => {
  const el = props.fuse === 'outline' ? rimRef.value : lineRef.value;
  if (!el) return;
  anim?.cancel();
  const a = el.animate(props.fuse === 'outline' ? OUTLINE : LINE, {
    duration: windowMs,
    easing: 'linear',
    fill: 'forwards'
  });
  if (from) a.currentTime = from;
  a.onfinish = () => {
    emit('fuseEnd');
    if (props.commitOn === 'fuseEnd') emit('commit', 'fuseEnd');
    lastInput = 'pointer';
    go(props.settle === 'stay' ? 'settled' : 'idle');
  };
  anim = a;
  syncPlayState();
};

const arm = () => {
  if (props.disabled || phase.value !== 'idle') return;
  windowMs = props.undoWindow;
  light();
  pause.canHoverPause = false;
  pause.hover = false;
  if (props.commitOn === 'press') emit('commit', 'press');
  go('armed');
};

const undo = () => {
  if (phase.value !== 'armed') return;
  const a = anim;
  if (a) {
    a.onfinish = null;
    a.pause();
  }
  emit('undo');
  go('idle');
};

watch(
  phase,
  next => {
    const inside = rootRef.value?.contains(document.activeElement);
    if (next === 'armed') undoRef.value?.focus({ preventScroll: true });
    else if (inside) (next === 'idle' ? idleRef.value : rootRef.value)?.focus({ preventScroll: true });
  },
  { flush: 'post' }
);

const onVisibility = () => {
  pause.hidden = document.hidden;
  syncPlayState();
};
onMounted(() => document.addEventListener('visibilitychange', onVisibility));
onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibility);
  anim?.cancel();
});

watch(
  () => props.fuse,
  () => {
    const a = anim;
    if (!a || phase.value !== 'armed') return;
    light(Number(a.currentTime) || 0);
  },
  { flush: 'post' }
);

watch(
  () => props.pauseOnHover,
  on => {
    if (on) return;
    pause.hover = false;
    syncPlayState();
  }
);

const handlePointerDown = (e: PointerEvent) => {
  lastInput = 'pointer';
  const pressable = phase.value === 'armed' || (phase.value === 'idle' && !props.disabled);
  if (e.button === 0 && pressable && rootRef.value) rootRef.value.dataset.pressed = '';
};
const release = () => {
  if (rootRef.value) delete rootRef.value.dataset.pressed;
};
const handlePointerEnter = (e: PointerEvent) => {
  if (props.pauseOnHover && e.pointerType === 'mouse' && pause.canHoverPause) {
    pause.hover = true;
    syncPlayState();
  }
};
const handlePointerLeave = (e: PointerEvent) => {
  release();
  if (e.pointerType !== 'mouse') return;
  pause.canHoverPause = true;
  pause.hover = false;
  syncPlayState();
};
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') lastInput = 'keyboard';
  if (e.key === 'Escape' && phase.value === 'armed') {
    e.preventDefault();
    lastInput = 'keyboard';
    undo();
  }
};

const rootStyle = computed(
  () =>
    ({
      '--fb-ink': props.color,
      '--fb-bg': props.background,
      '--fb-fuse': props.fuseColor,
      '--fb-fuse-h': `${props.fuseThickness}px`,
      '--fb-radius': `${props.radius}px`,
      '--fb-fade': `${props.crossfadeMs}ms`,
      '--fb-h': `${preset.value.height}px`,
      '--fb-fs': `${preset.value.font}px`,
      '--fb-icon': `${preset.value.icon}px`,
      '--fb-px': `${preset.value.px}px`,
      '--fb-press': 0.97,
      '--fb-ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)'
    }) as CSSProperties
);
</script>

<template>
  <span
    ref="rootRef"
    tabindex="-1"
    class="group relative inline-grid grid-cols-[minmax(0,1fr)] rounded-[var(--fb-radius)] data-[phase=idle]:has-[.fb-idle:disabled]:opacity-[0.55] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-offset-[3px] h-[var(--fb-h)] font-medium leading-none tracking-[0.01em] overflow-hidden outline-none isolate select-none touch-manipulation motion-reduce:data-[pressed]:[transform:none] contrast-more:[box-shadow:inset_0_0_0_1px_color-mix(in_srgb,var(--fb-ink)_40%,transparent)] [font-family:inherit] [font-size:var(--fb-fs)] [background:var(--fb-bg)] [color:var(--fb-ink)] [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent] [transition:transform_160ms_var(--fb-ease-out)] data-[pressed]:[transform:scale(var(--fb-press))] has-[:focus-visible]:[outline-color:color-mix(in_srgb,var(--fb-ink)_60%,transparent)]"
    :class="className"
    :data-phase="phase"
    :data-fuse="fuse"
    :data-instant="instant ? '' : undefined"
    :aria-disabled="phase === 'settled' || undefined"
    :style="rootStyle"
    @pointerdown="handlePointerDown"
    @pointerup="release"
    @pointercancel="release"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
    @keydown="handleKeyDown"
  >
    <button
      ref="idleRef"
      :type="type"
      :class="[
        FACE_CLASS,
        'fb-idle group-data-[phase=idle]:visible group-data-[phase=idle]:opacity-100 group-data-[phase=idle]:[filter:blur(0)] group-data-[phase=idle]:[transition-delay:0s] disabled:cursor-default focus-visible:outline-none [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:[background:color-mix(in_srgb,var(--fb-ink)_7%,transparent)]'
      ]"
      :disabled="disabled"
      :inert="phase !== 'idle'"
      @click="arm"
    >
      <span class="inline-flex w-[var(--fb-icon)] h-[var(--fb-icon)] [&>svg]:w-full [&>svg]:h-full" aria-hidden="true">
        <slot name="icon">
          <HugeiconsIcon :icon="Archive02Icon as IconArray" :size="preset.icon" :stroke-width="1.8" />
        </slot>
      </span>
      {{ label }}
    </button>
    <button
      ref="undoRef"
      type="button"
      :class="[
        FACE_CLASS,
        'group-data-[phase=armed]:visible group-data-[phase=armed]:opacity-100 group-data-[phase=armed]:[filter:blur(0)] group-data-[phase=armed]:[transition-delay:0s] focus-visible:outline-none [@media(hover:hover)_and_(pointer:fine)]:hover:[background:color-mix(in_srgb,var(--fb-ink)_7%,transparent)]'
      ]"
      :aria-describedby="statusId"
      aria-keyshortcuts="Escape"
      :inert="phase !== 'armed'"
      @click="undo"
    >
      <span
        class="inline-flex w-[var(--fb-icon)] h-[var(--fb-icon)] [&>svg]:w-full [&>svg]:h-full [transform:rotate(-70deg)] [transition:transform_var(--fb-fade)_var(--fb-ease-out)] group-data-[phase=armed]:[transform:rotate(0deg)] motion-reduce:transition-none motion-reduce:[transform:none]"
        aria-hidden="true"
      >
        <HugeiconsIcon :icon="Undo02Icon as IconArray" :size="preset.icon" :stroke-width="2" />
      </span>
      {{ undoLabel }}
      <i
        v-if="fuse !== 'outline'"
        ref="lineRef"
        class="inset-x-0 bottom-0 group-data-[fuse=top]:bottom-auto group-data-[fuse=top]:top-0 absolute h-[var(--fb-fuse-h)] origin-left pointer-events-none forced-colors:[background:Highlight] [background:var(--fb-fuse)] [box-shadow:0_0_6px_color-mix(in_srgb,var(--fb-fuse)_55%,transparent)]"
        aria-hidden="true"
      />
    </button>
    <span
      :class="[
        FACE_CLASS,
        'group-data-[phase=settled]:visible group-data-[phase=settled]:opacity-100 group-data-[phase=settled]:[filter:blur(0)] group-data-[phase=settled]:[transition-delay:0s] cursor-default!'
      ]"
      :inert="phase !== 'settled'"
    >
      <span class="inline-flex w-[var(--fb-icon)] h-[var(--fb-icon)] [&>svg]:w-full [&>svg]:h-full" aria-hidden="true">
        <HugeiconsIcon :icon="Tick02Icon as IconArray" :size="preset.icon" :stroke-width="2.2" />
      </span>
      {{ doneLabel }}
    </span>
    <svg
      v-if="fuse === 'outline'"
      class="absolute inset-0 opacity-0 group-data-[phase=armed]:opacity-100 w-full h-full overflow-visible pointer-events-none [filter:drop-shadow(0_0_3px_color-mix(in_srgb,var(--fb-fuse)_60%,transparent))] [transition:opacity_var(--fb-fade)_ease] group-data-[instant]:[transition-duration:0s]"
      aria-hidden="true"
    >
      <rect
        ref="rimRef"
        pathLength="1"
        class="fill-none forced-colors:[stroke:Highlight] [x:calc(var(--fb-fuse-h)/2)] [y:calc(var(--fb-fuse-h)/2)] [width:calc(100%-var(--fb-fuse-h))] [height:calc(100%-var(--fb-fuse-h))] [rx:max(0px,calc(var(--fb-radius)-var(--fb-fuse-h)/2))] [stroke:var(--fb-fuse)] [stroke-width:var(--fb-fuse-h)] [stroke-linecap:round] [stroke-dasharray:1]"
      />
    </svg>
    <span :id="statusId" class="sr-only" role="status" aria-live="polite">
      {{ phase === 'idle' ? '' : doneLabel }}
    </span>
  </span>
</template>
