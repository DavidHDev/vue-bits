<script lang="ts">
export interface MasonryItem {
  id: string | number;
  img: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
  alt?: string;
  url?: string;
  span?: number;
}

type Measured = Record<string, number>;

interface Grid {
  count: number;
  size: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Tile extends Rect {
  item: MasonryItem;
  id: string;
}

interface Layout {
  tiles: Tile[];
  height: number;
}

interface Spring {
  x: number;
  y: number;
  s: number;
  vx: number;
  vy: number;
  vs: number;
  tx: number;
  ty: number;
  w: number;
  h: number;
  shown: boolean;
  dragging: boolean;
  blur: boolean;
  reveal: number;
  start: number;
}

interface Ghost {
  id: string;
  item: MasonryItem;
  x: number;
  y: number;
  s: number;
  w: number;
  h: number;
}

interface Drag {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  active: boolean;
  moved: boolean;
}

const DIRECTIONS = ['bottom', 'top', 'left', 'right'];
const ANIMATE_FROM = ['bottom', 'top', 'left', 'right', 'center', 'random', 'none'];
const HOVER_EFFECTS = ['zoom', 'lift', 'tilt', 'none'];
const CAPTION_MODES = ['hover', 'always', 'none'];
const EASE = 'cubic-bezier(0.2, 0.9, 0.2, 1)';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const keyOf = (item: MasonryItem) => String(item.id);

const aspectOf = (item: MasonryItem, measured: Measured) => {
  const width = item.width ?? 0;
  const height = item.height ?? 0;
  if (width > 0 && height > 0) return height / width;
  if (measured[keyOf(item)]) return measured[keyOf(item)];
  if (height > 0) return height / 600;
  return 1;
};

const needsMeasure = (item: MasonryItem) => !((item.height ?? 0) > 0);

const gridOf = (width: number, columns: 'auto' | number, columnWidth: number, gap: number): Grid => {
  const fixed = Number(columns);
  const count =
    columns !== 'auto' && fixed > 0
      ? Math.max(1, Math.round(fixed))
      : Math.max(1, Math.floor((width + gap) / (Math.max(40, columnWidth) + gap)));
  return { count, size: Math.max(1, (width - gap * (count - 1)) / count) };
};

const place = (
  heights: number[],
  item: MasonryItem,
  grid: Grid,
  gap: number,
  measured: Measured,
  commit: boolean
): Rect => {
  const { count, size } = grid;
  const span = Math.min(count, Math.max(1, Math.round(item.span || 1)));
  let column = 0;
  let top = Infinity;
  for (let start = 0; start <= count - span; start++) {
    let y = 0;
    for (let k = start; k < start + span; k++) y = Math.max(y, heights[k]);
    if (y < top - 0.5) {
      top = y;
      column = start;
    }
  }
  const w = size * span + gap * (span - 1);
  const h = Math.max(1, w * aspectOf(item, measured));
  if (commit) for (let k = column; k < column + span; k++) heights[k] = top + h + gap;
  return { x: Math.round(column * (size + gap)), y: Math.round(top), w, h };
};

const scrollerOf = (element: HTMLElement | null): HTMLElement | null => {
  let node = element?.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const overflow = getComputedStyle(node).overflowY;
    if (
      (overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const layoutOf = (
  list: MasonryItem[],
  width: number,
  columns: 'auto' | number,
  columnWidth: number,
  gap: number,
  measured: Measured
): Layout => {
  const grid = gridOf(width, columns, columnWidth, gap);
  const heights = new Array(grid.count).fill(0);
  const tiles = list.map(item => ({ item, id: keyOf(item), ...place(heights, item, grid, gap, measured, true) }));
  return { tiles, height: Math.max(0, Math.max(...heights) - gap) };
};

const slotsFor = (
  others: MasonryItem[],
  dragged: MasonryItem,
  width: number,
  columns: 'auto' | number,
  columnWidth: number,
  gap: number,
  measured: Measured
) => {
  const grid = gridOf(width, columns, columnWidth, gap);
  const heights = new Array(grid.count).fill(0);
  const slots: { x: number; y: number }[] = [];
  for (let i = 0; i <= others.length; i++) {
    const slot = place(heights, dragged, grid, gap, measured, false);
    slots.push({ x: slot.x + slot.w / 2, y: slot.y + slot.h / 2 });
    if (i < others.length) place(heights, others[i], grid, gap, measured, true);
  }
  return slots;
};

const reduced = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
</script>

<script setup lang="ts">
import {
  computed,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  watchEffect,
  type CSSProperties,
  type FunctionalComponent
} from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowUpRight01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface MasonryProps {
  items?: MasonryItem[];
  columns?: 'auto' | number;
  columnWidth?: number;
  gap?: number;
  radius?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random' | 'none';
  stagger?: number;
  duration?: number;
  bounce?: number;
  blurToFocus?: boolean;
  revealOnScroll?: boolean;
  hoverEffect?: 'zoom' | 'lift' | 'tilt' | 'none';
  focusOnHover?: boolean;
  captions?: 'hover' | 'always' | 'none';
  parallax?: number;
  lightbox?: boolean;
  draggable?: boolean;
  onItemClick?: (item: MasonryItem, index: number, event: MouseEvent) => void;
  onReorder?: (items: MasonryItem[]) => void;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<MasonryProps>(), {
  items: () => [],
  columns: 'auto',
  columnWidth: 240,
  gap: 12,
  radius: 12,
  animateFrom: 'bottom',
  stagger: 0.05,
  duration: 0.6,
  bounce: 0.15,
  blurToFocus: true,
  revealOnScroll: true,
  hoverEffect: 'zoom',
  focusOnHover: false,
  captions: 'hover',
  parallax: 0,
  lightbox: true,
  draggable: true,
  onItemClick: undefined,
  onReorder: undefined,
  className: '',
  style: undefined
});

const rootRef = ref<HTMLDivElement | null>(null);
const boxRef = ref<HTMLDivElement | null>(null);
const nodes = new Map<string, HTMLDivElement>();
const springs = new Map<string, Spring>();
const loaded = new Set<string>();
const waiting = new Set<string>();
const pending = new Set<string>();
const engine = { raf: 0, last: 0, flush: 0 };
const ghostNodes = new Map<string, HTMLDivElement>();
const previous = new Map<string, { item: MasonryItem; w: number; h: number }>();
let drag: Drag | null = null;
let suppress = false;
let token = 0;
let lastShown: string | null = null;
let opened: string | null = null;

const width = ref(0);
const order = shallowRef<string[] | null>(null);
const measured = shallowRef<Measured>({});
const ready = ref(!props.items.some(needsMeasure));
const ghosts = shallowRef<Ghost[]>([]);
const openId = ref<string | null>(null);
const closing = ref(false);

const settings = computed(() => ({
  gap: Math.max(0, props.gap),
  animateFrom: ANIMATE_FROM.includes(props.animateFrom) ? props.animateFrom : 'bottom',
  stagger: Math.max(0, props.stagger),
  duration: Math.max(0.05, props.duration),
  bounce: clamp(props.bounce, 0, 0.9),
  blurToFocus: props.blurToFocus,
  revealOnScroll: props.revealOnScroll,
  hoverEffect: HOVER_EFFECTS.includes(props.hoverEffect) ? props.hoverEffect : 'zoom',
  focusOnHover: props.focusOnHover,
  parallax: clamp(props.parallax, 0, 1),
  lightbox: props.lightbox,
  draggable: props.draggable
}));

const itemsKey = computed(() => props.items.map(keyOf).join('\u0000'));

const ordered = computed<MasonryItem[]>(() => {
  const items = props.items;
  const current = order.value;
  if (!current) return items;
  const byId = new Map(items.map(item => [keyOf(item), item]));
  const list = current.filter(id => byId.has(id)).map(id => byId.get(id) as MasonryItem);
  items.forEach(item => {
    if (!current.includes(keyOf(item))) list.push(item);
  });
  return list;
});

const layout = computed<Layout | null>(() =>
  width.value && ready.value
    ? layoutOf(ordered.value, width.value, props.columns, props.columnWidth, settings.value.gap, measured.value)
    : null
);

const tiles = computed(() => layout.value?.tiles ?? []);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  const root = rootRef.value;
  if (!root) return;
  resizeObserver = new ResizeObserver(([entry]) => {
    width.value = Math.round(entry.contentRect.width);
  });
  resizeObserver.observe(root);
  width.value = Math.round(root.getBoundingClientRect().width);
});

watch(
  itemsKey,
  (_key, _old, onCleanup) => {
    const known = measured.value;
    const missing = props.items.filter(item => needsMeasure(item) && !known[keyOf(item)]);
    if (!missing.length) {
      ready.value = true;
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) ready.value = true;
    }, 2500);
    missing.forEach(item => {
      const image = new Image();
      image.onload = () => {
        if (cancelled || !image.naturalWidth) return;
        measured.value = { ...measured.value, [keyOf(item)]: image.naturalHeight / image.naturalWidth };
      };
      image.src = item.img;
    });
    onCleanup(() => {
      cancelled = true;
      clearTimeout(timer);
    });
  },
  { immediate: true }
);

watchEffect(() => {
  if (ready.value) return;
  const known = measured.value;
  if (props.items.every(item => !needsMeasure(item) || known[keyOf(item)])) ready.value = true;
});

const paint = (id: string, spring: Spring) => {
  const node = nodes.get(id);
  if (!node) return;
  node.style.transform = `translate3d(${spring.x}px, ${spring.y}px, 0) scale(${spring.s})`;
  if (spring.reveal < 1) {
    const eased = 1 - Math.pow(1 - Math.max(0, spring.reveal), 3);
    node.style.opacity = String(eased);
    node.style.filter = spring.blur ? `blur(${((1 - eased) * 12).toFixed(2)}px)` : '';
  } else if (node.style.opacity !== '') {
    node.style.opacity = '';
    node.style.filter = '';
  }
};

const frame = (now: number) => {
  const state = engine;
  state.raf = 0;
  const s = settings.value;
  const elapsed = clamp((now - state.last) / 1000, 0, 1 / 20);
  state.last = now;
  const omega = (Math.PI * 2) / s.duration;
  const zeta = clamp(1 - s.bounce, 0.1, 1);
  const steps = Math.max(1, Math.ceil(elapsed / (1 / 240)));
  const dt = elapsed / steps;
  let active = false;
  springs.forEach((spring, id) => {
    if (!spring.shown) return;
    if (spring.dragging) {
      paint(id, spring);
      return;
    }
    if (now < spring.start) {
      active = true;
      return;
    }
    for (let i = 0; i < steps; i++) {
      spring.vx += (-omega * omega * (spring.x - spring.tx) - 2 * zeta * omega * spring.vx) * dt;
      spring.vy += (-omega * omega * (spring.y - spring.ty) - 2 * zeta * omega * spring.vy) * dt;
      spring.vs += (-omega * omega * (spring.s - 1) - 2 * zeta * omega * spring.vs) * dt;
      spring.x += spring.vx * dt;
      spring.y += spring.vy * dt;
      spring.s += spring.vs * dt;
    }
    const resting =
      Math.abs(spring.x - spring.tx) < 0.05 &&
      Math.abs(spring.y - spring.ty) < 0.05 &&
      Math.abs(spring.s - 1) < 0.0005 &&
      Math.abs(spring.vx) + Math.abs(spring.vy) < 0.05 &&
      Math.abs(spring.vs) < 0.001;
    if (resting) {
      spring.x = spring.tx;
      spring.y = spring.ty;
      spring.s = 1;
      spring.vx = spring.vy = spring.vs = 0;
    } else active = true;
    if (spring.reveal < 1) {
      spring.reveal = clamp((now - spring.start) / (s.duration * 1000), 0, 1);
      if (spring.reveal < 1) active = true;
    }
    paint(id, spring);
  });
  if (active) state.raf = requestAnimationFrame(frame);
};

const kick = () => {
  if (engine.raf || typeof window === 'undefined') return;
  engine.last = performance.now();
  engine.raf = requestAnimationFrame(frame);
};

const visibleCenter = () => {
  const root = rootRef.value;
  if (!root) return 0;
  const rect = root.getBoundingClientRect();
  const top = Math.max(0, -rect.top);
  const bottom = Math.min(rect.height, window.innerHeight - rect.top);
  return bottom > top ? (top + bottom) / 2 : rect.height / 2;
};

const flushReveals = () => {
  engine.flush = 0;
  const s = settings.value;
  const batch: { id: string; spring: Spring }[] = [];
  pending.forEach(id => {
    const spring = springs.get(id);
    if (spring && !spring.shown) batch.push({ id, spring });
  });
  pending.clear();
  if (!batch.length) return;
  batch.sort((a, b) => a.spring.ty - b.spring.ty || a.spring.tx - b.spring.tx);
  const now = performance.now();
  const still = reduced() || s.animateFrom === 'none';
  const rootWidth = rootRef.value?.clientWidth ?? 0;
  const centerY = visibleCenter();
  batch.forEach(({ id, spring }, rank) => {
    spring.shown = true;
    spring.blur = s.blurToFocus && !still;
    if (still) {
      spring.x = spring.tx;
      spring.y = spring.ty;
      spring.s = 1;
      spring.reveal = 1;
      spring.start = now;
      paint(id, spring);
      return;
    }
    const direction =
      s.animateFrom === 'random' ? DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] : s.animateFrom;
    const distance = 60 + Math.min(spring.h, 280) * 0.35;
    spring.x = spring.tx;
    spring.y = spring.ty;
    spring.s = 0.96;
    if (direction === 'center') {
      spring.x = rootWidth / 2 - spring.w / 2;
      spring.y = centerY - spring.h / 2;
      spring.s = 0.55;
    } else if (direction === 'bottom') spring.y += distance;
    else if (direction === 'top') spring.y -= distance;
    else if (direction === 'left') spring.x -= distance;
    else if (direction === 'right') spring.x += distance;
    spring.vx = spring.vy = spring.vs = 0;
    spring.reveal = 0;
    spring.start = now + rank * s.stagger * 1000;
    paint(id, spring);
  });
  kick();
};

const requestReveal = (id: string) => {
  const spring = springs.get(id);
  if (!spring || spring.shown) return;
  if (!loaded.has(id)) {
    waiting.add(id);
    return;
  }
  waiting.delete(id);
  pending.add(id);
  if (!engine.flush) engine.flush = requestAnimationFrame(flushReveals);
};

const markLoaded = (id: string, image?: HTMLImageElement | null) => {
  loaded.add(id);
  const target = image ?? nodes.get(id)?.querySelector('img');
  target?.setAttribute('data-loaded', '');
  if (waiting.has(id)) requestReveal(id);
};

const setNode = (id: string, el: unknown) => {
  if (el) nodes.set(id, el as HTMLDivElement);
  else nodes.delete(id);
};

const setGhostNode = (id: string, el: unknown) => {
  if (el) ghostNodes.set(id, el as HTMLDivElement);
  else ghostNodes.delete(id);
};

const onImageRef = (id: string, el: unknown) => {
  const image = el as HTMLImageElement | null;
  if (image?.complete && image.naturalWidth && !loaded.has(id)) markLoaded(id, image);
};

const onImageDone = (id: string, event: Event) => markLoaded(id, event.currentTarget as HTMLImageElement);

watch(
  itemsKey,
  () => {
    const live = new Set(props.items.map(keyOf));
    const leaving: Ghost[] = [];
    previous.forEach((entry, id) => {
      if (live.has(id)) return;
      const spring = springs.get(id);
      previous.delete(id);
      if (!spring?.shown) return;
      leaving.push({ id, item: entry.item, x: spring.x, y: spring.y, s: spring.s, w: entry.w, h: entry.h });
      springs.delete(id);
    });
    if (leaving.length) ghosts.value = [...ghosts.value.filter(ghost => !live.has(ghost.id)), ...leaving];
    order.value = null;
  },
  { flush: 'pre' }
);

const applyLayout = () => {
  const current = layout.value;
  if (!current) return;
  const root = rootRef.value;
  const instant = reduced();
  current.tiles.forEach(tile => {
    const node = nodes.get(tile.id);
    let spring = springs.get(tile.id);
    if (!spring) {
      spring = {
        x: tile.x,
        y: tile.y,
        s: 1,
        vx: 0,
        vy: 0,
        vs: 0,
        tx: tile.x,
        ty: tile.y,
        w: tile.w,
        h: tile.h,
        shown: false,
        dragging: false,
        blur: false,
        reveal: 0,
        start: 0
      };
      springs.set(tile.id, spring);
      if (node) {
        node.style.opacity = '0';
        node.style.transform = `translate3d(${tile.x}px, ${tile.y}px, 0)`;
      }
    } else if (spring.shown && Math.abs(spring.w - tile.w) > 0.5 && !instant) {
      spring.s *= spring.w / tile.w;
    }
    spring.tx = tile.x;
    spring.ty = tile.y;
    spring.w = tile.w;
    spring.h = tile.h;
    if (!spring.shown) {
      spring.x = tile.x;
      spring.y = tile.y;
      if (node) node.style.transform = `translate3d(${tile.x}px, ${tile.y}px, 0)`;
    } else if (instant && !spring.dragging) {
      spring.x = tile.x;
      spring.y = tile.y;
      spring.s = 1;
      paint(tile.id, spring);
    }
    previous.set(tile.id, { item: tile.item, w: tile.w, h: tile.h });
  });
  if (root) root.style.height = `${current.height}px`;
  kick();
};

watch(layout, applyLayout, { flush: 'post' });

watch(
  [layout, () => props.revealOnScroll],
  (_value, _old, onCleanup) => {
    const current = layout.value;
    if (!current) return;
    const ids = current.tiles.map(tile => tile.id);
    if (!settings.value.revealOnScroll || typeof IntersectionObserver === 'undefined') {
      ids.forEach(requestReveal);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('data-id');
          if (id) requestReveal(id);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px' }
    );
    ids.forEach(id => {
      const node = nodes.get(id);
      if (node && !springs.get(id)?.shown) observer.observe(node);
    });
    onCleanup(() => observer.disconnect());
  },
  { flush: 'post' }
);

watch(
  layout,
  (_value, _old, onCleanup) => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    waiting.forEach(id => {
      timers.push(
        setTimeout(() => {
          if (!waiting.has(id)) return;
          loaded.add(id);
          requestReveal(id);
        }, 2500)
      );
    });
    onCleanup(() => timers.forEach(clearTimeout));
  },
  { flush: 'post' }
);

watch(
  ghosts,
  list => {
    list.forEach(ghost => {
      const node = ghostNodes.get(ghost.id);
      if (!node || node.getAttribute('data-leaving')) return;
      node.setAttribute('data-leaving', '');
      const from = `translate3d(${ghost.x}px, ${ghost.y}px, 0) scale(${ghost.s})`;
      const to = `translate3d(${ghost.x + ghost.w * 0.04}px, ${ghost.y + ghost.h * 0.04}px, 0) scale(${ghost.s * 0.92})`;
      const animation = node.animate(
        [
          { transform: from, opacity: 1 },
          { transform: to, opacity: 0 }
        ],
        { duration: reduced() ? 1 : 320, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
      );
      animation.finished
        .then(() => {
          ghosts.value = ghosts.value.filter(entry => entry.id !== ghost.id);
        })
        .catch(() => {});
    });
  },
  { flush: 'post' }
);

watch(
  [layout, () => props.parallax],
  (_value, _old, onCleanup) => {
    const strength = settings.value.parallax;
    const layers = () => [...nodes.values()].map(node => node.querySelector<HTMLElement>('[data-parallax]'));
    if (!strength || !layout.value) {
      layers().forEach(layer => {
        if (layer) layer.style.transform = '';
      });
      return;
    }
    let raf = 0;
    const scroller = scrollerOf(rootRef.value);
    const update = () => {
      raf = 0;
      const bounds = scroller ? scroller.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
      const top = Math.max(bounds.top, 0);
      const bottom = Math.min(bounds.bottom, window.innerHeight);
      const center = (top + bottom) / 2;
      nodes.forEach(node => {
        const layer = node.querySelector<HTMLElement>('[data-parallax]');
        if (!layer) return;
        const rect = node.getBoundingClientRect();
        if (rect.bottom < top - 200 || rect.top > bottom + 200) return;
        const reach = strength * 0.2 * rect.height;
        const shift = clamp(-(rect.top + rect.height / 2 - center) * strength * 0.25, -reach, reach);
        layer.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(${(1 + strength * 0.4 + 0.002).toFixed(3)})`;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    onCleanup(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
    });
  },
  { flush: 'post' }
);

const setDimmed = (activeId: string | null) => {
  nodes.forEach((node, id) => {
    if (activeId && id !== activeId) node.setAttribute('data-dimmed', '');
    else node.removeAttribute('data-dimmed');
  });
};

const onEnter = (id: string) => {
  if (settings.value.focusOnHover && !drag?.active) setDimmed(id);
};

const onLeave = (event: PointerEvent) => {
  if (settings.value.focusOnHover) setDimmed(null);
  const card = event.currentTarget as HTMLElement;
  card.style.removeProperty('--masonry-tilt-x');
  card.style.removeProperty('--masonry-tilt-y');
};

const onTilt = (event: PointerEvent) => {
  if (settings.value.hoverEffect !== 'tilt' || drag?.active) return;
  const card = event.currentTarget as HTMLElement;
  const rect = card.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  card.style.setProperty('--masonry-tilt-x', `${(-py * 10).toFixed(2)}deg`);
  card.style.setProperty('--masonry-tilt-y', `${(px * 10).toFixed(2)}deg`);
};

const finishDrag = () => {
  const current = drag;
  window.removeEventListener('pointermove', moveDrag);
  window.removeEventListener('pointerup', finishDrag);
  window.removeEventListener('pointercancel', finishDrag);
  drag = null;
  if (!current?.active) return;
  const spring = springs.get(current.id);
  const node = nodes.get(current.id);
  if (spring) spring.dragging = false;
  node?.removeAttribute('data-dragging');
  rootRef.value?.removeAttribute('data-dragging');
  suppress = true;
  setTimeout(() => {
    suppress = false;
  }, 0);
  kick();
  if (current.moved) props.onReorder?.(ordered.value);
};

const moveDrag = (event: PointerEvent) => {
  const current = drag;
  const root = rootRef.value;
  if (!current || !root || event.pointerId !== current.pointerId) return;
  if (!current.active) {
    if (Math.hypot(event.clientX - current.startX, event.clientY - current.startY) < 6) return;
    const spring = springs.get(current.id);
    if (!spring?.shown) return;
    current.active = true;
    spring.dragging = true;
    spring.vx = spring.vy = spring.vs = 0;
    nodes.get(current.id)?.setAttribute('data-dragging', '');
    root.setAttribute('data-dragging', '');
    setDimmed(null);
  }
  const rect = root.getBoundingClientRect();
  const spring = springs.get(current.id);
  if (!spring) return;
  spring.x = event.clientX - rect.left - current.offsetX;
  spring.y = event.clientY - rect.top - current.offsetY;
  spring.s = 1;
  paint(current.id, spring);
  kick();
  const list = ordered.value;
  const dragged = list.find(item => keyOf(item) === current.id);
  if (!dragged || !width.value) return;
  const others = list.filter(item => keyOf(item) !== current.id);
  const slots = slotsFor(
    others,
    dragged,
    width.value,
    props.columns,
    props.columnWidth,
    settings.value.gap,
    measured.value
  );
  const cx = spring.x + spring.w / 2;
  const cy = spring.y + spring.h / 2;
  const index = list.indexOf(dragged);
  let best = index;
  let nearest = Math.hypot(slots[index].x - cx, slots[index].y - cy);
  const threshold = nearest * 0.8 - 6;
  slots.forEach((slot, slotIndex) => {
    const distance = Math.hypot(slot.x - cx, slot.y - cy);
    if (distance < nearest && distance < threshold) {
      nearest = distance;
      best = slotIndex;
    }
  });
  if (best === index) return;
  const ids = others.map(keyOf);
  ids.splice(best, 0, current.id);
  current.moved = true;
  order.value = ids;
};

const startDrag = (event: PointerEvent, id: string) => {
  const s = settings.value;
  if (!s.draggable || event.button !== 0 || event.pointerType === 'touch' || openId.value) return;
  const root = rootRef.value;
  const spring = springs.get(id);
  if (!root || !spring) return;
  const rect = root.getBoundingClientRect();
  drag = {
    id,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    offsetX: event.clientX - rect.left - spring.x,
    offsetY: event.clientY - rect.top - spring.y,
    active: false,
    moved: false
  };
  window.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);
};

const onCardClick = (event: MouseEvent, item: MasonryItem, index: number) => {
  if (suppress) {
    event.preventDefault();
    return;
  }
  props.onItemClick?.(item, index, event);
  if (event.defaultPrevented) return;
  if (settings.value.lightbox) {
    event.preventDefault();
    token += 1;
    closing.value = false;
    openId.value = keyOf(item);
  }
};

const openIndex = computed(() => (openId.value ? ordered.value.findIndex(item => keyOf(item) === openId.value) : -1));
const openItem = computed(() => (openIndex.value >= 0 ? ordered.value[openIndex.value] : null));

const mediaRect = (id: string) => nodes.get(id)?.querySelector('[data-media]')?.getBoundingClientRect() ?? null;

const frameFor = (item: MasonryItem) => {
  const aspect = aspectOf(item, measured.value);
  const pad = window.innerWidth < 640 ? 16 : 72;
  const room = item.title || item.description || item.url ? 64 : 0;
  const maxW = Math.max(40, window.innerWidth - pad * 2);
  const maxH = Math.max(40, window.innerHeight - pad * 2 - room);
  let w = maxW;
  let h = w * aspect;
  if (h > maxH) {
    h = maxH;
    w = h / aspect;
  }
  const left = (window.innerWidth - w) / 2;
  const top = (window.innerHeight - room - h) / 2;
  return { left, top, width: w, height: h, room };
};

const closeBox = () => {
  const id = openId.value;
  if (!id || closing.value) return;
  token += 1;
  const current = token;
  const box = boxRef.value;
  const image = box?.querySelector<HTMLElement>('[data-box-image]');
  const backdrop = box?.querySelector<HTMLElement>('[data-box-backdrop]');
  const rect = mediaRect(id);
  closing.value = true;
  if (!image || !rect || reduced()) {
    openId.value = null;
    closing.value = false;
    return;
  }
  const bounds = image.getBoundingClientRect();
  const scale = rect.width / bounds.width;
  image.getAnimations().forEach(animation => animation.cancel());
  const animation = image.animate(
    [
      { transform: 'none', borderRadius: '6px' },
      {
        transform: `translate(${rect.left - bounds.left}px, ${rect.top - bounds.top}px) scale(${scale})`,
        borderRadius: `${props.radius / Math.max(scale, 0.01)}px`
      }
    ],
    { duration: 380, easing: EASE, fill: 'forwards' }
  );
  backdrop?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease', fill: 'forwards' });
  box
    ?.querySelectorAll('[data-box-fade]')
    .forEach(node => node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' }));
  animation.finished
    .then(() => {
      if (current !== token) return;
      openId.value = null;
      closing.value = false;
    })
    .catch(() => {});
};

const stepBox = (direction: number) => {
  const list = ordered.value;
  if (!openItem.value || closing.value || list.length < 2) return;
  const next = list[(openIndex.value + direction + list.length) % list.length];
  openId.value = keyOf(next);
};

watch(
  openId,
  id => {
    if (id) lastShown = id;
  },
  { flush: 'sync' }
);

watch(
  openId,
  (id, _old, onCleanup) => {
    if (!id) return;
    const node = nodes.get(id);
    node?.setAttribute('data-hidden', '');
    onCleanup(() => node?.removeAttribute('data-hidden'));
  },
  { flush: 'post' }
);

watch(
  openId,
  id => {
    const box = boxRef.value;
    if (!id || !box) {
      opened = null;
      return;
    }
    const image = box.querySelector<HTMLElement>('[data-box-image]');
    const backdrop = box.querySelector<HTMLElement>('[data-box-backdrop]');
    const fades = box.querySelectorAll('[data-box-fade]');
    if (!image) return;
    if (opened) {
      image.animate(
        [
          { opacity: 0, transform: 'scale(0.97)' },
          { opacity: 1, transform: 'none' }
        ],
        { duration: reduced() ? 1 : 320, easing: EASE }
      );
      opened = id;
      return;
    }
    opened = id;
    const rect = mediaRect(id);
    const target = image.getBoundingClientRect();
    if (rect && !reduced()) {
      const scale = rect.width / target.width;
      image.animate(
        [
          {
            transform: `translate(${rect.left - target.left}px, ${rect.top - target.top}px) scale(${scale})`,
            borderRadius: `${props.radius / Math.max(scale, 0.01)}px`
          },
          { transform: 'none', borderRadius: '6px' }
        ],
        { duration: 520, easing: EASE }
      );
      backdrop?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease' });
      fades.forEach(fade =>
        fade.animate([{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }], { duration: 560, easing: 'ease' })
      );
    }
  },
  { flush: 'post' }
);

const isOpen = computed(() => Boolean(openId.value));

watch(
  isOpen,
  (open, _old, onCleanup) => {
    if (!open) return;
    const before = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    boxRef.value?.querySelector<HTMLElement>('[data-box-close]')?.focus({ preventScroll: true });
    onCleanup(() => {
      document.documentElement.style.overflow = before;
      nodes
        .get(lastShown ?? '')
        ?.querySelector<HTMLElement>('[data-card]')
        ?.focus({ preventScroll: true });
    });
  },
  { flush: 'post' }
);

const onKey = (event: KeyboardEvent) => {
  if (!openId.value) return;
  if (event.key === 'Escape') closeBox();
  else if (event.key === 'ArrowRight') stepBox(1);
  else if (event.key === 'ArrowLeft') stepBox(-1);
};

watch(
  isOpen,
  (open, _old, onCleanup) => {
    if (!open) return;
    window.addEventListener('keydown', onKey);
    onCleanup(() => window.removeEventListener('keydown', onKey));
  },
  { flush: 'post' }
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  cancelAnimationFrame(engine.raf);
  cancelAnimationFrame(engine.flush);
  window.removeEventListener('pointermove', moveDrag);
  window.removeEventListener('pointerup', finishDrag);
  window.removeEventListener('pointercancel', finishDrag);
});

const captionMode = computed(() => (CAPTION_MODES.includes(props.captions) ? props.captions : 'hover'));
const box = computed(() => (openItem.value && typeof document !== 'undefined' ? frameFor(openItem.value) : null));

const rootStyle = computed(
  () => ({ '--masonry-radius': `${Math.max(0, props.radius)}px`, ...(props.style ?? {}) }) as CSSProperties
);

const CardShell: FunctionalComponent<{ tag: string; [key: string]: unknown }> = (shell, { slots, attrs }) =>
  h(shell.tag, attrs, slots.default?.());
CardShell.props = ['tag'];

const cardTag = (item: MasonryItem) =>
  !props.lightbox && item.url ? 'a' : props.lightbox || props.onItemClick ? 'button' : 'div';

const cardAttrs = (item: MasonryItem) => {
  const label = item.title || item.alt || undefined;
  const tag = cardTag(item);
  if (tag === 'a')
    return {
      href: item.url,
      target: '_blank',
      rel: 'noopener noreferrer',
      draggable: false,
      'aria-label': label
    };
  if (tag === 'button') return { type: 'button', 'aria-label': label };
  return {};
};
</script>

<template>
  <div
    ref="rootRef"
    :class="['masonry', className].filter(Boolean).join(' ')"
    :style="rootStyle"
    :data-hover="settings.hoverEffect"
    role="list"
  >
    <div
      v-for="(tile, index) in tiles"
      :key="tile.id"
      :ref="el => setNode(tile.id, el)"
      class="masonry__item"
      :style="{ width: `${tile.w}px`, height: `${tile.h}px` }"
      :data-id="tile.id"
      role="listitem"
    >
      <CardShell
        :tag="cardTag(tile.item)"
        v-bind="cardAttrs(tile.item)"
        class="masonry__card"
        data-card=""
        @click="(event: MouseEvent) => onCardClick(event, tile.item, index)"
        @pointerdown="(event: PointerEvent) => startDrag(event, tile.id)"
        @pointerenter="() => onEnter(tile.id)"
        @pointerleave="onLeave"
        @pointermove="onTilt"
      >
        <span class="masonry__media" data-media="">
          <span class="masonry__parallax" data-parallax="">
            <img
              :ref="el => onImageRef(tile.id, el)"
              class="masonry__image"
              :src="tile.item.img"
              :alt="tile.item.alt ?? tile.item.title ?? ''"
              :draggable="false"
              decoding="async"
              :data-loaded="loaded.has(tile.id) ? '' : undefined"
              @load="(event: Event) => onImageDone(tile.id, event)"
              @error="(event: Event) => onImageDone(tile.id, event)"
            />
          </span>
          <span
            v-if="captionMode !== 'none' && (tile.item.title || tile.item.description)"
            class="masonry__caption"
            :data-mode="captionMode"
          >
            <span v-if="tile.item.title" class="masonry__title">{{ tile.item.title }}</span>
            <span v-if="tile.item.description" class="masonry__text">{{ tile.item.description }}</span>
          </span>
        </span>
      </CardShell>
    </div>

    <div
      v-for="ghost in ghosts"
      :key="`ghost-${ghost.id}`"
      :ref="el => setGhostNode(ghost.id, el)"
      class="masonry__ghost"
      :style="{
        width: `${ghost.w}px`,
        height: `${ghost.h}px`,
        transform: `translate3d(${ghost.x}px, ${ghost.y}px, 0) scale(${ghost.s})`
      }"
      aria-hidden="true"
    >
      <div class="masonry__media">
        <img class="masonry__image" :src="ghost.item.img" alt="" data-loaded="" :draggable="false" />
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="openItem && box"
        ref="boxRef"
        class="masonry-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="openItem.title || openItem.alt || 'Image'"
      >
        <div class="masonry-lightbox__backdrop" data-box-backdrop="" @click="closeBox" />
        <img
          class="masonry-lightbox__image"
          data-box-image=""
          :src="openItem.img"
          :alt="openItem.alt ?? openItem.title ?? ''"
          :draggable="false"
          :style="{
            width: `${box.width}px`,
            height: `${box.height}px`,
            left: `${box.left}px`,
            top: `${box.top}px`,
            borderRadius: '6px'
          }"
          @click="closeBox"
        />
        <div
          v-if="box.room > 0"
          class="masonry-lightbox__caption"
          data-box-fade=""
          :style="{ top: `${box.top + box.height + 18}px` }"
        >
          <span v-if="openItem.title">{{ openItem.title }}</span>
          <span v-if="openItem.description" class="masonry-lightbox__muted">{{ openItem.description }}</span>
          <a v-if="openItem.url" :href="openItem.url" target="_blank" rel="noopener noreferrer">
            Open
            <HugeiconsIcon :icon="ArrowUpRight01Icon" :size="16" :stroke-width="2" />
          </a>
        </div>
        <button
          type="button"
          class="masonry-lightbox__button masonry-lightbox__close"
          data-box-fade=""
          data-box-close=""
          aria-label="Close"
          @click="closeBox"
        >
          <HugeiconsIcon :icon="Cancel01Icon" :size="20" :stroke-width="2" />
        </button>
        <template v-if="ordered.length > 1">
          <button
            type="button"
            class="masonry-lightbox__button masonry-lightbox__prev"
            data-box-fade=""
            aria-label="Previous"
            @click="stepBox(-1)"
          >
            <HugeiconsIcon :icon="ArrowLeft01Icon" :size="20" :stroke-width="2" />
          </button>
          <button
            type="button"
            class="masonry-lightbox__button masonry-lightbox__next"
            data-box-fade=""
            aria-label="Next"
            @click="stepBox(1)"
          >
            <HugeiconsIcon :icon="ArrowRight01Icon" :size="20" :stroke-width="2" />
          </button>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style>
.masonry {
  position: relative;
  width: 100%;
}

.masonry__item {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}

.masonry__item[data-dragging] {
  z-index: 10;
}

.masonry__item[data-hidden] {
  visibility: hidden;
}

.masonry__card {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: var(--masonry-radius, 12px);
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transform: perspective(900px) rotateX(var(--masonry-tilt-x, 0deg)) rotateY(var(--masonry-tilt-y, 0deg))
    translateY(var(--masonry-lift, 0px)) scale(var(--masonry-scale, 1));
  transition:
    transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.35s ease;
}

.masonry__card:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.masonry[data-hover='lift'] .masonry__item:hover .masonry__card {
  --masonry-lift: -6px;
  --masonry-scale: 1.02;
  box-shadow: 0 22px 40px -22px rgba(0, 0, 0, 0.55);
}

.masonry[data-hover='tilt'] .masonry__card {
  transition:
    transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.35s ease;
}

.masonry[data-hover='tilt'] .masonry__item:hover .masonry__card {
  --masonry-scale: 1.03;
  box-shadow: 0 26px 44px -24px rgba(0, 0, 0, 0.55);
}

.masonry__item[data-dragging] .masonry__card {
  --masonry-scale: 1.05;
  box-shadow: 0 34px 60px -26px rgba(0, 0, 0, 0.6);
  cursor: grabbing;
}

.masonry__item[data-dimmed] .masonry__card {
  opacity: 0.35;
}

.masonry__media {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--masonry-radius, 12px);
  background: rgba(127, 127, 127, 0.14);
  isolation: isolate;
}

.masonry__parallax {
  position: absolute;
  inset: 0;
  display: block;
}

.masonry__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
  transition:
    opacity 0.5s ease,
    transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.masonry__image[data-loaded] {
  opacity: 1;
}

.masonry[data-hover='zoom'] .masonry__item:hover .masonry__image {
  transform: scale(1.07);
}

.masonry__caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 40px 14px 12px;
  color: #ffffff;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.02) 15%,
    rgba(0, 0, 0, 0.08) 30%,
    rgba(0, 0, 0, 0.18) 45%,
    rgba(0, 0, 0, 0.3) 60%,
    rgba(0, 0, 0, 0.42) 75%,
    rgba(0, 0, 0, 0.5) 88%,
    rgba(0, 0, 0, 0.54) 100%
  );
  pointer-events: none;
  transition:
    opacity 0.35s ease,
    transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.masonry__caption[data-mode='hover'] {
  opacity: 0;
  transform: translateY(6px);
}

.masonry__item:hover .masonry__caption[data-mode='hover'],
.masonry__card:focus-visible .masonry__caption[data-mode='hover'] {
  opacity: 1;
  transform: none;
}

.masonry__title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.masonry__text {
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.8;
}

.masonry__ghost {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.masonry-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.masonry-lightbox__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(9, 9, 11, 0.9);
}

.masonry-lightbox__image {
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  object-fit: cover;
  transform-origin: 0 0;
  will-change: transform;
  cursor: zoom-out;
  user-select: none;
  -webkit-user-drag: none;
}

.masonry-lightbox__caption {
  position: fixed;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 0 72px;
  color: #ffffff;
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
  pointer-events: none;
}

.masonry-lightbox__caption a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: inherit;
  font-weight: 600;
  text-decoration: none;
  pointer-events: auto;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.masonry-lightbox__caption a:hover,
.masonry-lightbox__caption a:focus-visible {
  opacity: 1;
}

.masonry-lightbox__muted {
  opacity: 0.6;
}

.masonry-lightbox__button {
  position: absolute;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background 0.2s ease;
}

.masonry-lightbox__button:hover {
  background: rgba(255, 255, 255, 0.16);
}

.masonry-lightbox__button:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

.masonry-lightbox__close {
  top: 16px;
  right: 16px;
}

.masonry-lightbox__prev {
  top: calc(50% - 22px);
  left: 16px;
}

.masonry-lightbox__next {
  top: calc(50% - 22px);
  right: 16px;
}
</style>
