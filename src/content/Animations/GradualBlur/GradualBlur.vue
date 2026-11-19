<template>
  <div ref="rootRef" :class="`gradual-blur ${className}`.trim()" :style="[rootStyle, style]" aria-hidden="true">
    <div v-for="(layer, index) in stack.steps" :key="index" :style="layer" />
    <div v-if="stack.wash" :style="stack.wash" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties, type Ref, type StyleValue } from 'vue';

export type GradualBlurPosition = 'top' | 'bottom' | 'left' | 'right';
export type GradualBlurCurve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface GradualBlurProps {
  position?: GradualBlurPosition;
  target?: 'parent' | 'page';
  height?: string | number;
  width?: string | number;
  strength?: number;
  layers?: number;
  curve?: GradualBlurCurve;
  exponential?: boolean;
  opacity?: number;
  saturation?: number;
  tint?: string;
  autoHide?: boolean;
  container?: Element | string | Ref<Element | null | undefined> | null;
  hoverIntensity?: number;
  duration?: number | string;
  easing?: string;
  zIndex?: number;
  className?: string;
  style?: StyleValue;
}

const props = withDefaults(defineProps<GradualBlurProps>(), {
  position: 'bottom',
  target: 'parent',
  height: '6rem',
  width: undefined,
  strength: 2,
  layers: 8,
  curve: 'linear',
  exponential: true,
  opacity: 1,
  saturation: 1,
  tint: 'transparent',
  autoHide: false,
  container: undefined,
  hoverIntensity: 1,
  duration: 0.3,
  easing: 'ease-out',
  zIndex: 1000,
  className: '',
  style: undefined
});

const CURVES: Record<string, (t: number) => number> = {
  linear: t => t,
  bezier: t => t * t * (3 - 2 * t),
  'ease-in': t => t * t,
  'ease-out': t => 1 - (1 - t) * (1 - t),
  'ease-in-out': t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
};

const DIRECTIONS: Record<string, string> = { top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' };

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const toLength = (value: string | number) => (typeof value === 'number' ? `${value}px` : value);

const toTime = (value: string | number) => (typeof value === 'number' ? `${value}s` : value);

const findScroller = (
  container: GradualBlurProps['container'],
  root: HTMLElement,
  target: string,
  vertical: boolean
): Element | Window | null => {
  if (container) {
    if (typeof container === 'string') return document.querySelector(container);
    return container instanceof Element ? container : (container.value ?? null);
  }
  if (target === 'page') return window;
  const parent = root.parentElement;
  if (!parent) return null;
  const scrolls = (node: Element) => {
    const style = getComputedStyle(node);
    return /(auto|scroll|overlay)/.test(vertical ? style.overflowY : style.overflowX);
  };
  const sibling = Array.from(parent.children).find(child => child !== root && scrolls(child));
  return sibling || (scrolls(parent) ? parent : null);
};

const rootRef = ref<HTMLDivElement | null>(null);
const edge = computed<GradualBlurPosition>(() => (DIRECTIONS[props.position] ? props.position : 'bottom'));
const vertical = computed(() => edge.value === 'top' || edge.value === 'bottom');

const stack = computed(() => {
  const count = Math.min(Math.max(Math.round(props.layers) || 1, 1), 16);
  const shape = CURVES[props.curve] || CURVES.linear;
  const maxBlur = Math.max(props.strength, 0) * 12;
  const level = (u: number) => {
    const t = shape(clamp01(u));
    return maxBlur * (props.exponential ? (Math.pow(2, 4 * t) - 1) / 15 : t);
  };
  const boost = Math.pow(Math.max(props.saturation, 0), 1 / count);
  const fade = `${toTime(props.duration)} ${props.easing}`;
  const direction = DIRECTIONS[edge.value];
  const steps: CSSProperties[] = [];
  for (let i = 0; i < count; i++) {
    const from = level(i / count);
    const to = level((i + 1) / count);
    const radius = Math.sqrt(Math.max(to * to - from * from, 0));
    const filter = [
      `blur(calc(${radius.toFixed(3)}px * var(--gradual-blur-reveal, 1) * var(--gradual-blur-hover, 1)))`,
      boost !== 1 ? `saturate(calc(1 + ${(boost - 1).toFixed(4)} * var(--gradual-blur-reveal, 1)))` : ''
    ]
      .filter(Boolean)
      .join(' ');
    const mask = `linear-gradient(${direction}, transparent ${((i / count) * 100).toFixed(2)}%, #000 ${(((i + 1) / count) * 100).toFixed(2)}%)`;
    steps.push({
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      backdropFilter: filter,
      WebkitBackdropFilter: filter,
      maskImage: mask,
      WebkitMaskImage: mask,
      opacity: props.opacity,
      transition: `backdrop-filter ${fade}, -webkit-backdrop-filter ${fade}`
    } as CSSProperties);
  }
  const stops = Array.from({ length: 9 }, (_, k) => {
    const u = k / 8;
    const t = shape(u);
    const alpha = t * t * t * (t * (t * 6 - 15) + 10);
    return `rgba(0, 0, 0, ${alpha.toFixed(3)}) ${(u * 100).toFixed(1)}%`;
  }).join(', ');
  const tintMask = `linear-gradient(${direction}, ${stops})`;
  const wash: CSSProperties | null =
    props.tint && props.tint !== 'transparent'
      ? ({
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: props.tint,
          maskImage: tintMask,
          WebkitMaskImage: tintMask,
          opacity: 'calc(var(--gradual-blur-reveal, 1) * min(var(--gradual-blur-hover, 1), 1))',
          transition: `opacity ${fade}`
        } as CSSProperties)
      : null;
  return { steps, wash };
});

let stopReveal: (() => void) | null = null;

const setupReveal = () => {
  stopReveal?.();
  stopReveal = null;
  const root = rootRef.value;
  if (!root) return;
  if (!props.autoHide) {
    root.style.removeProperty('--gradual-blur-reveal');
    return;
  }
  const isVertical = vertical.value;
  const scroller = findScroller(props.container, root, props.target, isVertical);
  if (!scroller) return;
  const element = scroller instanceof Element ? scroller : null;
  const start = edge.value === 'top' || edge.value === 'left';

  const update = () => {
    const page = document.documentElement;
    const offset = element
      ? isVertical
        ? element.scrollTop
        : element.scrollLeft
      : isVertical
        ? window.scrollY
        : window.scrollX;
    const limit = element
      ? isVertical
        ? element.scrollHeight - element.clientHeight
        : element.scrollWidth - element.clientWidth
      : isVertical
        ? page.scrollHeight - window.innerHeight
        : page.scrollWidth - window.innerWidth;
    const box = root.getBoundingClientRect();
    const reach = Math.max(isVertical ? box.height : box.width, 1);
    const room = start ? offset : limit - offset;
    root.style.setProperty('--gradual-blur-reveal', clamp01(room / reach).toFixed(3));
  };

  update();
  const source: Element | Window = element ?? window;
  source.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  const observer = element && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
  if (observer && element) {
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
  }
  stopReveal = () => {
    source.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
    observer?.disconnect();
  };
};

let stopHover: (() => void) | null = null;

const setupHover = () => {
  stopHover?.();
  stopHover = null;
  const root = rootRef.value;
  const hoverIntensity = props.hoverIntensity;
  if (!root || hoverIntensity === 1) return;
  let frame = 0;
  let inside = false;
  let point: { x: number; y: number } | null = null;

  const check = () => {
    frame = 0;
    if (!point) return;
    const box = root.getBoundingClientRect();
    const now = point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom;
    if (now === inside) return;
    inside = now;
    root.style.setProperty('--gradual-blur-hover', inside ? String(Math.max(hoverIntensity, 0)) : '1');
  };

  const onMove = (event: PointerEvent) => {
    point = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(check);
  };

  const onLeave = () => {
    point = null;
    inside = false;
    root.style.setProperty('--gradual-blur-hover', '1');
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  stopHover = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    root.style.removeProperty('--gradual-blur-hover');
  };
};

onMounted(() => {
  setupReveal();
  setupHover();
});

watch(
  () => [props.autoHide, props.container, props.target, edge.value, vertical.value],
  () => setupReveal(),
  { flush: 'post' }
);

watch(
  () => props.hoverIntensity,
  () => setupHover(),
  { flush: 'post' }
);

onBeforeUnmount(() => {
  stopReveal?.();
  stopHover?.();
  stopReveal = null;
  stopHover = null;
});

const rootStyle = computed<CSSProperties>(() => {
  const isVertical = vertical.value;
  const depth = toLength(isVertical ? props.height : (props.width ?? props.height));
  const span = isVertical && props.width != null ? toLength(props.width) : null;
  const rounded = props.target !== 'page' && !span;
  const corner = (a: string, b: string) => (rounded && (edge.value === a || edge.value === b) ? 'inherit' : undefined);

  return {
    position: props.target === 'page' ? 'fixed' : 'absolute',
    zIndex: props.zIndex,
    borderTopLeftRadius: corner('top', 'left'),
    borderTopRightRadius: corner('top', 'right'),
    borderBottomLeftRadius: corner('bottom', 'left'),
    borderBottomRightRadius: corner('bottom', 'right'),
    top: edge.value === 'bottom' ? undefined : 0,
    bottom: edge.value === 'top' ? undefined : 0,
    left: edge.value === 'right' ? undefined : 0,
    right: edge.value === 'left' ? undefined : 0,
    height: isVertical ? depth : undefined,
    width: isVertical ? (span ?? undefined) : depth,
    marginInline: span ? 'auto' : undefined
  };
});
</script>

<style>
.gradual-blur {
  pointer-events: none;
}
</style>
