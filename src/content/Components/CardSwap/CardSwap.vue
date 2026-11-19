<script lang="ts">
import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  h,
  isVNode,
  Text,
  type Component,
  type CSSProperties,
  type VNode,
  type VNodeChild
} from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { BeachIcon, BridgeIcon, CloudIcon, SunsetIcon } from '@hugeicons/core-free-icons';

export type CardSwapNode = string | number | VNode | Component | (() => VNodeChild);

export interface CardSwapItem {
  title?: string;
  image?: string;
  icon?: CardSwapNode;
  alt?: string;
}

export interface CardSwapHandle {
  next: () => void;
  prev: () => void;
}

export interface CardSwapProps {
  items?: CardSwapItem[];
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  depth?: number;
  skewAmount?: number;
  visibleCards?: number;
  delay?: number;
  autoplay?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  speed?: number;
  bounce?: number;
  parallax?: number;
  hoverSpread?: number;
  dim?: number;
  cardRadius?: number;
  intro?: boolean;
  theme?: 'dark' | 'light';
  onCardClick?: (index: number) => void;
  onChange?: (index: number) => void;
  className?: string;
}

type Axis = 'x' | 'y' | 'z' | 'r' | 'p';
type Vec = { x: number; y: number };
type Pose = Record<Axis, number>;

interface Bounds {
  width: number;
  height: number;
  originX: number;
  originY: number;
}

interface BoundsInput {
  width: number;
  height: number;
  cardDistance: number;
  verticalDistance: number;
  depth: number;
  skewAmount: number;
  visible: number;
  hoverSpread: number;
}

interface Settings {
  width: number;
  height: number;
  dx: number;
  dy: number;
  dz: number;
  skew: number;
  visible: number;
  delay: number;
  autoplay: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
  speed: number;
  bounce: number;
  parallax: number;
  hoverSpread: number;
  dim: number;
  bounds: Bounds;
  onCardClick?: (index: number) => void;
  onChange?: (index: number) => void;
}

interface DeckCard extends Pose {
  el: HTMLDivElement | null;
  shade: HTMLSpanElement | null;
  index: number;
  pos: number;
  from: number;
  hold: number;
  nudge: number;
  phase: 'rest' | 'exit' | 'enter' | 'drag';
  dir: Vec;
  tilt: number;
  top: number;
  under: boolean;
  v: Pose;
}

interface DragState {
  id: number;
  index: number;
  startX: number;
  startY: number;
  active: boolean;
  samples: { x: number; y: number; t: number }[];
}

interface EngineState {
  order: number[];
  raf: number;
  last: number;
  timer: number;
  queue: number[];
  layers: number;
  scale: number;
  hovered: boolean;
  overCard: boolean;
  inView: boolean;
  drag: DragState | null;
  spread: number;
  spreadV: number;
  px: number;
  py: number;
  pvx: number;
  pvy: number;
  tx: number;
  ty: number;
  dragged: boolean;
  autoplay: boolean;
  delay: number;
}

interface ShiftOptions {
  dir?: Vec;
  tilt?: number;
  velocity?: Vec;
}

interface SwapApi {
  next: () => void;
  prev: () => void;
  refresh: () => void;
}

const THEMES: Record<'dark' | 'light', Record<string, string>> = {
  dark: {
    '--swap-tile': 'linear-gradient(180deg, #383b38 0%, #262826 100%)',
    '--swap-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--swap-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--swap-shadow': '0 30px 60px -24px rgba(0, 0, 0, 0.8), 0 10px 24px -12px rgba(0, 0, 0, 0.55)',
    '--swap-media-edge': 'rgba(255, 255, 255, 0.06)',
    '--swap-ink': '#f3f5f3',
    '--swap-badge': 'rgba(255, 255, 255, 0.08)',
    '--swap-shade': '#0e100e'
  },
  light: {
    '--swap-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f8f6 100%)',
    '--swap-tile-edge': 'rgba(22, 24, 22, 0.08)',
    '--swap-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--swap-shadow': '0 30px 60px -28px rgba(22, 24, 22, 0.35), 0 10px 24px -14px rgba(22, 24, 22, 0.2)',
    '--swap-media-edge': 'rgba(22, 24, 22, 0.06)',
    '--swap-ink': '#262926',
    '--swap-badge': 'rgba(22, 24, 22, 0.05)',
    '--swap-shade': '#ffffff'
  }
};

const glyph = (icon: typeof SunsetIcon) => h(HugeiconsIcon, { icon, size: 14, strokeWidth: 1.8 });

const DEFAULT_ITEMS: CardSwapItem[] = [
  {
    title: 'Golden hour',
    image: 'https://images.unsplash.com/photo-1514519334989-3d5c8b1a9f91?w=900&q=80&auto=format&fit=crop',
    icon: () => glyph(SunsetIcon)
  },
  {
    title: 'Black beach',
    image: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=900&q=80&auto=format&fit=crop',
    icon: () => glyph(BeachIcon)
  },
  {
    title: 'Steel arches',
    image: 'https://images.unsplash.com/photo-1520930528075-4ea5ead759f5?w=900&q=80&auto=format&fit=crop',
    icon: () => glyph(BridgeIcon)
  },
  {
    title: 'Pink drift',
    image: 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop',
    icon: () => glyph(CloudIcon)
  }
];

const PERSPECTIVE = 900;
const TAU = Math.PI * 2;
const STEP = 1 / 240;
const PAD = 32;
const AXES: Axis[] = ['x', 'y', 'z', 'r', 'p'];
const DOWN: Vec = { x: 0, y: 1 };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const stackBounds = ({
  width,
  height,
  cardDistance,
  verticalDistance,
  depth,
  skewAmount,
  visible,
  hoverSpread
}: BoundsInput): Bounds => {
  const slope = Math.tan((skewAmount * Math.PI) / 180);
  const spread = 1 + Math.max(0, hoverSpread);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < visible; i++) {
    const scale = PERSPECTIVE / (PERSPECTIVE + i * depth);
    for (const u of [-width / 2, width / 2]) {
      for (const v of [-height / 2, height / 2]) {
        const x = (i * cardDistance * spread + u) * scale;
        const y = (-i * verticalDistance * spread + v + u * slope) * scale;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return {
    width: Math.ceil(maxX - minX + PAD * 2),
    height: Math.ceil(maxY - minY + PAD * 2),
    originX: PAD - minX,
    originY: PAD - minY
  };
};

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true) return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return cloneVNode(node);
  if (typeof node === 'function' && !('setup' in node) && !('render' in node)) return (node as () => VNodeChild)();
  return h(node as Component);
};

const CardSwapNodeView = (props: { node?: unknown }) => renderNode(props.node);
CardSwapNodeView.props = ['node'];

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap(node => {
    if (node.type === Fragment) return flatten(Array.isArray(node.children) ? (node.children as VNode[]) : []);
    if (node.type === Comment || node.type === Text) return [];
    return [node];
  });

export const Card = defineComponent({
  name: 'Card',
  inheritAttrs: false,
  props: {
    customClass: { type: String, default: '' },
    className: { type: String, default: '' }
  },
  setup(cardProps, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: ['card-swap-card', cardProps.customClass, cardProps.className, attrs.class].filter(Boolean)
        },
        [slots.default?.(), h('span', { class: 'card-swap-card-rim', 'aria-hidden': 'true' })]
      );
  }
});
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, useSlots, watch } from 'vue';

const props = withDefaults(defineProps<CardSwapProps>(), {
  items: undefined,
  width: 460,
  height: 340,
  cardDistance: 60,
  verticalDistance: 70,
  depth: 90,
  skewAmount: 6,
  visibleCards: 4,
  delay: 4000,
  autoplay: true,
  pauseOnHover: true,
  draggable: true,
  speed: 1,
  bounce: 0.35,
  parallax: 0.5,
  hoverSpread: 0.12,
  dim: 0.5,
  cardRadius: 18,
  intro: true,
  theme: 'dark',
  onCardClick: undefined,
  onChange: undefined,
  className: ''
});

const slots = useSlots();

const rootRef = ref<HTMLDivElement | null>(null);
const stageRef = ref<HTMLDivElement | null>(null);
const slotRefs: (HTMLDivElement | null)[] = [];
const shadeRefs: (HTMLSpanElement | null)[] = [];
let api: SwapApi | null = null;
let stop: (() => void) | undefined;
let engineCount = -1;

type CardEntry = { vnode: VNode; item?: undefined } | { item: CardSwapItem; vnode?: undefined };

const readCards = (): CardEntry[] => {
  const custom = flatten(slots.default?.() ?? []);
  if (custom.length) return custom.map(vnode => ({ vnode }));
  return (props.items?.length ? props.items : DEFAULT_ITEMS).map(item => ({ item }));
};

const count = ref(props.items?.length || DEFAULT_ITEMS.length);

const cardWidth = computed(() => Math.max(40, Number(props.width) || 460));
const cardHeight = computed(() => Math.max(40, Number(props.height) || 340));
const visible = computed(() => clamp(Math.round(props.visibleCards), 1, Math.max(1, count.value)));

const bounds = computed(() =>
  stackBounds({
    width: cardWidth.value,
    height: cardHeight.value,
    cardDistance: props.cardDistance,
    verticalDistance: props.verticalDistance,
    depth: Math.max(0, props.depth),
    skewAmount: props.skewAmount,
    visible: visible.value,
    hoverSpread: props.hoverSpread
  })
);

const settings = computed<Settings>(() => ({
  width: cardWidth.value,
  height: cardHeight.value,
  dx: props.cardDistance,
  dy: props.verticalDistance,
  dz: Math.max(0, props.depth),
  skew: props.skewAmount,
  visible: visible.value,
  delay: props.delay,
  autoplay: props.autoplay,
  pauseOnHover: props.pauseOnHover,
  draggable: props.draggable,
  speed: clamp(props.speed, 0.1, 4),
  bounce: clamp(props.bounce, 0, 1),
  parallax: clamp(props.parallax, 0, 1),
  hoverSpread: Math.max(0, props.hoverSpread),
  dim: clamp(props.dim, 0, 1),
  bounds: bounds.value,
  onCardClick: props.onCardClick,
  onChange: props.onChange
}));

const getSettings = () => settings.value;

const start = (root: HTMLDivElement, stage: HTMLDivElement, count: number): (() => void) | undefined => {
  if (!count) return undefined;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const now = performance.now();
  const s0 = getSettings();

  const deck = Array.from(
    { length: count },
    (_, index): DeckCard => ({
      el: slotRefs[index],
      shade: shadeRefs[index],
      index,
      pos: index,
      from: index,
      hold: 0,
      nudge: 0,
      phase: 'rest',
      dir: { x: 0, y: 1 },
      tilt: 0,
      top: 0,
      under: false,
      x: 0,
      y: 0,
      z: 0,
      r: 0,
      p: 0,
      v: { x: 0, y: 0, z: 0, r: 0, p: 0 }
    })
  );
  const state: EngineState = {
    order: deck.map(card => card.index),
    raf: 0,
    last: 0,
    timer: 0,
    queue: [],
    layers: 0,
    scale: 1,
    hovered: false,
    overCard: false,
    inView: true,
    drag: null,
    spread: 0,
    spreadV: 0,
    px: 0,
    py: 0,
    pvx: 0,
    pvy: 0,
    tx: 0,
    ty: 0,
    dragged: false,
    autoplay: s0.autoplay,
    delay: s0.delay
  };

  const slot = (position: number, s: Settings): Pose => {
    const q = Math.min(position, s.visible);
    const spread = 1 + state.spread;
    return { x: q * s.dx * spread, y: -q * s.dy * spread, z: -q * s.dz, r: 0, p: q };
  };

  const clearance = (s: Settings, dir: Vec) => Math.abs(dir.x) * s.width + Math.abs(dir.y) * s.height + 12;

  const targetOf = (card: DeckCard, s: Settings, time: number): Pose => {
    if (card.phase === 'exit') {
      const base = slot(0, s);
      const reach = clearance(s, card.dir) * 1.3;
      return { x: base.x + card.dir.x * reach, y: base.y + card.dir.y * reach, z: base.z, r: card.tilt, p: 0 };
    }
    if (card.phase === 'enter') {
      const base = slot(0, s);
      return { x: base.x, y: base.y + clearance(s, DOWN) * 1.3, z: base.z, r: 0, p: card.p };
    }
    const position = (time < card.hold ? card.from : card.pos) + card.nudge;
    return slot(Math.max(0, position), s);
  };

  const layerOf = (card: DeckCard) => {
    if (card.top) return 1000 + card.top;
    if (card.under) return 1;
    return 10 + (count - card.pos) * 2;
  };

  const write = (card: DeckCard, s: Settings) => {
    const { el, shade } = card;
    if (!el) return;
    el.style.transform = `translate3d(${card.x.toFixed(2)}px, ${card.y.toFixed(2)}px, ${card.z.toFixed(2)}px) rotate(${card.r.toFixed(3)}deg) skewY(${s.skew}deg)`;
    el.style.zIndex = String(layerOf(card));
    const fade = clamp(s.visible - card.p, 0, 1);
    el.style.opacity = fade < 1 ? fade.toFixed(3) : '';
    el.style.visibility = fade <= 0.001 ? 'hidden' : '';
    if (shade) {
      const depthT = clamp(card.p / Math.max(1, s.visible - 1), 0, 1);
      shade.style.opacity = (s.dim * 0.62 * depthT).toFixed(3);
    }
    el.style.cursor = card.phase === 'drag' ? 'grabbing' : card.pos > 0 ? 'pointer' : s.draggable ? 'grab' : '';
    if (card.pos === 0) el.setAttribute('data-front', '');
    else el.removeAttribute('data-front');
  };

  const writeStage = (s: Settings) => {
    const ox = s.bounds.originX + state.px;
    const oy = s.bounds.originY + state.py;
    stage.style.perspectiveOrigin = `${ox.toFixed(2)}px ${oy.toFixed(2)}px`;
  };

  const integrate = (card: DeckCard, target: Pose, omega: number, zeta: number, dt: number) => {
    const k = omega * omega;
    const d = 2 * zeta * omega;
    const steps = Math.max(1, Math.ceil(dt / STEP));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      for (const axis of AXES) {
        const velocity = card.v[axis] + (k * (target[axis] - card[axis]) - d * card.v[axis]) * h;
        card.v[axis] = velocity;
        card[axis] += velocity * h;
      }
    }
  };

  const scalar = (
    value: number,
    velocity: number,
    target: number,
    omega: number,
    zeta: number,
    dt: number
  ): [number, number] => {
    const k = omega * omega;
    const d = 2 * zeta * omega;
    const steps = Math.max(1, Math.ceil(dt / STEP));
    const h = dt / steps;
    let x = value;
    let v = velocity;
    for (let i = 0; i < steps; i++) {
      v += (k * (target - x) - d * v) * h;
      x += v * h;
    }
    return [x, v];
  };

  const frame = (time: number) => {
    state.raf = 0;
    const s = getSettings();
    const dt = state.last ? Math.min(0.05, (time - state.last) / 1000) : 1 / 60;
    state.last = time;
    const speed = s.speed;
    const restOmega = TAU * 1.7 * speed;
    const restZeta = reduce ? 1 : 1 - 0.72 * s.bounce;
    const exitOmega = TAU * 1.9 * speed;
    let busy = false;

    const spreadTarget = state.hovered && !reduce ? s.hoverSpread : 0;
    [state.spread, state.spreadV] = scalar(state.spread, state.spreadV, spreadTarget, TAU * 1.4, 0.9, dt);
    [state.px, state.pvx] = scalar(state.px, state.pvx, reduce ? 0 : state.tx, TAU * 1.1, 1, dt);
    [state.py, state.pvy] = scalar(state.py, state.pvy, reduce ? 0 : state.ty, TAU * 1.1, 1, dt);
    if (
      Math.abs(state.spread - spreadTarget) > 0.0005 ||
      Math.abs(state.spreadV) > 0.0005 ||
      Math.abs(state.px - state.tx) > 0.05 ||
      Math.abs(state.py - state.ty) > 0.05 ||
      Math.abs(state.pvx) + Math.abs(state.pvy) > 0.05
    ) {
      busy = true;
    }
    writeStage(s);

    for (const card of deck) {
      if (card.phase === 'drag') {
        busy = true;
        write(card, s);
        continue;
      }
      const target = targetOf(card, s, time);
      const moving = card.phase === 'exit' || card.phase === 'enter';
      integrate(card, target, moving ? exitOmega : restOmega, moving ? 1 : restZeta, dt);
      if (card.phase === 'exit') {
        const base = slot(0, s);
        const travelled = (card.x - base.x) * card.dir.x + (card.y - base.y) * card.dir.y;
        if (travelled >= clearance(s, card.dir)) {
          card.phase = 'rest';
          card.top = 0;
          card.hold = 0;
        }
      } else if (card.phase === 'enter') {
        const base = slot(0, s);
        if (card.y - base.y >= clearance(s, DOWN)) {
          card.phase = 'rest';
          card.under = false;
          card.hold = 0;
        }
      }
      if (card.hold > time || card.phase !== 'rest') busy = true;
      for (const axis of AXES) {
        const limit = axis === 'p' ? 0.001 : 0.02;
        if (Math.abs(target[axis] - card[axis]) > limit || Math.abs(card.v[axis]) > limit) busy = true;
      }
      write(card, s);
    }

    if (busy) {
      state.raf = requestAnimationFrame(frame);
    } else {
      state.last = 0;
      for (const card of deck) {
        if (card.top && card.phase === 'rest') card.top = 0;
      }
    }
  };

  const wake = () => {
    if (!state.raf) state.raf = requestAnimationFrame(frame);
  };

  const paused = () => {
    const s = getSettings();
    return (
      !s.autoplay ||
      count < 2 ||
      (s.pauseOnHover && state.overCard) ||
      state.drag ||
      !state.inView ||
      document.visibilityState === 'hidden'
    );
  };

  const schedule = () => {
    clearTimeout(state.timer);
    state.timer = 0;
    if (paused()) return;
    state.timer = window.setTimeout(
      () => {
        state.timer = 0;
        shift(1);
      },
      Math.max(400, getSettings().delay)
    );
  };

  const settleOrder = (time: number, stagger: number) => {
    state.order.forEach((index, position) => {
      const card = deck[index];
      if (card.pos === position) return;
      card.from = card.pos;
      card.pos = position;
      card.hold = time + Math.max(0, position) * stagger;
    });
  };

  const shift = (direction: number, options: ShiftOptions = {}) => {
    if (count < 2) return;
    const s = getSettings();
    const time = performance.now();
    const stagger = 0.05 / s.speed;
    if (direction > 0) {
      const front = deck[state.order[0]];
      state.order = [...state.order.slice(1), front.index];
      settleOrder(time, stagger * 1000);
      front.phase = 'exit';
      front.dir = options.dir ?? DOWN;
      front.tilt = options.tilt ?? 0;
      front.top = ++state.layers;
      front.under = false;
      front.nudge = 0;
      front.hold = 0;
      if (options.velocity) {
        front.v.x = options.velocity.x;
        front.v.y = options.velocity.y;
      }
    } else {
      const back = deck[state.order[count - 1]];
      state.order = [back.index, ...state.order.slice(0, count - 1)];
      settleOrder(time, stagger * 1000);
      back.phase = 'enter';
      back.top = 0;
      back.under = true;
      back.nudge = 0;
      back.hold = 0;
    }
    deck.forEach(card => {
      if (card.phase === 'rest') card.nudge = 0;
    });
    s.onChange?.(state.order[0]);
    wake();
    schedule();
  };

  const goTo = (position: number) => {
    state.queue.forEach(clearTimeout);
    state.queue = [];
    const gap = 110 / getSettings().speed;
    for (let i = 0; i < position; i++) {
      state.queue.push(window.setTimeout(() => shift(1), i * gap));
    }
  };

  const fit = () => {
    const s = getSettings();
    const w = root.clientWidth;
    const h = root.clientHeight;
    const scale = Math.min(1, w / s.bounds.width, h > 0 ? h / s.bounds.height : 1);
    state.scale = scale > 0 ? scale : 1;
    stage.style.transform = `translate(-50%, -50%) scale(${state.scale.toFixed(4)})`;
  };

  const local = (event: PointerEvent) => {
    const box = root.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top, w: box.width, h: box.height };
  };

  const onMove = (event: PointerEvent) => {
    const s = getSettings();
    if (event.pointerType !== 'touch') {
      const point = local(event);
      const nx = clamp((point.x / Math.max(1, point.w)) * 2 - 1, -1, 1);
      const ny = clamp((point.y / Math.max(1, point.h)) * 2 - 1, -1, 1);
      state.tx = nx * s.parallax * 0.35 * s.bounds.width;
      state.ty = ny * s.parallax * 0.35 * s.bounds.height;
      state.hovered = true;
      const overCard = Boolean((event.target as Element | null)?.closest?.('[data-swap-index]'));
      if (overCard !== state.overCard) {
        state.overCard = overCard;
        schedule();
      }
      wake();
    }
    const drag = state.drag;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = (event.clientX - drag.startX) / state.scale;
    const dy = (event.clientY - drag.startY) / state.scale;
    if (!drag.active) {
      if (Math.hypot(dx, dy) < 5) return;
      drag.active = true;
      state.dragged = true;
      const card = deck[drag.index];
      card.phase = 'drag';
      card.v = { x: 0, y: 0, z: 0, r: 0, p: 0 };
      root.setPointerCapture?.(event.pointerId);
      root.style.cursor = 'grabbing';
    }
    const card = deck[drag.index];
    const base = slot(0, s);
    card.x = base.x + dx;
    card.y = base.y + dy;
    card.z = base.z;
    card.r = clamp(dx * 0.035, -9, 9);
    card.p = 0;
    const time = performance.now();
    drag.samples.push({ x: card.x, y: card.y, t: time });
    while (drag.samples.length > 2 && time - drag.samples[0].t > 90) drag.samples.shift();
    const progress = clamp(Math.hypot(dx, dy) / (Math.min(s.width, s.height) * 0.3), 0, 1);
    const next = deck[state.order[1]];
    if (next && next.phase === 'rest') next.nudge = -0.22 * progress;
    wake();
  };

  const onLeave = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    if (state.drag?.active) return;
    state.hovered = false;
    state.overCard = false;
    state.tx = 0;
    state.ty = 0;
    schedule();
    wake();
  };

  const onDown = (event: PointerEvent) => {
    const s = getSettings();
    state.dragged = false;
    if (!s.draggable || event.button > 0 || count < 2) return;
    const target = (event.target as Element | null)?.closest?.('[data-swap-index]');
    if (!target || !root.contains(target)) return;
    const index = Number(target.getAttribute('data-swap-index'));
    if (index !== state.order[0] || deck[index].phase !== 'rest') return;
    state.drag = {
      id: event.pointerId,
      index,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      samples: []
    };
    schedule();
  };

  const onUp = (event: PointerEvent) => {
    const drag = state.drag;
    if (!drag || drag.id !== event.pointerId) return;
    state.drag = null;
    root.style.cursor = '';
    if (!drag.active) {
      schedule();
      return;
    }
    root.releasePointerCapture?.(event.pointerId);
    const s = getSettings();
    const card = deck[drag.index];
    const base = slot(0, s);
    const first = drag.samples[0];
    const lastSample = drag.samples[drag.samples.length - 1];
    const span = first && lastSample ? Math.max(0.016, (lastSample.t - first.t) / 1000) : 1;
    const velocity =
      first && lastSample && lastSample !== first
        ? { x: (lastSample.x - first.x) / span, y: (lastSample.y - first.y) / span }
        : { x: 0, y: 0 };
    const offset = { x: card.x - base.x, y: card.y - base.y };
    const distance = Math.hypot(offset.x, offset.y);
    const fling = Math.hypot(velocity.x, velocity.y);
    const next = deck[state.order[1]];
    if (next) next.nudge = 0;
    if (event.type !== 'pointercancel' && (distance > Math.min(s.width, s.height) * 0.3 || fling > 700)) {
      const aim = { x: offset.x + velocity.x * 0.12, y: offset.y + velocity.y * 0.12 };
      const length = Math.hypot(aim.x, aim.y) || 1;
      card.phase = 'rest';
      shift(1, {
        dir: { x: aim.x / length, y: aim.y / length },
        tilt: card.r,
        velocity
      });
    } else {
      card.phase = 'rest';
      card.v.x = velocity.x;
      card.v.y = velocity.y;
      wake();
      schedule();
    }
  };

  const onClick = (event: MouseEvent) => {
    if (state.dragged) {
      state.dragged = false;
      return;
    }
    const target = (event.target as Element | null)?.closest?.('[data-swap-index]');
    if (!target || !root.contains(target)) return;
    const index = Number(target.getAttribute('data-swap-index'));
    getSettings().onCardClick?.(index);
    const position = state.order.indexOf(index);
    if (position > 0) goTo(position);
  };

  const onVisibility = () => schedule();

  api = {
    next: () => shift(1),
    prev: () => shift(-1),
    refresh: () => {
      const s = getSettings();
      deck.forEach(card => {
        const el = slotRefs[card.index];
        const shade = shadeRefs[card.index];
        if (el === card.el && shade === card.shade) return;
        card.el = el;
        card.shade = shade;
        write(card, s);
      });
      if (s.autoplay !== state.autoplay || s.delay !== state.delay) {
        state.autoplay = s.autoplay;
        state.delay = s.delay;
        schedule();
      }
      fit();
      wake();
    }
  };

  if (props.intro && !reduce) {
    deck.forEach(card => {
      card.from = 0;
      card.hold = now + (card.pos * 70) / s0.speed;
    });
    stage.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' });
  } else {
    deck.forEach(card => {
      Object.assign(card, slot(card.pos, s0));
    });
  }
  fit();
  writeStage(s0);
  deck.forEach(card => write(card, s0));
  wake();

  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(root);
  const intersectionObserver = new IntersectionObserver(entries => {
    state.inView = entries[entries.length - 1]?.isIntersecting ?? true;
    schedule();
  });
  intersectionObserver.observe(root);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('pointerdown', onDown);
  root.addEventListener('pointerup', onUp);
  root.addEventListener('pointercancel', onUp);
  root.addEventListener('click', onClick);
  document.addEventListener('visibilitychange', onVisibility);
  schedule();

  return () => {
    cancelAnimationFrame(state.raf);
    clearTimeout(state.timer);
    state.queue.forEach(clearTimeout);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('pointerdown', onDown);
    root.removeEventListener('pointerup', onUp);
    root.removeEventListener('pointercancel', onUp);
    root.removeEventListener('click', onClick);
    document.removeEventListener('visibilitychange', onVisibility);
    api = null;
  };
};

const boot = () => {
  stop?.();
  stop = undefined;
  api = null;
  const root = rootRef.value;
  const stage = stageRef.value;
  if (!root || !stage) return;
  const total = stage.querySelectorAll(':scope > [data-swap-index]').length;
  engineCount = total;
  count.value = total;
  slotRefs.length = total;
  shadeRefs.length = total;
  stop = start(root, stage, total);
};

onMounted(boot);

onUpdated(() => {
  const stage = stageRef.value;
  if (!stage) return;
  const total = stage.querySelectorAll(':scope > [data-swap-index]').length;
  if (total !== engineCount) {
    boot();
    return;
  }
  api?.refresh();
});

watch(settings, () => api?.refresh(), { flush: 'post' });

onBeforeUnmount(() => {
  stop?.();
  stop = undefined;
  api = null;
});

defineExpose<CardSwapHandle>({
  next: () => api?.next(),
  prev: () => api?.prev()
});

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    api?.next();
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    api?.prev();
  }
};

const rootStyle = computed(
  () =>
    ({
      ...(THEMES[props.theme] ?? THEMES.dark),
      '--swap-w': `${cardWidth.value}px`,
      '--swap-h': `${cardHeight.value}px`,
      '--swap-ox': `${bounds.value.originX}px`,
      '--swap-oy': `${bounds.value.originY}px`,
      '--swap-stage-w': `${bounds.value.width}px`,
      '--swap-stage-h': `${bounds.value.height}px`,
      '--swap-ratio': `${bounds.value.width} / ${bounds.value.height}`,
      '--swap-radius': `${Math.max(0, props.cardRadius)}px`
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="rootRef"
    :class="['card-swap', className]"
    :style="rootStyle"
    tabindex="0"
    role="region"
    aria-roledescription="carousel"
    aria-label="Card stack"
    @keydown="onKeyDown"
  >
    <div class="card-swap-sizer" aria-hidden="true">
      <span />
    </div>
    <div ref="stageRef" class="card-swap-stage">
      <div
        v-for="(card, index) in readCards()"
        :key="index"
        :ref="node => (slotRefs[index] = node as HTMLDivElement | null)"
        class="card-swap-slot"
        :data-swap-index="index"
      >
        <CardSwapNodeView v-if="card.vnode" :node="card.vnode" />
        <Card v-else>
          <div class="card-swap-item">
            <div v-if="card.item.icon || card.item.title" class="card-swap-head">
              <span v-if="card.item.icon" class="card-swap-icon"><CardSwapNodeView :node="card.item.icon" /></span>
              <span v-if="card.item.title" class="card-swap-title">{{ card.item.title }}</span>
            </div>
            <div v-if="card.item.image" class="card-swap-media">
              <img :src="card.item.image" :alt="card.item.alt ?? card.item.title ?? ''" draggable="false" />
            </div>
          </div>
        </Card>
        <span
          :ref="node => (shadeRefs[index] = node as HTMLSpanElement | null)"
          class="card-swap-shade"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>

<style>
.card-swap {
  position: relative;
  width: 100%;
  height: 100%;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.card-swap-sizer {
  max-height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.card-swap-sizer > span {
  display: block;
  width: 100%;
  max-width: var(--swap-stage-w);
  aspect-ratio: var(--swap-ratio);
}

.card-swap-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--swap-stage-w);
  height: var(--swap-stage-h);
  perspective: 900px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.card-swap-slot {
  position: absolute;
  top: var(--swap-oy);
  left: var(--swap-ox);
  width: var(--swap-w);
  height: var(--swap-h);
  margin: calc(var(--swap-h) / -2) 0 0 calc(var(--swap-w) / -2);
  border-radius: var(--swap-radius);
  overflow: hidden;
  isolation: isolate;
  box-shadow: var(--swap-shadow);
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-swap:focus-visible .card-swap-slot[data-front] {
  outline: 2px solid var(--swap-ink);
  outline-offset: 3px;
}

.card-swap-shade {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  background: var(--swap-shade);
  opacity: 0;
  pointer-events: none;
}

.card-swap-card {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: inherit;
  overflow: hidden;
  isolation: isolate;
  background: var(--swap-tile);
  color: var(--swap-ink);
}

.card-swap-card-rim {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--swap-tile-edge),
    inset 0 1px 0 var(--swap-tile-highlight);
  pointer-events: none;
}

.card-swap-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  padding: 6px;
  box-sizing: border-box;
}

.card-swap-head {
  display: flex;
  flex: none;
  align-items: center;
  gap: 10px;
  min-width: 0;
  height: 30px;
  padding: 0 6px;
}

.card-swap-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--swap-badge);
}

.card-swap-title {
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-swap-media {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: max(0px, calc(var(--swap-radius) - 6px));
  background: var(--swap-badge);
}

.card-swap-media img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.card-swap-media::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px var(--swap-media-edge);
  pointer-events: none;
}
</style>
