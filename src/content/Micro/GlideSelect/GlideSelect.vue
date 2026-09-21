<script setup lang="ts">
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, onUnmounted, ref, useId, watch, type CSSProperties } from 'vue';

export interface GlideSelectOption {
  value: string;
  label: string;
  tag?: string;
}

interface GlideSelectProps {
  options?: (string | GlideSelectOption)[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  showTags?: boolean;
  accentColor?: string;
  surfaceColor?: string;
  highlightColor?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  menuWidth?: number;
  placement?: 'top' | 'bottom';
  align?: 'left' | 'right';
  popDuration?: number;
  glideDuration?: number;
  rememberPosition?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

type Phase = 'closed' | 'open' | 'closing';

const SIZES: Record<string, { chip: number; row: number; font: number }> = {
  sm: { chip: 28, row: 26, font: 12 },
  md: { chip: 32, row: 30, font: 13 },
  lg: { chip: 44, row: 40, font: 14 }
};
const PAD = 4;
const GAP = 1;
const MENU_GAP = 6;

const norm = (o: string | GlideSelectOption): GlideSelectOption => (typeof o === 'string' ? { value: o, label: o } : o);
const typeaheadIndex = (items: GlideSelectOption[], from: number, ch: string) => {
  const c = ch.toLowerCase();
  const n = items.length;
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n;
    if (items[i].label.toLowerCase().startsWith(c)) return i;
  }
  return from;
};

const props = withDefaults(defineProps<GlideSelectProps>(), {
  options: () => ['One', 'Two', 'Three'],
  value: undefined,
  defaultValue: undefined,
  placeholder: 'Select…',
  showTags: true,
  accentColor: '#f5f5f5',
  surfaceColor: '#27272a',
  highlightColor: '#3f3f46',
  textColor: '#f5f5f5',
  size: 'md',
  radius: 10,
  menuWidth: 176,
  placement: 'bottom',
  align: 'left',
  popDuration: 180,
  glideDuration: 220,
  rememberPosition: true,
  disabled: false,
  ariaLabel: 'Select',
  className: ''
});

const emit = defineEmits<{ change: [value: string, option: GlideSelectOption] }>();

const items = computed(() => props.options.map(norm));
const inner = ref(props.defaultValue ?? '');
const current = computed(() => props.value ?? inner.value);
const selected = computed(() => items.value.findIndex(it => it.value === current.value));
const phase = ref<Phase>('closed');
const active = ref<number | null>(null);
const side = ref<'top' | 'bottom'>(props.placement);
const rootRef = ref<HTMLDivElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLDivElement | null>(null);
const pillRef = ref<HTMLSpanElement | null>(null);
let instant = false;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let scrub: { id: number; top: number } | null = null;
const id = useId();
const S = computed(() => SIZES[props.size] ?? SIZES.md);
const step = computed(() => S.value.row + GAP);
const popOut = computed(() => Math.round((props.popDuration * 2) / 3));

watch(
  phase,
  next => {
    if (next !== 'open') return;
    const el = menuRef.value;
    const root = rootRef.value;
    if (!el || !root) return;
    const r = root.getBoundingClientRect();
    const need = el.offsetHeight + MENU_GAP;
    side.value =
      props.placement === 'bottom' && r.bottom + need > window.innerHeight
        ? 'top'
        : props.placement === 'top' && r.top - need < 0
          ? 'bottom'
          : props.placement;
    el.style.transitionDuration = instant ? '0ms' : '';
    el.dataset.state = 'closed';
    void el.offsetHeight;
    el.dataset.state = 'open';
    const p = pillRef.value;
    if (p) {
      p.style.transition = 'none';
      p.style.transform = `translateY(${Math.max(0, selected.value) * step.value}px)`;
      p.style.opacity = '0';
      void p.offsetHeight;
      p.style.transition = '';
    }
  },
  { flush: 'post' }
);

watch(
  [active, phase, step],
  () => {
    const p = pillRef.value;
    if (!p || phase.value !== 'open') return;
    if (active.value === null) {
      p.style.opacity = '0';
      return;
    }
    const jump = instant || p.style.opacity !== '1';
    p.style.transitionDuration = jump ? '0ms, 150ms' : '';
    p.style.transform = `translateY(${active.value * step.value}px)`;
    p.style.opacity = '1';
    instant = false;
  },
  { flush: 'post' }
);

const open = (viaKey: boolean) => {
  if (props.disabled) return;
  clearTimeout(closeTimer);
  instant = true;
  active.value = selected.value >= 0 ? selected.value : viaKey ? 0 : null;
  phase.value = 'open';
};
const close = (mode: 'instant' | 'pop') => {
  active.value = null;
  clearTimeout(closeTimer);
  const el = menuRef.value;
  if (mode === 'instant' || !el) {
    phase.value = 'closed';
    return;
  }
  el.style.transitionDuration = '';
  el.dataset.state = 'closed';
  phase.value = 'closing';
  closeTimer = setTimeout(() => (phase.value = 'closed'), popOut.value + 20);
};
const pick = (i: number, viaKey: boolean) => {
  const it = items.value[i];
  if (!it) {
    close('instant');
    return;
  }
  if (it.value !== current.value) {
    if (props.value === undefined) inner.value = it.value;
    emit('change', it.value, it);
    if (!viaKey && rootRef.value) rootRef.value.dataset.swap = '';
  }
  close('instant');
  triggerRef.value?.focus({ preventScroll: true });
};

const onTriggerKey = (e: KeyboardEvent) => {
  const k = e.key;
  const n = items.value.length;
  const cur = active.value ?? Math.max(0, selected.value);
  if (phase.value !== 'open') {
    if (k === 'Enter' || k === ' ' || k === 'ArrowDown' || k === 'ArrowUp') {
      e.preventDefault();
      open(true);
    }
    return;
  }
  const go = (i: number) => {
    e.preventDefault();
    instant = true;
    active.value = Math.min(n - 1, Math.max(0, i));
  };
  if (k === 'ArrowDown' || k === 'ArrowUp') go(active.value === null ? cur : cur + (k === 'ArrowDown' ? 1 : -1));
  else if (k === 'Home' || k === 'End') go(k === 'Home' ? 0 : n - 1);
  else if (k === 'Enter' || k === ' ') {
    e.preventDefault();
    pick(cur, true);
  } else if (k === 'Escape' || k === 'Tab') {
    if (k === 'Escape') e.preventDefault();
    close('instant');
  } else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) go(typeaheadIndex(items.value, cur, k));
};
const onTriggerDown = (e: PointerEvent) => {
  if (e.button !== 0 || props.disabled) return;
  (e.currentTarget as HTMLElement).focus({ preventScroll: true });
  if (phase.value === 'open') close('pop');
  else open(false);
};

watch(phase, (next, _prev, onCleanup) => {
  if (next === 'closed') return;
  const onDown = (e: PointerEvent) => {
    if (rootRef.value && !rootRef.value.contains(e.target as Node)) close('pop');
  };
  document.addEventListener('pointerdown', onDown, true);
  onCleanup(() => document.removeEventListener('pointerdown', onDown, true));
});
watch(
  () => props.disabled,
  d => {
    if (d && phase.value !== 'closed') close('instant');
  }
);
onUnmounted(() => clearTimeout(closeTimer));

const rowAt = (y: number) => {
  const s = scrub;
  if (!s) return null;
  const i = Math.floor((y - s.top - PAD) / step.value);
  return i >= 0 && i < items.value.length ? i : null;
};
const onListDown = (e: PointerEvent) => {
  if (scrub) return;
  const el = e.currentTarget as HTMLElement;
  try {
    el.setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  scrub = { id: e.pointerId, top: el.getBoundingClientRect().top };
  instant = true;
  active.value = rowAt(e.clientY);
};
const onListMove = (e: PointerEvent) => {
  if (!scrub || scrub.id !== e.pointerId) return;
  const i = rowAt(e.clientY);
  if (i !== active.value) active.value = i;
};
const onListUp = (e: PointerEvent) => {
  if (!scrub || scrub.id !== e.pointerId) return;
  const i = e.type === 'pointerup' ? rowAt(e.clientY) : null;
  scrub = null;
  if (i !== null) pick(i, false);
  else if (!props.rememberPosition) active.value = null;
};
const onListOver = (e: PointerEvent) => {
  if (e.pointerType === 'touch' || scrub) return;
  const row = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
  if (!row) return;
  const i = Number(row.dataset.index);
  if (i !== active.value) active.value = i;
};
const onListLeave = () => {
  if (!scrub && !props.rememberPosition) active.value = null;
};
const onAnimationEnd = (e: AnimationEvent) => {
  if (e.animationName === 'gs-swap' && rootRef.value) delete rootRef.value.dataset.swap;
};

const rootStyle = computed(
  () =>
    ({
      '--gs-accent': props.accentColor,
      '--gs-surface': props.surfaceColor,
      '--gs-highlight': props.highlightColor,
      '--gs-text': props.textColor,
      '--gs-radius': `${props.radius}px`,
      '--gs-inner-radius': `${Math.max(3, props.radius - 4)}px`,
      '--gs-chip': `${S.value.chip}px`,
      '--gs-row': `${S.value.row}px`,
      '--gs-font': `${S.value.font}px`,
      '--gs-menu-w': `${props.menuWidth}px`,
      '--gs-pop': `${props.popDuration}ms`,
      '--gs-pop-out': `${popOut.value}ms`,
      '--gs-glide': `${props.glideDuration}ms`,
      '--gs-origin': `${side.value === 'bottom' ? 'top' : 'bottom'} ${props.align}`
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="rootRef"
    class="group relative inline-block data-[disabled]:opacity-50"
    :class="className"
    :data-size="size"
    :data-disabled="disabled ? '' : undefined"
    :style="rootStyle"
    @animationend="onAnimationEnd"
  >
    <button
      ref="triggerRef"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="phase === 'open'"
      :aria-controls="`${id}-list`"
      :aria-activedescendant="active !== null ? `${id}-${active}` : undefined"
      :aria-label="ariaLabel"
      :disabled="disabled"
      class="group/trigger relative inline-flex items-center gap-1.5 m-0 pr-2 pl-2.5 border-0 outline-none font-medium leading-none cursor-pointer select-none touch-manipulation disabled:cursor-default enabled:active:[transform:scale(0.97)] motion-reduce:enabled:active:[transform:none] motion-reduce:[transition:background-color_100ms_ease] [-webkit-tap-highlight-color:transparent] [font-family:inherit] [height:var(--gs-chip)] [border-radius:var(--gs-inner-radius)] [background:var(--gs-surface)] [color:var(--gs-text)] [font-size:var(--gs-font)] [transition:background-color_100ms_ease,transform_160ms_cubic-bezier(0.23,1,0.32,1)] aria-expanded:[background:color-mix(in_srgb,var(--gs-highlight)_60%,var(--gs-surface))] [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:[background:color-mix(in_srgb,var(--gs-highlight)_60%,var(--gs-surface))]"
      @pointerdown="onTriggerDown"
      @keydown="onTriggerKey"
    >
      <span
        :key="current"
        class="group-data-[swap]:animate-[gs-swap_160ms_ease] data-[empty]:opacity-60 motion-reduce:group-data-[swap]:animate-none"
        :data-empty="selected < 0 ? '' : undefined"
      >
        {{ selected >= 0 ? items[selected].label : placeholder }}
      </span>
      <span
        class="inline-flex group-aria-expanded/trigger:[transform:rotate(180deg)] motion-reduce:transition-none [color:color-mix(in_srgb,var(--gs-text)_55%,transparent)] [transition:transform_200ms_cubic-bezier(0.23,1,0.32,1)]"
        aria-hidden="true"
      >
        <HugeiconsIcon :icon="ArrowDown01Icon as IconArray" :size="12" :stroke-width="2.5" />
      </span>
    </button>
    <div
      v-if="phase !== 'closed'"
      ref="menuRef"
      class="absolute z-20 p-1 min-w-full opacity-0 [transform:scale(0.95)] data-[state=open]:[transform:scale(1)] data-[state=open]:opacity-100 data-[state=closed]:pointer-events-none data-[state=closed]:[transition-duration:var(--gs-pop-out)] data-[side=bottom]:top-[calc(100%+6px)] data-[side=top]:bottom-[calc(100%+6px)] data-[align=left]:left-0 data-[align=right]:right-0 motion-reduce:[transform:none]! motion-reduce:[transition:opacity_var(--gs-pop)_ease] motion-reduce:data-[state=closed]:[transition-duration:var(--gs-pop-out)] [width:var(--gs-menu-w)] [border-radius:var(--gs-radius)] [background:var(--gs-surface)] [box-shadow:0_4px_16px_color-mix(in_srgb,#000_22%,transparent)] [transform-origin:var(--gs-origin)] [transition:opacity_var(--gs-pop)_cubic-bezier(0.23,1,0.32,1),transform_var(--gs-pop)_cubic-bezier(0.23,1,0.32,1)]"
      data-state="open"
      :data-side="side"
      :data-align="align"
    >
      <div
        :id="`${id}-list`"
        role="listbox"
        :aria-label="ariaLabel"
        class="group/list relative grid gap-px touch-none"
        :data-live="active !== null ? '' : undefined"
        @pointerover="onListOver"
        @pointerleave="onListLeave"
        @pointerdown="onListDown"
        @pointermove="onListMove"
        @pointerup="onListUp"
        @pointercancel="onListUp"
        @lostpointercapture="onListUp"
      >
        <span
          ref="pillRef"
          class="top-0 right-0 left-0 absolute opacity-0 pointer-events-none motion-reduce:[transition:opacity_150ms_ease] [height:var(--gs-row)] [border-radius:var(--gs-inner-radius)] [background:var(--gs-highlight)] [transition:transform_var(--gs-glide)_cubic-bezier(0.23,1,0.32,1),opacity_150ms_ease]"
          aria-hidden="true"
        />
        <div
          v-for="(it, i) in items"
          :id="`${id}-${i}`"
          :key="it.value"
          role="option"
          :aria-selected="i === selected"
          :data-index="i"
          class="relative z-[1] flex items-center gap-2 pr-2 pl-2.5 cursor-pointer select-none group-data-[live]/list:aria-selected:bg-transparent [-webkit-tap-highlight-color:transparent] [height:var(--gs-row)] [border-radius:var(--gs-inner-radius)] [color:var(--gs-text)] [font-size:var(--gs-font)] [transition:background-color_150ms_ease] aria-selected:[background:color-mix(in_srgb,var(--gs-highlight)_60%,transparent)]"
        >
          <span class="flex-1 min-w-0 font-medium truncate">{{ it.label }}</span>
          <span
            v-if="showTags && it.tag"
            class="shrink-0 [color:color-mix(in_srgb,var(--gs-text)_55%,transparent)] [font-size:calc(var(--gs-font)_-_2px)]"
          >
            {{ it.tag }}
          </span>
          <span
            class="inline-flex data-[on]:visible shrink-0 invisible [color:var(--gs-accent)]"
            :data-on="i === selected ? '' : undefined"
            aria-hidden="true"
          >
            <HugeiconsIcon :icon="Tick02Icon as IconArray" :size="13" :stroke-width="2.5" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes gs-swap {
  from {
    opacity: 0.6;
    filter: blur(2px);
  }
}
</style>
