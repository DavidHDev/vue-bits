<script lang="ts">
import {
  cloneVNode,
  defineComponent,
  h,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  Teleport,
  watch,
  type Component,
  type CSSProperties,
  type PropType,
  type VNode,
  type VNodeChild
} from 'vue';

export type DockSide = 'bottom' | 'top' | 'left' | 'right';

export type DockNode = string | number | boolean | null | undefined | VNode | Component | (() => VNodeChild);

export type DockMenuItem = {
  label?: DockNode;
  onClick?: () => void;
  icon?: DockNode;
  checked?: boolean;
  disabled?: boolean;
  shortcut?: DockNode;
  items?: DockMenuItem[];
  separator?: boolean;
};

export type DockItemData = {
  icon?: DockNode;
  label?: string;
  onClick?: () => void;
  className?: string;
  active?: boolean;
  badge?: number | string | boolean | null;
  menu?: DockMenuItem[];
  separator?: boolean;
};

export type DockSpring = {
  mass?: number;
  stiffness?: number;
  damping?: number;
};

export type DockProps = {
  items?: DockItemData[];
  position?: DockSide;
  theme?: 'dark' | 'light';
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  gap?: number;
  roundness?: number;
  spring?: DockSpring;
  bounce?: boolean;
  autoHide?: boolean;
  tiles?: boolean;
  showLabels?: boolean;
  showIndicators?: boolean;
  showBadges?: boolean;
  badgeColor?: string;
  accentColor?: string;
  className?: string;
  style?: CSSProperties;
};

type Tokens = Record<string, string>;
type Point = { x: number; y: number };
type Edge = { left: number; right: number; top: number };
type Frame = { left: number; top: number; width: number; height: number };
type SubMenu = { index: number; keyboard: boolean; edge: Edge };

const SIDES: DockSide[] = ['bottom', 'top', 'left', 'right'];
const EDGE = 12;
const HOP = 0.4;
const HOP_TIME = 0.38;
const HOLD_TIME = 450;
const TAIL = 9;
const TAIL_HALF = 9;
const MENU_RADIUS = 10;
const MENU_GAP = 8;
const MARGIN = 8;
const POP = 'cubic-bezier(0.2, 1.25, 0.4, 1)';

const THEMES: Record<'dark' | 'light', Tokens> = {
  dark: {
    '--dock-panel': 'rgba(34, 37, 35, 0.66)',
    '--dock-panel-edge': 'rgba(255, 255, 255, 0.08)',
    '--dock-panel-highlight': 'rgba(255, 255, 255, 0.07)',
    '--dock-panel-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--dock-tile': 'linear-gradient(180deg, #373a38 0%, #242725 100%)',
    '--dock-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--dock-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--dock-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--dock-ink': '#f4f5f4',
    '--dock-label': '#282b29',
    '--dock-label-ink': '#f4f5f4',
    '--dock-dot': 'rgba(255, 255, 255, 0.72)',
    '--dock-separator': 'rgba(255, 255, 255, 0.12)',
    '--dock-press': 'brightness(0.75)',
    '--dock-menu': 'rgba(37, 40, 38, 0.8)',
    '--dock-menu-edge': 'rgba(255, 255, 255, 0.13)',
    '--dock-menu-ink': '#f4f5f4',
    '--dock-menu-muted': 'rgba(244, 245, 244, 0.42)',
    '--dock-menu-separator': 'rgba(255, 255, 255, 0.1)',
    '--dock-menu-shadow': '0 18px 40px -12px rgba(0, 0, 0, 0.65), 0 3px 10px rgba(0, 0, 0, 0.3)'
  },
  light: {
    '--dock-panel': 'rgba(239, 242, 239, 0.8)',
    '--dock-panel-edge': 'rgba(22, 24, 22, 0.07)',
    '--dock-panel-highlight': 'rgba(255, 255, 255, 0.95)',
    '--dock-panel-shadow': '0 22px 44px -22px rgba(22, 24, 22, 0.3), 0 6px 16px -10px rgba(22, 24, 22, 0.16)',
    '--dock-tile': 'linear-gradient(180deg, #ffffff 0%, #f5f7f5 100%)',
    '--dock-tile-edge': 'rgba(22, 24, 22, 0.08)',
    '--dock-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--dock-tile-shadow': '0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    '--dock-ink': '#252825',
    '--dock-label': '#ffffff',
    '--dock-label-ink': '#161816',
    '--dock-dot': 'rgba(22, 24, 22, 0.55)',
    '--dock-separator': 'rgba(22, 24, 22, 0.12)',
    '--dock-press': 'brightness(0.9)',
    '--dock-menu': 'rgba(247, 249, 247, 0.86)',
    '--dock-menu-edge': 'rgba(22, 24, 22, 0.1)',
    '--dock-menu-ink': '#161816',
    '--dock-menu-muted': 'rgba(22, 24, 22, 0.4)',
    '--dock-menu-separator': 'rgba(22, 24, 22, 0.1)',
    '--dock-menu-shadow': '0 18px 40px -14px rgba(22, 24, 22, 0.3), 0 3px 10px rgba(22, 24, 22, 0.1)'
  }
};

const hasBadge = (badge: unknown) => badge !== undefined && badge !== null && badge !== false;
const usable = (row?: DockMenuItem | null): row is DockMenuItem => !!row && !row.separator && !row.disabled;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true) return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return cloneVNode(node);
  return h(node as Component);
};

export const DockNodeView = (props: { node?: unknown }) => renderNode(props.node);
DockNodeView.props = ['node'];

const menuPath = (width: number, height: number, side: DockSide | null, at: number) => {
  const r = MENU_RADIUS;
  const p = (x: number, y: number) => `${(x + TAIL).toFixed(2)} ${(y + TAIL).toFixed(2)}`;
  const tail = (x: number, y: number, dx: number, dy: number, nx: number, ny: number) => {
    const q = (u: number, v: number) => p(x + dx * u + nx * v, y + dy * u + ny * v);
    return `L ${q(-TAIL_HALF, 0)} L ${q(-TAIL_HALF * 0.18, TAIL * 0.82)} Q ${q(0, TAIL)} ${q(TAIL_HALF * 0.18, TAIL * 0.82)} L ${q(TAIL_HALF, 0)}`;
  };
  return [
    `M ${p(r, 0)}`,
    side === 'top' ? tail(at, 0, 1, 0, 0, -1) : '',
    `L ${p(width - r, 0)} A ${r} ${r} 0 0 1 ${p(width, r)}`,
    side === 'right' ? tail(width, at, 0, 1, 1, 0) : '',
    `L ${p(width, height - r)} A ${r} ${r} 0 0 1 ${p(width - r, height)}`,
    side === 'bottom' ? tail(at, height, -1, 0, 0, 1) : '',
    `L ${p(r, height)} A ${r} ${r} 0 0 1 ${p(0, height - r)}`,
    side === 'left' ? tail(0, at, 0, -1, -1, 0) : '',
    `L ${p(0, r)} A ${r} ${r} 0 0 1 ${p(r, 0)} Z`
  ].join(' ');
};

const checkGlyph = () =>
  h(
    'svg',
    { viewBox: '0 0 16 16', width: '12', height: '12', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' },
    [h('path', { d: 'M3.5 8.5l3 3 6-7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]
  );

const chevronGlyph = () =>
  h(
    'svg',
    { viewBox: '0 0 16 16', width: '10', height: '10', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' },
    [h('path', { d: 'M6 3.5L10.5 8 6 12.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]
  );

export const DockMenu: Component = defineComponent({
  name: 'DockMenu',
  props: {
    rows: { type: Array as PropType<DockMenuItem[]>, required: true },
    label: { type: String, default: undefined },
    side: { type: String as PropType<DockSide | null>, default: null },
    point: { type: Object as PropType<Point>, default: undefined },
    edge: { type: Object as PropType<Edge>, default: undefined },
    tokens: { type: Object as PropType<Tokens>, required: true },
    nested: { type: Boolean, default: false },
    focusFirst: { type: Boolean, default: false },
    closing: { type: Boolean, default: false },
    pressing: { type: Object as PropType<{ current: boolean }>, required: true },
    onSelect: { type: Function as PropType<(row: DockMenuItem, keyboard: boolean) => void>, default: undefined },
    onDismiss: { type: Function as PropType<(restore: boolean) => void>, default: undefined },
    onBack: { type: Function as PropType<() => void>, default: undefined },
    onEnter: { type: Function as PropType<() => void>, default: undefined },
    onExited: { type: Function as PropType<() => void>, default: undefined }
  },
  setup(props) {
    const outerRef = ref<HTMLDivElement | null>(null);
    const listRef = ref<HTMLDivElement | null>(null);
    const glassRef = ref<HTMLSpanElement | null>(null);
    const shapeRef = ref<SVGSVGElement | null>(null);
    const pathRef = ref<SVGPathElement | null>(null);
    const highlightRef = ref<HTMLSpanElement | null>(null);
    const rowRefs: (HTMLButtonElement | null)[] = [];
    let frame: Frame | null = null;
    let timer = 0;
    let alive = true;
    let reduce = false;
    const active = ref(-1);
    const sub = shallowRef<SubMenu | null>(null);
    const blink = ref(false);
    const chosen = ref(false);
    const pressState = props.pressing;

    onMounted(() => {
      const outer = outerRef.value;
      const list = listRef.value;
      const glass = glassRef.value;
      const shape = pathRef.value;
      if (!outer || !list || !glass || !shape) return;
      alive = true;
      const layers = [outer.firstElementChild, glass, shapeRef.value, list].filter((layer): layer is Element =>
        Boolean(layer)
      );
      const { x, y } = props.point ?? { x: 0, y: 0 };
      const box = props.edge ?? { left: 0, right: 0, top: 0 };
      const side = props.side;
      reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const width = list.offsetWidth;
      const height = list.offsetHeight;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      let left: number;
      let top: number;
      let at = 0;
      let origin: string;
      if (side === 'bottom' || side === 'top') {
        left = clamp(x - width / 2, MARGIN, vw - MARGIN - width);
        top = side === 'bottom' ? y - TAIL - height : y + TAIL;
        at = clamp(x - left, MENU_RADIUS + TAIL_HALF, width - MENU_RADIUS - TAIL_HALF);
        origin = `${at}px ${side === 'bottom' ? height + TAIL : -TAIL}px`;
      } else if (side === 'left' || side === 'right') {
        top = clamp(y - height / 2, MARGIN, vh - MARGIN - height);
        left = side === 'right' ? x - TAIL - width : x + TAIL;
        at = clamp(y - top, MENU_RADIUS + TAIL_HALF, height - MENU_RADIUS - TAIL_HALF);
        origin = `${side === 'right' ? width + TAIL : -TAIL}px ${at}px`;
      } else {
        const flip = box.right - 4 + width > vw - MARGIN && box.left + 4 - width >= MARGIN;
        left = flip ? box.left + 4 - width : box.right - 4;
        top = clamp(box.top - 5, MARGIN, vh - MARGIN - height);
        origin = flip ? 'right top' : 'left top';
      }
      const path = menuPath(width, height, side, at);
      frame = { left, top, width, height };
      outer.style.left = `${left}px`;
      outer.style.top = `${top}px`;
      outer.style.transformOrigin = origin;
      outer.style.visibility = 'visible';
      glass.style.clipPath = `path('${path}')`;
      shape.setAttribute('d', path);
      if (reduce) {
        layers.forEach(layer => layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: 'ease-out' }));
      } else {
        outer.animate([{ transform: `scale(${props.nested ? 0.94 : 0.82})` }, { transform: 'scale(1)' }], {
          duration: props.nested ? 220 : 340,
          easing: POP
        });
        layers.forEach(layer =>
          layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: props.nested ? 120 : 160, easing: 'ease-out' })
        );
      }
      const first = props.rows.findIndex(usable);
      if (props.focusFirst && first >= 0) {
        active.value = first;
        rowRefs[first]?.focus({ preventScroll: true });
      } else {
        list.focus({ preventScroll: true });
      }
    });

    onBeforeUnmount(() => {
      alive = false;
      window.clearTimeout(timer);
    });

    watch(
      () => props.closing,
      (closing, _previous, onCleanup) => {
        if (!closing) return;
        const outer = outerRef.value;
        const layers = [outer?.firstElementChild, glassRef.value, shapeRef.value, listRef.value].filter(
          (layer): layer is Element => Boolean(layer)
        );
        const duration = reduce ? 100 : 150;
        let done = false;
        const finish = () => {
          if (done || !alive) return;
          done = true;
          props.onExited?.();
        };
        if (outer && !reduce) {
          outer.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }], {
            duration,
            easing: 'ease-in',
            fill: 'forwards'
          });
        }
        layers.forEach(layer =>
          layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-in', fill: 'forwards' })
        );
        const finishTimer = window.setTimeout(finish, duration);
        onCleanup(() => window.clearTimeout(finishTimer));
      },
      { immediate: true, flush: 'post' }
    );

    watch(
      [active, blink],
      () => {
        const highlight = highlightRef.value;
        if (!highlight) return;
        const row = rowRefs[active.value];
        if (!row || blink.value) {
          if (blink.value) highlight.style.transition = 'none';
          highlight.style.opacity = '0';
          return;
        }
        const jump = highlight.style.opacity !== '1' || reduce;
        if (jump) highlight.style.transition = 'none';
        highlight.style.transform = `translateY(${row.offsetTop}px)`;
        highlight.style.height = `${row.offsetHeight}px`;
        highlight.style.opacity = '1';
        if (jump) {
          void highlight.offsetHeight;
          highlight.style.transition = '';
        }
      },
      { immediate: true, flush: 'post' }
    );

    const activate = (index: number) => {
      active.value = index;
      rowRefs[index]?.focus({ preventScroll: true });
    };

    const openSub = (index: number, keyboard: boolean) => {
      window.clearTimeout(timer);
      const row = rowRefs[index];
      if (!frame || !row) return;
      sub.value = {
        index,
        keyboard,
        edge: { left: frame.left, right: frame.left + frame.width, top: frame.top + row.offsetTop }
      };
    };

    const closeSub = () => {
      window.clearTimeout(timer);
      sub.value = null;
    };

    const choose = (index: number, keyboard: boolean) => {
      if (chosen.value) return;
      const row = props.rows[index];
      chosen.value = true;
      active.value = index;
      window.clearTimeout(timer);
      if (reduce) {
        props.onSelect?.(row, keyboard);
        return;
      }
      blink.value = true;
      window.setTimeout(() => {
        if (alive) blink.value = false;
      }, 70);
      window.setTimeout(() => {
        if (alive) props.onSelect?.(row, keyboard);
      }, 150);
    };

    const enterRow = (index: number) => {
      if (chosen.value || active.value === index || !usable(props.rows[index])) return;
      activate(index);
      window.clearTimeout(timer);
      if (props.rows[index].items?.length) {
        if (sub.value?.index !== index) timer = window.setTimeout(() => openSub(index, false), 120);
      } else if (sub.value) {
        timer = window.setTimeout(closeSub, 220);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (chosen.value) return;
      const { key } = event;
      const rows = props.rows;
      const order = rows.flatMap((row, i) => (usable(row) ? [i] : []));
      let handled = true;
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
        if (order.length) {
          const at = order.indexOf(active.value);
          let next = order[0];
          if (key === 'End') next = order[order.length - 1];
          else if (key === 'ArrowDown') next = order[(at + 1) % order.length];
          else if (key === 'ArrowUp') next = order[at <= 0 ? order.length - 1 : at - 1];
          if (sub.value) closeSub();
          activate(next);
        }
      } else if (key === 'ArrowRight' && rows[active.value]?.items?.length) {
        openSub(active.value, true);
      } else if ((key === 'ArrowLeft' || key === 'Escape') && props.nested) {
        props.onBack?.();
      } else if (key === 'Escape' || key === 'Tab') {
        props.onDismiss?.(true);
      } else {
        handled = false;
      }
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const renderRow = (row: DockMenuItem | null | undefined, index: number, checks: boolean) => {
      if (!row) return null;
      if (row.separator) return h('span', { key: index, class: 'dock-menu-separator', role: 'separator' });
      const lit = index === active.value && !blink.value;
      const submenu = Boolean(row.items?.length);
      return h(
        'button',
        {
          key: index,
          ref: (node: unknown) => {
            rowRefs[index] = node as HTMLButtonElement | null;
          },
          type: 'button',
          class: 'dock-menu-row',
          role: row.checked !== undefined ? 'menuitemcheckbox' : 'menuitem',
          'aria-checked': row.checked !== undefined ? String(Boolean(row.checked)) : undefined,
          'aria-disabled': row.disabled ? 'true' : undefined,
          'aria-haspopup': submenu ? 'menu' : undefined,
          'aria-expanded': submenu ? String(sub.value?.index === index) : undefined,
          tabindex: -1,
          'data-dock-row': index,
          'data-active': lit ? '' : undefined,
          onPointermove: () => enterRow(index),
          onPointerup: () => {
            const press = pressState;
            if (!press?.current || !usable(row) || submenu) return;
            press.current = false;
            choose(index, false);
          },
          onClick: (event: MouseEvent) => {
            if (chosen.value || !usable(row)) return;
            if (submenu) openSub(index, event.detail === 0);
            else choose(index, event.detail === 0);
          }
        },
        [
          checks ? h('span', { class: 'dock-menu-check' }, row.checked ? [checkGlyph()] : []) : null,
          row.icon ? h('span', { class: 'dock-menu-icon' }, [renderNode(row.icon)]) : null,
          h('span', { class: 'dock-menu-text' }, [renderNode(row.label)]),
          row.shortcut ? h('span', { class: 'dock-menu-shortcut' }, [renderNode(row.shortcut)]) : null,
          submenu ? h('span', { class: 'dock-menu-chevron' }, [chevronGlyph()]) : null
        ]
      );
    };

    return () => {
      const rows = props.rows;
      const checks = rows.some(row => row && !row.separator && row.checked !== undefined);
      const current = sub.value;
      const subRow = current ? rows[current.index] : null;
      return [
        h(Teleport, { to: 'body' }, [
          h('div', { ref: outerRef, class: 'dock-menu', style: props.tokens, 'data-dock-menu': '' }, [
            h('span', { class: 'dock-menu-shadow' }),
            h('span', { ref: glassRef, class: 'dock-menu-glass' }),
            h('svg', { ref: shapeRef, class: 'dock-menu-shape', 'aria-hidden': 'true' }, [h('path', { ref: pathRef })]),
            h(
              'div',
              {
                ref: listRef,
                class: 'dock-menu-list',
                role: 'menu',
                'aria-label': props.label,
                tabindex: -1,
                onKeydown: onKeyDown,
                onPointerenter: () => props.onEnter?.(),
                onPointerleave: () => {
                  if (sub.value || chosen.value) return;
                  active.value = -1;
                  listRef.value?.focus({ preventScroll: true });
                }
              },
              [
                h('span', { ref: highlightRef, class: 'dock-menu-highlight' }),
                ...rows.map((row, index) => renderRow(row, index, checks))
              ]
            )
          ])
        ]),
        current
          ? h(DockMenu, {
              key: current.index,
              rows: subRow?.items ?? [],
              label: typeof subRow?.label === 'string' ? subRow.label : undefined,
              edge: current.edge,
              tokens: props.tokens,
              nested: true,
              focusFirst: current.keyboard,
              closing: props.closing,
              pressing: props.pressing,
              onSelect: (row: DockMenuItem, keyboard: boolean) => props.onSelect?.(row, keyboard),
              onDismiss: (restore: boolean) => props.onDismiss?.(restore),
              onBack: () => {
                const index = current.index;
                closeSub();
                activate(index);
              },
              onEnter: () => {
                window.clearTimeout(timer);
                active.value = current.index;
              }
            })
          : null
      ];
    };
  }
});
</script>

<script setup lang="ts">
import { computed, onUpdated } from 'vue';

type MenuState = {
  id: number;
  index: number;
  point: Point;
  keyboard: boolean;
  closing: boolean;
  restore: boolean;
  rows?: DockMenuItem[];
};

type Motion = {
  size: number;
  velocity: number;
  lift: number;
  rise: number;
  launch: number;
  gravity: number;
  hopping: boolean;
  drawn: string;
  node: HTMLButtonElement | null;
};

type Actions = {
  hop: (index: number) => void;
  focus: (index: number) => void;
  hold: (index: number | null) => void;
};

type Press = { id: number; x: number; y: number; timer: number; cleanup: () => void };

const props = withDefaults(defineProps<DockProps>(), {
  items: () => [],
  position: 'bottom',
  theme: 'dark',
  baseItemSize: 50,
  magnification: 70,
  distance: 200,
  panelHeight: 68,
  gap: 10,
  roundness: 0.5,
  spring: () => ({ mass: 0.1, stiffness: 150, damping: 12 }),
  bounce: true,
  autoHide: false,
  tiles: true,
  showLabels: true,
  showIndicators: true,
  showBadges: true,
  badgeColor: '#ff453a',
  accentColor: '#0a84ff',
  className: '',
  style: undefined
});

const rootRef = ref<HTMLDivElement | null>(null);
const itemRefs: (HTMLButtonElement | null)[] = [];
let wakeFn: (() => void) | null = null;
let actions: Actions | null = null;
let serial = 0;
let press: Press | null = null;
const pressing = { current: false };
let skip = -1;
const fit = ref(1);
const menu = shallowRef<MenuState | null>(null);

const side = computed<DockSide>(() => (SIDES.includes(props.position) ? props.position : 'bottom'));
const vertical = computed(() => side.value === 'left' || side.value === 'right');
const rawBase = computed(() => Math.max(16, props.baseItemSize));
const rawPeak = computed(() => Math.max(rawBase.value, props.magnification));
const rawThickness = computed(() => Math.max(rawBase.value, props.panelHeight));
const rawGap = computed(() => Math.max(0, props.gap));
const length = computed(
  () =>
    props.items.reduce((sum, item) => sum + (item?.separator ? 1 : rawBase.value), 0) +
    rawGap.value * Math.max(0, props.items.length - 1) +
    rawThickness.value -
    rawBase.value
);
const base = computed(() => rawBase.value * fit.value);
const peak = computed(() => rawPeak.value * fit.value);
const thickness = computed(() => rawThickness.value * fit.value);
const tokens = computed<Tokens>(() => ({
  ...(THEMES[props.theme] ?? THEMES.dark),
  '--dock-accent': props.accentColor,
  '--dock-badge': props.badgeColor
}));

const settings = computed(() => ({
  items: props.items,
  side: side.value,
  vertical: vertical.value,
  length: length.value + rawPeak.value - rawBase.value,
  base: base.value,
  peak: peak.value,
  thickness: thickness.value,
  gap: rawGap.value * fit.value,
  distance: Math.max(1, props.distance) * fit.value,
  mass: Math.max(0.01, props.spring?.mass ?? 0.1),
  stiffness: Math.max(1, props.spring?.stiffness ?? 150),
  damping: Math.max(0, props.spring?.damping ?? 12),
  bounce: props.bounce,
  autoHide: props.autoHide
}));

const rootClass = computed(
  () => `dock dock--${side.value}${props.tiles ? '' : ' dock--bare'}${props.className ? ` ${props.className}` : ''}`
);

const rootStyle = computed(
  () =>
    ({
      ...tokens.value,
      '--dock-base': `${base.value}px`,
      '--dock-thickness': `${thickness.value}px`,
      '--dock-gap': `${rawGap.value * fit.value}px`,
      '--dock-pad': `${(thickness.value - base.value) / 2}px`,
      '--dock-reach': `${peak.value - base.value}px`,
      '--dock-round': clamp(props.roundness, 0, 1),
      ...props.style
    }) as CSSProperties
);

const openIndex = computed(() => (menu.value && !menu.value.closing ? menu.value.index : -1));

const menuRows = computed(() => {
  const current = menu.value;
  if (!current) return [];
  return current.rows ?? props.items[current.index]?.menu ?? [];
});

const setItemRef = (node: unknown, index: number) => {
  itemRefs[index] = node as HTMLButtonElement | null;
};

onUpdated(() => {
  wakeFn?.();
});

watch(settings, () => wakeFn?.(), { flush: 'post' });

let disconnectFit: (() => void) | null = null;

const observeFit = () => {
  disconnectFit?.();
  disconnectFit = null;
  const root = rootRef.value;
  if (!root) return;
  const host = root.offsetParent ?? document.documentElement;
  const measure = () => {
    const s = settings.value;
    const room = (s.vertical ? host.clientHeight : host.clientWidth) - EDGE * 2;
    const next = s.length > 0 ? Math.min(1, Math.max(0.4, room / s.length)) : 1;
    fit.value = Math.round(next * 1000) / 1000;
  };
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(host);
  disconnectFit = () => observer.disconnect();
};

watch(() => [length.value, vertical.value, rawPeak.value, rawBase.value], observeFit, { flush: 'post' });

let teardown: (() => void) | null = null;

onMounted(() => {
  if (props.autoHide) rootRef.value?.setAttribute('data-hidden', '');
  observeFit();

  const root = rootRef.value;
  if (!root) return;

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const motion = new Map<number, Motion>();
  const pointer = { x: 0, y: 0, inside: false };
  let focused = -1;
  let held: number | null = null;
  let lastFocus: number | null = null;
  let lastRest: number[] = [];
  let lastBase = settings.value.base;
  let hidden = root.hasAttribute('data-hidden');
  let hiding = settings.value.autoHide;
  let hideTimer = 0;
  let raf = 0;
  let last = 0;
  let alive = true;

  const entry = (index: number): Motion => {
    let state = motion.get(index);
    if (!state) {
      state = {
        size: settings.value.base,
        velocity: 0,
        lift: 0,
        rise: 0,
        launch: 0,
        gravity: 0,
        hopping: false,
        drawn: '',
        node: null
      };
      motion.set(index, state);
    }
    return state;
  };

  const tick = (now: number) => {
    raf = 0;
    if (!alive) return;
    const s = settings.value;
    const dt = Math.min(1 / 30, Math.max(0.001, (now - last) / 1000));
    last = now;
    if (s.base !== lastBase) {
      const ratio = s.base / lastBase;
      motion.forEach(state => {
        state.size *= ratio;
        state.velocity *= ratio;
      });
      lastBase = s.base;
    }
    const rect = root.getBoundingClientRect();
    const center = s.vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
    const spans = s.items.map(item => (item?.separator ? 1 : s.base));
    let cursor = -(spans.reduce((sum, span) => sum + span, 0) + s.gap * Math.max(0, spans.length - 1)) / 2;
    const rest = spans.map(span => {
      const middle = cursor + span / 2;
      cursor += span + s.gap;
      return middle;
    });
    let focus: number | null = null;
    if (held !== null) focus = held;
    else if (pointer.inside) focus = (s.vertical ? pointer.y : pointer.x) - center;
    else if (rest[focused] !== undefined) focus = rest[focused];
    lastFocus = focus;
    lastRest = rest;
    const steps = Math.max(1, Math.ceil(dt * 240));
    const h = dt / steps;
    const k = s.stiffness / s.mass;
    const c = s.damping / s.mass;
    let moving = false;

    s.items.forEach((item, index) => {
      const node = itemRefs[index];
      if (!node || item?.separator) return;
      const state = entry(index);
      const reach = focus === null ? 1 : Math.abs(focus - rest[index]) / s.distance;
      const target = s.base + (s.peak - s.base) * (reach < 1 ? Math.cos((reach * Math.PI) / 2) ** 2 : 0);
      if (reduce) {
        state.size = target;
        state.velocity = 0;
      } else {
        for (let i = 0; i < steps; i++) {
          state.velocity = (state.velocity + h * k * (target - state.size)) / (1 + h * c + h * h * k);
          state.size += state.velocity * h;
          if (!state.hopping) continue;
          state.rise -= state.gravity * h;
          state.lift += state.rise * h;
          if (state.lift > 0) continue;
          state.lift = 0;
          state.rise *= -0.36;
          if (state.rise < state.launch * 0.2) {
            state.rise = 0;
            state.hopping = false;
            node.removeAttribute('data-hop');
          }
        }
      }
      if (Math.abs(state.velocity) < 0.01 && Math.abs(target - state.size) < 0.01) {
        state.size = target;
        state.velocity = 0;
      } else {
        moving = true;
      }
      if (state.hopping) moving = true;
      const size = Math.max(1, state.size);
      const drawn = `${size.toFixed(2)} ${state.lift.toFixed(2)} ${s.side}`;
      if (drawn === state.drawn && node === state.node) return;
      state.drawn = drawn;
      state.node = node;
      const lift = s.side === 'bottom' || s.side === 'right' ? -state.lift : state.lift;
      const tile = node.firstElementChild as HTMLElement | null;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      if (tile)
        tile.style.transform = `translate(${s.vertical ? `${lift}px, 0` : `0, ${lift}px`}) scale(${size / s.base})`;
    });

    if (moving) raf = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (raf || !alive) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const show = () => {
    window.clearTimeout(hideTimer);
    hideTimer = 0;
    if (!hidden) return;
    hidden = false;
    root.removeAttribute('data-hidden');
  };

  const hide = () => {
    window.clearTimeout(hideTimer);
    hideTimer = 0;
    const blocked = pointer.inside || held !== null || root.contains(document.activeElement);
    if (hidden || !settings.value.autoHide || blocked) return;
    hidden = true;
    root.setAttribute('data-hidden', '');
  };

  const hideLater = () => {
    if (hidden || hideTimer || !settings.value.autoHide) return;
    hideTimer = window.setTimeout(hide, 600);
  };

  wakeFn = () => {
    const enabled = settings.value.autoHide;
    if (enabled !== hiding) {
      hiding = enabled;
      if (enabled) hide();
      else show();
    }
    wake();
  };

  actions = {
    hop: (index: number) => {
      const node = itemRefs[index];
      if (reduce || !settings.value.bounce || !node) return;
      const state = entry(index);
      if (state.hopping) return;
      const height = state.size * HOP;
      state.gravity = (8 * height) / (HOP_TIME * HOP_TIME);
      state.launch = (state.gravity * HOP_TIME) / 2;
      state.rise = state.launch;
      state.hopping = true;
      node.setAttribute('data-hop', '');
      wake();
    },
    focus: (index: number) => {
      focused = index;
      wake();
    },
    hold: (index: number | null) => {
      if (index === null) {
        held = null;
        wake();
        hideLater();
        return;
      }
      held = lastFocus ?? lastRest[index] ?? 0;
      show();
      wake();
    }
  };

  const onMove = (event: PointerEvent) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.inside = true;
    show();
    wake();
  };
  const onLeave = () => {
    pointer.inside = false;
    wake();
    hideLater();
  };
  const onFocusOut = (event: FocusEvent) => {
    if (!root.contains(event.relatedTarget as Node | null)) hideLater();
  };
  const onWindowMove = (event: PointerEvent) => {
    const s = settings.value;
    if (!s.autoHide || pointer.inside) return;
    const host = root.offsetParent;
    const rect = host
      ? host.getBoundingClientRect()
      : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    const zone = EDGE + s.thickness * 0.6;
    const x = event.clientX;
    const y = event.clientY;
    const within = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    const near = {
      bottom: y >= rect.bottom - zone,
      top: y <= rect.top + zone,
      left: x <= rect.left + zone,
      right: x >= rect.right - zone
    }[s.side];
    if (within && near) show();
    else hideLater();
  };

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerdown', onMove);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('pointercancel', onLeave);
  root.addEventListener('focusin', show);
  root.addEventListener('focusout', onFocusOut);
  window.addEventListener('pointermove', onWindowMove);
  window.addEventListener('pointerdown', onWindowMove);
  wake();

  teardown = () => {
    alive = false;
    cancelAnimationFrame(raf);
    window.clearTimeout(hideTimer);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerdown', onMove);
    root.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('pointercancel', onLeave);
    root.removeEventListener('focusin', show);
    root.removeEventListener('focusout', onFocusOut);
    window.removeEventListener('pointermove', onWindowMove);
    window.removeEventListener('pointerdown', onWindowMove);
    wakeFn = null;
    actions = null;
    if (press) {
      window.clearTimeout(press.timer);
      press.cleanup();
    }
  };
});

onBeforeUnmount(() => {
  teardown?.();
  teardown = null;
  disconnectFit?.();
  disconnectFit = null;
});

const closeMenu = (restore: boolean) => {
  const current = menu.value;
  if (!current || current.closing) return;
  const rows = props.items[current.index]?.menu ?? [];
  menu.value = { ...current, closing: true, restore, rows };
};

const finishMenu = () => {
  const current = menu.value;
  menu.value = null;
  actions?.hold(null);
  if (current?.restore) itemRefs[current.index]?.focus({ preventScroll: true });
};

watch(
  menu,
  (current, _previous, onCleanup) => {
    if (!current || current.closing) return;
    const owner = itemRefs[current.index];
    const onDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && (target.closest('[data-dock-menu]') || owner?.contains(target))) return;
      closeMenu(false);
    };
    const onScroll = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('[data-dock-menu]')) return;
      closeMenu(false);
    };
    const onAway = () => closeMenu(false);
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onAway);
    window.addEventListener('blur', onAway);
    onCleanup(() => {
      document.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onAway);
      window.removeEventListener('blur', onAway);
    });
  },
  { flush: 'post' }
);

const openMenu = (index: number, mode: 'pointer' | 'keyboard' | 'press') => {
  const node = itemRefs[index];
  if (!node || !props.items[index]?.menu?.length) return false;
  const current = menu.value;
  if (current && current.index === index && !current.closing) return true;
  actions?.hold(index);
  const rect = node.getBoundingClientRect();
  const point = {
    bottom: { x: rect.left + rect.width / 2, y: rect.top - MENU_GAP },
    top: { x: rect.left + rect.width / 2, y: rect.bottom + MENU_GAP },
    left: { x: rect.right + MENU_GAP, y: rect.top + rect.height / 2 },
    right: { x: rect.left - MENU_GAP, y: rect.top + rect.height / 2 }
  }[side.value];
  serial += 1;
  menu.value = {
    id: serial,
    index,
    point,
    keyboard: mode === 'keyboard',
    closing: false,
    restore: false
  };
  return true;
};

const endPress = () => {
  const current = press;
  if (!current) return;
  window.clearTimeout(current.timer);
  current.cleanup();
  press = null;
};

const startPress = (event: PointerEvent, index: number) => {
  endPress();
  const target = event.currentTarget as HTMLButtonElement;
  const next: Press = { id: event.pointerId, x: event.clientX, y: event.clientY, timer: 0, cleanup: () => {} };
  if (target.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId);
  const onMove = (moved: PointerEvent) => {
    if (moved.pointerId !== next.id) return;
    if (Math.hypot(moved.clientX - next.x, moved.clientY - next.y) > 8) endPress();
  };
  const onUp = (released: PointerEvent) => {
    if (released.pointerId === next.id) endPress();
  };
  next.cleanup = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
  };
  next.timer = window.setTimeout(() => {
    next.cleanup();
    press = null;
    if (!openMenu(index, 'press')) return;
    skip = index;
    pressing.current = true;
    window.addEventListener(
      'pointerup',
      () => {
        pressing.current = false;
      },
      { once: true }
    );
  }, HOLD_TIME);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  press = next;
};

const onItemPointerDown = (event: PointerEvent, item: DockItemData, index: number) => {
  skip = -1;
  const current = menu.value;
  if (current && !current.closing) {
    if (event.button === 2 || event.ctrlKey) return;
    skip = index;
    closeMenu(false);
    return;
  }
  if (item.menu?.length && event.button === 0 && !event.ctrlKey) startPress(event, index);
};

const onItemContextMenu = (event: MouseEvent, item: DockItemData, index: number) => {
  if (!item.menu?.length) return;
  event.preventDefault();
  endPress();
  openMenu(index, 'pointer');
};

const onItemClick = (item: DockItemData, index: number) => {
  if (skip === index) {
    skip = -1;
    return;
  }
  actions?.hop(index);
  item.onClick?.();
};

const onItemFocus = (event: FocusEvent, index: number) => {
  if ((event.currentTarget as HTMLElement).matches(':focus-visible')) actions?.focus(index);
};

const onItemBlur = () => actions?.focus(-1);

const onItemKeyDown = (event: KeyboardEvent, index: number) => {
  const toward = { bottom: 'ArrowUp', top: 'ArrowDown', left: 'ArrowRight', right: 'ArrowLeft' }[side.value];
  if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10') || event.key === toward) {
    if (openMenu(index, 'keyboard')) event.preventDefault();
    return;
  }
  const order = props.items.flatMap((item, i) => (item?.separator ? [] : [i]));
  const at = order.indexOf(index);
  const keys = vertical.value ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
  let next: number | undefined;
  if (event.key === keys[0]) next = order[(at - 1 + order.length) % order.length];
  else if (event.key === keys[1]) next = order[(at + 1) % order.length];
  else if (event.key === 'Home') next = order[0];
  else if (event.key === 'End') next = order[order.length - 1];
  if (next === undefined) return;
  event.preventDefault();
  itemRefs[next]?.focus();
};

const onMenuSelect = (row: DockMenuItem, keyboard: boolean) => {
  closeMenu(keyboard || Boolean(menu.value?.keyboard));
  row.onClick?.();
};
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClass"
    role="toolbar"
    aria-label="Dock"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
    :style="rootStyle"
  >
    <template v-for="(item, index) in items" :key="index">
      <span v-if="item?.separator" class="dock-separator" aria-hidden="true" />
      <button
        v-else
        :ref="node => setItemRef(node, index)"
        type="button"
        :class="`dock-item${item.className ? ` ${item.className}` : ''}`"
        :aria-label="item.label"
        :aria-haspopup="item.menu?.length ? 'menu' : undefined"
        :aria-expanded="item.menu?.length ? openIndex === index : undefined"
        :data-open="openIndex === index ? '' : undefined"
        @pointerdown="event => onItemPointerDown(event, item, index)"
        @contextmenu="event => onItemContextMenu(event, item, index)"
        @click="onItemClick(item, index)"
        @focus="event => onItemFocus(event, index)"
        @blur="onItemBlur"
        @keydown="event => onItemKeyDown(event, index)"
      >
        <span class="dock-tile">
          <span class="dock-face"><DockNodeView :node="item.icon" /></span>
          <template v-if="showBadges && hasBadge(item.badge)">
            <span v-if="item.badge === true" class="dock-badge" />
            <span v-else class="dock-badge">{{ item.badge }}</span>
          </template>
        </span>
        <span v-if="showIndicators && item.active" class="dock-dot" aria-hidden="true" />
        <span v-if="showLabels && item.label && !menu" class="dock-label" aria-hidden="true">
          {{ item.label }}
        </span>
      </button>
    </template>
    <DockMenu
      v-if="menu"
      :key="menu.id"
      :rows="menuRows"
      :label="items[menu.index]?.label"
      :side="side"
      :point="menu.point"
      :tokens="tokens"
      :focus-first="menu.keyboard"
      :closing="menu.closing"
      :pressing="pressing"
      :on-select="onMenuSelect"
      :on-dismiss="closeMenu"
      :on-exited="finishMenu"
    />
  </div>
</template>

<style>
.dock {
  position: absolute;
  z-index: 10;
  display: flex;
  gap: var(--dock-gap);
  box-sizing: border-box;
  padding: var(--dock-pad);
  border-radius: calc(var(--dock-base) * var(--dock-round) * 0.5 + var(--dock-pad));
  background: var(--dock-panel);
  box-shadow:
    inset 0 0 0 1px var(--dock-panel-edge),
    inset 0 1px 0 var(--dock-panel-highlight),
    var(--dock-panel-shadow);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
  touch-action: none;
  transition:
    translate 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease;
}

.dock[data-hidden] {
  opacity: 0;
  pointer-events: none;
  transition:
    translate 0.36s cubic-bezier(0.55, 0, 0.75, 0.15),
    opacity 0.24s ease 0.1s;
}

.dock::before {
  content: '';
  position: absolute;
  z-index: -1;
  display: none;
}

.dock:hover::before {
  display: block;
}

.dock--bottom,
.dock--top {
  left: 50%;
  height: var(--dock-thickness);
  transform: translateX(-50%);
}

.dock--left,
.dock--right {
  top: 50%;
  flex-direction: column;
  width: var(--dock-thickness);
  transform: translateY(-50%);
}

.dock--bottom {
  bottom: 12px;
  align-items: flex-end;
}

.dock--top {
  top: 12px;
  align-items: flex-start;
}

.dock--left {
  left: 12px;
  align-items: flex-start;
}

.dock--right {
  right: 12px;
  align-items: flex-end;
}

.dock--bottom[data-hidden] {
  translate: 0 calc(100% + 12px);
}

.dock--top[data-hidden] {
  translate: 0 calc(-100% - 12px);
}

.dock--left[data-hidden] {
  translate: calc(-100% - 12px) 0;
}

.dock--right[data-hidden] {
  translate: calc(100% + 12px) 0;
}

.dock--bottom::before,
.dock--top::before {
  left: 0;
  right: 0;
  height: calc(var(--dock-reach) + 8px);
}

.dock--left::before,
.dock--right::before {
  top: 0;
  bottom: 0;
  width: calc(var(--dock-reach) + 8px);
}

.dock--bottom::before {
  bottom: 100%;
}

.dock--top::before {
  top: 100%;
}

.dock--left::before {
  left: 100%;
}

.dock--right::before {
  right: 100%;
}

.dock-item {
  position: relative;
  flex: none;
  width: var(--dock-base);
  height: var(--dock-base);
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--dock-ink);
  font: inherit;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.dock-item:hover,
.dock-item:focus-visible {
  z-index: 1;
}

.dock-tile {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--dock-base);
  height: var(--dock-base);
  transform-origin: 0 0;
  pointer-events: none;
}

.dock-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: calc(var(--dock-base) * var(--dock-round) * 0.5);
  background: var(--dock-tile);
  box-shadow:
    inset 0 0 0 1px var(--dock-tile-edge),
    inset 0 1px 0 var(--dock-tile-highlight),
    var(--dock-tile-shadow);
  font-size: calc(var(--dock-base) * 0.44);
  line-height: 1;
  transition: filter 0.2s ease;
}

.dock--bare .dock-face {
  overflow: visible;
  background: none;
  box-shadow: none;
  font-size: calc(var(--dock-base) * 0.62);
}

.dock-item:active .dock-face,
.dock-item[data-open] .dock-face {
  filter: var(--dock-press);
  transition-duration: 0s;
}

.dock-item:focus-visible .dock-face {
  outline: 2px solid var(--dock-accent);
  outline-offset: 3px;
}

.dock-badge {
  position: absolute;
  top: calc(var(--dock-base) * (0.1465 * var(--dock-round) - 0.19));
  right: calc(var(--dock-base) * (0.1465 * var(--dock-round) - 0.19));
  box-sizing: border-box;
  min-width: calc(var(--dock-base) * 0.38);
  height: calc(var(--dock-base) * 0.38);
  padding: 0 calc(var(--dock-base) * 0.1);
  border-radius: calc(var(--dock-base) * 0.19);
  background: var(--dock-badge);
  color: #ffffff;
  font-size: calc(var(--dock-base) * 0.22);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: calc(var(--dock-base) * 0.38);
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.dock-badge:empty {
  top: calc(var(--dock-base) * (0.1465 * var(--dock-round) - 0.11));
  right: calc(var(--dock-base) * (0.1465 * var(--dock-round) - 0.11));
  min-width: 0;
  width: calc(var(--dock-base) * 0.22);
  height: calc(var(--dock-base) * 0.22);
  padding: 0;
}

.dock-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--dock-dot);
  pointer-events: none;
}

.dock--bottom .dock-dot,
.dock--top .dock-dot {
  left: 50%;
  margin-left: -2px;
}

.dock--left .dock-dot,
.dock--right .dock-dot {
  top: 50%;
  margin-top: -2px;
}

.dock--bottom .dock-dot {
  top: calc(100% + max(var(--dock-pad) / 2, 5px) - 2px);
}

.dock--top .dock-dot {
  bottom: calc(100% + max(var(--dock-pad) / 2, 5px) - 2px);
}

.dock--left .dock-dot {
  right: calc(100% + max(var(--dock-pad) / 2, 5px) - 2px);
}

.dock--right .dock-dot {
  left: calc(100% + max(var(--dock-pad) / 2, 5px) - 2px);
}

.dock-separator {
  flex: none;
  align-self: center;
  border-radius: 1px;
  background: var(--dock-separator);
}

.dock--bottom .dock-separator,
.dock--top .dock-separator {
  width: 1px;
  height: calc(var(--dock-base) * 0.72);
}

.dock--left .dock-separator,
.dock--right .dock-separator {
  width: calc(var(--dock-base) * 0.72);
  height: 1px;
}

.dock-label {
  position: absolute;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--dock-label);
  color: var(--dock-label-ink);
  box-shadow:
    inset 0 0 0 1px var(--dock-panel-edge),
    0 8px 20px -8px rgba(0, 0, 0, 0.35);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.dock--bottom .dock-label {
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translate(-50%, 4px);
}

.dock--top .dock-label {
  top: calc(100% + 12px);
  left: 50%;
  transform: translate(-50%, -4px);
}

.dock--left .dock-label {
  top: 50%;
  left: calc(100% + 12px);
  transform: translate(-4px, -50%);
}

.dock--right .dock-label {
  top: 50%;
  right: calc(100% + 12px);
  transform: translate(4px, -50%);
}

.dock-item:focus-visible .dock-label {
  opacity: 1;
}

.dock--bottom .dock-item:focus-visible .dock-label,
.dock--top .dock-item:focus-visible .dock-label {
  transform: translate(-50%, 0);
}

.dock--left .dock-item:focus-visible .dock-label,
.dock--right .dock-item:focus-visible .dock-label {
  transform: translate(0, -50%);
}

@media (hover: hover) {
  .dock-item:hover .dock-label {
    opacity: 1;
  }

  .dock--bottom .dock-item:hover .dock-label,
  .dock--top .dock-item:hover .dock-label {
    transform: translate(-50%, 0);
  }

  .dock--left .dock-item:hover .dock-label,
  .dock--right .dock-item:hover .dock-label {
    transform: translate(0, -50%);
  }
}

.dock .dock-item[data-hop] .dock-label {
  opacity: 0;
}

.dock-menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  visibility: hidden;
  color: var(--dock-menu-ink);
  font-size: 13px;
  line-height: 1;
}

.dock-menu-shadow {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  box-shadow: var(--dock-menu-shadow);
  pointer-events: none;
}

.dock-menu-glass {
  position: absolute;
  inset: -9px;
  -webkit-backdrop-filter: blur(24px) saturate(1.8);
  backdrop-filter: blur(24px) saturate(1.8);
  pointer-events: none;
}

.dock-menu-shape {
  position: absolute;
  top: -9px;
  left: -9px;
  width: calc(100% + 18px);
  height: calc(100% + 18px);
  overflow: visible;
  pointer-events: none;
}

.dock-menu-shape path {
  fill: var(--dock-menu);
  stroke: var(--dock-menu-edge);
  stroke-width: 1px;
}

.dock-menu-list {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 172px;
  max-width: 280px;
  padding: 5px;
  outline: none;
}

.dock-menu-highlight {
  position: absolute;
  top: 0;
  left: 5px;
  right: 5px;
  height: 24px;
  border-radius: 6px;
  background: var(--dock-accent);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 0.16s cubic-bezier(0.3, 0.8, 0.3, 1),
    height 0.16s cubic-bezier(0.3, 0.8, 0.3, 1),
    opacity 0.12s ease;
}

.dock-menu-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  box-sizing: border-box;
  width: 100%;
  height: 24px;
  margin: 0;
  padding: 0 10px 0 7px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  white-space: nowrap;
  cursor: default;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.dock-menu-row[data-active] {
  color: #ffffff;
}

.dock-menu-row[aria-disabled='true'] {
  color: var(--dock-menu-muted);
}

.dock-menu-check {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 14px;
}

.dock-menu-icon {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  margin-right: 1px;
  font-size: 15px;
}

.dock-menu-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dock-menu-shortcut {
  flex: none;
  margin-left: 18px;
  color: var(--dock-menu-muted);
}

.dock-menu-row[data-active] .dock-menu-shortcut {
  color: rgba(255, 255, 255, 0.72);
}

.dock-menu-chevron {
  display: flex;
  flex: none;
  margin-left: 14px;
  color: var(--dock-menu-muted);
}

.dock-menu-row[data-active] .dock-menu-chevron {
  color: inherit;
}

.dock-menu-separator {
  flex: none;
  height: 1px;
  margin: 5px 10px;
  background: var(--dock-menu-separator);
}

@media (prefers-reduced-motion: reduce) {
  .dock,
  .dock[data-hidden],
  .dock-menu-highlight {
    transition: none;
  }
}
</style>
