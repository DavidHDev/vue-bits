<script setup lang="ts">
import { animate, motionValue, useReducedMotion } from 'motion-v';
import { computed, onMounted, onUnmounted, ref, useId, watch, type CSSProperties } from 'vue';

export type ScrubFieldSize = 'sm' | 'md' | 'lg';

interface ScrubFieldProps {
  label?: string;
  suffix?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: ScrubFieldSize;
  sensitivity?: number;
  rubberReach?: number;
  returnDuration?: number;
  coarseMultiplier?: number;
  fineMultiplier?: number;
  showDelta?: boolean;
  showDirty?: boolean;
  showFill?: boolean;
  accent?: string;
  chipColor?: string;
  disabled?: boolean;
  className?: string;
}

interface DragState {
  id: number;
  x: number;
  raw: number;
  mult: number;
  moved: boolean;
  before: number;
  slack: number;
  left: number;
}

type Modifiers = { shiftKey: boolean; altKey: boolean };

const SPRING_UI = { type: 'spring' as const, duration: 0.3, bounce: 0 };
const LEAN = 4;
const SIZES: Record<ScrubFieldSize, { height: number; font: number; radius: number; width: number }> = {
  sm: { height: 28, font: 12, radius: 6, width: 104 },
  md: { height: 34, font: 13, radius: 8, width: 128 },
  lg: { height: 44, font: 16, radius: 10, width: 160 }
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const decimalsOf = (n: number) => {
  const s = String(n);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
};
const onColor = (hex: string) => {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? [...raw].map(ch => ch + ch).join('') : raw.slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return '#ffffff';
  const yiq = (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
  return yiq >= 128 ? '#111111' : '#ffffff';
};

const props = withDefaults(defineProps<ScrubFieldProps>(), {
  label: 'Radius',
  suffix: 'px',
  value: undefined,
  defaultValue: 24,
  min: 0,
  max: 100,
  step: 1,
  size: 'md',
  sensitivity: 2,
  rubberReach: 8,
  returnDuration: 300,
  coarseMultiplier: 10,
  fineMultiplier: 0.1,
  showDelta: true,
  showDirty: false,
  showFill: true,
  accent: '#f5f5f5',
  chipColor: '#27272a',
  disabled: false,
  className: ''
});

const emit = defineEmits<{ change: [value: number]; commit: [value: number] }>();

const id = useId();
const reduce = useReducedMotion();
const controlled = computed(() => props.value !== undefined);
const value = ref<number>(props.value !== undefined ? props.value : props.defaultValue);
const dragging = ref(false);
const draft = ref<string | null>(null);
const display = motionValue(value.value);
const chipRef = ref<HTMLDivElement | null>(null);
const fillRef = ref<HTMLSpanElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const ghostRef = ref<HTMLSpanElement | null>(null);
let drag: DragState | null = null;
let valueNow = value.value;
let typing = false;
let moved = false;
let escListener: ((e: KeyboardEvent) => void) | null = null;
let offDisplay: (() => void) | undefined;

const baseDecimals = computed(() => decimalsOf(props.step));
const fineDecimals = computed(() => Math.min(6, baseDecimals.value + decimalsOf(props.fineMultiplier)));
const preset = computed(() => SIZES[props.size] || SIZES.md);

const fmt = (v: number) => {
  const scaled = v * 10 ** baseDecimals.value;
  return v.toFixed(Math.abs(scaled - Math.round(scaled)) < 1e-6 ? baseDecimals.value : fineDecimals.value);
};
const signed = (d: number) => (d < 0 ? '−' : '+') + fmt(Math.abs(d));

const reach = () => (props.rubberReach / 100) * Math.max(props.max - props.min, Number.EPSILON);
const bend = (raw: number) => {
  const r = reach();
  return r ? Math.sign(raw) * r * Math.log1p(Math.abs(raw) / r) : 0;
};
const unbend = (over: number) => {
  const r = reach();
  return r ? Math.sign(over) * r * Math.expm1(Math.abs(over) / r) : 0;
};
const toShown = (raw: number) => {
  const c = clamp(raw, props.min, props.max);
  return c + bend(raw - c);
};
const toRaw = (shown: number) => {
  const c = clamp(shown, props.min, props.max);
  return c + unbend(shown - c);
};
const multiplierOf = (e: Modifiers) => (e.shiftKey ? props.coarseMultiplier : e.altKey ? props.fineMultiplier : 1);

const commit = (next: number) => {
  const rounded = clamp(Number(next.toFixed(fineDecimals.value)), props.min, props.max);
  if (rounded === valueNow) return;
  valueNow = rounded;
  value.value = rounded;
  emit('change', rounded);
};

// the number, the lean and the fill follow the motion value by hand so a drag never waits on a render
const paint = (d: number) => {
  if (!typing && inputRef.value) inputRef.value.value = fmt(d);
  const chip = chipRef.value;
  if (chip) {
    chip.dataset.over = d < props.min || d > props.max ? 'true' : 'false';
    const r = reach();
    const lean = reduce.value || !r ? 0 : clamp((d - clamp(d, props.min, props.max)) / r, -1, 1) * LEAN;
    chip.style.transform = lean ? `translateX(${lean}px)` : '';
  }
  if (fillRef.value) {
    const k = (clamp(d, props.min, props.max) - props.min) / Math.max(props.max - props.min, Number.EPSILON);
    fillRef.value.style.transform = `scaleX(${k})`;
  }
};

const adopt = (next: number) => {
  valueNow = next;
  value.value = next;
  display.jump(next);
  if (!typing && inputRef.value) inputRef.value.value = fmt(next);
};

onMounted(() => {
  offDisplay = display.on('change', paint);
  paint(display.get());
});
watch(
  () => [props.min, props.max, props.rubberReach, props.showFill],
  () => paint(display.get()),
  { flush: 'post' }
);
watch(
  () => props.value,
  v => {
    if (controlled.value && !drag && v !== valueNow) adopt(clamp(v as number, props.min, props.max));
  }
);
watch(
  () => props.defaultValue,
  v => {
    if (!controlled.value && !drag) adopt(clamp(v, props.min, props.max));
  }
);
watch([baseDecimals, fineDecimals], () => {
  if (!typing && inputRef.value) inputRef.value.value = fmt(valueNow);
});

const handlePointerDown = (e: PointerEvent) => {
  if (props.disabled || drag || e.button !== 0 || typing) return;
  if (e.pointerType !== 'touch') e.preventDefault();
  display.stop();
  moved = false;
  drag = {
    id: e.pointerId,
    x: e.clientX,
    raw: toRaw(display.get()),
    mult: multiplierOf(e),
    moved: false,
    before: valueNow,
    slack: e.pointerType === 'touch' ? 8 : 3,
    left: chipRef.value ? chipRef.value.getBoundingClientRect().left : 0
  };
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  escListener = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') end(true);
  };
  window.addEventListener('keydown', escListener);
};

const handlePointerMove = (e: PointerEvent) => {
  const g = drag;
  if (!g || e.pointerId !== g.id) return;
  if (!g.moved) {
    if (Math.abs(e.clientX - g.x) < g.slack) return;
    g.moved = true;
    moved = true;
    g.x = e.clientX;
    dragging.value = true;
    document.documentElement.style.cursor = 'ew-resize';
  }
  const m = multiplierOf(e);
  if (m !== g.mult) {
    g.mult = m;
    g.raw = toRaw(display.get());
    g.x = e.clientX;
  }
  const raw = g.raw + Math.round((e.clientX - g.x) / props.sensitivity) * props.step * m;
  const shown = toShown(raw);
  display.set(shown);
  commit(clamp(raw, props.min, props.max));
  if (ghostRef.value) {
    ghostRef.value.style.translate = `calc(${e.clientX - g.left}px - 50%) -100%`;
    ghostRef.value.textContent = signed(shown - g.before);
  }
};

function end(cancel = false) {
  const g = drag;
  if (!g) return;
  drag = null;
  dragging.value = false;
  document.documentElement.style.cursor = '';
  if (escListener) {
    window.removeEventListener('keydown', escListener);
    escListener = null;
  }
  if (cancel) {
    commit(g.before);
    display.jump(g.before);
    return;
  }
  if (!g.moved) {
    inputRef.value?.focus();
    return;
  }
  const bound = clamp(display.get(), props.min, props.max);
  if (display.get() !== bound) {
    if (reduce.value) display.jump(bound);
    else animate(display, bound, { ...SPRING_UI, duration: props.returnDuration / 1000 });
  }
  if (g.moved && valueNow !== g.before) emit('commit', valueNow);
}

const leaveTyping = () => {
  typing = false;
  draft.value = null;
  if (inputRef.value) inputRef.value.value = fmt(valueNow);
};

const handleKeyDown = (e: KeyboardEvent) => {
  const typedNumber = draft.value !== null && draft.value.trim() !== '' ? Number(draft.value) : NaN;
  const from = Number.isNaN(typedNumber) ? valueNow : typedNumber;
  const deltas: Record<string, number> = {
    ArrowUp: props.step * multiplierOf(e),
    ArrowDown: -props.step * multiplierOf(e),
    PageUp: props.step * props.coarseMultiplier,
    PageDown: -props.step * props.coarseMultiplier
  };
  const delta = deltas[e.key];
  if (delta !== undefined || e.key === 'Home' || e.key === 'End') {
    e.preventDefault();
    leaveTyping();
    commit(delta !== undefined ? from + delta : e.key === 'Home' ? props.min : props.max);
    display.jump(valueNow);
    if (inputRef.value) inputRef.value.value = fmt(valueNow);
    emit('commit', valueNow);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    (e.currentTarget as HTMLInputElement).blur();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    leaveTyping();
    (e.currentTarget as HTMLInputElement).blur();
  }
};

const handleFocus = (e: FocusEvent) => {
  typing = true;
  const input = e.target as HTMLInputElement;
  draft.value = input.value;
  input.select();
};

const handleBlur = () => {
  const n = draft.value === null ? NaN : parseFloat(draft.value.replace(/[^\d.-]/g, ''));
  if (!Number.isNaN(n)) {
    commit(n);
    emit('commit', valueNow);
  }
  leaveTyping();
  display.jump(valueNow);
};

const onLabelClick = (e: MouseEvent) => {
  if (moved) e.preventDefault();
};

onUnmounted(() => {
  offDisplay?.();
  display.stop();
  document.documentElement.style.cursor = '';
  if (escListener) window.removeEventListener('keydown', escListener);
});

const dirty = computed(() => props.showDirty && value.value !== props.defaultValue);

const rootStyle = computed(
  () =>
    ({
      '--sf-accent': props.accent,
      '--sf-chip': props.chipColor,
      '--sf-ghost-ink': onColor(props.accent),
      '--sf-h': `${preset.value.height}px`,
      '--sf-fs': `${preset.value.font}px`,
      '--sf-r': `${preset.value.radius}px`,
      '--sf-w': `${preset.value.width}px`,
      '--sf-ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)'
    }) as CSSProperties
);

onMounted(() => {
  if (inputRef.value) inputRef.value.value = fmt(value.value);
});
</script>

<template>
  <div
    ref="chipRef"
    class="group inline-flex isolate relative items-center gap-1 data-[disabled=true]:opacity-50 pr-2 pl-1 rounded-[var(--sf-r)] w-[var(--sf-w)] h-[var(--sf-h)] leading-none [-webkit-touch-callout:none] touch-pan-y cursor-ew-resize data-[disabled=true]:cursor-default data-[typing=true]:cursor-text select-none data-[dirty=true]:[transition-duration:0ms] [font-family:inherit] [font-size:var(--sf-fs)] [background:var(--sf-chip)] [box-shadow:0_0_0_1px_transparent] [-webkit-tap-highlight-color:transparent] [transition:background-color_200ms_ease,box-shadow_200ms_ease] data-[dirty=true]:[box-shadow:0_0_0_1px_color-mix(in_srgb,var(--sf-accent)_55%,transparent)] data-[typing=true]:[background:color-mix(in_srgb,currentColor_7%,var(--sf-chip))]"
    :class="className"
    :data-dirty="dirty ? 'true' : 'false'"
    :data-dragging="dragging ? 'true' : 'false'"
    :data-typing="draft !== null ? 'true' : 'false'"
    :data-disabled="disabled ? 'true' : 'false'"
    :aria-disabled="disabled || undefined"
    :style="rootStyle"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="end()"
    @pointercancel="end(true)"
    @lostpointercapture="end()"
  >
    <span
      v-if="showFill"
      class="-z-10 absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <span
        ref="fillRef"
        class="absolute inset-0 origin-left [background:color-mix(in_srgb,var(--sf-accent)_16%,transparent)]"
      />
    </span>
    <label
      :for="id"
      class="inline-flex items-center px-1.5 rounded-[calc(var(--sf-r)-2px)] h-full font-medium whitespace-nowrap [transition:color_120ms_ease,transform_160ms_var(--sf-ease-out)] cursor-[inherit] motion-reduce:[transition:color_120ms_ease] [color:color-mix(in_srgb,currentColor_55%,transparent)] [@media(hover:hover)_and_(pointer:fine)]:group-data-[disabled=false]:group-hover:[color:color-mix(in_srgb,currentColor_85%,transparent)] group-data-[disabled=false]:group-data-[typing=false]:group-active:[transform:scale(0.96)] group-data-[disabled=false]:group-data-[typing=false]:group-active:[color:currentColor] group-data-[dragging=true]:[transform:scale(0.96)] group-data-[dragging=true]:[color:currentColor] motion-reduce:group-data-[dragging=true]:[transform:none] motion-reduce:group-data-[disabled=false]:group-data-[typing=false]:group-active:[transform:none]"
      @click="onLabelClick"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      ref="inputRef"
      class="flex-1 bg-transparent m-0 p-0 border-0 outline-0 w-full min-w-0 font-medium tabular-nums text-right cursor-[inherit] group-data-[typing=true]:cursor-text [color:inherit] [font-family:inherit] [font-size:inherit] [transition:color_120ms_ease] group-data-[over=true]:[color:color-mix(in_srgb,currentColor_55%,transparent)]"
      type="text"
      inputmode="decimal"
      role="spinbutton"
      :aria-valuenow="value"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuetext="`${fmt(value)}${suffix ? ` ${suffix}` : ''}`"
      :disabled="disabled"
      @focus="handleFocus"
      @input="draft = ($event.target as HTMLInputElement).value"
      @keydown="handleKeyDown"
      @blur="handleBlur"
    />
    <span v-if="suffix" class="font-medium [color:color-mix(in_srgb,currentColor_45%,transparent)]" aria-hidden="true">
      {{ suffix }}
    </span>
    <span
      v-if="showDelta"
      ref="ghostRef"
      class="-top-1.5 left-0 absolute opacity-0 group-data-[dragging=true]:opacity-100 px-1.5 py-0.5 rounded-full font-semibold tabular-nums text-[11px] leading-[1.4] whitespace-nowrap origin-bottom [transition:opacity_125ms_var(--sf-ease-out),scale_125ms_var(--sf-ease-out)] pointer-events-none motion-reduce:[scale:1] [color:var(--sf-ghost-ink)] [translate:0_-100%] [scale:0.95] [background:var(--sf-accent)] group-data-[dragging=true]:[scale:1] motion-reduce:[transition:opacity_200ms_ease]"
      aria-hidden="true"
    />
  </div>
</template>
