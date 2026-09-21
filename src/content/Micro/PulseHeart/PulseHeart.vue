<script setup lang="ts">
import { FavouriteIcon, StarIcon, ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { computed, onUnmounted, ref, watch, type CSSProperties } from 'vue';

export type PulseHeartIcon = 'heart' | 'star' | 'thumb';

interface PulseHeartProps {
  liked?: boolean;
  defaultLiked?: boolean;
  count?: number;
  showCount?: boolean;
  icon?: PulseHeartIcon;
  idleOutline?: boolean;
  size?: number;
  corner?: number;
  likedColor?: string;
  idleColor?: string;
  pillColor?: string;
  textColor?: string;
  duration?: number;
  dotSize?: number;
  overshoot?: number;
  beat?: number;
  rollDuration?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
}

type IconData = readonly (readonly [string, { readonly [key: string]: string | number }])[];
type Roll = { a: string; b: string; at: number; up: boolean };
type Cell = { ch: string } | { top: string; bottom: string };

const OUT = 0.4;
const ICONS: Record<PulseHeartIcon, IconData> = {
  heart: FavouriteIcon as IconData,
  star: StarIcon as IconData,
  thumb: ThumbsUpIcon as IconData
};

const back = (k: number, c: number) => {
  const u = k - 1;
  return 1 + (c + 1) * u ** 3 + c * u ** 2;
};
const swellOf = (t: number, c: number) =>
  t <= 0 ? 0 : t < OUT ? 1 - (1 - t / OUT) ** 3 : 1 - back((t - OUT) / (1 - OUT), c);
const format = (n: number) => new Intl.NumberFormat().format(n);
const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const props = withDefaults(defineProps<PulseHeartProps>(), {
  liked: undefined,
  defaultLiked: false,
  count: 0,
  showCount: true,
  icon: 'heart',
  idleOutline: true,
  size: 40,
  corner: 32,
  likedColor: '#ff4d6d',
  idleColor: '#8b8b93',
  pillColor: '#232326',
  textColor: '#f5f5f5',
  duration: 560,
  dotSize: 0.3,
  overshoot: 1.7,
  beat: 3,
  rollDuration: 350,
  disabled: false,
  label: 'Like',
  className: ''
});

const emit = defineEmits<{ change: [liked: boolean, count: number] }>();

const controlled = computed(() => props.liked !== undefined);
const inner = ref(props.defaultLiked);
const total = ref(props.count);
const liked = computed(() => (controlled.value ? !!props.liked : inner.value));
const shown = ref({ liked: liked.value, count: props.count });
const roll = ref<Roll | null>(null);

const rootRef = ref<HTMLButtonElement | null>(null);
const pillRef = ref<HTMLSpanElement | null>(null);
const heartRef = ref<HTMLSpanElement | null>(null);
const glyphRef = ref<SVGGElement | null>(null);
const roller: { el: HTMLSpanElement | null } = { el: null };
let raf = 0;
let rollTimer: ReturnType<typeof setTimeout> | undefined;
let viaPointer = false;
let shownNow = shown.value;

watch(
  () => props.count,
  c => (total.value = c)
);

watch(
  [liked, total],
  () => {
    if (raf) return;
    if (shownNow.liked === liked.value && shownNow.count === total.value) return;
    shownNow = { liked: liked.value, count: total.value };
    shown.value = shownNow;
  },
  { flush: 'post' }
);

watch(
  shown,
  () => {
    const root = rootRef.value;
    if (!root || root.dataset.instant === undefined) return;
    root.getBoundingClientRect();
    delete root.dataset.instant;
  },
  { flush: 'post' }
);

watch(
  roll,
  next => {
    const el = roller.el;
    if (!el || !next) return;
    el.style.transition = 'none';
    el.style.transform = `translateY(${next.up ? '0' : '-1em'})`;
    el.getBoundingClientRect();
    el.style.transition = '';
    el.style.transform = `translateY(${next.up ? '-1em' : '0'})`;
  },
  { flush: 'post' }
);

onUnmounted(() => {
  cancelAnimationFrame(raf);
  clearTimeout(rollTimer);
});

const startRoll = (from: number, to: number) => {
  if (from === to) return;
  const a = format(from);
  const b = format(to);
  const changed = a.length === b.length ? [...b].flatMap((ch, i) => (ch !== a[i] ? [i] : [])) : [];
  roll.value = { a, b, at: changed.length === 1 ? changed[0] : -1, up: to > from };
  clearTimeout(rollTimer);
  rollTimer = setTimeout(() => (roll.value = null), props.rollDuration);
};

const run = (nextLiked: boolean, nextCount: number) => {
  const root = rootRef.value;
  const heart = heartRef.value;
  const pill = pillRef.value;
  if (!root || !heart || !pill) return;
  const glyph = glyphRef.value;
  root.dataset.running = '';
  let swapped = false;
  let prev = 0;
  const t0 = performance.now();
  const tick = (now: number) => {
    const { duration: D, dotSize: dot, overshoot: c, beat: B } = props;
    const t = Math.min(1, (now - t0) / D);
    const step = prev ? now - prev : 1000 / 60;
    prev = now;
    const s = swellOf(t, c);
    const k = 1 - (1 - dot) * s;
    if (glyph) glyph.setAttribute('transform', `translate(12 12) scale(${k}) translate(-12 -12)`);
    else heart.style.transform = `scale(${k})`;
    pill.style.transform = `scale(${1 - (B / 100) * s})`;
    if (!swapped && t + step / 2 / D >= OUT) {
      swapped = true;
      root.dataset.liked = String(nextLiked);
      startRoll(shownNow.count, nextCount);
      shownNow = { liked: nextLiked, count: nextCount };
      shown.value = shownNow;
    }
    if (t < 1) {
      raf = requestAnimationFrame(tick);
      return;
    }
    raf = 0;
    if (glyph) glyph.removeAttribute('transform');
    heart.style.transform = '';
    pill.style.transform = '';
    delete root.dataset.running;
    if (liked.value !== shownNow.liked || total.value !== shownNow.count) {
      shownNow = { liked: liked.value, count: total.value };
      shown.value = shownNow;
    }
  };
  raf = requestAnimationFrame(tick);
};

const handlePointerDown = (e: PointerEvent) => {
  if (e.button !== 0 || props.disabled) return;
  viaPointer = true;
  if (!reducedMotion() && rootRef.value) rootRef.value.dataset.pressed = '';
};
const handlePointerUp = () => {
  if (rootRef.value) delete rootRef.value.dataset.pressed;
};
const handlePointerCancel = () => {
  viaPointer = false;
  handlePointerUp();
};
const handleKeyDown = () => {
  viaPointer = false;
};
const handleClick = (e: MouseEvent) => {
  if (props.disabled || raf) return;
  const pointer = viaPointer && e.detail !== 0;
  viaPointer = false;
  const nextLiked = !liked.value;
  const nextCount = total.value + (nextLiked ? 1 : -1);
  if (!controlled.value) inner.value = nextLiked;
  total.value = nextCount;
  emit('change', nextLiked, nextCount);
  if (pointer && !reducedMotion()) run(nextLiked, nextCount);
  else if (rootRef.value) rootRef.value.dataset.instant = '';
};

const paths = computed(() => ICONS[props.icon] || ICONS.heart);
const text = computed(() => format(shown.value.count));
const cells = computed<Cell[]>(() => {
  const r = roll.value;
  if (!r) return [...text.value].map(ch => ({ ch }));
  if (r.at === -1) return [{ top: r.up ? r.a : r.b, bottom: r.up ? r.b : r.a }];
  return [...r.b].map((ch, i) => (i === r.at ? { top: r.up ? r.a[i] : ch, bottom: r.up ? ch : r.a[i] } : { ch }));
});

const rootStyle = computed(
  () =>
    ({
      '--ph-size': `${props.size}px`,
      '--ph-corner': `${props.corner}px`,
      '--ph-pill': props.pillColor,
      '--ph-idle': props.idleColor,
      '--ph-liked': props.likedColor,
      '--ph-text': props.textColor,
      '--ph-roll': `${props.rollDuration}ms`,
      '--ph-stroke': `${(1.5 * props.size) / 24}px`,
      '--ph-ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)'
    }) as CSSProperties
);
</script>

<template>
  <button
    ref="rootRef"
    type="button"
    :aria-pressed="liked"
    :disabled="disabled"
    :data-liked="String(shown.liked)"
    :data-solid="idleOutline ? undefined : ''"
    :data-no-count="showCount ? undefined : ''"
    class="group inline-flex relative justify-center items-center bg-transparent disabled:opacity-[0.55] m-0 p-0 border-0 rounded-[var(--ph-corner)] outline-none focus-visible:outline-offset-[3px] [@media(pointer:coarse)]:min-w-11 [@media(pointer:coarse)]:min-h-11 motion-reduce:transition-none [transition:transform_160ms_var(--ph-ease-out)] [-webkit-touch-callout:none] touch-manipulation cursor-pointer disabled:cursor-default select-none [font-family:inherit] [color:var(--ph-text)] [-webkit-tap-highlight-color:transparent] data-[pressed]:[transform:scale(0.97)] focus-visible:[outline:2px_solid_color-mix(in_srgb,var(--ph-liked)_60%,transparent)]"
    :class="className"
    :style="rootStyle"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @pointerleave="handlePointerUp"
    @pointercancel="handlePointerCancel"
    @keydown="handleKeyDown"
    @click="handleClick"
  >
    <span
      ref="pillRef"
      class="[padding-inline-end:calc(var(--ph-size)*0.4)] group-data-[no-count]:[padding-inline-end:calc(var(--ph-size)*0.3)] inline-flex items-center rounded-[var(--ph-corner)] origin-center [gap:calc(var(--ph-size)*0.25)] [padding:calc(var(--ph-size)*0.3)] [background:var(--ph-pill)] [@media(prefers-contrast:more)]:[box-shadow:inset_0_0_0_1px_color-mix(in_srgb,var(--ph-text)_25%,transparent)]"
    >
      <span
        ref="heartRef"
        class="block [&_svg]:block [&_svg]:fill-none group-data-[liked=true]:[&_svg]:fill-current group-data-[solid]:[&_svg]:fill-current [&_svg]:stroke-current w-[var(--ph-size)] [&_svg]:w-full h-[var(--ph-size)] [&_svg]:h-full [&_svg]:overflow-visible origin-center group-data-[instant]:transition-none group-data-[running]:transition-none motion-reduce:[transition:color_200ms_ease] [color:var(--ph-idle)] [transition:color_160ms_ease] group-data-[liked=true]:[color:var(--ph-liked)] [&_svg]:[stroke-width:var(--ph-stroke)] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [@media(hover:hover)_and_(pointer:fine)]:group-enabled:group-hover:group-data-[liked=false]:[color:color-mix(in_srgb,var(--ph-idle)_45%,var(--ph-liked))]"
        aria-hidden="true"
      >
        <slot name="icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g ref="glyphRef">
              <path
                v-for="[, attrs] in paths"
                :key="String(attrs.key)"
                :d="String(attrs.d)"
                vector-effect="non-scaling-stroke"
              />
            </g>
          </svg>
        </slot>
      </span>
      <span
        v-if="showCount"
        class="[&>span]:block inline-flex [&>span]:h-[1em] font-semibold tabular-nums leading-none tracking-[-0.1px] [font-size:calc(var(--ph-size)*0.5)] [color:var(--ph-text)]"
        aria-hidden="true"
      >
        <template v-for="(cell, i) in cells" :key="'ch' in cell ? `c${i}` : `r${i}`">
          <span v-if="'ch' in cell">{{ cell.ch }}</span>
          <span v-else class="relative overflow-hidden">
            <span
              :ref="(el: unknown) => (roller.el = el as HTMLSpanElement | null)"
              class="[&>span]:block flex flex-col [&>span]:h-[1em] [&>span]:leading-none motion-reduce:transition-none [transition:transform_var(--ph-roll)_var(--ph-ease-out)]"
            >
              <span>{{ cell.top }}</span>
              <span>{{ cell.bottom }}</span>
            </span>
          </span>
        </template>
      </span>
      <span class="sr-only">{{ showCount ? `${label}, ${format(total)}` : label }}</span>
    </span>
  </button>
</template>
