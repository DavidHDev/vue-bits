<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch, type CSSProperties } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';

export interface FlowingMenuItem {
  text: string;
  link?: string;
  image?: string;
  marquee?: string;
  meta?: string;
}

interface FlowingMenuProps {
  items?: FlowingMenuItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'alternate';
  followCursor?: number;
  duration?: number;
  stretch?: number;
  magnet?: number;
  bandInset?: number;
  bandRadius?: number;
  carryContent?: boolean;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  dividers?: boolean;
  dimInactive?: boolean;
  align?: 'center' | 'left';
  showIndex?: boolean;
  showArrow?: boolean;
  imageShape?: 'pill' | 'rounded' | 'circle';
  intro?: boolean;
  activeIndex?: number;
  onItemClick?: (item: FlowingMenuItem, index: number, event: MouseEvent) => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

interface Row {
  item?: HTMLLIElement | null;
  band?: HTMLDivElement | null;
  track?: HTMLDivElement | null;
}

interface Marquee {
  x: number;
  part: number;
  spin: number;
  covered: boolean;
}

interface Metric {
  top: number;
  height: number;
}

type Edge = 'top' | 'bottom' | 'center';

const props = withDefaults(defineProps<FlowingMenuProps>(), {
  items: () => [],
  speed: 60,
  direction: 'left',
  followCursor: 0.4,
  duration: 0.5,
  stretch: 0.6,
  magnet: 0.25,
  bandInset: 0,
  bandRadius: 0,
  carryContent: false,
  textColor: '#ffffff',
  bgColor: '#111111',
  marqueeBgColor: '#ffffff',
  marqueeTextColor: '#111111',
  borderColor: 'rgba(255, 255, 255, 0.14)',
  dividers: true,
  dimInactive: false,
  align: 'center',
  showIndex: false,
  showArrow: false,
  imageShape: 'pill',
  intro: true,
  activeIndex: undefined,
  onItemClick: undefined,
  ariaLabel: 'Menu',
  className: '',
  style: undefined
});

const DIRECTIONS = ['left', 'right', 'alternate'];
const SHAPES = ['pill', 'rounded', 'circle'];
const EASE = 'cubic-bezier(0.2, 0.9, 0.2, 1)';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const prefersReduced = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

const rootRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);
const floatRef = ref<HTMLDivElement | null>(null);
const rows: Row[] = [];
const marquees: Marquee[] = [];
let metrics: (Metric | null)[] = [];
const band = {
  top: 0,
  bottom: 0,
  vTop: 0,
  vBottom: 0,
  toTop: 0,
  toBottom: 0,
  lead: 1,
  shown: false,
  index: -1,
  rest: 0
};
const cursor: { x: number; y: number | null; t: number; vx: number } = { x: 0, y: null, t: 0, vx: 0 };
const engine: { raf: number; last: number; timers: ReturnType<typeof setTimeout>[]; touched: boolean } = {
  raf: 0,
  last: 0,
  timers: [],
  touched: false
};
const copies = ref<number[]>([]);
const layerRefs: (HTMLDivElement | null)[] = [];
const layerTracks: (HTMLDivElement | null)[] = [];
const roll = { current: 0, p: 1, dir: 1, slots: [-1, -1], fromOpacity: 0, fromOffset: 0 };
const slots = ref<number[]>([-1, -1]);

const settings = computed(() => ({
  speed: Math.max(0, props.speed),
  direction: DIRECTIONS.includes(props.direction) ? props.direction : 'left',
  followCursor: clamp(props.followCursor, 0, 1),
  duration: Math.max(0.1, props.duration),
  stretch: clamp(props.stretch, 0, 1),
  magnet: clamp(props.magnet, 0, 1),
  bandInset: Math.max(0, props.bandInset),
  bandRadius: Math.max(0, props.bandRadius),
  carryContent: props.carryContent,
  dimInactive: props.dimInactive,
  onItemClick: props.onItemClick
}));

const shape = computed(() => (SHAPES.includes(props.imageShape) ? props.imageShape : 'pill'));

const rootStyle = computed(
  () =>
    ({
      backgroundColor: props.bgColor,
      color: props.textColor,
      '--flowing-menu-border': props.borderColor,
      ...props.style
    }) as CSSProperties
);

const bandStyle = computed(() => ({ backgroundColor: props.marqueeBgColor, color: props.marqueeTextColor }));

const setRow = (index: number, key: keyof Row, el: unknown) => {
  rows[index] = { ...rows[index], [key]: (el as HTMLElement | null) ?? null } as Row;
};

const setLayer = (slot: number, el: unknown) => {
  layerRefs[slot] = (el as HTMLDivElement | null) ?? null;
};

const setLayerTrack = (slot: number, el: unknown) => {
  layerTracks[slot] = (el as HTMLDivElement | null) ?? null;
};

const marqueeAt = (index: number) => {
  if (!marquees[index]) marquees[index] = { x: 0, part: 0, spin: 0, covered: false };
  return marquees[index];
};

const insetFor = (height: number) => Math.min(settings.value.bandInset, Math.max(0, height / 2 - 2));

const markRows = () => {
  const b = band;
  const dim = settings.value.dimInactive && b.index >= 0;
  rows.forEach((row, index) => {
    if (!row?.item) return;
    if (index === b.index) row.item.setAttribute('data-current', '');
    else row.item.removeAttribute('data-current');
    if (dim && index !== b.index) row.item.setAttribute('data-dimmed', '');
    else row.item.removeAttribute('data-dimmed');
  });
};

const rowHeight = () => metrics.find(Boolean)?.height ?? 0;

const paintFloat = () => {
  const b = band;
  const s = settings.value;
  const r = roll;
  const el = floatRef.value;
  const list = listRef.value;
  if (!el || !list) return;
  if (!b.shown || b.bottom - b.top < 0.25) {
    el.style.visibility = 'hidden';
    return;
  }
  const height = rowHeight();
  const side = Math.min(s.bandInset, Math.max(0, height / 2 - 2));
  const radius = Math.min(s.bandRadius, (b.bottom - b.top) / 2, Math.max(0, list.clientWidth / 2 - side));
  el.style.visibility = 'visible';
  el.style.clipPath = `inset(${b.top.toFixed(2)}px ${side}px ${(list.clientHeight - b.bottom).toFixed(2)}px ${side}px round ${radius.toFixed(2)}px)`;
  const center = (b.top + b.bottom) / 2;
  const eased = 1 - Math.pow(1 - r.p, 3);
  const travel = height * 0.8 * r.dir;
  [0, 1].forEach(slot => {
    const layer = layerRefs[slot];
    const index = r.slots[slot];
    if (!layer) return;
    const current = slot === r.current;
    const visible = index >= 0 && (current || r.p < 1);
    layer.style.visibility = visible ? 'visible' : 'hidden';
    if (!visible) return;
    const offset = current ? (1 - eased) * travel : r.fromOffset - eased * travel;
    const opacity = current ? eased : r.fromOpacity * (1 - eased);
    layer.style.height = `${height}px`;
    layer.style.opacity = opacity.toFixed(3);
    layer.style.transform = `translate3d(0, ${(center - height / 2 + offset).toFixed(2)}px, 0)`;
    const state = marqueeAt(index);
    state.covered = true;
    const track = layerTracks[slot];
    if (track) track.style.transform = `translate3d(${state.x.toFixed(2)}px, 0, 0)`;
  });
};

const paint = () => {
  const b = band;
  const s = settings.value;
  const height = Math.max(0, b.bottom - b.top);
  rows.forEach((row, index) => {
    const m = metrics[index];
    if (!row?.band || !m) return;
    const state = marqueeAt(index);
    state.covered = false;
    const from = Math.max(b.top, m.top);
    const to = Math.min(b.bottom, m.top + m.height);
    if (s.carryContent || !b.shown || to - from < 0.25) {
      row.band.style.visibility = 'hidden';
    } else {
      const side = Math.min(s.bandInset, Math.max(0, m.height / 2 - 2));
      const radius = Math.min(s.bandRadius, height / 2, Math.max(0, (row.item?.clientWidth ?? 0) / 2 - side));
      row.band.style.visibility = 'visible';
      row.band.style.clipPath = `inset(${(b.top - m.top).toFixed(2)}px ${side}px ${(m.top + m.height - b.bottom).toFixed(2)}px ${side}px round ${radius.toFixed(2)}px)`;
      state.covered = (to - from) / m.height > 0.04;
    }
    if (row.track) row.track.style.transform = `translate3d(${state.x.toFixed(2)}px, 0, 0)`;
  });
  if (s.carryContent) paintFloat();
  else if (floatRef.value) floatRef.value.style.visibility = 'hidden';
};

const frame = (now: number) => {
  const loop = engine;
  loop.raf = 0;
  const s = settings.value;
  const b = band;
  const c = cursor;
  const reduced = prefersReduced();
  const elapsed = clamp((now - loop.last) / 1000, 0, 1 / 20);
  loop.last = now;
  let busy = false;

  if (b.shown) {
    const current = b.index >= 0 ? metrics[b.index] : null;
    if (current) {
      const inset = insetFor(current.height);
      const lean =
        c.y === null || reduced
          ? 0
          : clamp((c.y - (current.top + current.height / 2)) * s.magnet, -current.height * 0.3, current.height * 0.3);
      b.toTop = current.top + inset + lean;
      b.toBottom = current.top + current.height - inset + lean;
    } else if (b.index < 0) {
      b.toTop = b.toBottom = b.rest;
    }
    const gap = (b.toTop + b.toBottom) / 2 - (b.top + b.bottom) / 2;
    if (Math.abs(gap) > 2) b.lead = gap > 0 ? 1 : -1;
    if (reduced) {
      b.top = b.toTop;
      b.bottom = b.toBottom;
      b.vTop = b.vBottom = 0;
    } else {
      const omega = (Math.PI * 2) / s.duration;
      const fast = omega * (1 + 1.1 * s.stretch);
      const slow = omega * (1 - 0.4 * s.stretch);
      const zeta = 1 - 0.3 * s.stretch;
      const wTop = b.lead > 0 ? slow : fast;
      const wBottom = b.lead > 0 ? fast : slow;
      const steps = Math.max(1, Math.ceil(elapsed / (1 / 240)));
      const dt = elapsed / steps;
      for (let i = 0; i < steps; i++) {
        b.vTop += (-wTop * wTop * (b.top - b.toTop) - 2 * zeta * wTop * b.vTop) * dt;
        b.vBottom += (-wBottom * wBottom * (b.bottom - b.toBottom) - 2 * zeta * wBottom * b.vBottom) * dt;
        b.top += b.vTop * dt;
        b.bottom += b.vBottom * dt;
        if (b.bottom < b.top) {
          const mid = (b.top + b.bottom) / 2;
          const v = (b.vTop + b.vBottom) / 2;
          b.top = b.bottom = mid;
          b.vTop = b.vBottom = v;
        }
      }
    }
    const resting =
      Math.abs(b.top - b.toTop) < 0.1 &&
      Math.abs(b.bottom - b.toBottom) < 0.1 &&
      Math.abs(b.vTop) < 2 &&
      Math.abs(b.vBottom) < 2;
    if (resting) {
      b.top = b.toTop;
      b.bottom = b.toBottom;
      b.vTop = b.vBottom = 0;
      if (b.index < 0 && b.bottom - b.top < 0.5) b.shown = false;
    } else busy = true;
  }

  const r = roll;
  if (r.p < 1) {
    r.p = reduced ? 1 : Math.min(1, r.p + elapsed / (s.duration * 0.8));
    busy = true;
  }

  c.vx *= Math.exp(-elapsed / 0.3);
  const push = clamp(c.vx * s.followCursor * 0.55, -1600, 1600);

  marquees.forEach((state, index) => {
    if (!state) return;
    const goal = state.covered ? 1 : 0;
    state.spin += (goal - state.spin) * (1 - Math.exp(-elapsed / 0.35));
    if (Math.abs(goal - state.spin) < 0.002) state.spin = goal;
    if (!state.covered && state.spin === 0) return;
    busy = true;
    if (state.part <= 0 || reduced) return;
    const flow = s.direction === 'alternate' ? (index % 2 ? 1 : -1) : s.direction === 'right' ? 1 : -1;
    state.x += (flow * s.speed + push) * state.spin * elapsed;
    state.x = (((state.x % state.part) + state.part) % state.part) - state.part;
  });

  paint();
  if (busy) loop.raf = requestAnimationFrame(frame);
};

const kick = () => {
  const loop = engine;
  if (loop.raf || typeof window === 'undefined') return;
  loop.last = performance.now();
  loop.raf = requestAnimationFrame(frame);
};

const goTo = (index: number, from: Edge) => {
  const m = metrics[index];
  if (!m) return;
  const b = band;
  const inset = insetFor(m.height);
  const top = m.top + inset;
  const bottom = m.top + m.height - inset;
  const r = roll;
  const showing = r.slots[r.current];
  if (settings.value.carryContent && showing !== index) {
    if (!b.shown || showing < 0) {
      r.slots[r.current] = index;
      r.p = 1;
    } else {
      const eased = 1 - Math.pow(1 - r.p, 3);
      r.fromOpacity = eased;
      r.fromOffset = (1 - eased) * m.height * 0.8 * r.dir;
      r.dir = index > showing ? 1 : -1;
      r.current = 1 - r.current;
      r.slots[r.current] = index;
      r.p = 0;
    }
    slots.value = [...r.slots];
  }
  if (!b.shown) {
    const start = from === 'bottom' ? bottom : from === 'center' ? (top + bottom) / 2 : top;
    b.top = b.bottom = start;
    b.vTop = b.vBottom = 0;
    b.shown = true;
  }
  const shift = (top + bottom) / 2 - (b.top + b.bottom) / 2;
  if (Math.abs(shift) > 0.5) b.lead = shift > 0 ? 1 : -1;
  else b.lead = from === 'bottom' ? -1 : 1;
  b.toTop = top;
  b.toBottom = bottom;
  b.index = index;
  markRows();
  kick();
};

const release = (toward: Edge) => {
  const b = band;
  if (!b.shown) return;
  const point = toward === 'top' ? b.toTop : toward === 'bottom' ? b.toBottom : (b.toTop + b.toBottom) / 2;
  b.lead = toward === 'top' ? -1 : 1;
  b.rest = point;
  b.toTop = b.toBottom = point;
  b.index = -1;
  cursor.y = null;
  markRows();
  kick();
};

const rowAt = (clientY: number) => {
  const list = listRef.value;
  if (!list) return -1;
  const y = clientY - list.getBoundingClientRect().top;
  return metrics.findIndex(m => m && y >= m.top && y < m.top + m.height);
};

const halfOf = (clientY: number, index: number): 'top' | 'bottom' => {
  const list = listRef.value;
  const m = metrics[index];
  if (!list || !m) return 'top';
  return clientY - list.getBoundingClientRect().top - m.top < m.height / 2 ? 'top' : 'bottom';
};

const stopIntro = () => {
  const loop = engine;
  loop.touched = true;
  loop.timers.forEach(clearTimeout);
  loop.timers = [];
};

const sameCopies = (current: number[], next: number[]) =>
  current.length === next.length && current.every((value, index) => value === next[index]);

const measure = () => {
  const list = listRef.value;
  metrics = rows.map(row => (row?.item ? { top: row.item.offsetTop, height: row.item.offsetHeight } : null));
  if (list && metrics[0]) {
    const height = metrics[0].height;
    const inset = insetFor(height);
    rootRef.value?.style.setProperty('--flowing-menu-band', String(height ? (height - inset * 2) / height : 1));
  }
  const next = rows.map((row, index) => {
    const state = marqueeAt(index);
    const part = row?.track?.firstElementChild;
    const width = part?.getBoundingClientRect().width ?? 0;
    const total = row?.item?.getBoundingClientRect().width ?? 0;
    if (width > 0) {
      state.part = width;
      state.x = (((state.x % width) + width) % width) - width;
    }
    return width > 0 ? Math.max(2, Math.ceil(total / width) + 1) : 3;
  });
  if (!sameCopies(copies.value, next)) copies.value = next;
  const b = band;
  if (b.shown && b.index >= 0) {
    const m = metrics[b.index];
    if (m) {
      const inset = insetFor(m.height);
      b.toTop = m.top + inset;
      b.toBottom = m.top + m.height - inset;
    }
  }
  paint();
  kick();
};

let observer: ResizeObserver | null = null;

const observe = () => {
  observer?.disconnect();
  observer = null;
  measure();
  const root = rootRef.value;
  if (!root || typeof ResizeObserver === 'undefined') return;
  observer = new ResizeObserver(() => measure());
  observer.observe(root);
  rows.forEach(row => {
    const part = row?.track?.firstElementChild;
    if (part) observer?.observe(part);
  });
};

const syncRows = () => {
  rows.length = props.items.length;
  marquees.length = props.items.length;
  paint();
};

const runIntro = () => {
  if (!props.intro || prefersReduced()) return;
  const root = rootRef.value;
  if (!root) return;
  root.querySelectorAll('[data-intro-line]').forEach((node, index) => {
    node.animate([{ transform: 'translateY(110%)' }, { transform: 'none' }], {
      duration: 900,
      delay: index * 70,
      easing: EASE,
      fill: 'backwards'
    });
  });
  root.querySelectorAll('[data-intro-fade]').forEach((node, index) => {
    node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 700,
      delay: 200 + index * 40,
      easing: 'ease',
      fill: 'backwards'
    });
  });
  root.querySelectorAll('[data-intro-rule]').forEach((node, index) => {
    node.animate([{ transform: 'scaleX(0)' }, { transform: 'none' }], {
      duration: 1100,
      delay: index * 70,
      easing: EASE,
      fill: 'backwards'
    });
  });
  const loop = engine;
  const count = rows.filter(Boolean).length;
  const start = 650 + count * 70;
  for (let index = 0; index < count; index++) {
    loop.timers.push(
      setTimeout(
        () => {
          if (!loop.touched) goTo(index, 'top');
        },
        start + index * 170
      )
    );
  }
  loop.timers.push(
    setTimeout(
      () => {
        if (!loop.touched) release('bottom');
      },
      start + count * 170 + 120
    )
  );
};

onMounted(() => {
  observe();
  syncRows();
  runIntro();
});

watch(
  () => [props.items, props.bandInset],
  () => nextTick(observe),
  { flush: 'post' }
);

watch(
  () => ({ ...props }),
  () => nextTick(syncRows),
  { flush: 'post' }
);

onUpdated(syncRows);

onBeforeUnmount(() => {
  observer?.disconnect();
  engine.timers.forEach(clearTimeout);
  engine.timers = [];
  cancelAnimationFrame(engine.raf);
});

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return;
  stopIntro();
  const c = cursor;
  const now = performance.now();
  const gap = (now - c.t) / 1000;
  if (gap > 0 && gap < 0.1) {
    const instant = (event.clientX - c.x) / gap;
    c.vx += (instant - c.vx) * (1 - Math.exp(-gap / 0.08));
  }
  c.x = event.clientX;
  c.t = now;
  const list = listRef.value;
  if (list) c.y = event.clientY - list.getBoundingClientRect().top;
  const index = rowAt(event.clientY);
  if (index >= 0 && index !== band.index) goTo(index, halfOf(event.clientY, index));
  else kick();
};

const onPointerLeave = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return;
  const list = listRef.value;
  const b = band;
  if (!list || b.index < 0) return;
  const rect = list.getBoundingClientRect();
  if (event.clientY <= rect.top) release('top');
  else if (event.clientY >= rect.bottom) release('bottom');
  else release(halfOf(event.clientY, b.index));
};

const onLinkPointerDown = (event: PointerEvent, index: number) => {
  if (event.pointerType !== 'touch') return;
  stopIntro();
  goTo(index, halfOf(event.clientY, index));
};

const onLinkFocus = (event: FocusEvent, index: number) => {
  if (!(event.currentTarget as HTMLElement).matches(':focus-visible')) return;
  stopIntro();
  goTo(index, 'top');
};

const onLinkBlur = (event: FocusEvent) => {
  const next = event.relatedTarget as Node | null;
  if (next && listRef.value?.contains(next)) return;
  release('bottom');
};

const onLinkClick = (event: MouseEvent, item: FlowingMenuItem, index: number) =>
  settings.value.onItemClick?.(item, index, event);

const partCount = (index: number) => copies.value[index] ?? 3;
</script>

<template>
  <nav
    ref="rootRef"
    :class="['flowing-menu', className].filter(Boolean).join(' ')"
    :style="rootStyle"
    :aria-label="ariaLabel"
    :data-align="align === 'left' ? 'left' : 'center'"
    :data-shape="shape"
  >
    <ul ref="listRef" class="flowing-menu__list" @pointermove="onPointerMove" @pointerleave="onPointerLeave">
      <li
        v-for="(item, index) in items"
        :key="`${item.text}-${index}`"
        :ref="el => setRow(index, 'item', el)"
        class="flowing-menu__item"
      >
        <span v-if="dividers && index > 0" class="flowing-menu__divider" data-intro-rule="" aria-hidden="true" />
        <component
          :is="item.link ? 'a' : 'button'"
          class="flowing-menu__link"
          :href="item.link || undefined"
          :type="item.link ? undefined : 'button'"
          :aria-current="index === activeIndex ? 'page' : undefined"
          @pointerdown="(event: PointerEvent) => onLinkPointerDown(event, index)"
          @focus="(event: FocusEvent) => onLinkFocus(event, index)"
          @blur="onLinkBlur"
          @click="(event: MouseEvent) => onLinkClick(event, item, index)"
        >
          <span class="flowing-menu__index" data-intro-fade="" aria-hidden="true">
            <template v-if="showIndex">{{ String(index + 1).padStart(2, '0') }}</template>
          </span>
          <span class="flowing-menu__label">
            <span class="flowing-menu__label-text" data-intro-line="">{{ item.text }}</span>
            <span v-if="index === activeIndex" class="flowing-menu__dot" aria-hidden="true" />
          </span>
          <span class="flowing-menu__end" data-intro-fade="" aria-hidden="true">
            <span v-if="item.meta" class="flowing-menu__meta">{{ item.meta }}</span>
            <span v-if="showArrow" class="flowing-menu__arrow">
              <HugeiconsIcon :icon="ArrowUpRight01Icon" :size="22" :stroke-width="1.75" />
            </span>
          </span>
        </component>
        <div :ref="el => setRow(index, 'band', el)" class="flowing-menu__band" aria-hidden="true" :style="bandStyle">
          <div :ref="el => setRow(index, 'track', el)" class="flowing-menu__track">
            <div v-for="copy in partCount(index)" :key="copy" class="flowing-menu__part">
              <span class="flowing-menu__part-text">{{ item.marquee ?? item.text }}</span>
              <span v-if="item.image" class="flowing-menu__image" :style="{ backgroundImage: `url(${item.image})` }" />
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="carryContent" ref="floatRef" class="flowing-menu__float" aria-hidden="true" :style="bandStyle">
      <div v-for="slot in [0, 1]" :key="slot" :ref="el => setLayer(slot, el)" class="flowing-menu__float-layer">
        <div :ref="el => setLayerTrack(slot, el)" class="flowing-menu__track">
          <template v-if="slots[slot] >= 0 && items[slots[slot]]">
            <div v-for="copy in partCount(slots[slot])" :key="copy" class="flowing-menu__part">
              <span class="flowing-menu__part-text">{{ items[slots[slot]].marquee ?? items[slots[slot]].text }}</span>
              <span
                v-if="items[slots[slot]].image"
                class="flowing-menu__image"
                :style="{ backgroundImage: `url(${items[slots[slot]].image})` }"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.flowing-menu {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.flowing-menu__list {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.flowing-menu__item {
  position: relative;
  flex: 1 1 0;
  min-height: 56px;
  overflow: hidden;
  container-type: size;
}

.flowing-menu__divider {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: var(--flowing-menu-border, rgba(255, 255, 255, 0.14));
  transform-origin: left center;
  pointer-events: none;
}

.flowing-menu__link {
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 100%;
  padding: 0 clamp(16px, 4cqw, 40px);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  transition: opacity 0.45s ease;
  -webkit-tap-highlight-color: transparent;
}

.flowing-menu[data-align='left'] .flowing-menu__link {
  grid-template-columns: auto 1fr auto;
}

.flowing-menu__item[data-dimmed] .flowing-menu__link {
  opacity: 0.32;
}

.flowing-menu__link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -4px;
}

.flowing-menu__index {
  justify-self: start;
  min-width: 1.6em;
  font-size: clamp(11px, 12cqh, 15px);
  font-variant-numeric: tabular-nums;
  opacity: 0.5;
}

.flowing-menu__label {
  display: flex;
  align-items: center;
  gap: 0.28em;
  justify-self: center;
  overflow: hidden;
  padding: 0.06em 0;
  font-size: clamp(16px, 40cqh, 140px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.035em;
  white-space: nowrap;
}

.flowing-menu[data-align='left'] .flowing-menu__label {
  justify-self: start;
}

.flowing-menu__label-text {
  display: block;
}

.flowing-menu__dot {
  display: block;
  width: 0.2em;
  height: 0.2em;
  flex-shrink: 0;
  border-radius: 999px;
  background: currentColor;
}

.flowing-menu__end {
  display: flex;
  align-items: center;
  justify-self: end;
  gap: 14px;
}

.flowing-menu__meta {
  font-size: clamp(11px, 12cqh, 15px);
  font-variant-numeric: tabular-nums;
  opacity: 0.5;
}

.flowing-menu__arrow {
  display: grid;
  place-items: center;
  opacity: 0.55;
}

.flowing-menu__band {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
  clip-path: inset(50% 0 50% 0);
}

.flowing-menu__track {
  display: flex;
  align-items: center;
  width: max-content;
  height: 100%;
  will-change: transform;
}

.flowing-menu__part {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 100%;
}

.flowing-menu__part-text {
  padding: 0 0.4em;
  font-size: clamp(14px, calc(38cqh * var(--flowing-menu-band, 1)), 130px);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.025em;
  white-space: nowrap;
}

.flowing-menu__image {
  display: block;
  flex-shrink: 0;
  height: calc(56cqh * var(--flowing-menu-band, 1));
  aspect-ratio: 2.2 / 1;
  margin: 0 calc(3.5cqh * var(--flowing-menu-band, 1));
  border-radius: 999px;
  background-position: center;
  background-size: cover;
}

.flowing-menu[data-shape='rounded'] .flowing-menu__image {
  aspect-ratio: 3 / 2;
  border-radius: calc(10cqh * var(--flowing-menu-band, 1));
}

.flowing-menu[data-shape='circle'] .flowing-menu__image {
  aspect-ratio: 1;
  border-radius: 999px;
}

.flowing-menu__float {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
  clip-path: inset(50% 0 50% 0);
}

.flowing-menu__float-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 25%;
  container-type: size;
  will-change: transform, opacity;
}
</style>
