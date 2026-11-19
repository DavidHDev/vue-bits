<script lang="ts">
import { cloneVNode, h, isVNode, type Component, type CSSProperties, type VNode, type VNodeChild } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { VolumeHighIcon, VolumeLowIcon } from '@hugeicons/core-free-icons';

export type ElasticSliderNode = VNode | Component | null;

export interface ElasticSliderProps {
  value?: number;
  defaultValue?: number;
  startingValue?: number;
  maxValue?: number;
  isStepped?: boolean;
  stepSize?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  orientation?: 'horizontal' | 'vertical';
  leftIcon?: ElasticSliderNode;
  rightIcon?: ElasticSliderNode;
  iconPlacement?: 'outside' | 'inside';
  valuePosition?: 'top' | 'bubble' | 'inside' | 'none';
  formatValue?: (value: number) => string;
  ticks?: boolean | number[];
  thumb?: boolean;
  fillFrom?: number;
  thickness?: number;
  activeThickness?: number;
  radius?: number;
  restOpacity?: number;
  growOnHover?: boolean;
  maxStretch?: number;
  bounce?: number;
  jumpToClick?: boolean;
  wheel?: boolean;
  trackColor?: string;
  rangeColor?: string;
  iconColor?: string;
  contentColor?: string;
  fillContentColor?: string;
  thumbColor?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const DefaultLeftIcon = () => h(HugeiconsIcon, { icon: VolumeLowIcon, size: 20, strokeWidth: 1.75 });
const DefaultRightIcon = () => h(HugeiconsIcon, { icon: VolumeHighIcon, size: 20, strokeWidth: 1.75 });

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true) return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return cloneVNode(node);
  return h(node as Component);
};

const ElasticSliderNodeView = (props: { node?: unknown }) => renderNode(props.node);
ElasticSliderNodeView.props = ['node'];
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, useSlots, watch } from 'vue';

const ROOT = 'elastic-slider';
const VALUE = 'elastic-slider__value';
const BODY = 'elastic-slider__body';
const ICON = 'elastic-slider__icon';
const ICON_INNER = 'elastic-slider__icon-inner';
const HIT = 'elastic-slider__hit';
const TRACK = 'elastic-slider__track';
const RANGE = 'elastic-slider__range';
const CONTENT = 'elastic-slider__content';
const FILL_CONTENT = 'elastic-slider__content elastic-slider__content--fill';
const TICK = 'elastic-slider__tick';
const FILL_TICK = 'elastic-slider__tick elastic-slider__tick--fill';
const THUMB = 'elastic-slider__thumb';
const BUBBLE = 'elastic-slider__bubble';
const BUBBLE_TEXT = 'elastic-slider__bubble-text';

const TAU = Math.PI * 2;
const VALUE_POSITIONS = ['top', 'bubble', 'inside', 'none'];
const DARK_INK = 'rgba(17, 17, 17, 0.86)';
const LIGHT_INK = 'rgba(255, 255, 255, 0.94)';

interface Motion {
  p: number;
  vp: number;
  target: number;
  s: number;
  vs: number;
  side: number;
  held: boolean;
  a: number;
  va: number;
  goal: number;
  length: number;
  dragging: boolean;
  hovered: boolean;
  focused: boolean;
  raf: number;
  last: number;
  ready: boolean;
}

interface Drag {
  id: number;
  origin: number;
  from: number | null;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const decimalsOf = (step: number) => {
  const text = String(step);
  return text.includes('.') ? text.split('.')[1].length : 0;
};

const rubber = (distance: number, limit: number) =>
  limit > 0 ? 2 * (1 / (1 + Math.exp(-distance / limit)) - 0.5) * limit : 0;

const prefersReduced = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

let probe: CanvasRenderingContext2D | null = null;

const readColor = (text: string): number[] | null => {
  const match = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(text);
  if (match)
    return [Number(match[1]), Number(match[2]), Number(match[3]), match[4] === undefined ? 1 : Number(match[4])];
  if (typeof document === 'undefined') return null;
  if (!probe) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    probe = canvas.getContext('2d', { willReadFrequently: true });
  }
  if (!probe) return null;
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = '#000000';
  probe.fillStyle = text;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
};

const props = withDefaults(defineProps<ElasticSliderProps>(), {
  value: undefined,
  defaultValue: 50,
  startingValue: 0,
  maxValue: 100,
  isStepped: false,
  stepSize: 1,
  onChange: undefined,
  onChangeEnd: undefined,
  orientation: 'horizontal',
  leftIcon: DefaultLeftIcon,
  rightIcon: DefaultRightIcon,
  iconPlacement: 'outside',
  valuePosition: 'top',
  formatValue: undefined,
  ticks: false,
  thumb: false,
  fillFrom: undefined,
  thickness: 6,
  activeThickness: 12,
  radius: undefined,
  restOpacity: 0.7,
  growOnHover: true,
  maxStretch: 50,
  bounce: 0.5,
  jumpToClick: true,
  wheel: false,
  trackColor: 'color-mix(in srgb, currentColor 18%, transparent)',
  rangeColor: 'currentColor',
  iconColor: 'currentColor',
  contentColor: 'currentColor',
  fillContentColor: 'auto',
  thumbColor: '#ffffff',
  disabled: false,
  ariaLabel: 'Slider',
  className: '',
  style: undefined
});

const slots = useSlots();

const rootRef = ref<HTMLDivElement | null>(null);
const hitRef = ref<HTMLDivElement | null>(null);
const bodyRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const rangeRef = ref<HTMLDivElement | null>(null);
const thumbRef = ref<HTMLSpanElement | null>(null);
const bubbleRef = ref<HTMLSpanElement | null>(null);
const startIconRef = ref<HTMLSpanElement | null>(null);
const endIconRef = ref<HTMLSpanElement | null>(null);

const motion: Motion = {
  p: 0,
  vp: 0,
  target: 0,
  s: 0,
  vs: 0,
  side: 1,
  held: false,
  a: 0,
  va: 0,
  goal: 0,
  length: 0,
  dragging: false,
  hovered: false,
  focused: false,
  raf: 0,
  last: 0,
  ready: false
};
let drag: Drag | null = null;

const lo = computed(() => Math.min(props.startingValue, props.maxValue));
const hi = computed(() => Math.max(props.startingValue, props.maxValue));
const span = computed(() => hi.value - lo.value || 1);
const step = computed(() => (props.isStepped && props.stepSize > 0 ? props.stepSize : 0));
const vertical = computed(() => props.orientation === 'vertical');
const controlled = computed(() => props.value !== undefined);
const inner = ref(props.defaultValue);
const current = computed(() => clamp(controlled.value ? (props.value as number) : inner.value, lo.value, hi.value));
let currentValue = current.value;

const settings = computed(() => ({
  lo: lo.value,
  hi: hi.value,
  span: span.value,
  step: step.value,
  vertical: vertical.value,
  origin: clamp(((props.fillFrom ?? lo.value) - lo.value) / span.value, 0, 1),
  thickness: Math.max(1, props.thickness),
  activeThickness: Math.max(1, props.activeThickness),
  radius: props.radius,
  restOpacity: clamp(props.restOpacity, 0, 1),
  growOnHover: props.growOnHover,
  maxStretch: Math.max(0, props.maxStretch),
  bounce: clamp(props.bounce, 0, 0.95),
  jumpToClick: props.jumpToClick,
  controlled: controlled.value,
  onChange: props.onChange,
  onChangeEnd: props.onChangeEnd
}));

const snap = (raw: number) => {
  const s = settings.value;
  let next = clamp(raw, s.lo, s.hi);
  if (s.step) next = clamp(s.lo + Math.round((next - s.lo) / s.step) * s.step, s.lo, s.hi);
  return Number(next.toFixed(10));
};

const paint = () => {
  const m = motion;
  const s = settings.value;
  const track = trackRef.value;
  const range = rangeRef.value;
  if (!track || !range) return;
  const thick = s.thickness + (s.activeThickness - s.thickness) * m.a;
  track.style.width = s.vertical ? `${thick.toFixed(2)}px` : '';
  track.style.height = s.vertical ? '' : `${thick.toFixed(2)}px`;
  track.style.setProperty('--elastic-slider-reveal', clamp((thick - 14) / 10, 0, 1).toFixed(3));
  const length = Math.max(1, m.length);
  const along = 1 + m.s / length;
  const across = 1 - 0.22 * clamp(m.s / Math.max(1, s.maxStretch), -1, 1);
  const atEnd = m.side > 0;
  track.style.transformOrigin = s.vertical ? (atEnd ? '50% 100%' : '50% 0%') : atEnd ? '0% 50%' : '100% 50%';
  const scaleX = s.vertical ? across : along;
  const scaleY = s.vertical ? along : across;
  track.style.transform = `scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
  track.style.setProperty('--elastic-slider-unscale', `scale(${(1 / scaleX).toFixed(4)}, ${(1 / scaleY).toFixed(4)})`);
  const p = clamp(m.p, 0, 1);
  const from = (Math.min(s.origin, p) * 100).toFixed(3);
  const to = ((1 - Math.max(s.origin, p)) * 100).toFixed(3);
  const round = (s.radius ?? thick / 2).toFixed(2);
  range.style.clipPath = s.vertical
    ? `inset(${to}% 0 ${from}% 0 round ${round}px)`
    : `inset(0 ${to}% 0 ${from}% round ${round}px)`;
  const position = atEnd ? p * length * along : length - (1 - p) * length * along;
  const shift = s.vertical
    ? `translate3d(0, ${(-position).toFixed(2)}px, 0)`
    : `translate3d(${position.toFixed(2)}px, 0, 0)`;
  if (thumbRef.value) thumbRef.value.style.transform = `${shift} scale(${(1 + 0.12 * m.a).toFixed(3)})`;
  if (bubbleRef.value) {
    const center = s.vertical ? 'translate(0, 50%)' : 'translate(-50%, 0)';
    bubbleRef.value.style.transform = `${shift} ${center} scale(${(0.7 + 0.3 * m.a).toFixed(3)})`;
    bubbleRef.value.style.opacity = clamp(m.a * 1.4 - 0.2, 0, 1).toFixed(3);
  }
  const startShift = atEnd ? 0 : m.s;
  const endShift = atEnd ? m.s : 0;
  const iconScale = (1 + 0.08 * m.a).toFixed(3);
  if (startIconRef.value) {
    startIconRef.value.style.transform = s.vertical
      ? `translate3d(0, ${startShift.toFixed(2)}px, 0) scale(${iconScale})`
      : `translate3d(${(-startShift).toFixed(2)}px, 0, 0) scale(${iconScale})`;
  }
  if (endIconRef.value) {
    endIconRef.value.style.transform = s.vertical
      ? `translate3d(0, ${(-endShift).toFixed(2)}px, 0) scale(${iconScale})`
      : `translate3d(${endShift.toFixed(2)}px, 0, 0) scale(${iconScale})`;
  }
  if (bodyRef.value) {
    bodyRef.value.style.opacity = s.restOpacity < 1 ? (s.restOpacity + (1 - s.restOpacity) * m.a).toFixed(3) : '';
  }
};

const frame = (now: number) => {
  const m = motion;
  m.raf = 0;
  const s = settings.value;
  const elapsed = clamp((now - m.last) / 1000, 0, 1 / 20);
  m.last = now;
  if (prefersReduced()) {
    m.p = m.target;
    m.vp = 0;
    if (!m.held) {
      m.s = 0;
      m.vs = 0;
    }
    m.a = m.goal;
    m.va = 0;
  } else {
    const steps = Math.max(1, Math.ceil(elapsed / (1 / 240)));
    const dt = elapsed / steps;
    const fillOmega = TAU / (m.dragging ? 0.09 : 0.3);
    const fillZeta = m.dragging ? 1 : 0.86;
    const stretchOmega = TAU / 0.42;
    const stretchZeta = 1 - 0.9 * s.bounce;
    const activeOmega = TAU / 0.32;
    for (let i = 0; i < steps; i++) {
      m.vp += (-fillOmega * fillOmega * (m.p - m.target) - 2 * fillZeta * fillOmega * m.vp) * dt;
      m.p += m.vp * dt;
      if (!m.held) {
        m.vs += (-stretchOmega * stretchOmega * m.s - 2 * stretchZeta * stretchOmega * m.vs) * dt;
        m.s += m.vs * dt;
      }
      m.va += (-activeOmega * activeOmega * (m.a - m.goal) - 2 * 0.9 * activeOmega * m.va) * dt;
      m.a += m.va * dt;
    }
  }
  const settled =
    Math.abs(m.p - m.target) < 0.0004 &&
    Math.abs(m.vp) < 0.002 &&
    (m.held || (Math.abs(m.s) < 0.05 && Math.abs(m.vs) < 0.5)) &&
    Math.abs(m.a - m.goal) < 0.002 &&
    Math.abs(m.va) < 0.005;
  if (settled) {
    m.p = m.target;
    m.vp = 0;
    m.a = m.goal;
    m.va = 0;
    if (!m.held) {
      m.s = 0;
      m.vs = 0;
    }
  }
  paint();
  if (!settled || m.dragging) m.raf = requestAnimationFrame(frame);
};

const kick = () => {
  const m = motion;
  if (m.raf || typeof window === 'undefined') return;
  m.last = performance.now();
  m.raf = requestAnimationFrame(frame);
};

const autoInk = () => {
  const root = rootRef.value;
  const range = rangeRef.value;
  if (!root || !range || props.fillContentColor !== 'auto') return;
  const color = readColor(getComputedStyle(range).backgroundColor);
  const ink =
    !color || color[3] < 0.5
      ? 'var(--elastic-slider-content)'
      : (0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]) / 255 > 0.55
        ? DARK_INK
        : LIGHT_INK;
  root.style.setProperty('--elastic-slider-fill-content', ink);
};

const refreshGoal = () => {
  const m = motion;
  m.goal = (m.hovered && settings.value.growOnHover) || m.dragging || m.focused ? 1 : 0;
  kick();
};

const pulse = (side: number) => {
  const icon = (side > 0 ? endIconRef : startIconRef).value?.firstElementChild;
  if (!icon || prefersReduced()) return;
  icon.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], {
    duration: 280,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
  });
};

const bump = (side: number) => {
  const m = motion;
  const s = settings.value;
  if (!s.maxStretch || m.held || Math.abs(m.vs) > 40 || Math.abs(m.s) > 2) return;
  m.side = side;
  m.vs = s.maxStretch * 5.5;
  pulse(side);
  kick();
};

const commit = (next: number) => {
  const s = settings.value;
  motion.target = (next - s.lo) / s.span;
  kick();
  if (next === currentValue) return;
  currentValue = next;
  if (!s.controlled) inner.value = next;
  s.onChange?.(next);
};

const syncCurrent = () => {
  const m = motion;
  currentValue = current.value;
  const fraction = (current.value - lo.value) / span.value;
  if (!m.dragging) m.target = fraction;
  if (!m.ready) {
    m.ready = true;
    m.p = fraction;
    paint();
    return;
  }
  kick();
};

const sync = () => {
  autoInk();
  paint();
};

let observer: ResizeObserver | null = null;

const observe = () => {
  observer?.disconnect();
  observer = null;
  const hit = hitRef.value;
  if (!hit) return;
  const measure = () => {
    motion.length = settings.value.vertical ? hit.clientHeight : hit.clientWidth;
    paint();
  };
  measure();
  if (typeof ResizeObserver === 'undefined') return;
  observer = new ResizeObserver(measure);
  observer.observe(hit);
};

let unbindWheel: (() => void) | null = null;

const bindWheel = () => {
  unbindWheel?.();
  unbindWheel = null;
  const hit = hitRef.value;
  if (!hit || !props.wheel || props.disabled) return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const s = settings.value;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? -event.deltaY : event.deltaX;
    if (!delta) return;
    const amount = s.step ? Math.sign(delta) * s.step : (delta * s.span) / 800;
    const next = snap(currentValue + amount);
    if (next === currentValue) {
      bump(Math.sign(delta));
      return;
    }
    commit(next);
    clearTimeout(timer);
    timer = setTimeout(() => settings.value.onChangeEnd?.(currentValue), 200);
  };
  hit.addEventListener('wheel', onWheel, { passive: false });
  unbindWheel = () => {
    clearTimeout(timer);
    hit.removeEventListener('wheel', onWheel);
  };
};

onMounted(() => {
  syncCurrent();
  observe();
  sync();
  refreshGoal();
  bindWheel();
});

watch([current, lo, span], syncCurrent, { flush: 'post' });
watch(vertical, observe, { flush: 'post' });
watch(() => props.growOnHover, refreshGoal);
watch([() => props.wheel, () => props.disabled], bindWheel, { flush: 'post' });
watch(settings, sync, { flush: 'post' });
watch(() => [props.fillContentColor, props.rangeColor, props.trackColor, props.contentColor, props.style], sync, {
  flush: 'post',
  deep: true
});
onUpdated(sync);

onBeforeUnmount(() => {
  cancelAnimationFrame(motion.raf);
  observer?.disconnect();
  unbindWheel?.();
});

const along = (event: PointerEvent) => {
  const rect = hitRef.value?.getBoundingClientRect();
  if (!rect) return 0;
  return settings.value.vertical ? rect.bottom - event.clientY : event.clientX - rect.left;
};

const follow = (event: PointerEvent) => {
  const d = drag;
  if (!d) return;
  const m = motion;
  const s = settings.value;
  const length = Math.max(1, m.length);
  const position = along(event);
  const fraction = d.from === null ? position / length : d.from + (position - d.origin) / length;
  const over = fraction < 0 ? -fraction * length : fraction > 1 ? (fraction - 1) * length : 0;
  if (over > 0 && s.maxStretch > 0) {
    const side = fraction < 0 ? -1 : 1;
    if (!m.held || m.side !== side) pulse(side);
    m.held = true;
    m.side = side;
    m.s = rubber(over, s.maxStretch);
    m.vs = 0;
  } else if (m.held) {
    m.held = false;
  }
  commit(snap(s.lo + clamp(fraction, 0, 1) * s.span));
};

const onPointerDown = (event: PointerEvent) => {
  const hit = hitRef.value;
  if (props.disabled || event.button !== 0 || !hit) return;
  hit.setPointerCapture(event.pointerId);
  const m = motion;
  const s = settings.value;
  drag = {
    id: event.pointerId,
    origin: along(event),
    from: s.jumpToClick ? null : m.target
  };
  m.dragging = true;
  hit.setAttribute('data-dragging', '');
  refreshGoal();
  if (s.jumpToClick) commit(snap(s.lo + clamp(along(event) / Math.max(1, m.length), 0, 1) * s.span));
};

const onPointerMove = (event: PointerEvent) => {
  if (!drag || drag.id !== event.pointerId) return;
  follow(event);
};

const release = () => {
  if (!drag) return;
  const m = motion;
  drag = null;
  m.dragging = false;
  m.held = false;
  hitRef.value?.removeAttribute('data-dragging');
  refreshGoal();
  settings.value.onChangeEnd?.(currentValue);
};

const onKeyDown = (event: KeyboardEvent) => {
  if (props.disabled) return;
  const s = settings.value;
  const unit = s.step || s.span / 100;
  const large = Math.max(unit, s.span / 10);
  const now = currentValue;
  const keys: Record<string, number> = {
    ArrowRight: now + unit,
    ArrowUp: now + unit,
    ArrowLeft: now - unit,
    ArrowDown: now - unit,
    PageUp: now + large,
    PageDown: now - large,
    Home: s.lo,
    End: s.hi
  };
  if (!(event.key in keys)) return;
  event.preventDefault();
  const wanted = keys[event.key];
  const next = snap(wanted);
  if (next === now) {
    if (wanted !== now) bump(wanted > now ? 1 : -1);
    return;
  }
  commit(next);
  s.onChangeEnd?.(next);
};

const onFocus = (event: FocusEvent) => {
  motion.focused = (event.currentTarget as HTMLElement).matches(':focus-visible');
  refreshGoal();
};

const onBlur = () => {
  motion.focused = false;
  refreshGoal();
};

const onEnter = () => {
  motion.hovered = true;
  autoInk();
  refreshGoal();
};

const onLeave = () => {
  motion.hovered = false;
  refreshGoal();
};

const label = computed(() =>
  props.formatValue
    ? props.formatValue(current.value)
    : step.value
      ? current.value.toFixed(decimalsOf(step.value))
      : String(Math.round(current.value))
);
const place = computed(() => (VALUE_POSITIONS.includes(props.valuePosition) ? props.valuePosition : 'top'));
const inside = computed(() => props.iconPlacement === 'inside');
const hasLeft = computed(() => !!slots['left-icon'] || !!props.leftIcon);
const hasRight = computed(() => !!slots['right-icon'] || !!props.rightIcon);
const insideStart = computed(() => inside.value && hasLeft.value);
const insideEndLabel = computed(() => place.value === 'inside');
const insideEndIcon = computed(() => !insideEndLabel.value && inside.value && hasRight.value);
const hasContent = computed(() => insideStart.value || insideEndLabel.value || insideEndIcon.value);
const marks = computed(() => {
  const count = step.value ? Math.round((hi.value - lo.value) / step.value) : 0;
  const tickValues = Array.isArray(props.ticks)
    ? props.ticks
    : props.ticks
      ? count > 0 && count <= 40
        ? Array.from({ length: count + 1 }, (_, index) => lo.value + index * step.value)
        : Array.from({ length: 11 }, (_, index) => lo.value + (index / 10) * (hi.value - lo.value))
      : [];
  return tickValues
    .map(tick => (tick - lo.value) / span.value)
    .filter(fraction => fraction > 0.001 && fraction < 0.999);
});
const markStyle = (fraction: number) =>
  vertical.value ? { bottom: `${fraction * 100}%` } : { left: `${fraction * 100}%` };
const thumbSize = computed(() => clamp(props.activeThickness + 6, 16, 28));

const rootStyle = computed(
  () =>
    ({
      '--elastic-slider-track': props.trackColor,
      '--elastic-slider-range': props.rangeColor,
      '--elastic-slider-icon': props.iconColor,
      '--elastic-slider-content': props.contentColor,
      ...(props.fillContentColor !== 'auto' ? { '--elastic-slider-fill-content': props.fillContentColor } : {}),
      '--elastic-slider-thumb': props.thumbColor,
      '--elastic-slider-thumb-size': `${thumbSize.value}px`,
      '--elastic-slider-hit': `${Math.max(34, props.thickness, props.activeThickness)}px`,
      '--elastic-slider-pad': `${Math.max(8, Math.round(props.thickness * 0.32))}px`,
      '--elastic-slider-bubble-offset': `${(props.thumb ? thumbSize.value * 1.12 : props.activeThickness) / 2 + 8}px`,
      ...(props.radius !== undefined ? { '--elastic-slider-radius': `${props.radius}px` } : {}),
      ...props.style
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="rootRef"
    :class="[ROOT, className].filter(Boolean).join(' ')"
    :style="rootStyle"
    :data-orientation="vertical ? 'vertical' : 'horizontal'"
    :data-disabled="disabled ? '' : undefined"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
  >
    <span v-if="place === 'top'" :class="VALUE" aria-hidden="true">{{ label }}</span>
    <div ref="bodyRef" :class="BODY">
      <span v-if="!inside && hasLeft" ref="startIconRef" :class="ICON" aria-hidden="true">
        <span :class="ICON_INNER">
          <slot name="left-icon"><ElasticSliderNodeView :node="leftIcon" /></slot>
        </span>
      </span>
      <div
        ref="hitRef"
        :class="HIT"
        role="slider"
        :tabindex="disabled ? -1 : 0"
        :aria-label="ariaLabel"
        :aria-valuemin="lo"
        :aria-valuemax="hi"
        :aria-valuenow="current"
        :aria-valuetext="label"
        :aria-orientation="vertical ? 'vertical' : 'horizontal'"
        :aria-disabled="disabled || undefined"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="release"
        @pointercancel="release"
        @lostpointercapture="release"
        @keydown="onKeyDown"
        @focus="onFocus"
        @blur="onBlur"
      >
        <div ref="trackRef" :class="TRACK">
          <span v-for="fraction in marks" :key="fraction" :class="TICK" :style="markStyle(fraction)" />
          <span v-if="hasContent" :class="CONTENT">
            <span>
              <slot v-if="insideStart" name="left-icon"><ElasticSliderNodeView :node="leftIcon" /></slot>
            </span>
            <span>
              <span v-if="insideEndLabel">{{ label }}</span>
              <slot v-else-if="insideEndIcon" name="right-icon"><ElasticSliderNodeView :node="rightIcon" /></slot>
            </span>
          </span>
          <div ref="rangeRef" :class="RANGE">
            <span v-for="fraction in marks" :key="fraction" :class="FILL_TICK" :style="markStyle(fraction)" />
            <span v-if="hasContent" :class="FILL_CONTENT">
              <span>
                <slot v-if="insideStart" name="left-icon"><ElasticSliderNodeView :node="leftIcon" /></slot>
              </span>
              <span>
                <span v-if="insideEndLabel">{{ label }}</span>
                <slot v-else-if="insideEndIcon" name="right-icon"><ElasticSliderNodeView :node="rightIcon" /></slot>
              </span>
            </span>
          </div>
        </div>
        <span v-if="thumb" ref="thumbRef" :class="THUMB" aria-hidden="true" />
        <span v-if="place === 'bubble'" ref="bubbleRef" :class="BUBBLE" aria-hidden="true">
          <span :class="BUBBLE_TEXT">{{ label }}</span>
        </span>
      </div>
      <span v-if="!inside && hasRight" ref="endIconRef" :class="ICON" aria-hidden="true">
        <span :class="ICON_INNER">
          <slot name="right-icon"><ElasticSliderNodeView :node="rightIcon" /></slot>
        </span>
      </span>
    </div>
  </div>
</template>

<style>
.elastic-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 12rem;
  color: inherit;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.elastic-slider[data-orientation='vertical'] {
  width: auto;
  height: 12rem;
}

.elastic-slider[data-disabled] {
  opacity: 0.45;
  pointer-events: none;
}

.elastic-slider__value {
  font-size: 12px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  opacity: 0.6;
}

.elastic-slider__body {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 0;
}

.elastic-slider[data-orientation='vertical'] .elastic-slider__body {
  flex-direction: column-reverse;
  width: auto;
  height: 100%;
}

.elastic-slider__icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  color: var(--elastic-slider-icon, currentColor);
  will-change: transform;
}

.elastic-slider__icon-inner {
  display: grid;
  place-items: center;
}

.elastic-slider__hit {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  height: var(--elastic-slider-hit, 34px);
  outline: none;
  cursor: grab;
  touch-action: none;
}

.elastic-slider[data-orientation='vertical'] .elastic-slider__hit {
  flex-direction: column;
  justify-content: flex-end;
  width: var(--elastic-slider-hit, 34px);
  height: auto;
  min-height: 0;
}

.elastic-slider__hit[data-dragging] {
  cursor: grabbing;
}

.elastic-slider__hit:focus-visible .elastic-slider__track {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.elastic-slider__track {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: var(--elastic-slider-radius, 999px);
  background: var(--elastic-slider-track);
  will-change: transform;
}

.elastic-slider[data-orientation='vertical'] .elastic-slider__track {
  width: 6px;
  height: 100%;
}

.elastic-slider__range {
  position: absolute;
  inset: 0;
  background: var(--elastic-slider-range);
  clip-path: inset(0 100% 0 0);
}

.elastic-slider__content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--elastic-slider-pad, 12px);
  color: var(--elastic-slider-content);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  opacity: var(--elastic-slider-reveal, 1);
  pointer-events: none;
}

.elastic-slider__content > span {
  display: grid;
  place-items: center;
  transform: var(--elastic-slider-unscale, none);
}

.elastic-slider[data-orientation='vertical'] .elastic-slider__content {
  flex-direction: column-reverse;
  padding: var(--elastic-slider-pad, 12px) 0;
}

.elastic-slider__content--fill {
  color: var(--elastic-slider-fill-content);
}

.elastic-slider__tick {
  position: absolute;
  top: 50%;
  width: 3px;
  height: 3px;
  margin: -1.5px 0 0 -1.5px;
  border-radius: 999px;
  background: var(--elastic-slider-content);
  opacity: 0.4;
}

.elastic-slider[data-orientation='vertical'] .elastic-slider__tick {
  top: auto;
  left: 50%;
  margin: 0 0 -1.5px -1.5px;
}

.elastic-slider__tick--fill {
  background: var(--elastic-slider-fill-content);
  opacity: 0.5;
}

.elastic-slider__thumb {
  position: absolute;
  top: 50%;
  left: 0;
  width: var(--elastic-slider-thumb-size, 18px);
  height: var(--elastic-slider-thumb-size, 18px);
  margin-top: calc(var(--elastic-slider-thumb-size, 18px) / -2);
  margin-left: calc(var(--elastic-slider-thumb-size, 18px) / -2);
  border-radius: 999px;
  background: var(--elastic-slider-thumb, #ffffff);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.28),
    0 0 0 0.5px rgba(0, 0, 0, 0.12);
  pointer-events: none;
  will-change: transform;
}

.elastic-slider[data-orientation='vertical'] .elastic-slider__thumb {
  top: auto;
  bottom: 0;
  left: 50%;
  margin-top: 0;
  margin-bottom: calc(var(--elastic-slider-thumb-size, 18px) / -2);
}

.elastic-slider__bubble {
  position: absolute;
  bottom: calc(50% + var(--elastic-slider-bubble-offset, 14px));
  left: 0;
  padding: 5px 8px;
  border-radius: 8px;
  background: var(--elastic-slider-range);
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
  white-space: nowrap;
  opacity: 0;
  transform-origin: 50% 100%;
  pointer-events: none;
  will-change: transform, opacity;
}

.elastic-slider[data-orientation='vertical'] .elastic-slider__bubble {
  bottom: 0;
  left: calc(50% + var(--elastic-slider-bubble-offset, 14px));
  transform-origin: 0% 50%;
}

.elastic-slider__bubble-text {
  color: var(--elastic-slider-fill-content);
}
</style>
