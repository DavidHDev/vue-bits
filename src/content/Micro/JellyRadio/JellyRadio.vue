<script setup lang="ts">
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { animate, motionValue, useReducedMotion, type MotionValue } from 'motion-v';
import { computed, onMounted, onUnmounted, ref, watch, type Component, type CSSProperties } from 'vue';

export type JellyRadioItem =
  | string
  | { value: string; label: string; icon?: IconArray | Component; disabled?: boolean };

interface JellyRadioProps {
  items?: JellyRadioItem[];
  value?: string;
  defaultValue?: string;
  chipColor?: string;
  activeColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: 'sm' | 'md' | 'lg';
  gap?: number;
  radius?: number;
  swell?: number;
  barge?: number;
  shrink?: number;
  jelly?: number;
  bounce?: number;
  stagger?: number;
  stiffness?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

interface ChipValues {
  x: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}

const SIZES: Record<string, [number, number, number]> = { sm: [28, 12, 12], md: [36, 13, 16], lg: [44, 14, 20] };

const spring = (k: number, m: number, bounce: number) => ({
  type: 'spring' as const,
  stiffness: k,
  damping: 2 * Math.sqrt(k * m) * (1 - bounce),
  mass: m
});

const isIconData = (icon: IconArray | Component): icon is IconArray => Array.isArray(icon);

const props = withDefaults(defineProps<JellyRadioProps>(), {
  items: () => ['Off', 'Low', 'Medium', 'High', 'Max'],
  value: undefined,
  defaultValue: undefined,
  chipColor: '#27272a',
  activeColor: '#f5f5f5',
  textColor: '#f5f5f5',
  activeTextColor: '#18181b',
  size: 'md',
  gap: 8,
  radius: 18,
  swell: 0.2,
  barge: 6,
  shrink: 0.05,
  jelly: 1,
  bounce: 0.25,
  stagger: 22,
  stiffness: 580,
  disabled: false,
  ariaLabel: 'Options',
  className: ''
});

const emit = defineEmits<{ change: [value: string, index: number] }>();

const list = computed(() => props.items.map(it => (typeof it === 'string' ? { value: it, label: it } : it)));
const inner = ref(props.defaultValue ?? list.value[0]?.value);
const current = computed(() => props.value ?? inner.value);
const at = computed(() =>
  Math.max(
    0,
    list.value.findIndex(it => it.value === current.value)
  )
);
const reduce = useReducedMotion();
const groupRef = ref<HTMLDivElement | null>(null);
const chips: (HTMLButtonElement | null)[] = [];
let widths: number[] = [];
const mvs: ChipValues[] = [];
const unsubs: (() => void)[][] = [];
let applied = at.value;
let observer: ResizeObserver | null = null;

const sizeValues = computed(() => SIZES[props.size] ?? SIZES.md);
const itemsKey = computed(() => list.value.map(it => it.value).join('|'));

const mvFor = (i: number) => {
  let mv = mvs[i];
  if (!mv) {
    mv = { x: motionValue(0), sx: motionValue(1), sy: motionValue(1) };
    mvs[i] = mv;
  }
  return mv;
};

// the chip transform is written straight to the element, so Vue never re-renders during the motion
const paintChip = (i: number) => {
  const el = chips[i];
  if (!el) return;
  const mv = mvFor(i);
  el.style.transform = `translateX(${mv.x.get()}px) scale(${mv.sx.get()}, ${mv.sy.get()})`;
};

const bindChip = (i: number, el: HTMLButtonElement | null) => {
  if (chips[i] === el) return;
  unsubs[i]?.forEach(off => off());
  unsubs[i] = [];
  chips[i] = el;
  if (!el) return;
  const mv = mvFor(i);
  const paint = () => paintChip(i);
  unsubs[i] = [mv.x.on('change', paint), mv.sx.on('change', paint), mv.sy.on('change', paint)];
  paint();
};

const apply = (sel: number, instant: boolean) => {
  const group = groupRef.value;
  const rtl = group ? getComputedStyle(group).direction === 'rtl' : false;
  const push = ((widths[sel] ?? 0) * props.swell) / 2 + props.barge;
  const count = list.value.length;
  for (let i = 0; i < count; i++) {
    const mv = mvFor(i);
    const on = i === sel;
    const far = Math.abs(i - sel);
    const dir = Math.sign(i - sel) * (rtl ? -1 : 1);
    const x = dir * push;
    const s = on ? 1 + props.swell : 1 - props.shrink;
    if (instant || reduce.value) {
      mv.x.jump(x);
      mv.sx.jump(s);
      mv.sy.jump(s);
      paintChip(i);
      continue;
    }
    const k = props.stiffness * (1 - 0.12 * Math.min(far, 3));
    const inFlight = mv.x.isAnimating() || mv.sx.isAnimating() || mv.sy.isAnimating();
    const delay = inFlight ? 0 : (far * props.stagger) / 1000;
    animate(mv.x, x, { ...spring(k, 0.9, props.bounce), delay });
    const j = props.jelly;
    animate(mv.sx, s, {
      ...spring(k * (1 + 0.24 * j), 0.9 - 0.1 * j, Math.min(0.85, props.bounce + 0.3 * j)),
      delay
    });
    animate(mv.sy, s, { ...spring(k * (1 - 0.14 * j), 0.9 + 0.05 * j, props.bounce), delay: delay + 0.05 * j });
  }
};

const measure = () => {
  const group = groupRef.value;
  if (!group) return;
  widths = chips.map(el => el?.offsetWidth ?? 0);
  const chipH = chips[0]?.offsetHeight ?? 0;
  const maxW = Math.max(0, ...widths);
  group.style.setProperty('--jr-pad-x', `${Math.ceil((maxW * props.swell * 1.3) / 2 + props.barge) + 2}px`);
  group.style.setProperty('--jr-pad-y', `${Math.ceil((chipH * props.swell) / 2) + 2}px`);
};
const settle = () => {
  measure();
  apply(applied, true);
};

onMounted(() => {
  settle();
  observer = new ResizeObserver(settle);
  if (groupRef.value) observer.observe(groupRef.value);
  document.fonts?.ready.then(settle);
});
watch([itemsKey, () => props.size, () => props.gap, () => props.swell, () => props.barge, () => props.shrink], settle, {
  flush: 'post'
});
watch(at, next => {
  if (applied === next) return;
  applied = next;
  apply(next, true);
});
onUnmounted(() => {
  observer?.disconnect();
  unsubs.forEach(list => list.forEach(off => off()));
  mvs.forEach(mv => {
    mv.x.destroy();
    mv.sx.destroy();
    mv.sy.destroy();
  });
});

const commit = (i: number, instant: boolean) => {
  const item = list.value[i];
  if (props.disabled || i === at.value || !item || item.disabled) return;
  applied = i;
  apply(i, instant);
  if (props.value === undefined) inner.value = item.value;
  emit('change', item.value, i);
};
const stepFrom = (i: number, dir: number) => {
  const n = list.value.length;
  let j = i;
  for (let tries = 0; tries < n; tries++) {
    j = (j + dir + n) % n;
    if (!list.value[j].disabled) return j;
  }
  return i;
};
const onKeyDown = (e: KeyboardEvent, i: number) => {
  let next: number | null = null;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = stepFrom(i, 1);
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = stepFrom(i, -1);
  else if (e.key === 'Home') next = stepFrom(-1, 1);
  else if (e.key === 'End') next = stepFrom(list.value.length, -1);
  else if (e.key === ' ' || e.key === 'Enter') next = i;
  if (next === null) return;
  e.preventDefault();
  commit(next, true);
  chips[next]?.focus();
};

const rootStyle = computed(
  () =>
    ({
      '--jr-chip': props.chipColor,
      '--jr-active': props.activeColor,
      '--jr-text': props.textColor,
      '--jr-active-text': props.activeTextColor,
      '--jr-gap': `${props.gap}px`,
      '--jr-radius': `${props.radius}px`,
      '--jr-h': `${sizeValues.value[0]}px`,
      '--jr-font': `${sizeValues.value[1]}px`,
      '--jr-px': `${sizeValues.value[2]}px`
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="groupRef"
    role="radiogroup"
    :aria-label="ariaLabel"
    :data-disabled="disabled ? '' : undefined"
    class="group inline-flex items-center gap-[var(--jr-gap)] px-[var(--jr-pad-x)] py-[var(--jr-pad-y)] data-[disabled]:opacity-50 select-none data-[disabled]:pointer-events-none [-webkit-touch-callout:none]"
    :class="className"
    :style="rootStyle"
  >
    <button
      v-for="(it, i) in list"
      :key="it.value"
      :ref="el => bindChip(i, el as HTMLButtonElement | null)"
      type="button"
      role="radio"
      :aria-checked="i === at"
      :tabindex="i === at ? 0 : -1"
      :disabled="disabled || !!it.disabled"
      class="group/chip relative bg-transparent m-0 p-0 border-0 outline-none text-inherit data-[on=true]:cursor-default disabled:cursor-default cursor-pointer disabled:opacity-40 group-data-[disabled]:disabled:opacity-100 origin-center touch-manipulation [font:inherit] [-webkit-tap-highlight-color:transparent]"
      :data-on="i === at ? 'true' : 'false'"
      @click="commit(i, $event.detail === 0)"
      @keydown="onKeyDown($event, i)"
    >
      <span
        class="relative inline-flex justify-center items-center gap-[0.4em] before:absolute before:inset-0 before:opacity-0 before:bg-[var(--jr-text)] rounded-[var(--jr-radius)] group-data-[on=true]/chip:bg-[var(--jr-active)] bg-[var(--jr-chip)] font-medium leading-none whitespace-nowrap overflow-hidden before:pointer-events-none group-active/chip:[transform:scale(0.97)] motion-reduce:group-active/chip:[transform:none] group-data-[on=true]/chip:[color:var(--jr-active-text)] [color:var(--jr-text)] [height:var(--jr-h)] [padding:0_var(--jr-px)] [font-size:var(--jr-font)] [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1),background-color_200ms_ease,color_200ms_ease] before:[transition:opacity_160ms_ease] before:content-[''] [@media(hover:hover)_and_(pointer:fine)]:group-hover/chip:group-enabled/chip:group-data-[on=false]/chip:before:opacity-[0.11]"
      >
        <span v-if="it.icon" class="inline-flex">
          <HugeiconsIcon v-if="isIconData(it.icon)" :icon="it.icon" :size="16" :stroke-width="2" />
          <component :is="it.icon" v-else />
        </span>
        <span>{{ it.label }}</span>
      </span>
    </button>
  </div>
</template>
