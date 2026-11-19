<script lang="ts">
import { cloneVNode, h, isVNode, type Component, type VNode, type VNodeChild } from 'vue';

export type PillNavNode = string | number | boolean | null | undefined | VNode | Component | (() => VNodeChild);

export interface PillNavItem {
  label: string;
  href?: string;
  icon?: PillNavNode;
  ariaLabel?: string;
}

const DEFAULT_ITEMS: PillNavItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
];

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true) return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return cloneVNode(node);
  return h(node as Component);
};

export const PillNavNodeView = (props: { node?: unknown }) => renderNode(props.node);
PillNavNodeView.props = ['node'];
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useId, watch, type CSSProperties } from 'vue';

interface PillNavProps {
  logo?: PillNavNode;
  logoAlt?: string;
  logoHref?: string;
  items?: PillNavItem[];
  activeHref?: string;
  defaultActiveIndex?: number;
  onItemClick?: (item: PillNavItem, index: number, event: MouseEvent) => void;
  linkComponent?: string | Component;
  theme?: 'dark' | 'light';
  layout?: 'split' | 'joined';
  size?: 'sm' | 'md' | 'lg';
  surface?: 'glass' | 'solid' | 'none';
  itemStyle?: 'pill' | 'plain';
  hoverEffect?: 'fill' | 'glide' | 'none';
  indicator?: 'dot' | 'pill' | 'none';
  highlightColor?: string;
  highlightTextColor?: string;
  barColor?: string;
  textColor?: string;
  bounce?: number;
  stretch?: number;
  intro?: boolean;
  collapse?: 'auto' | 'always' | 'never';
  onMenuToggle?: (open: boolean) => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties | Record<string, string>;
}

interface Engine {
  enter: (index: number, event?: PointerEvent) => void;
  leave: () => void;
  focus: (index: number, event?: FocusEvent) => void;
  blur: () => void;
  press: (event?: PointerEvent) => void;
  release: () => void;
  refresh: () => void;
}

const THEMES: Record<string, Record<string, string>> = {
  dark: {
    '--pn-surface': 'rgba(36, 38, 36, 0.66)',
    '--pn-solid': '#242624',
    '--pn-edge': 'rgba(255, 255, 255, 0.08)',
    '--pn-rim': 'rgba(255, 255, 255, 0.07)',
    '--pn-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--pn-text': 'rgba(244, 245, 244, 0.64)',
    '--pn-strong': '#f4f5f4',
    '--pn-pill': 'linear-gradient(180deg, #ffffff 0%, #ebeeeb 100%)',
    '--pn-pill-ink': '#111311',
    '--pn-pill-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 16px -6px rgba(0, 0, 0, 0.6)',
    '--pn-dot': '#f4f5f4',
    '--pn-ring': 'rgba(244, 245, 244, 0.55)',
    '--pn-row-hover': 'rgba(255, 255, 255, 0.06)',
    '--pn-tile': 'linear-gradient(180deg, #363a36 0%, #252825 100%)',
    '--pn-tile-rim':
      'inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.7)'
  },
  light: {
    '--pn-surface': 'rgba(240, 242, 240, 0.8)',
    '--pn-solid': '#f0f2f0',
    '--pn-edge': 'rgba(22, 24, 22, 0.07)',
    '--pn-rim': 'rgba(255, 255, 255, 0.95)',
    '--pn-shadow': '0 22px 44px -22px rgba(22, 24, 22, 0.3), 0 6px 16px -10px rgba(22, 24, 22, 0.16)',
    '--pn-text': 'rgba(22, 24, 22, 0.6)',
    '--pn-strong': '#161816',
    '--pn-pill': 'linear-gradient(180deg, #2b2e2b 0%, #161816 100%)',
    '--pn-pill-ink': '#ffffff',
    '--pn-pill-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 14px -6px rgba(22, 24, 22, 0.45)',
    '--pn-dot': '#161816',
    '--pn-ring': 'rgba(22, 24, 22, 0.45)',
    '--pn-row-hover': 'rgba(22, 24, 22, 0.05)',
    '--pn-tile': 'linear-gradient(180deg, #ffffff 0%, #f5f7f5 100%)',
    '--pn-tile-rim':
      'inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(22, 24, 22, 0.25)'
  }
};

const SIZES: Record<string, Record<string, string>> = {
  sm: {
    '--pn-h': '36px',
    '--pn-pad': '3px',
    '--pn-inner': '30px',
    '--pn-x': '12px',
    '--pn-font': '13px',
    '--pn-gap': '6px',
    '--pn-mark': '18px'
  },
  md: {
    '--pn-h': '44px',
    '--pn-pad': '4px',
    '--pn-inner': '36px',
    '--pn-x': '16px',
    '--pn-font': '14px',
    '--pn-gap': '8px',
    '--pn-mark': '22px'
  },
  lg: {
    '--pn-h': '52px',
    '--pn-pad': '5px',
    '--pn-inner': '42px',
    '--pn-x': '20px',
    '--pn-font': '15px',
    '--pn-gap': '10px',
    '--pn-mark': '26px'
  }
};

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const contrastInk = (color?: string): string | null => {
  const hex = String(color || '')
    .trim()
    .replace('#', '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null;
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map(c => c + c)
          .join('')
      : hex;
  const channel = (index: number) => {
    const value = parseInt(full.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.36 ? '#111311' : '#ffffff';
};

const readVar = (element: Element, name: string) => parseFloat(getComputedStyle(element).getPropertyValue(name)) || 0;

const props = withDefaults(defineProps<PillNavProps>(), {
  logo: undefined,
  logoAlt: 'Logo',
  logoHref: '#',
  items: () => DEFAULT_ITEMS,
  activeHref: undefined,
  defaultActiveIndex: 0,
  onItemClick: undefined,
  linkComponent: 'a',
  theme: 'dark',
  layout: 'split',
  size: 'md',
  surface: 'glass',
  itemStyle: 'pill',
  hoverEffect: 'fill',
  indicator: 'dot',
  highlightColor: undefined,
  highlightTextColor: undefined,
  barColor: undefined,
  textColor: undefined,
  bounce: 0.3,
  stretch: 0.5,
  intro: true,
  collapse: 'auto',
  onMenuToggle: undefined,
  ariaLabel: 'Main',
  className: '',
  style: undefined
});

const panelId = useId();
const rootRef = ref<HTMLElement | null>(null);
const barRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const glideRef = ref<HTMLSpanElement | null>(null);
const inkRef = ref<HTMLDivElement | null>(null);
const dotRef = ref<HTMLSpanElement | null>(null);
const logoRef = ref<HTMLSpanElement | null>(null);
const markRef = ref<HTMLSpanElement | null>(null);
const toggleRef = ref<HTMLButtonElement | null>(null);
const panelRef = ref<HTMLDivElement | null>(null);
const measureRef = ref<HTMLDivElement | null>(null);
const measureListRef = ref<HTMLDivElement | null>(null);
const slotRefs: (HTMLLIElement | null)[] = [];
let engine: Engine | null = null;
let stopEngine: (() => void) | null = null;
let introPending = props.intro;
let slide = false;
let pending: boolean | null = null;
let ready = false;
const selected = ref(props.defaultActiveIndex);
const collapsed = ref(props.collapse === 'always');
const open = ref(false);
const panelShown = ref(false);

const controlled = computed(() => props.activeHref !== undefined);
const activeIndex = computed(() =>
  controlled.value ? props.items.findIndex(item => item.href === props.activeHref) : selected.value
);
const joined = computed(() => props.layout === 'joined');
const hasLogo = computed(() => Boolean(props.logo));
const fill = computed(() => props.hoverEffect === 'fill');
const glide = computed(() => !fill.value && (props.hoverEffect === 'glide' || props.indicator === 'pill'));

const settings = () => ({
  hoverEffect: props.hoverEffect,
  indicator: props.indicator,
  activeIndex: activeIndex.value,
  bounce: clamp(props.bounce, 0, 1),
  stretch: clamp(props.stretch, 0, 1)
});

const vars = computed(() => {
  const palette = THEMES[props.theme] ?? THEMES.dark;
  const next: Record<string, string> = { ...palette, ...(SIZES[props.size] ?? SIZES.md) };
  if (props.surface === 'glass') next['--pn-blur'] = 'blur(20px) saturate(1.6)';
  if (props.surface === 'solid') {
    next['--pn-surface'] = palette['--pn-solid'];
    next['--pn-blur'] = 'none';
  }
  if (props.surface === 'none') {
    next['--pn-surface'] = 'transparent';
    next['--pn-shadow'] = 'none';
    next['--pn-blur'] = 'none';
    next['--pn-edge'] = 'transparent';
    next['--pn-rim'] = 'transparent';
  }
  if (props.barColor) {
    next['--pn-surface'] = props.barColor;
    next['--pn-solid'] = props.barColor;
  }
  if (props.textColor) {
    next['--pn-strong'] = props.textColor;
    next['--pn-text'] = `color-mix(in srgb, ${props.textColor} 64%, transparent)`;
  }
  if (props.highlightColor) {
    next['--pn-pill'] = props.highlightColor;
    next['--pn-dot'] = props.highlightColor;
    next['--pn-pill-shadow'] = 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 16px -6px rgba(0, 0, 0, 0.45)';
    next['--pn-pill-ink'] = props.highlightTextColor || contrastInk(props.highlightColor) || palette['--pn-pill-ink'];
  } else if (props.highlightTextColor) {
    next['--pn-pill-ink'] = props.highlightTextColor;
  }
  return next;
});

const startEngine = () => {
  const root = rootRef.value;
  if (!root) return null;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const state = {
    x0: 0,
    x1: 0,
    v0: 0,
    v1: 0,
    alpha: 0,
    pop: 1,
    press: 1,
    pressVelocity: 0,
    dotX: 0,
    dotVelocity: 0,
    dotAlpha: 0,
    hover: -1,
    focus: false,
    sliding: false,
    pressing: false,
    waiting: slide && !reduce
  };
  slide = false;
  const rects: { left: number; width: number }[] = [];
  let trackWidth = 0;
  let trackHeight = 0;
  let raf = 0;
  let last = 0;

  const measure = () => {
    const track = trackRef.value;
    if (!track) return;
    trackWidth = track.offsetWidth;
    trackHeight = track.offsetHeight;
    slotRefs.forEach((slot, index) => {
      if (!slot) return;
      rects[index] = { left: slot.offsetLeft, width: slot.offsetWidth };
      const reach = Math.ceil(2 * Math.sqrt((slot.offsetWidth / 2) ** 2 + slot.offsetHeight ** 2)) + 2;
      slot.style.setProperty('--pn-fill', `${reach}px`);
    });
  };

  const glideIndex = () => {
    const s = settings();
    if (s.hoverEffect === 'fill') return -1;
    if (s.hoverEffect === 'glide' && state.hover >= 0) return state.hover;
    return s.indicator === 'pill' ? s.activeIndex : -1;
  };

  const sync = () => {
    const s = settings();
    slotRefs.forEach((slot, index) => {
      if (!slot) return;
      const hovered = state.hover === index;
      slot.toggleAttribute('data-lit', hovered);
      slot.toggleAttribute('data-hover', hovered && s.hoverEffect === 'fill');
    });
    root.toggleAttribute('data-focus', state.focus && state.hover >= 0);
    root.toggleAttribute('data-dot-lit', s.hoverEffect === 'fill' && state.hover >= 0 && state.hover === s.activeIndex);
  };

  const render = () => {
    const glideEl = glideRef.value;
    const ink = inkRef.value;
    const dot = dotRef.value;
    const width = Math.max(0, state.x1 - state.x0);
    const scale = state.press * state.pop;
    const target = rects[glideIndex()];
    const squash = target ? 1 - clamp((width / Math.max(target.width, 1) - 1) * 0.3, 0, 0.14) : 1;
    if (glideEl) {
      glideEl.style.width = `${width}px`;
      glideEl.style.transform = `translate3d(${state.x0}px, 0, 0) scale(${scale}, ${scale * squash})`;
      glideEl.style.opacity = `${state.alpha}`;
    }
    if (ink) {
      const half = (width * scale) / 2;
      const center = (state.x0 + state.x1) / 2;
      const inset = (trackHeight * (1 - scale * squash)) / 2;
      ink.style.clipPath = `inset(${inset}px ${trackWidth - center - half}px ${inset}px ${center - half}px round ${trackHeight / 2}px)`;
      ink.style.opacity = `${state.alpha}`;
    }
    if (dot) {
      const pull = clamp(Math.abs(state.dotVelocity) / 700, 0, 2.2);
      dot.style.transform = `translate3d(${state.dotX}px, 0, 0) scaleX(${1 + pull})`;
      dot.style.opacity = `${state.dotAlpha}`;
    }
  };

  const tick = (now: number) => {
    raf = 0;
    const s = settings();
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    const index = glideIndex();
    const target = rects[index];
    const zeta = 1 - 0.55 * s.bounce;
    const base = 520;
    let busy = false;

    if (target && !state.waiting) {
      const t0 = target.left;
      const t1 = target.left + target.width;
      if (state.alpha < 0.02 && !state.sliding) {
        state.x0 = t0;
        state.x1 = t1;
        state.v0 = 0;
        state.v1 = 0;
        state.pop = 0.9;
      }
      if (reduce) {
        state.x0 = t0;
        state.x1 = t1;
        state.v0 = 0;
        state.v1 = 0;
      } else {
        const direction = Math.sign((t0 + t1) / 2 - (state.x0 + state.x1) / 2);
        const lead = base * (1 + 0.9 * s.stretch);
        const trail = base * (1 - 0.5 * s.stretch);
        const k0 = direction < 0 ? lead : direction > 0 ? trail : base;
        const k1 = direction > 0 ? lead : direction < 0 ? trail : base;
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          state.v0 += (-k0 * (state.x0 - t0) - 2 * zeta * Math.sqrt(k0) * state.v0) * h;
          state.x0 += state.v0 * h;
          state.v1 += (-k1 * (state.x1 - t1) - 2 * zeta * Math.sqrt(k1) * state.v1) * h;
          state.x1 += state.v1 * h;
        }
      }
      state.alpha += (1 - state.alpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.06));
      busy =
        Math.abs(state.x0 - t0) > 0.05 ||
        Math.abs(state.x1 - t1) > 0.05 ||
        Math.abs(state.v0) > 0.5 ||
        Math.abs(state.v1) > 0.5 ||
        state.alpha < 0.999;
      if (!busy) state.sliding = false;
    } else {
      state.alpha += (0 - state.alpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.07));
      if (state.alpha > 0.002) busy = true;
      else state.alpha = 0;
    }

    state.pop += (1 - state.pop) * (reduce ? 1 : 1 - Math.exp(-dt / 0.09));
    if (Math.abs(1 - state.pop) > 0.001) busy = true;

    const pressTarget = state.pressing ? 0.95 : 1;
    if (reduce) {
      state.press = pressTarget;
      state.pressVelocity = 0;
    } else {
      state.pressVelocity += (-700 * (state.press - pressTarget) - 30 * state.pressVelocity) * dt;
      state.press += state.pressVelocity * dt;
    }
    if (Math.abs(state.press - pressTarget) > 0.0005 || Math.abs(state.pressVelocity) > 0.01) busy = true;

    const dotTarget = s.indicator === 'dot' ? rects[s.activeIndex] : null;
    if (dotTarget && !state.waiting) {
      const center = dotTarget.left + dotTarget.width / 2;
      if (state.dotAlpha < 0.02) {
        state.dotX = center;
        state.dotVelocity = 0;
      }
      if (reduce) {
        state.dotX = center;
        state.dotVelocity = 0;
      } else {
        const k = 360;
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          state.dotVelocity +=
            (-k * (state.dotX - center) - 2 * (1 - 0.5 * s.bounce) * Math.sqrt(k) * state.dotVelocity) * h;
          state.dotX += state.dotVelocity * h;
        }
      }
      state.dotAlpha += (1 - state.dotAlpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.1));
      if (Math.abs(state.dotX - center) > 0.05 || Math.abs(state.dotVelocity) > 0.5 || state.dotAlpha < 0.999)
        busy = true;
    } else {
      state.dotAlpha += (0 - state.dotAlpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.1));
      if (state.dotAlpha > 0.002) busy = true;
      else state.dotAlpha = 0;
    }

    render();
    if (busy) raf = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };

  const instance: Engine = {
    enter: (index, event) => {
      if (event?.pointerType === 'touch') return;
      state.hover = index;
      state.focus = false;
      sync();
      wake();
    },
    leave: () => {
      if (state.focus) return;
      state.hover = -1;
      sync();
      wake();
    },
    focus: (index, event) => {
      const target = event?.target;
      const visible = target instanceof Element && target.matches(':focus-visible');
      state.focus = visible;
      state.hover = visible ? index : state.hover;
      sync();
      wake();
    },
    blur: () => {
      if (!state.focus) return;
      state.focus = false;
      state.hover = -1;
      sync();
      wake();
    },
    press: event => {
      if (event && event.button > 0) return;
      state.pressing = true;
      wake();
    },
    release: () => {
      if (!state.pressing) return;
      state.pressing = false;
      wake();
    },
    refresh: () => {
      measure();
      sync();
      wake();
    }
  };
  engine = instance;

  measure();
  sync();
  render();
  wake();

  let timer = 0;
  if (state.waiting) {
    state.x0 = 0;
    state.x1 = 0;
    timer = window.setTimeout(() => {
      state.waiting = false;
      if (glideIndex() >= 0) {
        state.alpha = 1;
        state.sliding = true;
      }
      wake();
    }, 420);
  }

  const resizeObserver = new ResizeObserver(() => {
    measure();
    render();
    wake();
  });
  if (trackRef.value) resizeObserver.observe(trackRef.value);
  document.fonts?.ready?.then(() => instance.refresh()).catch(() => {});
  window.addEventListener('pointerup', instance.release);
  window.addEventListener('pointercancel', instance.release);

  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(timer);
    resizeObserver.disconnect();
    window.removeEventListener('pointerup', instance.release);
    window.removeEventListener('pointercancel', instance.release);
    if (engine === instance) engine = null;
  };
};

const restartEngine = () => {
  stopEngine?.();
  stopEngine = startEngine();
};

const evaluate = () => {
  const root = rootRef.value;
  if (!root || !measureRef.value) return;
  if (props.collapse === 'always' || props.collapse === 'never') {
    collapsed.value = props.collapse === 'always';
    return;
  }
  const parent = root.parentElement;
  if (!parent) return;
  const styles = getComputedStyle(parent);
  const available = parent.clientWidth - (parseFloat(styles.paddingLeft) || 0) - (parseFloat(styles.paddingRight) || 0);
  const listWidth = measureListRef.value?.offsetWidth ?? 0;
  const height = readVar(root, '--pn-h');
  const pad = readVar(root, '--pn-pad');
  const gap = readVar(root, '--pn-gap');
  const inner = readVar(root, '--pn-inner');
  const need = joined.value
    ? pad * 2 + (hasLogo.value ? inner + 2 : 0) + listWidth
    : (hasLogo.value ? height + gap : 0) + listWidth + pad * 2;
  const next = need > available + 0.5;
  if (introPending && next !== collapsed.value) pending = next;
  collapsed.value = next;
};

const runIntro = () => {
  const root = rootRef.value;
  if (!root || !introPending) return;
  if (pending !== null && pending !== collapsed.value) return;
  pending = null;
  introPending = false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const pop = (element: HTMLElement | null, delay: number) =>
    element?.animate(
      [
        { opacity: 0, transform: 'scale(0.6)' },
        { opacity: 1, transform: 'scale(1)' }
      ],
      { duration: 700, delay, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'backwards' }
    );
  const reveal = (element: HTMLElement | null) => {
    if (!element) return;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    element.animate(
      [
        { clipPath: `inset(0px ${Math.max(0, width - height)}px 0px 0px round ${height / 2}px)` },
        { clipPath: `inset(0px 0px 0px 0px round ${height / 2}px)` }
      ],
      { duration: 760, delay: 90, easing: EASE_OUT, fill: 'backwards' }
    );
  };
  pop(logoRef.value, 0);
  if (collapsed.value) {
    pop(toggleRef.value, 120);
    return;
  }
  slide = true;
  reveal(joined.value ? root : barRef.value);
  slotRefs.forEach((slot, index) => {
    slot?.animate(
      [
        { opacity: 0, transform: 'translateX(-10px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      { duration: 560, delay: 200 + index * 50, easing: EASE_OUT, fill: 'backwards' }
    );
  });
};

let collapseObserver: ResizeObserver | null = null;

onMounted(async () => {
  evaluate();
  collapseObserver = new ResizeObserver(evaluate);
  if (rootRef.value?.parentElement) collapseObserver.observe(rootRef.value.parentElement);
  if (measureRef.value) collapseObserver.observe(measureRef.value);
  await nextTick();
  ready = true;
  runIntro();
  restartEngine();
});

watch(
  collapsed,
  () => {
    if (!ready) return;
    runIntro();
    restartEngine();
  },
  { flush: 'post' }
);

watch(
  () => props.items.length,
  () => {
    if (ready) restartEngine();
  },
  { flush: 'post' }
);

watch(
  () => [props.collapse, joined.value, hasLogo.value, props.size, collapsed.value],
  () => {
    if (ready) evaluate();
  },
  { flush: 'post' }
);

watch(
  joined,
  () => {
    if (ready) runIntro();
  },
  { flush: 'post' }
);

onUpdated(() => {
  engine?.refresh();
});

watch([collapsed, open], ([isCollapsed, isOpen]) => {
  if (!isCollapsed && isOpen) open.value = false;
});

watch(
  [open, panelShown, joined],
  (_, __, onCleanup) => {
    const panel = panelRef.value;
    const root = rootRef.value;
    if (!panel || !root) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const header = joined.value ? root.offsetHeight : (toggleRef.value?.offsetHeight ?? 44);
    const start = joined.value
      ? `inset(0px 0px ${Math.max(0, height - header)}px 0px round ${header / 2}px)`
      : `inset(0px 0px ${Math.max(0, height - header)}px ${Math.max(0, width - header)}px round ${header / 2}px)`;
    const end = 'inset(0px 0px 0px 0px round 24px)';
    const rows = panel.querySelectorAll('li');
    const running: Animation[] = [];
    if (open.value) {
      if (reduce) return;
      running.push(panel.animate([{ clipPath: start }, { clipPath: end }], { duration: 560, easing: EASE_OUT }));
      rows.forEach((row, index) => {
        running.push(
          row.animate(
            [
              { opacity: 0, transform: 'translateY(-8px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ],
            { duration: 420, delay: 90 + index * 40, easing: EASE_OUT, fill: 'backwards' }
          )
        );
      });
    } else {
      if (reduce) {
        panelShown.value = false;
        return;
      }
      const morph = panel.animate([{ clipPath: end }, { clipPath: start }], {
        duration: 380,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });
      morph.onfinish = () => {
        panelShown.value = false;
      };
      running.push(morph);
      rows.forEach(row => {
        running.push(row.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' }));
      });
    }
    onCleanup(() => {
      running.forEach(animation => {
        animation.onfinish = null;
        animation.cancel();
      });
    });
  },
  { flush: 'post' }
);

watch(open, (isOpen, _, onCleanup) => {
  if (!isOpen) return;
  const onPointerDown = (event: PointerEvent) => {
    const target = event.target;
    if (target instanceof Node && rootRef.value?.contains(target)) return;
    open.value = false;
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    open.value = false;
    toggleRef.value?.focus();
  };
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('keydown', onKeyDown);
  onCleanup(() => {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('keydown', onKeyDown);
  });
});

onBeforeUnmount(() => {
  stopEngine?.();
  stopEngine = null;
  collapseObserver?.disconnect();
  collapseObserver = null;
});

const spin = (event: PointerEvent) => {
  const mark = markRef.value;
  if (!mark || event.pointerType === 'touch' || mark.getAnimations().length) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  mark.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], {
    duration: 900,
    easing: 'cubic-bezier(0.65, 0, 0.25, 1)'
  });
};

const choose = (item: PillNavItem, index: number, event: MouseEvent) => {
  props.onItemClick?.(item, index, event);
  if (!controlled.value) selected.value = index;
};

const toggle = () => {
  const next = !open.value;
  if (next) panelShown.value = true;
  open.value = next;
  props.onMenuToggle?.(next);
};

const chooseRow = (item: PillNavItem, index: number, event: MouseEvent) => {
  choose(item, index, event);
  open.value = false;
  props.onMenuToggle?.(false);
};

const onEnter = (index: number, event: PointerEvent) => engine?.enter(index, event);
const onLeave = () => engine?.leave();
const onPress = (event: PointerEvent) => engine?.press(event);
const onFocus = (index: number, event: FocusEvent) => engine?.focus(index, event);
const onBlur = () => engine?.blur();

const linkTag = (item: PillNavItem) => (item.href ? props.linkComponent : 'button');
const linkAttrs = (item: PillNavItem) => (item.href ? { href: item.href } : { type: 'button' });
const setSlot = (index: number) => (element: unknown) => {
  slotRefs[index] = (element as HTMLLIElement | null) ?? null;
};
</script>

<template>
  <nav
    ref="rootRef"
    :class="['pill-nav', joined ? 'pill-nav__surface' : '', className]"
    :data-layout="layout"
    :data-items="itemStyle"
    :data-collapsed="collapsed ? '' : undefined"
    :data-open="open ? '' : undefined"
    :data-panel="panelShown ? '' : undefined"
    :style="[vars, style]"
    :aria-label="ariaLabel"
  >
    <span v-if="logo" ref="logoRef" :class="['pill-nav__logo', joined ? '' : 'pill-nav__surface']">
      <component
        :is="linkComponent"
        :href="logoHref"
        class="pill-nav__logo-link"
        :aria-label="logoAlt"
        @pointerenter="spin"
      >
        <span ref="markRef" class="pill-nav__mark">
          <img v-if="typeof logo === 'string'" :src="logo" alt="" draggable="false" />
          <PillNavNodeView v-else :node="logo" />
        </span>
      </component>
      <span v-if="!joined" class="pill-nav__rim" />
    </span>

    <div v-if="!collapsed" ref="barRef" :class="['pill-nav__bar', joined ? '' : 'pill-nav__surface']">
      <div ref="trackRef" class="pill-nav__track" @pointerleave="onLeave">
        <ul class="pill-nav__list">
          <li
            v-for="(item, index) in items"
            :key="`${item.label}-${index}`"
            :ref="setSlot(index)"
            class="pill-nav__slot"
            :data-on="fill && indicator === 'pill' && index === activeIndex ? '' : undefined"
            @pointerenter="(event: PointerEvent) => onEnter(index, event)"
            @pointerdown="onPress"
            @focusin="(event: FocusEvent) => onFocus(index, event)"
            @focusout="onBlur"
          >
            <component
              :is="linkTag(item)"
              v-bind="linkAttrs(item)"
              class="pill-nav__item"
              :aria-current="index === activeIndex ? 'page' : undefined"
              :aria-label="item.ariaLabel"
              @click="(event: MouseEvent) => choose(item, index, event)"
            >
              <span v-if="fill" class="pill-nav__fill" aria-hidden="true" />
              <span class="pill-nav__face">
                <PillNavNodeView :node="item.icon" />
                {{ item.label }}
              </span>
              <span v-if="fill" class="pill-nav__face-alt" aria-hidden="true">
                <PillNavNodeView :node="item.icon" />
                {{ item.label }}
              </span>
            </component>
          </li>
        </ul>
        <span v-if="glide" ref="glideRef" class="pill-nav__glide" aria-hidden="true" />
        <div v-if="glide" ref="inkRef" class="pill-nav__ink" aria-hidden="true">
          <span v-for="(item, index) in items" :key="`${item.label}-${index}`" class="pill-nav__ink-item">
            <PillNavNodeView :node="item.icon" />
            {{ item.label }}
          </span>
        </div>
        <span v-if="indicator === 'dot'" ref="dotRef" class="pill-nav__dot" aria-hidden="true" />
      </div>
      <span v-if="!joined" class="pill-nav__rim" />
    </div>

    <button
      v-if="collapsed"
      ref="toggleRef"
      type="button"
      :class="['pill-nav__toggle', joined ? 'pill-nav__toggle--bare' : 'pill-nav__surface']"
      :aria-expanded="open"
      :aria-controls="panelId"
      :aria-label="open ? 'Close menu' : 'Open menu'"
      @click="toggle"
    >
      <span class="pill-nav__burger" aria-hidden="true">
        <span class="pill-nav__line pill-nav__line--top" />
        <span class="pill-nav__line pill-nav__line--bottom" />
      </span>
      <span v-if="!joined" class="pill-nav__rim" />
    </button>

    <div v-if="collapsed && panelShown" :id="panelId" ref="panelRef" class="pill-nav__panel pill-nav__surface">
      <ul class="pill-nav__menu">
        <li v-for="(item, index) in items" :key="`${item.label}-${index}`">
          <component
            :is="linkTag(item)"
            v-bind="linkAttrs(item)"
            class="pill-nav__row"
            :aria-current="index === activeIndex ? 'page' : undefined"
            :tabindex="open ? undefined : -1"
            @click="(event: MouseEvent) => chooseRow(item, index, event)"
          >
            <PillNavNodeView :node="item.icon" />
            {{ item.label }}
          </component>
        </li>
      </ul>
      <span class="pill-nav__rim" />
    </div>

    <div ref="measureRef" class="pill-nav__measure" aria-hidden="true">
      <div ref="measureListRef" class="pill-nav__list">
        <span v-for="(item, index) in items" :key="`${item.label}-${index}`" class="pill-nav__ink-item">
          <PillNavNodeView :node="item.icon" />
          {{ item.label }}
        </span>
      </div>
    </div>

    <span v-if="joined" class="pill-nav__rim pill-nav__rim--root" />
  </nav>
</template>

<style>
.pill-nav {
  --pn-roll: calc(var(--pn-inner) / 2 + 0.7em);
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--pn-gap);
  max-width: 100%;
  font-size: var(--pn-font);
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
}

.pill-nav[data-collapsed] {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.pill-nav[data-layout='joined'] {
  gap: 2px;
  padding: var(--pn-pad);
  border-radius: 999px;
}

.pill-nav__surface {
  background: var(--pn-surface);
  box-shadow: var(--pn-shadow);
  -webkit-backdrop-filter: var(--pn-blur);
  backdrop-filter: var(--pn-blur);
}

.pill-nav[data-layout='joined'][data-panel] {
  background: transparent;
  box-shadow: none;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

.pill-nav[data-panel] .pill-nav__rim--root {
  opacity: 0;
}

.pill-nav__rim {
  position: absolute;
  inset: 0;
  z-index: 4;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--pn-edge),
    inset 0 1px 0 var(--pn-rim);
  pointer-events: none;
}

.pill-nav__logo {
  position: relative;
  z-index: 2;
  display: inline-grid;
  flex: none;
  place-items: center;
  width: var(--pn-h);
  height: var(--pn-h);
  border-radius: 999px;
}

.pill-nav__logo-link {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: inherit;
  color: var(--pn-strong);
  text-decoration: none;
  outline: none;
}

.pill-nav[data-layout='joined'] .pill-nav__logo {
  width: var(--pn-inner);
  height: var(--pn-inner);
}

.pill-nav__logo-link:focus-visible,
.pill-nav__toggle:focus-visible {
  outline: 2px solid var(--pn-ring);
  outline-offset: 2px;
}

.pill-nav__mark {
  display: grid;
  place-items: center;
  width: var(--pn-mark);
  height: var(--pn-mark);
}

.pill-nav__mark img,
.pill-nav__mark svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pill-nav__bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  height: var(--pn-h);
  padding: var(--pn-pad);
  border-radius: 999px;
  box-sizing: border-box;
}

.pill-nav[data-layout='joined'] .pill-nav__bar {
  height: var(--pn-inner);
  padding: 0;
}

.pill-nav__track {
  position: relative;
  height: 100%;
}

.pill-nav__list {
  display: flex;
  align-items: stretch;
  gap: var(--pn-item-gap, 2px);
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pill-nav__slot {
  display: flex;
}

.pill-nav__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 var(--pn-x);
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--pn-text);
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  font-weight: 500;
  letter-spacing: -0.005em;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  isolation: isolate;
  transition: color 0.25s ease;
}

.pill-nav__slot[data-lit] .pill-nav__item,
.pill-nav__item[aria-current] {
  color: var(--pn-strong);
}

.pill-nav[data-items='pill'] {
  --pn-item-gap: 3px;
}

.pill-nav[data-items='pill'] .pill-nav__item {
  background: var(--pn-tile);
  box-shadow: var(--pn-tile-rim);
  color: var(--pn-strong);
}

.pill-nav__item:focus-visible,
.pill-nav__row:focus-visible {
  outline: 2px solid var(--pn-ring);
  outline-offset: -2px;
}

.pill-nav__face {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  transition: transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
}

.pill-nav__face svg {
  width: 1.15em;
  height: 1.15em;
  flex: none;
}

.pill-nav__face-alt {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45em;
  color: var(--pn-pill-ink);
  transform: translateY(var(--pn-roll));
  transition: transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
}

.pill-nav__face-alt svg {
  width: 1.15em;
  height: 1.15em;
  flex: none;
}

.pill-nav__slot[data-on] .pill-nav__face,
.pill-nav__slot[data-hover] .pill-nav__face {
  transform: translateY(calc(var(--pn-roll) * -1));
  transition-duration: 0.5s;
}

.pill-nav__slot[data-on] .pill-nav__face-alt,
.pill-nav__slot[data-hover] .pill-nav__face-alt {
  transform: translateY(0);
  transition-duration: 0.5s;
}

.pill-nav__fill {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: -1;
  width: var(--pn-fill, 200%);
  height: var(--pn-fill, 200%);
  margin: calc(var(--pn-fill, 200%) / -2) 0 0 calc(var(--pn-fill, 200%) / -2);
  border-radius: 50%;
  background: var(--pn-pill);
  transform: scale(0);
  transition: transform 0.36s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.pill-nav__slot[data-on] .pill-nav__fill,
.pill-nav__slot[data-hover] .pill-nav__fill {
  transform: scale(1);
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.pill-nav__glide {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  border-radius: 999px;
  background: var(--pn-pill);
  box-shadow: var(--pn-pill-shadow);
  opacity: 0;
  pointer-events: none;
  transform-origin: 50% 50%;
  will-change: transform, width, opacity;
}

.pill-nav[data-focus] .pill-nav__glide {
  box-shadow:
    var(--pn-pill-shadow),
    0 0 0 2px var(--pn-ring);
}

.pill-nav__ink {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  gap: var(--pn-item-gap, 2px);
  color: var(--pn-pill-ink);
  pointer-events: none;
  clip-path: inset(0 100% 0 0);
}

.pill-nav__ink-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45em;
  height: 100%;
  padding: 0 var(--pn-x);
  font-weight: 500;
  letter-spacing: -0.005em;
  white-space: nowrap;
}

.pill-nav__ink-item svg {
  width: 1.15em;
  height: 1.15em;
  flex: none;
}

.pill-nav__dot {
  position: absolute;
  bottom: calc((var(--pn-inner) - var(--pn-font)) / 4 - 2px);
  left: 0;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 999px;
  background: var(--pn-dot);
  opacity: 0;
  pointer-events: none;
  transition: background-color 0.3s ease;
  will-change: transform, opacity;
}

.pill-nav[data-dot-lit] .pill-nav__dot {
  background: var(--pn-pill-ink);
}

.pill-nav__toggle {
  position: relative;
  z-index: 3;
  display: inline-grid;
  flex: none;
  place-items: center;
  width: var(--pn-h);
  height: var(--pn-h);
  padding: 0;
  border: 0;
  border-radius: 999px;
  color: var(--pn-strong);
  cursor: pointer;
  outline: none;
}

.pill-nav__toggle--bare {
  background: transparent;
}

.pill-nav[data-layout='joined'] .pill-nav__toggle {
  width: var(--pn-inner);
  height: var(--pn-inner);
}

.pill-nav__burger {
  position: relative;
  width: 16px;
  height: 10px;
}

.pill-nav__line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 2px;
  background: currentColor;
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    top 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.pill-nav__line--top {
  top: 1.5px;
}

.pill-nav__line--bottom {
  top: 7px;
}

.pill-nav[data-open] .pill-nav__line--top {
  top: 4.25px;
  transform: rotate(45deg);
}

.pill-nav[data-open] .pill-nav__line--bottom {
  top: 4.25px;
  transform: rotate(-45deg);
}

.pill-nav__panel {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  padding: calc(var(--pn-h) + 10px) 6px 6px;
  border-radius: 24px;
  box-sizing: border-box;
}

.pill-nav[data-layout='joined'] .pill-nav__panel {
  padding-top: calc(var(--pn-h) + 4px);
}

.pill-nav__menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pill-nav__row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: calc(var(--pn-h) + 2px);
  padding: 0 16px;
  border: 0;
  border-radius: 18px;
  box-sizing: border-box;
  background: none;
  color: var(--pn-strong);
  font-family: inherit;
  font-size: calc(var(--pn-font) + 1px);
  line-height: 1;
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease;
}

.pill-nav__row svg {
  width: 1.15em;
  height: 1.15em;
  flex: none;
}

.pill-nav__row:hover {
  background: var(--pn-row-hover);
}

.pill-nav__row[aria-current] {
  background: var(--pn-pill);
  box-shadow: var(--pn-pill-shadow);
  color: var(--pn-pill-ink);
}

.pill-nav__measure {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 2px;
  visibility: hidden;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .pill-nav__face,
  .pill-nav__face-alt,
  .pill-nav__fill,
  .pill-nav__line,
  .pill-nav__item,
  .pill-nav__row {
    transition: none;
  }
}
</style>
