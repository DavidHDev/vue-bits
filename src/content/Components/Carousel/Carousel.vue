<script lang="ts">
import {
  h,
  isVNode,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
  type Component,
  type CSSProperties,
  type VNode,
  type VNodeChild
} from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CommandIcon,
  Drag04Icon,
  Image01Icon,
  Layers01Icon,
  Timer02Icon
} from '@hugeicons/core-free-icons';

export type CarouselNode = string | number | VNode | Component | (() => VNodeChild);

export interface CarouselItem {
  id?: string | number;
  title?: CarouselNode;
  description?: CarouselNode;
  icon?: CarouselNode;
  image?: string;
  alt?: string;
}

export type CarouselEntry = CarouselItem | string | VNode | Component;

export interface CarouselProps {
  items?: CarouselEntry[];
  baseWidth?: number | string;
  aspectRatio?: number;
  peek?: number;
  gap?: number;
  radius?: number;
  frame?: boolean;
  effect?: 'tilt' | 'slide' | 'scale' | 'fade' | 'cube';
  indicator?: 'dots' | 'bars' | 'counter' | 'none';
  arrows?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  draggable?: boolean;
  round?: boolean;
  initialIndex?: number;
  theme?: 'dark' | 'light';
  className?: string;
  style?: CSSProperties;
}

type Settings = {
  count: number;
  mode: string;
  width: number;
  bleed: number;
  inset: number;
  cardWidth: number;
  span: number;
  loop: boolean;
  autoplay: boolean;
  autoplayDelay: number;
  pauseOnHover: boolean;
  draggable: boolean;
  bars: boolean;
  shade: number;
};

type Drag = {
  id: number;
  x: number;
  y: number;
  p: number;
  from: number;
  moved: boolean;
  samples: [number, number][];
};

type Engine = {
  goTo: (index: number) => void;
  step: (direction: number, auto?: boolean) => void;
  sync: () => void;
};

const glyph = (icon: typeof Drag04Icon) => () => h(HugeiconsIcon, { icon, size: 16, strokeWidth: 1.8 });

export const DEFAULT_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: 'Swipe with momentum',
    description: 'Fling the cards and they glide into place.',
    icon: glyph(Drag04Icon)
  },
  {
    id: 2,
    title: 'Autoplay with a timer',
    description: 'The indicator fills up so people know what comes next.',
    icon: glyph(Timer02Icon)
  },
  {
    id: 3,
    title: 'Five transitions',
    description: 'Tilt, slide, scale, fade or turn the cards like a cube.',
    icon: glyph(Layers01Icon)
  },
  {
    id: 4,
    title: 'Keyboard friendly',
    description: 'Arrow keys, Home and End move between the cards.',
    icon: glyph(CommandIcon)
  },
  {
    id: 5,
    title: 'Bring any content',
    description: 'Pass text, images or your own components as cards.',
    icon: glyph(Image01Icon)
  }
];

const THEMES: Record<string, Record<string, string>> = {
  dark: {
    '--carousel-frame': 'rgba(34, 37, 35, 0.66)',
    '--carousel-frame-edge': 'rgba(255, 255, 255, 0.08)',
    '--carousel-frame-highlight': 'rgba(255, 255, 255, 0.07)',
    '--carousel-frame-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--carousel-tile': 'linear-gradient(180deg, #373a38 0%, #242725 100%)',
    '--carousel-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--carousel-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--carousel-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--carousel-ink': '#f4f5f4',
    '--carousel-muted': 'rgba(244, 245, 244, 0.6)',
    '--carousel-faint': 'rgba(255, 255, 255, 0.22)',
    '--carousel-soft': 'rgba(255, 255, 255, 0.42)',
    '--carousel-badge': 'rgba(255, 255, 255, 0.08)',
    '--carousel-hover': 'brightness(1.12)',
    '--carousel-press': 'brightness(0.8)'
  },
  light: {
    '--carousel-frame': 'rgba(239, 242, 239, 0.8)',
    '--carousel-frame-edge': 'rgba(22, 24, 22, 0.07)',
    '--carousel-frame-highlight': 'rgba(255, 255, 255, 0.95)',
    '--carousel-frame-shadow': '0 22px 44px -22px rgba(22, 24, 22, 0.3), 0 6px 16px -10px rgba(22, 24, 22, 0.16)',
    '--carousel-tile': 'linear-gradient(180deg, #ffffff 0%, #f5f7f5 100%)',
    '--carousel-tile-edge': 'rgba(22, 24, 22, 0.08)',
    '--carousel-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--carousel-tile-shadow': '0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    '--carousel-ink': '#252825',
    '--carousel-muted': 'rgba(37, 40, 37, 0.6)',
    '--carousel-faint': 'rgba(22, 24, 22, 0.16)',
    '--carousel-soft': 'rgba(22, 24, 22, 0.34)',
    '--carousel-badge': 'rgba(22, 24, 22, 0.05)',
    '--carousel-hover': 'brightness(0.97)',
    '--carousel-press': 'brightness(0.92)'
  }
};

const EFFECTS = ['tilt', 'slide', 'scale', 'fade', 'cube'];
const STIFFNESS = 150;
const DAMPING = 24;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wrap = (value: number, count: number) => ((value % count) + count) % count;
const nearest = (offset: number, count: number) => wrap(offset + count / 2, count) - count / 2;

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const edgeMask = (size: number) => {
  const stops = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map(t => [smootherstep(t).toFixed(3), (t * size).toFixed(1)]);
  const left = stops.map(([alpha, x]) => `rgba(0, 0, 0, ${alpha}) ${x}px`);
  const right = [...stops].reverse().map(([alpha, x]) => `rgba(0, 0, 0, ${alpha}) calc(100% - ${x}px)`);
  return `linear-gradient(to right, ${[...left, ...right].join(', ')})`;
};

const band = (value: number, max: number) => {
  if (value < 0) return -0.3 * (1 - Math.exp(value / 0.55));
  if (value > max) return max + 0.3 * (1 - Math.exp((max - value) / 0.55));
  return value;
};

const pose = (index: number, position: number, s: Settings) => {
  const offset = s.loop ? nearest(index - position, s.count) : index - position;
  const distance = Math.abs(offset);
  const near = Math.min(distance, 1);
  const result = {
    transform: 'none',
    opacity: 1,
    visible: true,
    layer: 10 - Math.min(9, Math.round(distance * 2)),
    shade: 0,
    focus: 1
  };
  if (s.mode === 'fade') {
    const half = Math.min(1, near * 2);
    result.visible = distance < 1;
    result.opacity = 1 - near * near * (3 - 2 * near);
    result.transform = `scale(${1 - 0.04 * near})`;
    result.focus = 1 - half * half * (3 - 2 * half);
    return result;
  }
  if (s.mode === 'cube') {
    const half = s.cardWidth / 2;
    const turn = Math.sin(Math.PI * (position - Math.floor(position)));
    result.visible = distance < 1;
    result.transform = `scale(${1 - 0.12 * turn}) translateZ(${-half}px) rotateY(${clamp(offset, -1, 1) * 90}deg) translateZ(${half}px)`;
    result.shade = near * s.shade;
    return result;
  }
  let x = offset * s.span;
  result.visible = x > -(s.inset + s.cardWidth + 2) && x < s.width + s.bleed * 2 - s.inset + 2;
  result.focus = 1 - near * near * (3 - 2 * near);
  if (s.mode === 'tilt') {
    result.visible = result.visible && distance < 1;
    result.transform = `translate3d(${x}px, 0, 0) rotateY(${-clamp(offset, -1, 1) * 90}deg)`;
  } else if (s.mode === 'scale') {
    x -= Math.sign(offset) * near * s.cardWidth * 0.06;
    result.transform = `translate3d(${x}px, 0, 0) scale(${1 - 0.12 * near})`;
    result.opacity = 1 - 0.5 * near;
  } else {
    result.transform = `translate3d(${x}px, 0, 0)`;
  }
  return result;
};

const isCustom = (item: unknown): item is VNode | Component => {
  if (isVNode(item) || typeof item === 'function') return true;
  return typeof item === 'object' && item !== null && ('setup' in item || 'render' in item || 'template' in item);
};

const keyOf = (item: CarouselEntry, index: number) => {
  if (isVNode(item)) return item.key ?? index;
  if (typeof item === 'object' && item !== null && !isCustom(item) && (item as CarouselItem).id != null)
    return (item as CarouselItem).id as string | number;
  return index;
};

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true || node === '') return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return node;
  return h(node as Component);
};

const CarouselCard = (props: { item: CarouselEntry; round: boolean; compact: boolean }) => {
  const { item, round, compact } = props;
  if (isCustom(item)) {
    return h('div', { class: `carousel-card is-custom${round ? ' is-round' : ''}` }, [
      renderNode(item),
      h('span', { class: 'carousel-card-rim' })
    ]);
  }
  const {
    image,
    alt = '',
    icon: mark,
    title,
    description
  }: CarouselItem = typeof item === 'string' ? { image: item } : ((item as CarouselItem) ?? {});
  const text = Boolean(title || description);
  return h('div', { class: `carousel-card${image ? ' has-image' : ''}${round ? ' is-round' : ''}` }, [
    image ? h('img', { class: 'carousel-image', src: image, alt, draggable: false, decoding: 'async' }) : null,
    image && text ? h('span', { class: 'carousel-scrim' }) : null,
    mark ? h('span', { class: 'carousel-icon' }, [renderNode(mark)]) : null,
    text
      ? h('div', { class: 'carousel-text' }, [
          title ? h('div', { class: 'carousel-title' }, [renderNode(title)]) : null,
          description && !compact ? h('p', { class: 'carousel-description' }, [renderNode(description)]) : null
        ])
      : null,
    h('span', { class: 'carousel-card-rim' })
  ]);
};
CarouselCard.props = ['item', 'round', 'compact'];
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<CarouselProps>(), {
  items: () => DEFAULT_ITEMS,
  baseWidth: 300,
  aspectRatio: 1.25,
  peek: 0,
  gap: 16,
  radius: 12,
  frame: true,
  effect: 'tilt',
  indicator: 'dots',
  arrows: false,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false,
  loop: false,
  draggable: true,
  round: false,
  initialIndex: 0,
  theme: 'dark',
  className: '',
  style: undefined
});

const emit = defineEmits<{ change: [index: number] }>();

const rootRef = ref<HTMLDivElement | null>(null);
const stageRef = ref<HTMLDivElement | null>(null);
const viewportRef = ref<HTMLDivElement | null>(null);
const counterRef = ref<HTMLSpanElement | null>(null);
const slideRefs: (HTMLDivElement | null)[] = [];
const shadeRefs: (HTMLSpanElement | null)[] = [];
const fillRefs: (HTMLSpanElement | null)[] = [];
let engine: Engine | null = null;

const count = computed(() => props.items.length);
const mode = computed(() => (EFFECTS.includes(props.effect) ? props.effect : 'tilt'));
const stacked = computed(() => mode.value === 'fade' || mode.value === 'cube');
const ratio = computed(() => clamp(props.aspectRatio, 0.3, 4));
const maxWidth = computed(() =>
  typeof props.baseWidth === 'number' && props.round && props.frame
    ? 20 + (props.baseWidth - 20) * Math.min(1, 1 / ratio.value)
    : props.baseWidth
);
const width = ref(typeof maxWidth.value === 'number' ? maxWidth.value - (props.frame ? 20 : 0) : 300);
const active = ref(clamp(Math.round(props.initialIndex), 0, Math.max(0, props.items.length - 1)));
const start = active.value;

const side = computed(() =>
  stacked.value || (props.round && props.frame) ? 0 : clamp(props.peek, 0, width.value * 0.2)
);
const slot = computed(() => Math.max(40, width.value - side.value * 2));
const diameter = computed(() => (props.frame ? slot.value : Math.min(slot.value, slot.value / ratio.value)));
const cardWidth = computed(() => (props.round ? diameter.value : slot.value));
const cardHeight = computed(() => (props.round ? diameter.value : slot.value / ratio.value));
const clipped = computed(() => !props.frame && !stacked.value);
const bleed = computed(() => (clipped.value ? Math.round(Math.min(48, cardWidth.value * 0.12)) : 0));
const inset = computed(() => bleed.value + (width.value - cardWidth.value) / 2);
const settings = computed<Settings>(() => ({
  count: count.value,
  mode: mode.value,
  width: width.value,
  bleed: bleed.value,
  inset: inset.value,
  cardWidth: cardWidth.value,
  span: cardWidth.value + Math.max(0, props.gap),
  loop: props.loop && count.value > 1,
  autoplay: props.autoplay && count.value > 1,
  autoplayDelay: Math.max(600, props.autoplayDelay),
  pauseOnHover: props.pauseOnHover,
  draggable: props.draggable && count.value > 1,
  bars: props.indicator === 'bars',
  shade: props.theme === 'light' ? 0.3 : 0.6
}));

const controls = computed(() => count.value > 1 && (props.indicator !== 'none' || props.arrows));
const atStart = computed(() => !settings.value.loop && active.value === 0);
const atEnd = computed(() => !settings.value.loop && active.value === count.value - 1);
const perspective = computed(() =>
  mode.value === 'cube' ? `${Math.round(cardWidth.value * 2.6)}px` : mode.value === 'tilt' ? '1000px' : undefined
);
const mask = computed(() => (clipped.value ? edgeMask(inset.value) : undefined));
const inside = computed(() => props.frame && !props.round);

const rootClass = computed(
  () =>
    `carousel-container${props.frame ? ' has-frame' : ''}${props.round ? ' is-round' : ''}${props.className ? ` ${props.className}` : ''}`
);

const rootStyle = computed<CSSProperties>(() => ({
  ...(THEMES[props.theme] ?? THEMES.dark),
  '--carousel-radius': `${props.round ? 9999 : Math.max(0, props.radius)}px`,
  '--carousel-scale': clamp(cardWidth.value / 300, 0.86, 1),
  width: typeof maxWidth.value === 'number' ? '100%' : maxWidth.value,
  maxWidth: typeof maxWidth.value === 'number' ? `${maxWidth.value}px` : undefined,
  ...props.style
}));

const viewportStyle = computed<CSSProperties>(() => ({
  height: `${cardHeight.value}px`,
  marginInline: bleed.value ? `${-bleed.value}px` : undefined,
  perspective: perspective.value,
  overflowX: clipped.value ? 'clip' : 'visible',
  maskImage: mask.value,
  WebkitMaskImage: mask.value
}));

const slideStyle = (index: number): CSSProperties => {
  const initial = pose(index, active.value, settings.value);
  return {
    left: `${inset.value}px`,
    width: `${cardWidth.value}px`,
    height: `${cardHeight.value}px`,
    transform: initial.transform,
    opacity: initial.opacity,
    visibility: initial.visible ? 'visible' : 'hidden',
    zIndex: initial.layer,
    '--carousel-focus': initial.focus
  } as CSSProperties;
};

const shadeOpacity = (index: number) => pose(index, active.value, settings.value).shade;

const fillScale = (index: number) =>
  `scaleX(${index < active.value ? 1 : index === active.value && !settings.value.autoplay ? 1 : 0})`;

const onSlideClick = (index: number) => {
  if (index !== active.value) engine?.goTo(index);
};

const Controls = () =>
  h('div', { class: 'carousel-controls', style: { width: `${cardWidth.value}px` } }, [
    props.arrows
      ? h(
          'button',
          {
            type: 'button',
            class: 'carousel-arrow',
            'aria-label': 'Previous slide',
            disabled: atStart.value,
            onClick: () => engine?.step(-1)
          },
          [h(HugeiconsIcon, { icon: ArrowLeft01Icon, size: 16, strokeWidth: 2 })]
        )
      : null,
    props.indicator === 'dots'
      ? h(
          'div',
          { class: 'carousel-dots' },
          props.items.map((_, index) =>
            h(
              'button',
              {
                key: index,
                type: 'button',
                class: `carousel-dot${index === active.value ? ' is-active' : ''}`,
                'aria-label': `Go to slide ${index + 1}`,
                'aria-current': index === active.value ? 'true' : undefined,
                onClick: () => engine?.goTo(index)
              },
              [h('span', { class: 'carousel-dot-mark' })]
            )
          )
        )
      : null,
    props.indicator === 'bars'
      ? h(
          'div',
          { class: 'carousel-bars' },
          props.items.map((_, index) =>
            h(
              'button',
              {
                key: index,
                type: 'button',
                class: 'carousel-bar',
                'aria-label': `Go to slide ${index + 1}`,
                'aria-current': index === active.value ? 'true' : undefined,
                onClick: () => engine?.goTo(index)
              },
              [
                h('span', { class: 'carousel-bar-track' }, [
                  h('span', {
                    ref: (element: unknown) => {
                      fillRefs[index] = element as HTMLSpanElement | null;
                    },
                    class: 'carousel-bar-fill',
                    style: { transform: fillScale(index) }
                  })
                ])
              ]
            )
          )
        )
      : null,
    props.indicator === 'counter'
      ? h('div', { class: 'carousel-counter' }, [
          h('span', { ref: counterRef, class: 'carousel-counter-current' }, String(active.value + 1).padStart(2, '0')),
          h('span', '/'),
          h('span', String(count.value).padStart(2, '0'))
        ])
      : null,
    props.arrows
      ? h(
          'button',
          {
            type: 'button',
            class: 'carousel-arrow',
            'aria-label': 'Next slide',
            disabled: atEnd.value,
            onClick: () => engine?.step(1)
          },
          [h(HugeiconsIcon, { icon: ArrowRight01Icon, size: 16, strokeWidth: 2 })]
        )
      : null
  ]);

let teardown: (() => void) | null = null;

onMounted(() => {
  const root = rootRef.value;
  const stage = stageRef.value;
  const viewport = viewportRef.value;
  if (!root || !stage || !viewport) return;

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const state = {
    p: start,
    v: 0,
    target: start,
    shown: start,
    elapsed: 0,
    hovered: false,
    focused: false,
    visible: true,
    drag: null as Drag | null,
    wheeling: false,
    wheelTimer: 0 as number,
    suppress: false,
    last: 0
  };
  let raf = 0;
  let alive = true;

  const unit = (s: Settings) => (s.mode === 'fade' || s.mode === 'cube' ? s.cardWidth : s.span);
  const limit = (s: Settings, value: number) => (s.loop ? value : clamp(value, 0, s.count - 1));

  const apply = () => {
    const s = settings.value;
    for (let i = 0; i < s.count; i++) {
      const slide = slideRefs[i];
      if (!slide) continue;
      const next = pose(i, state.p, s);
      slide.style.transform = next.transform;
      slide.style.opacity = String(next.opacity);
      slide.style.visibility = next.visible ? 'visible' : 'hidden';
      slide.style.zIndex = String(next.layer);
      slide.style.setProperty('--carousel-focus', String(next.focus));
      const shade = shadeRefs[i];
      if (shade) shade.style.opacity = String(next.shade);
    }
    if (!s.bars) return;
    const progress = s.autoplay ? clamp(state.elapsed / s.autoplayDelay, 0, 1) : 1;
    for (let i = 0; i < s.count; i++) {
      const fill = fillRefs[i];
      if (fill) fill.style.transform = `scaleX(${i < state.shown ? 1 : i === state.shown ? progress : 0})`;
    }
  };

  const announce = () => {
    const s = settings.value;
    if (!s.count) return;
    const index = s.loop ? wrap(Math.round(state.target), s.count) : clamp(Math.round(state.target), 0, s.count - 1);
    if (index === state.shown) return;
    state.shown = index;
    active.value = index;
  };

  const paused = (s: Settings) =>
    (s.pauseOnHover && state.hovered) ||
    state.focused ||
    Boolean(state.drag) ||
    state.wheeling ||
    !state.visible ||
    document.hidden;

  const tick = (now: number) => {
    raf = 0;
    if (!alive) return;
    const s = settings.value;
    const dt = state.last ? Math.min(0.05, (now - state.last) / 1000) : 1 / 60;
    state.last = now;
    let busy = false;
    if (!state.drag?.moved && !state.wheeling) {
      if (reduce) {
        state.p = state.target;
        state.v = 0;
      } else {
        const steps = Math.ceil(dt * 240);
        const h = dt / steps;
        for (let k = 0; k < steps; k++) {
          state.v += (STIFFNESS * (state.target - state.p) - DAMPING * state.v) * h;
          state.p += state.v * h;
        }
        if (Math.abs(state.target - state.p) < 0.0004 && Math.abs(state.v) < 0.004) {
          state.p = state.target;
          state.v = 0;
        } else {
          busy = true;
        }
      }
      if (!busy && s.loop && s.count) {
        state.target = wrap(Math.round(state.target), s.count);
        state.p = state.target;
      }
    }
    if (s.autoplay && !paused(s)) {
      state.elapsed += dt * 1000;
      if (state.elapsed >= s.autoplayDelay) step(1, true);
      busy = true;
    }
    apply();
    if (busy) raf = requestAnimationFrame(tick);
    else state.last = 0;
  };

  const wake = () => {
    if (!raf && alive) raf = requestAnimationFrame(tick);
  };

  const moveTo = (target: number) => {
    state.target = target;
    state.elapsed = 0;
    announce();
    apply();
    wake();
  };

  const step = (direction: number, auto = false) => {
    const s = settings.value;
    if (s.count < 2) return;
    let next = Math.round(state.target) + direction;
    if (!s.loop) {
      if (auto && next > s.count - 1) next = 0;
      next = clamp(next, 0, s.count - 1);
    }
    moveTo(next);
  };

  const goTo = (index: number) => {
    const s = settings.value;
    if (!s.count) return;
    const goal = clamp(Math.round(index), 0, s.count - 1);
    const current = Math.round(state.target);
    moveTo(s.loop ? current + nearest(goal - wrap(current, s.count), s.count) : goal);
  };

  const onPointerDown = (event: PointerEvent) => {
    const s = settings.value;
    if (!s.draggable || (event.pointerType === 'mouse' && event.button !== 0)) return;
    state.drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      p: state.p,
      from: 0,
      moved: false,
      samples: []
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.id) return;
    const s = settings.value;
    if (!drag.moved) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        state.drag = null;
        return;
      }
      drag.moved = true;
      drag.x = event.clientX;
      drag.p = state.p;
      drag.from = Math.round(state.target);
      viewport.setPointerCapture?.(event.pointerId);
      viewport.dataset.dragging = 'true';
    }
    const raw = drag.p - (event.clientX - drag.x) / unit(s);
    state.p = s.loop ? raw : band(raw, s.count - 1);
    state.v = 0;
    state.target = Math.round(limit(s, state.p));
    drag.samples.push([event.timeStamp, event.clientX]);
    if (drag.samples.length > 8) drag.samples.shift();
    announce();
    apply();
  };

  const onPointerUp = (event: PointerEvent) => {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.id) return;
    state.drag = null;
    delete viewport.dataset.dragging;
    if (!drag.moved) {
      wake();
      return;
    }
    state.suppress = true;
    window.setTimeout(() => {
      state.suppress = false;
    }, 0);
    const s = settings.value;
    const sample: [number, number] = drag.samples.find(([time]) => event.timeStamp - time < 90) ?? [
      event.timeStamp,
      event.clientX
    ];
    const elapsed = Math.max(16, event.timeStamp - sample[0]);
    const velocity = clamp(((sample[1] - event.clientX) / elapsed) * (1000 / unit(s)), -12, 12);
    const travelled = state.p - drag.from;
    let target = Math.round(state.p + velocity * 0.2);
    if (target === drag.from) {
      if (Math.abs(velocity) > 0.8) target += Math.sign(velocity);
      else if (Math.abs(travelled) > 0.18) target += Math.sign(travelled);
    }
    if (!s.loop) target = clamp(target, 0, s.count - 1);
    const within = s.loop || (state.p >= 0 && state.p <= s.count - 1);
    state.v = within ? velocity : 0;
    moveTo(target);
  };

  const onClickCapture = (event: MouseEvent) => {
    if (!state.suppress) return;
    event.preventDefault();
    event.stopPropagation();
    state.suppress = false;
  };

  const onWheel = (event: WheelEvent) => {
    const s = settings.value;
    if (!s.draggable || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    const raw = state.p + event.deltaX / unit(s);
    state.p = s.loop ? raw : clamp(raw, -0.15, s.count - 0.85);
    state.v = 0;
    state.wheeling = true;
    state.target = Math.round(limit(s, state.p));
    announce();
    apply();
    window.clearTimeout(state.wheelTimer);
    state.wheelTimer = window.setTimeout(() => {
      state.wheeling = false;
      moveTo(Math.round(limit(settings.value, state.p)));
    }, 120);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]'))
      return;
    const s = settings.value;
    const keys: Record<string, () => void> = {
      ArrowRight: () => step(1),
      ArrowLeft: () => step(-1),
      Home: () => goTo(0),
      End: () => goTo(s.count - 1)
    };
    if (!keys[event.key]) return;
    event.preventDefault();
    keys[event.key]();
  };

  const onEnter = () => {
    state.hovered = true;
  };

  const onLeave = () => {
    state.hovered = false;
    wake();
  };

  const onFocusIn = () => {
    try {
      state.focused = root.matches(':focus-visible') || Boolean(root.querySelector(':focus-visible'));
    } catch {
      state.focused = false;
    }
  };

  const onFocusOut = (event: FocusEvent) => {
    if (root.contains(event.relatedTarget as Node | null)) return;
    state.focused = false;
    wake();
  };

  const onVisibility = () => {
    if (document.hidden) return;
    state.last = 0;
    wake();
  };

  const resizeObserver = new ResizeObserver(entries => {
    const box = entries[entries.length - 1]?.contentRect;
    if (box) width.value = Math.max(1, Math.round(box.width));
  });
  resizeObserver.observe(stage);
  const visibility = new IntersectionObserver(entries => {
    state.visible = entries.some(entry => entry.isIntersecting);
    if (state.visible) wake();
  });
  visibility.observe(root);

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('pointercancel', onPointerUp);
  viewport.addEventListener('click', onClickCapture, true);
  viewport.addEventListener('wheel', onWheel, { passive: false });
  root.addEventListener('keydown', onKeyDown);
  root.addEventListener('mouseenter', onEnter);
  root.addEventListener('mouseleave', onLeave);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('focusout', onFocusOut);
  document.addEventListener('visibilitychange', onVisibility);

  engine = {
    goTo,
    step,
    sync: () => {
      const s = settings.value;
      if (!s.loop && s.count) {
        state.target = clamp(Math.round(state.target), 0, s.count - 1);
        state.p = clamp(state.p, -0.3, s.count - 0.7);
      }
      announce();
      apply();
      wake();
    }
  };
  engine.sync();

  teardown = () => {
    alive = false;
    cancelAnimationFrame(raf);
    window.clearTimeout(state.wheelTimer);
    engine = null;
    resizeObserver.disconnect();
    visibility.disconnect();
    viewport.removeEventListener('pointerdown', onPointerDown);
    viewport.removeEventListener('pointermove', onPointerMove);
    viewport.removeEventListener('pointerup', onPointerUp);
    viewport.removeEventListener('pointercancel', onPointerUp);
    viewport.removeEventListener('click', onClickCapture, true);
    viewport.removeEventListener('wheel', onWheel);
    root.removeEventListener('keydown', onKeyDown);
    root.removeEventListener('mouseenter', onEnter);
    root.removeEventListener('mouseleave', onLeave);
    root.removeEventListener('focusin', onFocusIn);
    root.removeEventListener('focusout', onFocusOut);
    document.removeEventListener('visibilitychange', onVisibility);
  };
});

onUpdated(() => {
  engine?.sync();
});

onBeforeUnmount(() => {
  teardown?.();
  teardown = null;
});

watch(active, value => emit('change', value));

watch(
  active,
  (current, previous) => {
    const counter = counterRef.value;
    if (!counter?.animate || previous === current) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const delta = props.loop && count.value > 1 ? nearest(current - previous, count.value) : current - previous;
    counter.animate(
      [
        { transform: `translateY(${delta > 0 ? 70 : -70}%)`, opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      { duration: 320, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
    );
  },
  { flush: 'post' }
);
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClass"
    :style="rootStyle"
    role="region"
    aria-roledescription="carousel"
    aria-label="Carousel"
    tabindex="0"
  >
    <div ref="stageRef" class="carousel-stage">
      <div
        ref="viewportRef"
        class="carousel-viewport"
        :data-draggable="settings.draggable ? 'true' : undefined"
        :aria-live="settings.autoplay ? 'off' : 'polite'"
        :style="viewportStyle"
      >
        <div
          v-for="(item, index) in items"
          :key="keyOf(item, index)"
          :ref="element => (slideRefs[index] = element as HTMLDivElement | null)"
          class="carousel-slide"
          :style="slideStyle(index)"
          :data-current="index === active ? 'true' : undefined"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${index + 1} of ${count}`"
          @click="onSlideClick(index)"
        >
          <CarouselCard :item="item" :round="round" :compact="round && cardWidth < 240" />
          <span
            v-if="mode === 'cube'"
            :ref="element => (shadeRefs[index] = element as HTMLSpanElement | null)"
            class="carousel-shade"
            :style="{ opacity: shadeOpacity(index) }"
          />
        </div>
      </div>

      <Controls v-if="inside && controls" />
      <span v-if="frame" class="carousel-frame-rim" />
    </div>

    <Controls v-if="!inside && controls" />
  </div>
</template>

<style>
.carousel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 100%;
  box-sizing: border-box;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.carousel-container.has-frame {
  gap: 16px;
}

.carousel-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  gap: 12px;
  box-sizing: border-box;
  border-radius: var(--carousel-radius);
}

.carousel-container:focus-visible .carousel-stage {
  outline: 2px solid var(--carousel-ink);
  outline-offset: 4px;
}

.carousel-container.has-frame .carousel-stage {
  padding: 10px;
  border-radius: calc(var(--carousel-radius) + 10px);
  background: var(--carousel-frame);
  box-shadow: var(--carousel-frame-shadow);
  overflow: hidden;
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
}

.carousel-container.has-frame.is-round .carousel-stage {
  border-radius: 50%;
}

.carousel-frame-rim {
  position: absolute;
  inset: 0;
  z-index: 30;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--carousel-frame-edge),
    inset 0 1px 0 var(--carousel-frame-highlight);
  pointer-events: none;
}

.carousel-viewport {
  position: relative;
  align-self: stretch;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.carousel-viewport[data-draggable='true'] {
  cursor: grab;
}

.carousel-viewport[data-dragging='true'] {
  cursor: grabbing;
}

.carousel-slide {
  position: absolute;
  top: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform, opacity;
}

.carousel-slide:not([data-current]) {
  cursor: pointer;
}

.carousel-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  height: 100%;
  padding: calc(20px * var(--carousel-scale, 1));
  box-sizing: border-box;
  border-radius: var(--carousel-radius);
  background: var(--carousel-tile);
  box-shadow: var(--carousel-tile-shadow);
  color: var(--carousel-ink);
  overflow: hidden;
  transition: filter 0.25s ease;
}

.carousel-card-rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--carousel-tile-edge),
    inset 0 1px 0 var(--carousel-tile-highlight);
  pointer-events: none;
}

.carousel-card.is-custom {
  display: block;
  padding: 0;
}

.carousel-card.is-round {
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 14%;
  text-align: center;
}

.carousel-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.carousel-scrim {
  position: absolute;
  inset: 0;
  opacity: var(--carousel-focus, 1);
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.62) 0%,
    rgba(0, 0, 0, 0.6) 8%,
    rgba(0, 0, 0, 0.54) 17%,
    rgba(0, 0, 0, 0.45) 26%,
    rgba(0, 0, 0, 0.34) 36%,
    rgba(0, 0, 0, 0.22) 46%,
    rgba(0, 0, 0, 0.11) 56%,
    rgba(0, 0, 0, 0.04) 64%,
    rgba(0, 0, 0, 0) 72%
  );
}

.carousel-card.is-round .carousel-scrim {
  background: rgba(0, 0, 0, 0.3);
}

.carousel-icon {
  position: relative;
  display: grid;
  place-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--carousel-badge);
  color: var(--carousel-ink);
}

.carousel-card.has-image .carousel-icon {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.carousel-icon svg {
  width: 16px;
  height: 16px;
}

.carousel-text {
  position: relative;
  margin-top: auto;
  opacity: var(--carousel-focus, 1);
}

.carousel-card.is-round .carousel-text {
  margin-top: 0;
}

.carousel-title {
  font-size: calc(18px * var(--carousel-scale, 1));
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.carousel-description {
  margin: 4px 0 0;
  font-size: calc(14px * var(--carousel-scale, 1));
  line-height: 1.45;
  color: var(--carousel-muted);
}

.carousel-card.has-image .carousel-title {
  color: #ffffff;
}

.carousel-card.has-image .carousel-description {
  color: rgba(255, 255, 255, 0.78);
}

.carousel-shade {
  position: absolute;
  inset: 0;
  border-radius: var(--carousel-radius);
  background: #000000;
  pointer-events: none;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  max-width: 100%;
}

.carousel-arrow {
  display: grid;
  place-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--carousel-tile);
  box-shadow:
    inset 0 0 0 1px var(--carousel-tile-edge),
    inset 0 1px 0 var(--carousel-tile-highlight),
    var(--carousel-tile-shadow);
  color: var(--carousel-ink);
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    filter 0.2s ease,
    transform 0.2s ease;
}

.carousel-arrow:disabled {
  opacity: 0.35;
  cursor: default;
}

.carousel-arrow:not(:disabled):active {
  filter: var(--carousel-press);
  transform: scale(0.92);
  transition-duration: 0s;
}

.carousel-arrow:focus-visible,
.carousel-dot:focus-visible,
.carousel-bar:focus-visible {
  outline: 2px solid var(--carousel-ink);
  outline-offset: 2px;
}

.carousel-dots {
  display: flex;
  align-items: center;
}

.carousel-dot {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;
}

.carousel-dot-mark {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--carousel-faint);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.carousel-dot.is-active .carousel-dot-mark {
  background: var(--carousel-ink);
  transform: scale(1.2);
}

.carousel-bars {
  display: flex;
  flex: 1;
  gap: 6px;
  min-width: 0;
}

.carousel-bar {
  display: flex;
  align-items: center;
  flex: 1;
  height: 20px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.carousel-bar-track {
  position: relative;
  width: 100%;
  height: 3px;
  border-radius: 3px;
  background: var(--carousel-faint);
  overflow: hidden;
  transition: background-color 0.2s ease;
}

.carousel-bar-fill {
  position: absolute;
  inset: 0;
  background: var(--carousel-ink);
  transform-origin: left center;
}

.carousel-counter {
  display: flex;
  align-items: baseline;
  gap: 6px;
  overflow: hidden;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: var(--carousel-muted);
}

.carousel-counter-current {
  display: inline-block;
  color: var(--carousel-ink);
}

@media (hover: hover) {
  .carousel-slide:hover .carousel-card {
    filter: var(--carousel-hover);
  }

  .carousel-arrow:not(:disabled):hover {
    filter: var(--carousel-hover);
  }

  .carousel-arrow:not(:disabled):hover:active {
    filter: var(--carousel-press);
  }

  .carousel-dot:not(.is-active):hover .carousel-dot-mark,
  .carousel-bar:hover .carousel-bar-track {
    background: var(--carousel-soft);
  }
}
</style>
