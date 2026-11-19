<script lang="ts">
import { h, isVNode, type Component, type CSSProperties, type VNode, type VNodeChild } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import {
  CodeIcon,
  FigmaIcon,
  File01Icon,
  FileZipIcon,
  Folder01Icon,
  Image01Icon,
  MusicNote01Icon,
  Note01Icon,
  Pdf01Icon,
  Presentation01Icon,
  Table01Icon,
  Video01Icon
} from '@hugeicons/core-free-icons';

export type AnimatedListNode = string | number | VNode | Component | (() => VNodeChild);

export interface AnimatedListEntry {
  id?: string | number;
  icon?: AnimatedListNode;
  image?: string;
  title: AnimatedListNode;
  description?: AnimatedListNode;
  meta?: AnimatedListNode;
}

export type AnimatedListItem = string | AnimatedListEntry;

export type AnimatedListAnimation = 'pop' | 'slide' | 'fade';
type State = 'in' | 'above' | 'below';

export interface AnimatedListProps {
  items?: AnimatedListItem[];
  onItemSelect?: (item: AnimatedListItem, index: number) => void;
  renderItem?: (item: AnimatedListItem, index: number, isSelected: boolean) => VNodeChild;
  initialSelectedIndex?: number;
  selectOnHover?: boolean;
  enableArrowNavigation?: boolean;
  loop?: boolean;
  animation?: AnimatedListAnimation | 'none';
  animateOnce?: boolean;
  stagger?: number;
  showGradients?: boolean;
  fadeSize?: number;
  displayScrollbar?: boolean;
  frame?: boolean;
  theme?: 'dark' | 'light';
  accentColor?: string;
  radius?: number;
  gap?: number;
  width?: number | string;
  maxHeight?: number | string;
  className?: string;
  itemClassName?: string;
  style?: CSSProperties;
}

const THEMES: Record<'dark' | 'light', Record<string, string>> = {
  dark: {
    '--al-frame': 'rgba(36, 39, 36, 0.66)',
    '--al-frame-edge': 'rgba(255, 255, 255, 0.08)',
    '--al-frame-highlight': 'rgba(255, 255, 255, 0.07)',
    '--al-frame-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--al-tile': 'linear-gradient(180deg, #363a36 0%, #242724 100%)',
    '--al-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--al-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--al-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--al-well': 'rgba(255, 255, 255, 0.08)',
    '--al-ink': '#f4f5f4',
    '--al-muted': 'rgba(244, 245, 244, 0.55)',
    '--al-thumb': 'rgba(255, 255, 255, 0.16)',
    '--al-ring': 'rgba(244, 245, 244, 0.3)',
    '--al-ring-fill': 'rgba(244, 245, 244, 0.05)',
    '--al-hover': 'brightness(1.12)',
    '--al-press': 'brightness(0.85)',
    '--al-active': 'brightness(1.16)'
  },
  light: {
    '--al-frame': 'rgba(240, 242, 240, 0.8)',
    '--al-frame-edge': 'rgba(22, 24, 22, 0.07)',
    '--al-frame-highlight': 'rgba(255, 255, 255, 0.95)',
    '--al-frame-shadow': '0 22px 44px -22px rgba(22, 24, 22, 0.3), 0 6px 16px -10px rgba(22, 24, 22, 0.16)',
    '--al-tile': 'linear-gradient(180deg, #ffffff 0%, #f5f7f5 100%)',
    '--al-tile-edge': 'rgba(22, 24, 22, 0.08)',
    '--al-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--al-tile-shadow': '0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    '--al-well': 'rgba(22, 24, 22, 0.05)',
    '--al-ink': '#252825',
    '--al-muted': 'rgba(37, 40, 37, 0.55)',
    '--al-thumb': 'rgba(22, 24, 22, 0.16)',
    '--al-ring': 'rgba(22, 24, 22, 0.28)',
    '--al-ring-fill': 'transparent',
    '--al-hover': 'brightness(0.97)',
    '--al-press': 'brightness(0.92)',
    '--al-active': 'none'
  }
};

const glyph = (icon: typeof Folder01Icon) => () => h(HugeiconsIcon, { icon, size: 18, strokeWidth: 1.8 });

export const DEFAULT_ITEMS: AnimatedListEntry[] = [
  { icon: glyph(Folder01Icon), title: 'Brand assets', description: '24 files', meta: '2m' },
  { icon: glyph(Image01Icon), title: 'Launch hero.png', description: '2.4 MB', meta: '18m' },
  { icon: glyph(Video01Icon), title: 'Product tour.mp4', description: '148 MB', meta: '1h' },
  { icon: glyph(Note01Icon), title: 'Pricing notes', description: '1,240 words', meta: '3h' },
  { icon: glyph(CodeIcon), title: 'landing-page.tsx', description: '12 KB', meta: '5h' },
  { icon: glyph(FigmaIcon), title: 'Onboarding flow', description: '38 frames', meta: '8h' },
  { icon: glyph(MusicNote01Icon), title: 'Ambient loop.wav', description: '9.1 MB', meta: '1d' },
  { icon: glyph(Table01Icon), title: 'Q3 forecast', description: '4 sheets', meta: '1d' },
  { icon: glyph(Pdf01Icon), title: 'Brand guidelines.pdf', description: '6.8 MB', meta: '2d' },
  { icon: glyph(Presentation01Icon), title: 'Investor update', description: '22 slides', meta: '3d' },
  { icon: glyph(FileZipIcon), title: 'Icon set.zip', description: '1.2 MB', meta: '4d' },
  { icon: glyph(Image01Icon), title: 'Moodboard.jpg', description: '3.6 MB', meta: '5d' },
  { icon: glyph(File01Icon), title: 'Release notes', description: 'Version 2.4', meta: '1w' },
  { icon: glyph(Folder01Icon), title: 'Archive', description: '118 files', meta: '2w' },
  { icon: glyph(Video01Icon), title: 'Teaser cut.mov', description: '86 MB', meta: '3w' }
];

const HIDDEN: Record<AnimatedListAnimation, Record<'above' | 'below', string>> = {
  pop: { above: 'translate3d(0, -12px, 0) scale(0.8)', below: 'translate3d(0, 12px, 0) scale(0.8)' },
  slide: { above: 'translate3d(0, -28px, 0) scale(0.98)', below: 'translate3d(0, 28px, 0) scale(0.98)' },
  fade: { above: 'translate3d(0, -4px, 0)', below: 'translate3d(0, 4px, 0)' }
};

const SPRING =
  'linear(0, 0.0603, 0.2033, 0.3821, 0.5633, 0.7258, 0.8584, 0.9574, 1.0242, 1.0634, 1.0809, 1.0828, 1.0747, 1.0613, 1.046, 1.0313, 1.0186, 1.0085, 1.0012, 0.9965, 0.994, 0.9931, 0.9933, 0.9941, 0.9953, 0.9966, 0.9978, 0.9988, 1)';

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const FADE_MASK = (() => {
  const steps = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];
  const top = steps.map(t => `rgba(0, 0, 0, ${smootherstep(t).toFixed(3)}) calc(var(--al-fade-top) * ${t})`);
  const bottom = [...steps]
    .reverse()
    .map(t => `rgba(0, 0, 0, ${smootherstep(t).toFixed(3)}) calc(100% - var(--al-fade-bottom) * ${t})`);
  return `linear-gradient(to bottom, ${[...top, ...bottom].join(', ')})`;
})();

const size = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const toEntry = (item: AnimatedListItem): AnimatedListEntry =>
  item !== null && typeof item === 'object' ? item : { title: item };

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true || node === '') return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return node;
  return h(node as Component);
};

export const AnimatedListNodeView = (props: { node?: unknown }) => renderNode(props.node);
AnimatedListNodeView.props = ['node'];
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, useSlots, watch } from 'vue';

interface Engine {
  place: (snap: boolean) => void;
  syncRing: () => void;
  updateFades: () => void;
  sync: () => void;
}

const props = withDefaults(defineProps<AnimatedListProps>(), {
  items: () => DEFAULT_ITEMS,
  onItemSelect: undefined,
  renderItem: undefined,
  initialSelectedIndex: -1,
  selectOnHover: true,
  enableArrowNavigation: true,
  loop: false,
  animation: 'pop',
  animateOnce: false,
  stagger: 0.05,
  showGradients: true,
  fadeSize: 56,
  displayScrollbar: true,
  frame: true,
  theme: 'dark',
  accentColor: undefined,
  radius: 14,
  gap: 8,
  width: 420,
  maxHeight: 440,
  className: '',
  itemClassName: '',
  style: undefined
});

const slots = useSlots();

const rootRef = ref<HTMLDivElement | null>(null);
const viewportRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const indicatorRef = ref<HTMLSpanElement | null>(null);
const ringRef = ref<HTMLSpanElement | null>(null);
const itemRefs: (HTMLDivElement | null)[] = [];
let engine: Engine | null = null;
let keyboard = false;
let navigating = false;
const selected = ref(props.initialSelectedIndex);
const baseId = useId();

const settings = {
  get items() {
    return props.items;
  },
  get onItemSelect() {
    return props.onItemSelect;
  },
  get selected() {
    return selected.value;
  },
  get selectOnHover() {
    return props.selectOnHover;
  },
  get enableArrowNavigation() {
    return props.enableArrowNavigation;
  },
  get loop() {
    return props.loop;
  },
  get animation() {
    return props.animation;
  },
  get animateOnce() {
    return props.animateOnce;
  },
  get stagger() {
    return props.stagger;
  },
  get showGradients() {
    return props.showGradients;
  },
  get fadeSize() {
    return props.fadeSize;
  }
};

const setItemRef = (index: number) => (element: unknown) => {
  itemRefs[index] = (element as HTMLDivElement | null) ?? null;
};

const rootClass = computed(() =>
  `animated-list${props.frame ? ' animated-list--framed' : ''} ${props.className}`.trim()
);

const rootStyle = computed(
  () =>
    ({
      ...(THEMES[props.theme] ?? THEMES.dark),
      '--al-radius': `${Math.max(0, props.radius)}px`,
      '--al-gap': `${Math.max(0, props.gap)}px`,
      '--al-width': size(props.width),
      '--al-accent': props.accentColor || 'var(--al-ink)',
      ...(props.accentColor
        ? {
            '--al-ring': props.accentColor,
            '--al-ring-fill': `color-mix(in srgb, ${props.accentColor} 8%, transparent)`
          }
        : {}),
      ...props.style
    }) as CSSProperties
);

const viewportStyle = computed(
  () =>
    ({
      maxHeight: size(props.maxHeight),
      maskImage: props.showGradients ? FADE_MASK : undefined,
      WebkitMaskImage: props.showGradients ? FADE_MASK : undefined
    }) as CSSProperties
);

const activeDescendant = computed(() =>
  selected.value >= 0 && selected.value < props.items.length ? `${baseId}-${selected.value}` : undefined
);

const entries = computed(() => props.items.map(item => toEntry(item)));

let teardown: (() => void) | null = null;

onMounted(() => {
  const root = rootRef.value;
  const viewport = viewportRef.value;
  const track = trackRef.value;
  const indicator = indicatorRef.value;
  const ring = ringRef.value;
  if (!root || !viewport || !track || !indicator || !ring) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const springEase = CSS.supports?.('transition-timing-function', 'linear(0, 1)')
    ? SPRING
    : 'cubic-bezier(0.34, 1.4, 0.64, 1)';
  const transition = `transform 620ms ${springEase}, opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), filter 200ms ease`;
  const motion = { y: 0, h: 0, vy: 0, vh: 0, ty: 0, th: 0, ready: false };
  const fades = { top: '', bottom: '' };
  let boxes: (number[] | null)[] = [];
  let current: AnimatedListAnimation | 'none' | null = null;
  let entered = false;
  let engaged = false;
  let pointer = [0, 0];
  let raf = 0;
  let last = 0;

  const mode = (): AnimatedListAnimation | 'none' => {
    const chosen = settings.animation;
    if (chosen === 'none' || !HIDDEN[chosen]) return 'none';
    return reduced ? 'fade' : chosen;
  };

  const apply = (element: HTMLElement, state: State) => {
    element.dataset.state = state;
    const pose = current && current !== 'none' && state !== 'in' ? HIDDEN[current][state] : '';
    element.style.transform = pose;
    element.style.opacity = pose ? '0' : '';
  };

  const syncRing = () => {
    const item = itemRefs[settings.selected];
    if (!item) return;
    const state = (item.dataset.state as State | undefined) || 'in';
    if (state === ring.dataset.state) return;
    ring.style.transitionDelay = item.style.transitionDelay;
    apply(ring, state);
  };

  const write = () => {
    indicator.style.transform = `translate3d(0, ${motion.y.toFixed(2)}px, 0)`;
    indicator.style.height = `${motion.h.toFixed(2)}px`;
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    const omega = 30;
    const zeta = 0.78;
    const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      motion.vy += (omega * omega * (motion.ty - motion.y) - 2 * zeta * omega * motion.vy) * h;
      motion.vh += (omega * omega * (motion.th - motion.h) - 2 * zeta * omega * motion.vh) * h;
      motion.y += motion.vy * h;
      motion.h += motion.vh * h;
    }
    const moving =
      Math.abs(motion.ty - motion.y) > 0.05 ||
      Math.abs(motion.th - motion.h) > 0.05 ||
      Math.abs(motion.vy) + Math.abs(motion.vh) > 0.5;
    if (!moving) {
      motion.y = motion.ty;
      motion.h = motion.th;
      motion.vy = motion.vh = 0;
    }
    write();
    if (moving) raf = requestAnimationFrame(frame);
  };

  const place = (snap: boolean) => {
    const item = itemRefs[settings.selected];
    if (!item) {
      indicator.style.opacity = '0';
      motion.ready = false;
      return;
    }
    indicator.style.opacity = '1';
    motion.ty = item.offsetTop;
    motion.th = item.offsetHeight;
    if (snap || reduced || !motion.ready) {
      motion.y = motion.ty;
      motion.h = motion.th;
      motion.vy = motion.vh = 0;
      motion.ready = true;
      write();
      return;
    }
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  const updateFades = () => {
    const span = Math.max(1, settings.fadeSize);
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const top = settings.showGradients ? Math.min(span, Math.max(0, scrollTop)) : 0;
    const bottom = settings.showGradients ? Math.min(span, Math.max(0, scrollHeight - clientHeight - scrollTop)) : 0;
    const nextTop = `${top.toFixed(1)}px`;
    const nextBottom = `${bottom.toFixed(1)}px`;
    if (nextTop !== fades.top) {
      fades.top = nextTop;
      viewport.style.setProperty('--al-fade-top', nextTop);
    }
    if (nextBottom !== fades.bottom) {
      fades.bottom = nextBottom;
      viewport.style.setProperty('--al-fade-bottom', nextBottom);
    }
  };

  const measure = () => {
    const offset = track.offsetTop;
    boxes = itemRefs.map(item => (item ? [offset + item.offsetTop, item.offsetHeight] : null));
  };

  const reveal = (entrance: boolean) => {
    if (!entered) return;
    const top = viewport.scrollTop;
    const view = viewport.clientHeight;
    let order = 0;
    itemRefs.forEach((item, index) => {
      const box = boxes[index];
      if (!item || !box) return;
      const start = box[0] - top;
      const overlap = Math.min(view, start + box[1]) - Math.max(0, start);
      const hidden =
        current !== 'none' && overlap < Math.min(box[1], view) * 0.5 && !(settings.animateOnce && item.dataset.seen);
      const state: State = hidden ? (start + box[1] / 2 < view / 2 ? 'above' : 'below') : 'in';
      if (state === item.dataset.state) return;
      const delay = entrance && !hidden ? (order++ * Math.max(0, settings.stagger)).toFixed(3) : 0;
      item.style.transitionDelay = delay ? `${delay}s, ${delay}s, 0s` : '';
      if (!hidden) item.dataset.seen = 'true';
      apply(item, state);
    });
    syncRing();
  };

  const sync = () => {
    itemRefs.length = settings.items.length;
    const items = itemRefs.filter((item): item is HTMLDivElement => Boolean(item));
    const next = mode();
    const changed = next !== current;
    const restyle = changed ? items : items.filter(item => !item.dataset.state);
    current = next;
    if (current === 'none') entered = true;
    if (restyle.length) {
      const elements: HTMLElement[] = changed ? [...restyle, ring] : restyle;
      for (const element of elements) element.style.transition = 'none';
      for (const item of restyle)
        apply(item, current === 'none' ? 'in' : (item.dataset.state as State | undefined) || 'below');
      if (changed) apply(ring, (itemRefs[settings.selected]?.dataset.state as State | undefined) || 'in');
      void root.offsetHeight;
      for (const element of elements) element.style.transition = transition;
    }
    measure();
    reveal(restyle.length > 0);
  };

  sync();

  const gate =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          (observed, observer) => {
            if (!observed.some(entry => entry.isIntersecting)) return;
            observer.disconnect();
            if (entered) return;
            entered = true;
            measure();
            reveal(true);
          },
          { rootMargin: '0px 0px -10% 0px' }
        );
  if (!entered) {
    if (gate) gate.observe(root);
    else {
      entered = true;
      reveal(true);
    }
  }

  const resizeObserver = new ResizeObserver(() => {
    place(true);
    updateFades();
    measure();
    reveal(false);
  });
  resizeObserver.observe(viewport);
  resizeObserver.observe(track);

  const onScroll = () => {
    updateFades();
    reveal(false);
  };

  const onKey = (event: KeyboardEvent) => {
    if (!settings.enableArrowNavigation || event.defaultPrevented) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const active = document.activeElement;
    const focused = active === viewport;
    const idle = !active || active === document.body || active === document.documentElement;
    if (!focused && !(engaged && idle)) return;
    const count = settings.items.length;
    if (!count) return;
    const index = settings.selected;
    let next: number | null = null;
    if (event.key === 'ArrowDown') next = index < 0 ? 0 : index + 1;
    else if (event.key === 'ArrowUp') next = index < 0 ? count - 1 : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;
    else if ((event.key === 'Enter' || (focused && event.key === ' ')) && index >= 0 && index < count) {
      event.preventDefault();
      settings.onItemSelect?.(settings.items[index], index);
      return;
    }
    if (next === null) return;
    event.preventDefault();
    next = settings.loop ? (next + count) % count : Math.min(count - 1, Math.max(0, next));
    keyboard = true;
    navigating = true;
    selected.value = next;
  };

  const onPointerMove = (event: PointerEvent) => {
    const moved = event.clientX !== pointer[0] || event.clientY !== pointer[1];
    pointer = [event.clientX, event.clientY];
    if (!navigating || !moved) return;
    navigating = false;
    const item = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-index]') : null;
    if (item && root.contains(item) && settings.selectOnHover) selected.value = Number(item.dataset.index);
  };

  const onEnter = () => {
    engaged = true;
  };
  const onLeave = () => {
    engaged = false;
  };

  viewport.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('keydown', onKey);
  root.addEventListener('pointerenter', onEnter);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('pointermove', onPointerMove);

  updateFades();
  place(true);
  syncRing();

  engine = { place, syncRing, updateFades, sync };

  teardown = () => {
    cancelAnimationFrame(raf);
    gate?.disconnect();
    resizeObserver.disconnect();
    viewport.removeEventListener('scroll', onScroll);
    window.removeEventListener('keydown', onKey);
    root.removeEventListener('pointerenter', onEnter);
    root.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('pointermove', onPointerMove);
    engine = null;
  };
});

onBeforeUnmount(() => {
  teardown?.();
  teardown = null;
});

watch(
  [() => props.items, () => props.animation],
  () => {
    engine?.sync();
  },
  { flush: 'post' }
);

watch(
  [selected, () => props.fadeSize, () => props.showGradients],
  () => {
    if (!engine) return;
    engine.place(false);
    engine.syncRing();
    if (!keyboard) return;
    keyboard = false;
    const viewport = viewportRef.value;
    const track = trackRef.value;
    const item = itemRefs[selected.value];
    if (!viewport || !track || !item) return;
    const top = track.offsetTop + item.offsetTop;
    const bottom = top + item.offsetHeight;
    const room = Math.max(0, (viewport.clientHeight - item.offsetHeight) / 2);
    const margin = Math.min(props.showGradients ? Math.max(12, props.fadeSize) : 12, room);
    if (top < viewport.scrollTop + margin) {
      viewport.scrollTo({ top: Math.max(0, top - margin), behavior: 'smooth' });
    } else if (bottom > viewport.scrollTop + viewport.clientHeight - margin) {
      viewport.scrollTo({ top: bottom - viewport.clientHeight + margin, behavior: 'smooth' });
    }
  },
  { flush: 'post' }
);

watch(
  [() => props.showGradients, () => props.fadeSize, () => props.maxHeight, () => props.gap],
  () => {
    engine?.updateFades();
  },
  { flush: 'post' }
);

const hover = (index: number) => {
  if (!navigating) selected.value = index;
};

const choose = (item: AnimatedListItem, index: number) => {
  selected.value = index;
  props.onItemSelect?.(item, index);
};
</script>

<template>
  <div ref="rootRef" :class="rootClass" :data-animated="animation !== 'none' ? '' : undefined" :style="rootStyle">
    <div
      ref="viewportRef"
      :class="['animated-list__viewport', { 'animated-list__viewport--bare': !displayScrollbar }]"
      role="listbox"
      tabindex="0"
      :aria-activedescendant="activeDescendant"
      :style="viewportStyle"
    >
      <div ref="trackRef" class="animated-list__track">
        <div
          v-for="(entry, index) in entries"
          :key="entry.id ?? index"
          :ref="setItemRef(index)"
          :id="`${baseId}-${index}`"
          :class="`animated-list__item ${itemClassName}`.trim()"
          role="option"
          :aria-selected="index === selected"
          :data-index="index"
          :data-selected="index === selected ? '' : undefined"
          @pointerenter="selectOnHover ? hover(index) : undefined"
          @click="choose(items[index], index)"
        >
          <slot v-if="slots.item" name="item" :item="items[index]" :index="index" :selected="index === selected" />
          <AnimatedListNodeView
            v-else-if="renderItem"
            :node="() => renderItem!(items[index], index, index === selected)"
          />
          <template v-else>
            <span v-if="entry.image || entry.icon" class="animated-list__lead">
              <img v-if="entry.image" :src="entry.image" alt="" draggable="false" />
              <AnimatedListNodeView v-else :node="entry.icon" />
            </span>
            <span class="animated-list__text">
              <span class="animated-list__title"><AnimatedListNodeView :node="entry.title" /></span>
              <span v-if="entry.description" class="animated-list__description">
                <AnimatedListNodeView :node="entry.description" />
              </span>
            </span>
            <span v-if="entry.meta" class="animated-list__meta"><AnimatedListNodeView :node="entry.meta" /></span>
          </template>
          <span class="animated-list__rim" aria-hidden="true" />
        </div>
        <span ref="indicatorRef" class="animated-list__indicator" aria-hidden="true">
          <span ref="ringRef" class="animated-list__ring" />
        </span>
      </div>
    </div>
    <span v-if="frame" class="animated-list__frame-rim" aria-hidden="true" />
  </div>
</template>

<style>
.animated-list {
  position: relative;
  width: min(100%, var(--al-width));
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: calc(var(--al-radius) + 12px);
  color: var(--al-ink);
  -webkit-tap-highlight-color: transparent;
}

.animated-list--framed {
  padding: 6px;
  background: var(--al-frame);
  box-shadow: var(--al-frame-shadow);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
}

.animated-list:has(> .animated-list__viewport:focus-visible) {
  outline: 2px solid var(--al-accent);
  outline-offset: 3px;
}

.animated-list__frame-rim {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--al-frame-edge),
    inset 0 1px 0 var(--al-frame-highlight);
  pointer-events: none;
}

.animated-list__viewport {
  --al-fade-top: 0px;
  --al-fade-bottom: 0px;
  position: relative;
  box-sizing: border-box;
  padding: 6px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: calc(var(--al-radius) + 6px);
  outline: none;
  scrollbar-width: thin;
  scrollbar-color: var(--al-thumb) transparent;
}

.animated-list__viewport::-webkit-scrollbar {
  width: 6px;
}

.animated-list__viewport::-webkit-scrollbar-track {
  background: transparent;
}

.animated-list__viewport::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: var(--al-thumb);
}

.animated-list__viewport--bare {
  scrollbar-width: none;
}

.animated-list__viewport--bare::-webkit-scrollbar {
  display: none;
}

.animated-list__track {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--al-gap);
}

.animated-list__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 10px 14px 10px 10px;
  box-sizing: border-box;
  border-radius: var(--al-radius);
  background: var(--al-tile);
  box-shadow: var(--al-tile-shadow);
  color: var(--al-ink);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.animated-list[data-animated] .animated-list__item:not([data-state]) {
  opacity: 0;
}

@media (hover: hover) {
  .animated-list__item:hover {
    filter: var(--al-hover);
  }
}

.animated-list__item[data-selected]:not(:active) {
  filter: var(--al-active);
}

.animated-list__item:active {
  filter: var(--al-press);
}

.animated-list__lead {
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  overflow: hidden;
  border-radius: max(8px, calc(var(--al-radius) - 4px));
  background: var(--al-well);
  color: var(--al-ink);
}

.animated-list__lead img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.animated-list__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.animated-list__title {
  overflow: hidden;
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.animated-list__description {
  overflow: hidden;
  font-size: 13px;
  line-height: 1.35;
  color: var(--al-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.animated-list__meta {
  flex: none;
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
  color: var(--al-muted);
}

.animated-list__rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--al-tile-edge),
    inset 0 1px 0 var(--al-tile-highlight);
  pointer-events: none;
}

.animated-list__indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  height: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.animated-list__ring {
  position: absolute;
  inset: 0;
  border-radius: var(--al-radius);
  background: var(--al-ring-fill);
  box-shadow: inset 0 0 0 1px var(--al-ring);
}
</style>
