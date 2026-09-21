<script setup lang="ts">
import {
  CommandLineIcon,
  File02Icon,
  PencilEdit01Icon,
  RefreshIcon,
  Search01Icon,
  Tick02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue';

export type CallChipStatus = 'idle' | 'running' | 'done' | 'error';
export type CallChipIcon = 'terminal' | 'file' | 'search' | 'edit';

interface CallChipProps {
  icon?: CallChipIcon;
  name?: string;
  argument?: string;
  status?: CallChipStatus;
  expectedMs?: number;
  size?: number;
  radius?: number;
  color?: string;
  surfaceColor?: string;
  progressColor?: string;
  progressOpacity?: number;
  doneColor?: string;
  errorColor?: string;
  washOpacity?: number;
  shake?: number;
  showTimer?: boolean;
  className?: string;
}

type Glyph = 'tool' | 'check' | 'retry';

const HOLD_AT = 0.9;
const SHAKE = [0, -1, 1, -0.66, 0.66, -0.33, 0];
const ICONS: Record<CallChipIcon, IconArray> = {
  terminal: CommandLineIcon as IconArray,
  file: File02Icon as IconArray,
  search: Search01Icon as IconArray,
  edit: PencilEdit01Icon as IconArray
};
const WORDS: Record<CallChipStatus, string> = { running: 'running', done: 'done', error: 'failed', idle: 'queued' };
const GLYPH_CLASS =
  'absolute inset-0 grid place-items-center opacity-0 blur-[3px] [transform:translateY(70%)] data-[state=in]:opacity-100 data-[state=in]:blur-none data-[state=in]:[transform:none] data-[state=in]:[transition:opacity_240ms_cubic-bezier(0.23,1,0.32,1),transform_240ms_cubic-bezier(0.23,1,0.32,1),filter_240ms_cubic-bezier(0.23,1,0.32,1)] data-[state=out]:[transform:translateY(-70%)] data-[state=out]:[transition:opacity_160ms_cubic-bezier(0.23,1,0.32,1),transform_160ms_cubic-bezier(0.23,1,0.32,1),filter_160ms_cubic-bezier(0.23,1,0.32,1)] group-data-[status=done]:data-[state=in]:[color:var(--cc-done)] group-data-[status=error]:data-[state=in]:[color:var(--cc-error)] motion-reduce:[transform:none]! motion-reduce:[filter:none]! group-not-data-[mounted]:transition-none!';

const fmt = (ms: number) => (ms < 10000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const glyphOf = (s: CallChipStatus): Glyph => (s === 'done' ? 'check' : s === 'error' ? 'retry' : 'tool');

const props = withDefaults(defineProps<CallChipProps>(), {
  icon: 'terminal',
  name: 'bash',
  argument: 'npm test',
  status: 'running',
  expectedMs: 2500,
  size: 34,
  radius: 10,
  color: 'currentColor',
  surfaceColor: '#27272a',
  progressColor: 'currentColor',
  progressOpacity: 0.08,
  doneColor: '#22c55e',
  errorColor: '#ef4444',
  washOpacity: 0.14,
  shake: 6,
  showTimer: true,
  className: ''
});

const emit = defineEmits<{ retry: [] }>();

const rootRef = ref<HTMLSpanElement | null>(null);
const fillRef = ref<HTMLSpanElement | null>(null);
const timerRef = ref<HTMLSpanElement | null>(null);
const mounted = ref(false);
const pressed = ref(false);
const announce = ref('');
const glyph = computed(() => glyphOf(props.status));
const prevGlyph = ref<Glyph | null>(null);
watch(glyph, (_next, prev) => (prevGlyph.value = prev));

let isMounted = false;
let fraction = 0;
let liveFraction = 0;
const clock = { ms: 0 };
let shakeAnim: Animation | null = null;
let stopTimer: (() => void) | undefined;

const setFraction = (f: number, instant: boolean) => {
  const fill = fillRef.value;
  if (!fill) return;
  fraction = f;
  if (instant) fill.style.transition = 'none';
  fill.style.transform = `scaleX(${f})`;
  if (instant) {
    void fill.getBoundingClientRect();
    fill.style.transition = '';
  }
};
const apply = (s: CallChipStatus, animate: boolean) => {
  if (s === 'running') {
    shakeAnim?.cancel();
    setFraction(0, true);
    if (animate) setFraction(HOLD_AT, false);
  } else if (s === 'done') {
    setFraction(1, !animate);
  } else if (s === 'error') {
    setFraction(Math.min(1, Math.max(0, liveFraction)), true);
    if (animate && props.shake > 0 && !reduceMotion() && rootRef.value) {
      shakeAnim = rootRef.value.animate(
        SHAKE.map(k => ({ transform: `translateX(${k * props.shake}px)`, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' })),
        { duration: 450, composite: 'add' }
      );
    }
  } else setFraction(0, true);
};

const startTimer = (s: CallChipStatus) => {
  stopTimer?.();
  stopTimer = undefined;
  const write = (ms: number) => {
    clock.ms = ms;
    if (timerRef.value) timerRef.value.textContent = fmt(ms);
  };
  if (s !== 'running') {
    if ((s === 'idle' || !clock.ms) && timerRef.value) timerRef.value.textContent = '—';
    return;
  }
  const startedAt = performance.now();
  write(0);
  if (reduceMotion()) {
    const id = setInterval(() => write(performance.now() - startedAt), 100);
    stopTimer = () => {
      clearInterval(id);
      write(performance.now() - startedAt);
    };
    return;
  }
  let raf = 0;
  const tick = () => {
    write(performance.now() - startedAt);
    raf = requestAnimationFrame(tick);
  };
  tick();
  stopTimer = () => {
    cancelAnimationFrame(raf);
    write(performance.now() - startedAt);
  };
};
const updateAnnounce = (s: CallChipStatus) => {
  const ms = props.showTimer && clock.ms ? Math.round(clock.ms) : 0;
  const when = s === 'done' && ms ? ` in ${ms} ms` : s === 'error' && ms ? ` after ${ms} ms` : '';
  announce.value = `${props.name} ${props.argument}, ${WORDS[s] ?? s}${when}`;
};

onMounted(() => {
  isMounted = true;
  mounted.value = true;
  apply(props.status, props.status === 'running');
  startTimer(props.status);
  updateAnnounce(props.status);
});
onUnmounted(() => {
  isMounted = false;
  shakeAnim?.cancel();
  stopTimer?.();
});
watch(
  () => props.status,
  () => {
    const fill = fillRef.value;
    liveFraction = fill ? new DOMMatrix(getComputedStyle(fill).transform).a : fraction;
  },
  { flush: 'pre' }
);
watch(
  () => props.status,
  s => {
    if (isMounted) apply(s, true);
    startTimer(s);
    updateAnnounce(s);
  },
  { flush: 'post' }
);

const font = computed(() => Math.max(11, Math.round(props.size * 0.38)));
const iconSize = computed(() => font.value + 2);
const glyphState = (g: Glyph) => (g === glyph.value ? 'in' : g === prevGlyph.value ? 'out' : undefined);

const rootStyle = computed(
  () =>
    ({
      '--cc-size': `${props.size}px`,
      '--cc-font': `${font.value}px`,
      '--cc-pad': `${Math.round(props.size * 0.35)}px`,
      '--cc-gap': `${Math.round(font.value * 0.55)}px`,
      '--cc-radius': `${props.radius}px`,
      '--cc-color': props.color,
      '--cc-surface': props.surfaceColor,
      '--cc-progress': props.progressColor,
      '--cc-progress-pct': `${props.progressOpacity * 100}%`,
      '--cc-done': props.doneColor,
      '--cc-error': props.errorColor,
      '--cc-wash-pct': `${props.washOpacity * 100}%`,
      '--cc-expected': `${props.expectedMs}ms`
    }) as CSSProperties
);
</script>

<template>
  <span
    ref="rootRef"
    role="status"
    :aria-busy="status === 'running' || undefined"
    :data-status="status"
    :data-mounted="mounted ? '' : undefined"
    :data-pressed="pressed ? '' : undefined"
    class="group inline-flex box-border relative items-center overflow-hidden leading-none whitespace-nowrap data-[pressed]:[transform:scale(0.97)] motion-reduce:data-[pressed]:[transform:none] [-webkit-touch-callout:none] data-[status=error]:cursor-pointer select-none [height:var(--cc-size)] [padding:0_var(--cc-pad)] [gap:var(--cc-gap)] [border-radius:var(--cc-radius)] [background:var(--cc-surface)] [color:var(--cc-color)] [font-size:var(--cc-font)] [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1)]"
    :class="className"
    :style="rootStyle"
  >
    <span
      ref="fillRef"
      class="absolute inset-0 origin-left group-not-data-[mounted]:transition-none! pointer-events-none [transform:scaleX(0)] [clip-path:inset(0_0_0_0)] [background:color-mix(in_srgb,var(--cc-progress)_var(--cc-progress-pct),transparent)] group-data-[status=running]:[transition:transform_var(--cc-expected)_linear] group-data-[status=done]:[clip-path:inset(100%_0_0_0)] group-data-[status=done]:[background:color-mix(in_srgb,var(--cc-done)_var(--cc-wash-pct),transparent)] group-data-[status=done]:[transition:transform_200ms_cubic-bezier(0.23,1,0.32,1),background-color_120ms_ease,clip-path_400ms_cubic-bezier(0.23,1,0.32,1)_200ms] group-data-[status=error]:[background:color-mix(in_srgb,var(--cc-error)_var(--cc-wash-pct),transparent)] group-data-[status=error]:[transition:background-color_200ms_ease] motion-reduce:group-data-[status=done]:[clip-path:inset(0_0_0_0)] motion-reduce:group-data-[status=done]:[transition:background-color_120ms_ease]"
      aria-hidden="true"
    />
    <span
      class="relative flex-none overflow-hidden [width:calc(var(--cc-font)+2px)] [height:calc(var(--cc-font)+2px)]"
      aria-hidden="true"
    >
      <span :class="GLYPH_CLASS" :data-state="glyphState('tool')">
        <slot name="icon">
          <HugeiconsIcon :icon="ICONS[icon] ?? ICONS.terminal" :size="iconSize" :stroke-width="1.8" />
        </slot>
      </span>
      <span :class="GLYPH_CLASS" :data-state="glyphState('check')">
        <HugeiconsIcon :icon="Tick02Icon as IconArray" :size="iconSize" :stroke-width="2.2" />
      </span>
      <span :class="GLYPH_CLASS" :data-state="glyphState('retry')">
        <HugeiconsIcon :icon="RefreshIcon as IconArray" :size="iconSize" :stroke-width="2" />
      </span>
    </span>
    <span class="relative font-medium" aria-hidden="true">{{ name }}</span>
    <span class="relative opacity-[0.72]" aria-hidden="true">{{ argument }}</span>
    <span
      v-if="showTimer"
      ref="timerRef"
      class="relative opacity-50 min-w-[6ch] tabular-nums text-right"
      aria-hidden="true"
    >
      0 ms
    </span>
    <button
      v-if="status === 'error'"
      type="button"
      class="absolute -inset-[5px] bg-transparent m-0 p-0 border-0 outline-none appearance-none touch-manipulation cursor-pointer [border-radius:var(--cc-radius)] [-webkit-tap-highlight-color:transparent]"
      :aria-label="`Retry ${name} ${argument}`"
      @click="emit('retry')"
      @pointerdown="pressed = true"
      @pointerup="pressed = false"
      @pointercancel="pressed = false"
    />
    <span class="sr-only">{{ announce }}</span>
  </span>
</template>
