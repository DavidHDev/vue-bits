<script setup lang="ts">
import { FavouriteIcon, FlashIcon, StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, defineComponent, h, onMounted, onUnmounted, ref, watchPostEffect, type CSSProperties } from 'vue';

export type PeekRatingShape = 'star' | 'heart' | 'bolt';

interface PeekRatingProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  shape?: PeekRatingShape;
  labels?: string[];
  activeColor?: string;
  idleColor?: string;
  tipColor?: string;
  tipTextColor?: string;
  size?: number;
  lift?: number;
  magnify?: number;
  riseDuration?: number;
  popScale?: number;
  showTip?: boolean;
  allowClear?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

interface GestureState {
  hover: number | null;
  pressing: boolean;
  pointerId: number | null;
  settled: boolean;
  rect: DOMRect | null;
  rtl: boolean;
}

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const SHAPES: Record<PeekRatingShape, IconArray> = {
  star: StarIcon as IconArray,
  heart: FavouriteIcon as IconArray,
  bolt: FlashIcon as IconArray
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// h() with a string always builds a native element; <component :is="'button'"> would resolve to a globally registered Button
const StarTag = defineComponent({
  name: 'StarTag',
  props: { tag: { type: String, default: 'button' } },
  setup(p, { slots, attrs }) {
    return () => h(p.tag, attrs, slots.default?.());
  }
});
const elOf = (el: unknown) => ((el as { $el?: HTMLElement } | null)?.$el ?? null) as HTMLElement | null;

const props = withDefaults(defineProps<PeekRatingProps>(), {
  value: undefined,
  defaultValue: 0,
  count: 5,
  shape: 'star',
  labels: () => [],
  activeColor: '#f5b400',
  idleColor: '#52525b',
  tipColor: '#27272a',
  tipTextColor: '#f5f5f5',
  size: 28,
  lift: 6,
  magnify: 1.15,
  riseDuration: 320,
  popScale: 1.3,
  showTip: true,
  allowClear: true,
  readOnly: false,
  disabled: false,
  ariaLabel: 'Rating',
  className: ''
});

const emit = defineEmits<{ change: [value: number]; preview: [value: number | null] }>();

const inner = ref(props.defaultValue);
const value = computed(() => clamp(props.value ?? inner.value, 0, props.count));
const interactive = computed(() => !props.readOnly && !props.disabled);

const rootRef = ref<HTMLDivElement | null>(null);
const rowRef = ref<HTMLDivElement | null>(null);
const tipEl = ref<HTMLSpanElement | null>(null);
const starEls: (HTMLElement | null)[] = [];
const liftEls: (HTMLSpanElement | null)[] = [];
const glyphEls: (HTMLSpanElement | null)[] = [];
const st: GestureState = { hover: null, pressing: false, pointerId: null, settled: false, rect: null, rtl: false };

// the lift, glyph colour and tip are driven by hand so a preview never waits on a Vue render
const paint = () => {
  const { hover, settled, rtl } = st;
  const previewing = hover !== null && !settled;
  const shown = previewing ? (hover as number) + 1 : value.value;
  const still = reducedMotion();

  for (let i = 0; i < props.count; i++) {
    const liftEl = liftEls[i];
    const glyphEl = glyphEls[i];
    if (!liftEl || !glyphEl) continue;
    const lifted = previewing && !still && i <= (hover as number);
    liftEl.style.transform = lifted
      ? `translateY(${-props.lift}px) scale(${i === hover ? props.magnify : 1})`
      : 'translateY(0px) scale(1)';
    glyphEl.dataset.lit = String(i < shown);
  }

  const tip = tipEl.value;
  if (!tip) return;
  if (previewing && props.showTip) {
    const row = rowRef.value;
    const slot = row ? row.clientWidth / props.count : props.size;
    const visual = rtl ? props.count - 1 - (hover as number) : (hover as number);
    const wasHidden = tip.dataset.show !== 'true';
    if (wasHidden) tip.style.transition = 'none';
    tip.textContent = props.labels[hover as number] ?? String((hover as number) + 1);
    tip.style.transform = `translate(calc(${slot * (visual + 0.5)}px - 50%), 0)`;
    if (wasHidden) {
      void tip.offsetWidth;
      tip.style.transition = '';
    }
    tip.dataset.show = 'true';
  } else {
    tip.dataset.show = 'false';
  }
};
watchPostEffect(paint);

const setHover = (index: number | null) => {
  if (index === st.hover) return;
  st.hover = index;
  if (index !== null) st.settled = false;
  paint();
  emit('preview', index === null ? null : index + 1);
};

const measure = () => {
  const row = rowRef.value;
  if (!row) return;
  st.rect = row.getBoundingClientRect();
  st.rtl = getComputedStyle(row).direction === 'rtl';
};

const indexAt = (x: number, y: number): number | null => {
  const { rect, pressing, rtl } = st;
  if (!rect || !rect.width) return null;
  if (pressing && (y < rect.top - props.size || y > rect.bottom + props.size)) return null;
  const index = clamp(Math.floor(((x - rect.left) / rect.width) * props.count), 0, props.count - 1);
  return rtl ? props.count - 1 - index : index;
};

const commit = (next: number, pop = true) => {
  if (props.value === undefined) inner.value = next;
  emit('change', next);
  st.settled = true;
  paint();
  const glyph = glyphEls[next - 1];
  if (pop && next > 0 && props.popScale > 1 && glyph && typeof glyph.animate === 'function' && !reducedMotion()) {
    glyph.getAnimations().forEach(animation => animation.cancel());
    glyph.animate(
      [
        { transform: 'scale(1)', easing: EASE_OUT },
        { transform: `scale(${props.popScale})`, offset: 0.35, easing: EASE_OUT },
        { transform: 'scale(1)' }
      ],
      { duration: 300 }
    );
  }
};

const handlePointerEnter = (e: PointerEvent) => {
  if (!interactive.value || e.pointerType !== 'mouse') return;
  rootRef.value?.removeAttribute('data-instant');
  measure();
};

const handlePointerDown = (e: PointerEvent) => {
  if (!interactive.value || e.button !== 0 || st.pointerId !== null) return;
  rootRef.value?.removeAttribute('data-instant');
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  st.pointerId = e.pointerId;
  st.pressing = true;
  measure();
  setHover(indexAt(e.clientX, e.clientY));
};

const handlePointerMove = (e: PointerEvent) => {
  if (!interactive.value) return;
  const { pressing, pointerId } = st;
  if (e.pointerType !== 'mouse' && !pressing) return;
  if (pressing && e.pointerId !== pointerId) return;
  if (!pressing && !st.rect) measure();
  setHover(indexAt(e.clientX, e.clientY));
};

const endPress = (e: PointerEvent) => {
  const { pressing, pointerId, hover } = st;
  if (!pressing || e.pointerId !== pointerId) return;
  st.pressing = false;
  st.pointerId = null;
  if (e.type === 'pointerup' && hover !== null) {
    const next = hover + 1;
    commit(props.allowClear && next === value.value ? 0 : next);
  }
  if (e.pointerType !== 'mouse') setHover(null);
};

const handlePointerLeave = () => {
  if (!st.pressing) setHover(null);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!interactive.value || props.readOnly) return;
  const min = props.allowClear ? 0 : 1;
  let next: number;
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = clamp(value.value + 1, min, props.count);
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      next = clamp(value.value - 1, min, props.count);
      break;
    case 'Home':
      next = 1;
      break;
    case 'End':
      next = props.count;
      break;
    case 'Backspace':
    case 'Delete':
      if (!props.allowClear) return;
      next = 0;
      break;
    case ' ':
    case 'Enter': {
      const index = starEls.indexOf(e.target as HTMLElement);
      if (index === -1) return;
      next = props.allowClear && index + 1 === value.value ? 0 : index + 1;
      break;
    }
    default:
      return;
  }
  e.preventDefault();
  rootRef.value?.setAttribute('data-instant', 'true');
  st.hover = null;
  commit(next, false);
  starEls[Math.max(next, 1) - 1]?.focus();
};

const reset = () => {
  st.pressing = false;
  st.pointerId = null;
  setHover(null);
};
const onVisibility = () => {
  if (document.hidden) reset();
};
onMounted(() => {
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('blur', reset);
});
onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibility);
  window.removeEventListener('blur', reset);
});

const indexes = computed(() => Array.from({ length: props.count }, (_, i) => i));
const shapeIcon = computed(() => SHAPES[props.shape] || SHAPES.star);
const tipRoom = computed(() => (interactive.value && props.showTip ? Math.round(props.size * 0.9) : 0));

const rootStyle = computed(
  () =>
    ({
      '--pr-active': props.activeColor,
      '--pr-idle': props.idleColor,
      '--pr-tip': props.tipColor,
      '--pr-tip-text': props.tipTextColor,
      '--pr-size': `${props.size}px`,
      '--pr-gap': `${Math.round(props.size * 0.22)}px`,
      '--pr-room': `${props.lift + tipRoom.value}px`,
      '--pr-rise': `${props.riseDuration}ms`,
      '--pr-ease-out': EASE_OUT
    }) as CSSProperties
);

const labelFor = (i: number) =>
  props.labels[i] ? `${i + 1} of ${props.count}, ${props.labels[i]}` : `${i + 1} of ${props.count}`;
const tabIndexFor = (i: number) =>
  !interactive.value ? -1 : (value.value === 0 ? i === 0 : value.value === i + 1) ? 0 : -1;
</script>

<template>
  <div
    ref="rootRef"
    :role="readOnly ? 'img' : 'radiogroup'"
    :aria-label="readOnly ? `${value} of ${count}` : ariaLabel"
    :aria-disabled="disabled || undefined"
    class="group inline-flex aria-disabled:opacity-50 font-[inherit] text-inherit aria-disabled:pointer-events-none"
    :class="className"
    :style="rootStyle"
    @keydown="handleKeyDown"
  >
    <div
      ref="rowRef"
      class="relative inline-flex items-end pt-[var(--pr-room)] select-none touch-pan-y [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]"
      @pointerenter="handlePointerEnter"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="endPress"
      @pointercancel="endPress"
      @lostpointercapture="endPress"
      @pointerleave="handlePointerLeave"
    >
      <span
        v-if="interactive && showTip"
        ref="tipEl"
        class="top-0 left-0 absolute inline-flex items-center px-[calc(var(--pr-size)*0.3)] rounded-full h-[calc(var(--pr-size)*0.6)] font-semibold text-[length:calc(var(--pr-size)*0.38)] leading-none tracking-[0.01em] whitespace-nowrap opacity-0 data-[show=true]:opacity-100 shadow-[0_2px_10px_rgba(0,0,0,0.18)] pointer-events-none group-data-[instant=true]:[transition-duration:0ms] motion-reduce:[transition:opacity_180ms_ease] [background:var(--pr-tip)] [color:var(--pr-tip-text)] [transition:transform_var(--pr-rise)_var(--pr-ease-out),opacity_180ms_ease]"
        aria-hidden="true"
      />
      <StarTag
        v-for="i in indexes"
        :key="i"
        :ref="(el: unknown) => (starEls[i] = elOf(el))"
        :tag="readOnly ? 'span' : 'button'"
        :type="readOnly ? undefined : 'button'"
        class="place-items-center grid bg-transparent m-0 p-0 border-0 focus-visible:rounded-md outline-none focus-visible:outline-offset-2 w-[calc(var(--pr-size)+var(--pr-gap))] h-[calc(var(--pr-size)+8px)] font-[inherit] text-inherit touch-manipulation [@media(hover:hover)_and_(pointer:fine)]:cursor-pointer [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:min-w-11 focus-visible:[outline:2px_solid_color-mix(in_srgb,var(--pr-active)_70%,transparent)]"
        :role="readOnly ? undefined : 'radio'"
        :aria-checked="readOnly ? undefined : value === i + 1"
        :aria-label="readOnly ? undefined : labelFor(i)"
        :aria-hidden="readOnly || undefined"
        :tabindex="tabIndexFor(i)"
      >
        <span
          :ref="(el: unknown) => (liftEls[i] = el as HTMLSpanElement | null)"
          class="block origin-bottom group-data-[instant=true]:[transition-duration:0ms] motion-reduce:transition-none [transition:transform_var(--pr-rise)_var(--pr-ease-out)]"
        >
          <span
            :ref="(el: unknown) => (glyphEls[i] = el as HTMLSpanElement | null)"
            class="block w-[var(--pr-size)] h-[var(--pr-size)] text-[var(--pr-idle)] data-[lit=true]:text-[var(--pr-active)] group-data-[instant=true]:[transition-duration:0ms] [&>svg]:block [&>svg]:w-full [&>svg]:h-full [transition:color_160ms_ease]"
          >
            <slot name="icon">
              <HugeiconsIcon :icon="shapeIcon" :size="size" fill="currentColor" :stroke-width="1.5" />
            </slot>
          </span>
        </span>
      </StarTag>
    </div>
  </div>
</template>
