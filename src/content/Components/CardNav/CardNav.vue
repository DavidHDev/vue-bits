<script lang="ts">
import { cloneVNode, h, isVNode, type Component, type SetupContext, type VNode, type VNodeChild } from 'vue';

export type CardNavNode = string | number | boolean | null | undefined | VNode | Component | (() => VNodeChild);

export interface CardNavLink {
  label: string;
  href?: string;
  ariaLabel?: string;
}

export interface CardNavItem {
  label: string;
  description?: string;
  bgColor?: string;
  textColor?: string;
  links?: CardNavLink[];
}

export interface CardNavCta {
  label: string;
  href?: string;
  onClick?: (event: MouseEvent) => void;
}

const THEMES: Record<string, Record<string, string>> = {
  dark: {
    '--cn-panel': 'rgba(36, 39, 37, 0.72)',
    '--cn-solid': '#242725',
    '--cn-edge': 'rgba(255, 255, 255, 0.08)',
    '--cn-highlight': 'rgba(255, 255, 255, 0.07)',
    '--cn-shadow': '0 24px 48px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--cn-text': '#f4f5f4',
    '--cn-muted': 'rgba(244, 245, 244, 0.56)',
    '--cn-hover': 'rgba(255, 255, 255, 0.06)',
    '--cn-ring': 'rgba(244, 245, 244, 0.55)',
    '--cn-tile': 'linear-gradient(180deg, #323532 0%, #252825 100%)',
    '--cn-tile-rim':
      'inset 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 10px -4px rgba(0, 0, 0, 0.6)',
    '--cn-cta': 'linear-gradient(180deg, #ffffff 0%, #ebedeb 100%)',
    '--cn-cta-ink': '#111311',
    '--cn-cta-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 16px -6px rgba(0, 0, 0, 0.6)',
    '--cn-cta-hover': 'brightness(0.94)'
  },
  light: {
    '--cn-panel': 'rgba(243, 245, 243, 0.84)',
    '--cn-solid': '#f3f5f3',
    '--cn-edge': 'rgba(22, 24, 22, 0.07)',
    '--cn-highlight': 'rgba(255, 255, 255, 0.95)',
    '--cn-shadow': '0 24px 48px -24px rgba(22, 24, 22, 0.3), 0 6px 16px -10px rgba(22, 24, 22, 0.16)',
    '--cn-text': '#161816',
    '--cn-muted': 'rgba(22, 24, 22, 0.56)',
    '--cn-hover': 'rgba(22, 24, 22, 0.05)',
    '--cn-ring': 'rgba(22, 24, 22, 0.45)',
    '--cn-tile': 'linear-gradient(180deg, #ffffff 0%, #f8f9f8 100%)',
    '--cn-tile-rim':
      'inset 0 0 0 1px rgba(22, 24, 22, 0.07), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(22, 24, 22, 0.22)',
    '--cn-cta': 'linear-gradient(180deg, #2a2d2a 0%, #161816 100%)',
    '--cn-cta-ink': '#ffffff',
    '--cn-cta-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 14px -6px rgba(22, 24, 22, 0.45)',
    '--cn-cta-hover': 'brightness(1.25)'
  }
};

const DEFAULT_ITEMS: CardNavItem[] = [
  {
    label: 'About',
    description: 'The people and the story behind the studio.',
    links: [
      { label: 'Company', href: '#' },
      { label: 'Careers', href: '#' }
    ]
  },
  {
    label: 'Projects',
    description: 'Selected work from the last few years.',
    links: [
      { label: 'Featured', href: '#' },
      { label: 'Case studies', href: '#' }
    ]
  },
  {
    label: 'Contact',
    description: 'Say hello, we read everything.',
    links: [
      { label: 'Email', href: '#' },
      { label: 'X', href: '#' },
      { label: 'LinkedIn', href: '#' }
    ]
  }
];

const NARROW = 560;
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const easeOut = (t: number) => 1 - (1 - t) ** 3;

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

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true) return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return cloneVNode(node);
  return h(node as Component);
};

export const CardNavNodeView = (props: { node?: unknown }) => renderNode(props.node);
CardNavNodeView.props = ['node'];

export const CardNavAnchor = (props: { href?: string; as?: string | Component }, { slots, attrs }: SetupContext) => {
  if (!props.href) return h('button', { ...attrs, type: 'button' }, slots.default?.());
  if (!props.as || typeof props.as === 'string')
    return h(props.as || 'a', { ...attrs, href: props.href }, slots.default?.());
  return h(props.as, { ...attrs, href: props.href }, slots);
};
CardNavAnchor.props = ['href', 'as'];
CardNavAnchor.inheritAttrs = false;
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, useId, watch, type CSSProperties } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';

interface CardNavProps {
  logo?: CardNavNode;
  logoAlt?: string;
  logoHref?: string;
  items?: CardNavItem[];
  cta?: CardNavCta;
  theme?: 'dark' | 'light';
  surface?: 'glass' | 'solid';
  openOn?: 'click' | 'hover';
  cardEffect?: 'rise' | 'unfold' | 'fade';
  stagger?: number;
  bounce?: number;
  speed?: number;
  cardHeight?: number;
  maxWidth?: number;
  accentColor?: string;
  menuLabel?: boolean;
  intro?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  linkComponent?: string | Component;
  onLinkClick?: (link: CardNavLink, item: CardNavItem, event: MouseEvent) => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<CardNavProps>(), {
  logo: undefined,
  logoAlt: 'Logo',
  logoHref: '#',
  items: () => DEFAULT_ITEMS,
  cta: undefined,
  theme: 'dark',
  surface: 'glass',
  openOn: 'click',
  cardEffect: 'rise',
  stagger: 0.12,
  bounce: 0.2,
  speed: 1,
  cardHeight: 176,
  maxWidth: 800,
  accentColor: undefined,
  menuLabel: true,
  intro: true,
  defaultOpen: false,
  open: undefined,
  onOpenChange: undefined,
  linkComponent: 'a',
  onLinkClick: undefined,
  ariaLabel: 'Main',
  className: '',
  style: undefined
});

const contentId = useId();
const rootRef = ref<HTMLDivElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const menuRef = ref<HTMLButtonElement | null>(null);
const barRef = ref<HTMLDivElement | null>(null);
const cardRefs: (HTMLElement | null)[] = [];
let engine: { wake: () => void; refresh: () => void; destroy: () => void } | null = null;
let leaveTimer = 0;
const introOnMount = props.intro;
const openState = ref(props.defaultOpen);
const narrow = ref(false);
const shown = ref(props.defaultOpen);

const controlled = computed(() => props.open !== undefined);
const hasCta = computed(() => Boolean(props.cta));
const open = computed(() => (controlled.value ? Boolean(props.open) : openState.value));

const settings = computed(() => ({
  open: open.value,
  cardEffect: props.cardEffect,
  stagger: clamp(props.stagger, 0, 0.3),
  bounce: clamp(props.bounce, 0, 1),
  speed: clamp(props.speed, 0.2, 3)
}));

const vars = computed(() => {
  const palette = THEMES[props.theme] ?? THEMES.dark;
  const next: Record<string, string> = {
    ...palette,
    '--cn-max': `${props.maxWidth}px`,
    '--cn-bar': '60px',
    '--cn-inset': '8px',
    '--cn-gap': '8px',
    '--cn-radius': '18px',
    '--cn-logo': '24px',
    '--cn-card': `${props.cardHeight}px`
  };
  if (props.surface === 'glass') next['--cn-blur'] = 'blur(20px) saturate(1.6)';
  if (props.surface === 'solid') {
    next['--cn-panel'] = palette['--cn-solid'];
    next['--cn-blur'] = 'none';
  }
  if (props.accentColor) {
    next['--cn-cta'] = props.accentColor;
    next['--cn-cta-ink'] = contrastInk(props.accentColor) || '#ffffff';
    next['--cn-cta-shadow'] = 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 16px -6px rgba(0, 0, 0, 0.45)';
    next['--cn-cta-hover'] = 'brightness(1.08)';
  }
  return next;
});

const setOpen = (next: boolean) => {
  if (next === open.value) return;
  if (!controlled.value) openState.value = next;
  props.onOpenChange?.(next);
};

const setCardRef = (index: number) => (element: unknown) => {
  cardRefs[index] = (element as HTMLElement | null) ?? null;
};

const createEngine = () => {
  const panel = panelRef.value;
  const content = contentRef.value;
  if (!panel || !content) return null;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const state = { p: settings.value.open ? 1 : 0, v: 0, height: content.offsetHeight, bar: 60 };
  let raf = 0;
  let last = 0;

  const render = () => {
    const s = settings.value;
    state.bar = parseFloat(getComputedStyle(panel).getPropertyValue('--cn-bar')) || 60;
    panel.style.height = `${state.bar + Math.max(0, state.p) * state.height}px`;
    const cards = cardRefs.filter((card): card is HTMLElement => Boolean(card));
    const count = cards.length;
    const lag = count > 1 ? Math.min(s.stagger, 0.7 / (count - 1)) : 0;
    const span = 1 - lag * (count - 1);
    cards.forEach((card, index) => {
      const local = clamp((state.p - index * lag) / Math.max(span, 0.05), 0, 1);
      const e = easeOut(local);
      if (s.cardEffect === 'unfold') {
        card.style.transform = `translateY(${(1 - e) * -10}px) rotateX(${(1 - e) * -72}deg)`;
        card.style.opacity = `${clamp(local * 1.8, 0, 1)}`;
        card.style.filter = '';
      } else if (s.cardEffect === 'fade') {
        card.style.transform = `translateY(${(1 - e) * 6}px)`;
        card.style.opacity = `${e}`;
        card.style.filter = e < 0.999 ? `blur(${(1 - e) * 6}px)` : '';
      } else {
        card.style.transform = `translateY(${(1 - e) * 26}px) scale(${0.97 + 0.03 * e})`;
        card.style.opacity = `${e}`;
        card.style.filter = '';
      }
    });
  };

  const tick = (now: number) => {
    raf = 0;
    const s = settings.value;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    const target = s.open ? 1 : 0;
    if (reduce) {
      state.p = target;
      state.v = 0;
    } else {
      const k = 160 * s.speed * s.speed;
      const zeta = s.open ? 1 - 0.68 * s.bounce : 1;
      const steps = Math.ceil(dt / (1 / 240));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        state.v += (-k * (state.p - target) - 2 * zeta * Math.sqrt(k) * state.v) * h;
        state.p += state.v * h;
      }
    }
    const done = Math.abs(state.p - target) < 0.0005 && Math.abs(state.v) < 0.002;
    if (done) {
      state.p = target;
      state.v = 0;
    }
    render();
    if (done && target === 0) shown.value = false;
    if (!done) raf = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };

  render();
  const observer = new ResizeObserver(() => {
    state.height = content.offsetHeight;
    render();
  });
  observer.observe(content);

  return {
    wake,
    refresh: () => {
      state.height = content.offsetHeight;
      render();
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    }
  };
};

const rebuildEngine = () => {
  engine?.destroy();
  engine = createEngine();
};

let narrowObserver: ResizeObserver | null = null;

const playIntro = () => {
  const panel = panelRef.value;
  const bar = barRef.value;
  if (!panel || !bar || !introOnMount) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const width = panel.offsetWidth;
  const height = panel.offsetHeight;
  const radius = parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 18;
  panel.animate(
    [
      { clipPath: `inset(0px ${Math.max(0, (width - height) / 2)}px round ${height / 2}px)`, opacity: 0 },
      { clipPath: `inset(0px 0px round ${radius}px)`, opacity: 1 }
    ],
    { duration: 820, easing: EASE_OUT, fill: 'backwards' }
  );
  Array.from(bar.children).forEach((child, index) => {
    child.animate(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 560, delay: 220 + index * 70, easing: EASE_OUT, fill: 'backwards' }
    );
  });
};

onMounted(() => {
  const root = rootRef.value;
  if (root) {
    const measure = () => {
      narrow.value = root.offsetWidth < NARROW;
    };
    measure();
    narrowObserver = new ResizeObserver(measure);
    narrowObserver.observe(root);
  }
  playIntro();
  rebuildEngine();
});

watch([() => props.items.length, hasCta, narrow], () => rebuildEngine(), { flush: 'post' });

watch(
  open,
  value => {
    if (value) shown.value = true;
    engine?.refresh();
    engine?.wake();
  },
  { flush: 'post' }
);

onUpdated(() => {
  engine?.refresh();
});

watch(
  open,
  (value, _previous, onCleanup) => {
    if (!value) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && rootRef.value?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      menuRef.value?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    onCleanup(() => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    });
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  window.clearTimeout(leaveTimer);
  narrowObserver?.disconnect();
  engine?.destroy();
  engine = null;
});

const hover = computed(() => props.openOn === 'hover');

const onPointerEnter = (event: PointerEvent) => {
  if (!hover.value || event.pointerType === 'touch') return;
  window.clearTimeout(leaveTimer);
  setOpen(true);
};

const onPointerLeave = (event: PointerEvent) => {
  if (!hover.value || event.pointerType === 'touch') return;
  window.clearTimeout(leaveTimer);
  leaveTimer = window.setTimeout(() => setOpen(false), 160);
};

const onCtaClick = (event: MouseEvent, wide: boolean) => {
  props.cta?.onClick?.(event);
  if (wide) setOpen(false);
};

const onLinkSelect = (link: CardNavLink, item: CardNavItem, event: MouseEvent) => {
  props.onLinkClick?.(link, item, event);
  setOpen(false);
};
</script>

<template>
  <div
    ref="rootRef"
    :class="['card-nav', className].filter(Boolean)"
    :data-open="open ? '' : undefined"
    :data-shown="shown || open ? '' : undefined"
    :data-narrow="narrow ? '' : undefined"
    :style="[vars, style]"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <nav ref="panelRef" class="card-nav__panel" :aria-label="ariaLabel">
      <div ref="barRef" class="card-nav__bar">
        <button
          ref="menuRef"
          type="button"
          class="card-nav__menu"
          :data-icon-only="menuLabel ? undefined : ''"
          :aria-expanded="open"
          :aria-controls="contentId"
          :aria-label="menuLabel ? undefined : open ? 'Close menu' : 'Open menu'"
          @click="setOpen(!open)"
        >
          <span class="card-nav__burger" aria-hidden="true">
            <span class="card-nav__line card-nav__line--top" />
            <span class="card-nav__line card-nav__line--bottom" />
          </span>
          <span v-if="menuLabel" class="card-nav__menu-label">
            <span class="card-nav__word card-nav__word--open" :aria-hidden="open">Menu</span>
            <span class="card-nav__word card-nav__word--close" :aria-hidden="!open">Close</span>
          </span>
        </button>

        <CardNavAnchor v-if="logo" :href="logoHref" :as="linkComponent" class="card-nav__logo" :aria-label="logoAlt">
          <img v-if="typeof logo === 'string'" :src="logo" alt="" draggable="false" />
          <CardNavNodeView v-else :node="logo" />
        </CardNavAnchor>

        <CardNavAnchor
          v-if="cta && !narrow"
          :href="cta.href"
          :as="linkComponent"
          class="card-nav__cta"
          @click="(event: MouseEvent) => onCtaClick(event, false)"
        >
          {{ cta.label }}
        </CardNavAnchor>
      </div>

      <div :id="contentId" ref="contentRef" class="card-nav__content" :aria-hidden="!open">
        <div class="card-nav__cards">
          <div
            v-for="(item, index) in items"
            :key="`${item.label}-${index}`"
            :ref="setCardRef(index)"
            class="card-nav__card"
            :data-tinted="item.bgColor ? '' : undefined"
            :style="item.bgColor ? { background: item.bgColor, color: item.textColor } : undefined"
          >
            <div class="card-nav__card-head">
              <span class="card-nav__label">{{ item.label }}</span>
              <p v-if="item.description" class="card-nav__description">{{ item.description }}</p>
            </div>
            <ul class="card-nav__links">
              <li v-for="(link, linkIndex) in item.links ?? []" :key="`${link.label}-${linkIndex}`">
                <CardNavAnchor
                  :href="link.href"
                  :as="linkComponent"
                  class="card-nav__link"
                  :aria-label="link.ariaLabel"
                  :tabindex="open ? undefined : -1"
                  @click="(event: MouseEvent) => onLinkSelect(link, item, event)"
                >
                  <span class="card-nav__arrow" aria-hidden="true">
                    <HugeiconsIcon
                      class="card-nav__arrow-icon card-nav__arrow-icon--out"
                      :icon="ArrowUpRight01Icon"
                      :size="14"
                      :stroke-width="2"
                    />
                    <HugeiconsIcon
                      class="card-nav__arrow-icon card-nav__arrow-icon--in"
                      :icon="ArrowUpRight01Icon"
                      :size="14"
                      :stroke-width="2"
                    />
                  </span>
                  {{ link.label }}
                </CardNavAnchor>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="cta && narrow" :ref="setCardRef(items.length)">
          <CardNavAnchor
            :href="cta.href"
            :as="linkComponent"
            class="card-nav__cta card-nav__cta--wide"
            :tabindex="!open ? -1 : undefined"
            @click="(event: MouseEvent) => onCtaClick(event, true)"
          >
            {{ cta.label }}
          </CardNavAnchor>
        </div>
      </div>
      <span class="card-nav__rim" />
    </nav>
  </div>
</template>

<style>
.card-nav {
  position: relative;
  width: 100%;
  max-width: var(--cn-max);
  height: var(--cn-bar);
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.4;
  -webkit-tap-highlight-color: transparent;
}

.card-nav__panel {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  height: var(--cn-bar);
  border-radius: var(--cn-radius);
  overflow: hidden;
  background: var(--cn-panel);
  box-shadow: var(--cn-shadow);
  -webkit-backdrop-filter: var(--cn-blur);
  backdrop-filter: var(--cn-blur);
}

.card-nav__rim {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--cn-edge),
    inset 0 1px 0 var(--cn-highlight);
  pointer-events: none;
}

.card-nav__bar {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: var(--cn-bar);
  padding: 0 var(--cn-inset);
  box-sizing: border-box;
}

.card-nav__menu {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-self: start;
  height: calc(var(--cn-bar) - var(--cn-inset) * 2);
  padding: 0 14px 0 16px;
  border: 0;
  border-radius: calc(var(--cn-radius) - var(--cn-inset));
  background: none;
  color: var(--cn-text);
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease;
}

.card-nav__menu[data-icon-only] {
  justify-content: center;
  width: calc(var(--cn-bar) - var(--cn-inset) * 2);
  padding: 0;
}

.card-nav__menu:hover {
  background: var(--cn-hover);
}

.card-nav__menu:focus-visible,
.card-nav__logo:focus-visible,
.card-nav__cta:focus-visible,
.card-nav__link:focus-visible {
  outline: 2px solid var(--cn-ring);
  outline-offset: 2px;
}

.card-nav__burger {
  position: relative;
  width: 18px;
  height: 12px;
}

.card-nav__line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 2px;
  background: currentColor;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    top 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-nav__line--top {
  top: 2.25px;
}

.card-nav__line--bottom {
  top: 8.25px;
}

.card-nav[data-open] .card-nav__line--top {
  top: 5.25px;
  transform: rotate(45deg);
}

.card-nav[data-open] .card-nav__line--bottom {
  top: 5.25px;
  transform: rotate(-45deg);
}

.card-nav__menu-label {
  position: relative;
  display: inline-grid;
  overflow: hidden;
}

.card-nav__word {
  grid-area: 1 / 1;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-nav__word--close {
  transform: translateY(110%);
}

.card-nav[data-open] .card-nav__word--open {
  transform: translateY(-110%);
}

.card-nav[data-open] .card-nav__word--close {
  transform: translateY(0);
}

.card-nav__logo {
  display: inline-flex;
  align-items: center;
  justify-self: center;
  height: var(--cn-logo);
  color: var(--cn-text);
  text-decoration: none;
  outline: none;
}

.card-nav__logo img,
.card-nav__logo svg {
  display: block;
  height: 100%;
  width: auto;
}

.card-nav__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
  height: calc(var(--cn-bar) - var(--cn-inset) * 2);
  padding: 0 16px;
  border: 0;
  border-radius: calc(var(--cn-radius) - var(--cn-inset));
  background: var(--cn-cta);
  box-shadow: var(--cn-cta-shadow);
  color: var(--cn-cta-ink);
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  transition: filter 0.2s ease;
}

.card-nav__cta:hover {
  filter: var(--cn-cta-hover);
}

.card-nav[data-narrow] .card-nav__bar {
  grid-template-columns: auto 1fr auto;
}

.card-nav[data-narrow] .card-nav__logo {
  grid-column: 1;
  grid-row: 1;
  justify-self: start;
  padding-left: 14px;
}

.card-nav[data-narrow] .card-nav__menu {
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
}

.card-nav__content {
  position: absolute;
  top: var(--cn-bar);
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: var(--cn-gap);
  padding: 0 var(--cn-inset) var(--cn-inset);
  box-sizing: border-box;
  perspective: 900px;
}

.card-nav__content {
  visibility: hidden;
}

.card-nav[data-shown] .card-nav__content {
  visibility: visible;
}

.card-nav__cards {
  display: flex;
  gap: var(--cn-gap);
}

.card-nav[data-narrow] .card-nav__cards {
  flex-direction: column;
}

.card-nav__card {
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  min-height: var(--cn-card);
  padding: 16px 16px 14px;
  border-radius: calc(var(--cn-radius) - var(--cn-inset));
  box-sizing: border-box;
  background: var(--cn-tile);
  box-shadow: var(--cn-tile-rim);
  color: var(--cn-text);
  transform-origin: 50% 0;
  will-change: transform, opacity;
}

.card-nav[data-narrow] .card-nav__card {
  flex: none;
  min-height: 0;
  gap: 10px;
  padding: 14px 14px 12px;
}

.card-nav[data-narrow] .card-nav__links {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2px 16px;
}

.card-nav__card[data-tinted] {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 4px 10px -4px rgba(0, 0, 0, 0.45);
}

.card-nav__card-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-nav__label {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.card-nav__description {
  margin: 0;
  color: var(--cn-muted);
  font-size: 13px;
  line-height: 1.45;
}

.card-nav__card[data-tinted] .card-nav__description {
  color: inherit;
  opacity: 0.7;
}

.card-nav__links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: auto 0 0;
  padding: 0;
  list-style: none;
}

.card-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  opacity: 0.82;
  transition: opacity 0.2s ease;
}

.card-nav__link:hover {
  opacity: 1;
}

.card-nav__arrow {
  position: relative;
  display: inline-block;
  flex: none;
  width: 14px;
  height: 14px;
  overflow: hidden;
}

.card-nav__arrow-icon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-nav__arrow-icon--in {
  transform: translate(-110%, 110%);
}

.card-nav__link:hover .card-nav__arrow-icon--out,
.card-nav__link:focus-visible .card-nav__arrow-icon--out {
  transform: translate(110%, -110%);
}

.card-nav__link:hover .card-nav__arrow-icon--in,
.card-nav__link:focus-visible .card-nav__arrow-icon--in {
  transform: translate(0, 0);
}

.card-nav__cta--wide {
  display: flex;
  width: 100%;
  height: 44px;
}

@media (prefers-reduced-motion: reduce) {
  .card-nav__line,
  .card-nav__word,
  .card-nav__arrow-icon {
    transition: none;
  }
}
</style>
