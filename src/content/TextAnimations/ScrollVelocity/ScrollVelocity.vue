<template>
  <section :style="sectionStyle" @pointerenter="setHovered(true)" @pointerleave="setHovered(false)">
    <div
      v-for="(text, index) in texts"
      :key="index"
      :class="parallaxClassName"
      :style="parallaxStyles"
      @pointerdown="event => handlePointerDown(event, index)"
      @pointermove="event => handlePointerMove(event, index)"
      @pointerup="event => handlePointerUp(event, index)"
      @pointercancel="event => handlePointerUp(event, index)"
      @click.capture="event => handleClickCapture(event, index)"
    >
      <div :ref="el => setScroller(el, index)" :class="scrollerClassName" :style="scrollerStyles(index)">
        <span
          v-for="copy in numCopies"
          :key="copy"
          :ref="copy === 1 ? el => setCopy(el, index) : undefined"
          :class="className"
          :aria-hidden="copy > 1 ? true : undefined"
          :style="!separator && gap > 0 ? { paddingRight: `${gap}px` } : undefined"
        >
          <CopyContent :text="text" :separator="separator" :gap="gap" />
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, watch, type CSSProperties, type FunctionalComponent } from 'vue';
import {
  attachSpring,
  motionValue,
  transform,
  useAnimationFrame,
  useReducedMotion,
  useScroll,
  useVelocity,
  type MotionValue
} from 'motion-v';

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface ScrollVelocityProps {
  scrollContainerRef?: HTMLElement | null;
  texts?: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: CSSProperties;
  scrollerStyle?: CSSProperties;
  separator?: string;
  pauseOnHover?: boolean;
  fadeEdges?: boolean;
  skewWithVelocity?: number;
  scaleWithVelocity?: number;
  outlineAlternate?: boolean;
  gap?: number;
  fontSize?: number | string;
  fontWeight?: number | string;
  color?: string;
  draggable?: boolean;
}

interface Row {
  baseX: MotionValue<number>;
  skewX: MotionValue<number>;
  scaleY: MotionValue<number>;
  directionFactor: number;
  pace: number;
  fling: number;
  drag: { active: boolean; pointerId: number; lastX: number; lastTime: number; velocity: number; travel: number };
  copyWidth: number;
  copy: HTMLElement | null;
  scroller: HTMLElement | null;
  transform: string;
}

const props = withDefaults(defineProps<ScrollVelocityProps>(), {
  scrollContainerRef: null,
  texts: () => [],
  velocity: 100,
  className: '',
  damping: 50,
  stiffness: 400,
  numCopies: 6,
  velocityMapping: () => ({ input: [0, 1000], output: [0, 5] }),
  parallaxClassName: 'parallax',
  scrollerClassName: 'scroller',
  parallaxStyle: undefined,
  scrollerStyle: undefined,
  separator: '',
  pauseOnHover: false,
  fadeEdges: false,
  skewWithVelocity: 0,
  scaleWithVelocity: 0,
  outlineAlternate: false,
  gap: 0,
  fontSize: undefined,
  fontWeight: undefined,
  color: undefined,
  draggable: false
});

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const FADE_STEPS = Array.from({ length: 9 }, (_, i) => i / 8);

const FADE_MASK = `linear-gradient(to right, ${[
  ...FADE_STEPS.map(t => `rgba(0, 0, 0, ${smootherstep(t).toFixed(3)}) ${(t * 12).toFixed(1)}%`),
  ...FADE_STEPS.map(t => `rgba(0, 0, 0, ${smootherstep(1 - t).toFixed(3)}) ${(88 + t * 12).toFixed(1)}%`)
].join(', ')})`;

const OUTLINE_STYLE: CSSProperties = {
  WebkitTextFillColor: 'transparent',
  WebkitTextStroke: 'max(1px, 0.028em) currentColor'
};

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

let hovered = false;

const setHovered = (value: boolean) => {
  hovered = value;
};

const CopyContent: FunctionalComponent<{ text: string; separator: string; gap: number }> = ({
  text,
  separator,
  gap
}) => [
  `${text}\u00a0`,
  ...(separator ? [h('span', { style: gap > 0 ? { margin: `0 ${gap / 2}px` } : undefined }, separator), '\u00a0'] : [])
];

const rows: Row[] = [];

const getRow = (index: number): Row => {
  if (!rows[index]) {
    rows[index] = {
      baseX: motionValue(0),
      skewX: motionValue(0),
      scaleY: motionValue(1),
      directionFactor: 1,
      pace: 1,
      fling: 0,
      drag: { active: false, pointerId: -1, lastX: 0, lastTime: 0, velocity: 0, travel: 0 },
      copyWidth: 0,
      copy: null,
      scroller: null,
      transform: ''
    };
  }
  return rows[index];
};

const scrollContainer = computed(() => props.scrollContainerRef ?? undefined);
const { scrollY } = useScroll(props.scrollContainerRef ? { container: scrollContainer } : {});
const scrollVelocity = useVelocity(scrollY);
const smoothVelocity = motionValue(scrollVelocity.get());
const mapVelocity = computed(() =>
  transform(props.velocityMapping?.input || [0, 1000], props.velocityMapping?.output || [0, 5], { clamp: false })
);
const reduceMotion = useReducedMotion();

let detachSpring: (() => void) | null = null;

watch(
  () => [props.damping, props.stiffness],
  ([damping, stiffness]) => {
    detachSpring?.();
    detachSpring = attachSpring(smoothVelocity, scrollVelocity, { damping, stiffness });
  },
  { immediate: true }
);

let observer: ResizeObserver | null = null;
const observed = new Map<HTMLElement, number>();

const measure = (element: HTMLElement, width: number) => {
  const index = observed.get(element);
  if (index === undefined) return;
  getRow(index).copyWidth = width;
  paint(index);
};

const updateWidths = () => {
  observed.forEach((_, element) => measure(element, element.offsetWidth));
};

const setCopy = (el: unknown, index: number) => {
  const row = getRow(index);
  const element = el instanceof HTMLElement ? el : null;
  if (row.copy === element) return;
  if (row.copy) {
    observer?.unobserve(row.copy);
    observed.delete(row.copy);
  }
  row.copy = element;
  if (!element) return;
  observed.set(element, index);
  if (observer) {
    observer.observe(element);
  } else if (typeof window !== 'undefined') {
    measure(element, element.offsetWidth);
  }
};

const setScroller = (el: unknown, index: number) => {
  const row = getRow(index);
  row.scroller = el instanceof HTMLElement ? el : null;
  row.transform = '';
  paint(index);
};

const paint = (index: number) => {
  const row = rows[index];
  if (!row || !row.scroller) return;
  const x = row.copyWidth === 0 ? 0 : wrap(-row.copyWidth, 0, row.baseX.get());
  const skew = row.skewX.get();
  const scale = row.scaleY.get();
  const parts: string[] = [];
  if (x !== 0) parts.push(`translateX(${x}px)`);
  if (scale !== 1) parts.push(`scaleY(${scale})`);
  if (skew !== 0) parts.push(`skewX(${skew}deg)`);
  const next = parts.join(' ') || 'none';
  if (next !== row.transform) {
    row.transform = next;
    row.scroller.style.transform = next;
  }
};

const step = (index: number, delta: number) => {
  const row = getRow(index);
  const baseVelocity = index % 2 !== 0 ? -props.velocity : props.velocity;
  const grab = row.drag;
  const seconds = Math.min(delta, 64) / 1000;
  const targetPace = grab.active || (props.pauseOnHover && hovered) ? 0 : 1;
  row.pace += (targetPace - row.pace) * (1 - Math.exp(-delta / 150));

  const velocityFactor = mapVelocity.value(smoothVelocity.get());

  let moveBy = row.directionFactor * baseVelocity * (delta / 1000);

  if (velocityFactor < 0) {
    row.directionFactor = -1;
  } else if (velocityFactor > 0) {
    row.directionFactor = 1;
  }

  moveBy += row.directionFactor * moveBy * velocityFactor;
  let travel = moveBy * row.pace;

  if (!grab.active && row.fling !== 0) {
    travel += row.fling * seconds;
    row.fling *= Math.exp(-delta / 420);
    if (Math.abs(row.fling) < 4) row.fling = 0;
  }

  row.baseX.set(row.baseX.get() + travel);

  const skewWithVelocity = props.skewWithVelocity;
  const scaleWithVelocity = props.scaleWithVelocity;
  if (!skewWithVelocity && !scaleWithVelocity && row.skewX.get() === 0 && row.scaleY.get() === 1) return;

  const thrown = grab.active ? grab.velocity : row.fling;
  const scrollSurge = Math.tanh(Math.abs(smoothVelocity.get()) / 1600) * row.pace;
  const throwSurge = Math.tanh(Math.abs(thrown) / 2000);
  const surge = Math.max(scrollSurge, throwSurge);
  const heading =
    throwSurge > scrollSurge ? Math.sign(thrown) : Math.sign(travel) || row.directionFactor * Math.sign(baseVelocity);
  const ease = 1 - Math.exp(-delta / 110);
  const nextSkew = row.skewX.get() + (-heading * skewWithVelocity * surge - row.skewX.get()) * ease;
  const nextScale = row.scaleY.get() + (1 + scaleWithVelocity * surge - row.scaleY.get()) * ease;
  row.skewX.set(Math.abs(nextSkew) < 0.01 && !skewWithVelocity ? 0 : nextSkew);
  row.scaleY.set(Math.abs(nextScale - 1) < 0.0005 && !scaleWithVelocity ? 1 : nextScale);
};

useAnimationFrame((_t, delta) => {
  const count = props.texts.length;
  if (!reduceMotion.value) {
    for (let index = 0; index < count; index++) step(index, delta);
  }
  for (let index = 0; index < count; index++) paint(index);
});

const handlePointerDown = (event: PointerEvent, index: number) => {
  if (!props.draggable || (event.pointerType === 'mouse' && event.button !== 0)) return;
  const row = getRow(index);
  const grab = row.drag;
  const target = event.currentTarget as HTMLElement;
  grab.active = true;
  grab.pointerId = event.pointerId;
  grab.lastX = event.clientX;
  grab.lastTime = event.timeStamp;
  grab.velocity = 0;
  grab.travel = 0;
  row.fling = 0;
  target.setPointerCapture?.(event.pointerId);
  target.style.cursor = 'grabbing';
};

const handlePointerMove = (event: PointerEvent, index: number) => {
  const row = getRow(index);
  const grab = row.drag;
  if (!props.draggable || !grab.active || event.pointerId !== grab.pointerId) return;
  const dx = event.clientX - grab.lastX;
  const dt = Math.max(event.timeStamp - grab.lastTime, 1);
  grab.lastX = event.clientX;
  grab.lastTime = event.timeStamp;
  grab.travel += Math.abs(dx);
  row.baseX.set(row.baseX.get() + dx);
  grab.velocity += ((dx / dt) * 1000 - grab.velocity) * (1 - Math.exp(-dt / 50));
};

const handlePointerUp = (event: PointerEvent, index: number) => {
  const row = getRow(index);
  const grab = row.drag;
  if (!props.draggable || !grab.active || event.pointerId !== grab.pointerId) return;
  const target = event.currentTarget as HTMLElement;
  grab.active = false;
  const resting = event.timeStamp - grab.lastTime > 90;
  row.fling = resting ? 0 : Math.max(-5000, Math.min(5000, grab.velocity));
  grab.velocity = 0;
  if (target.hasPointerCapture?.(event.pointerId)) {
    target.releasePointerCapture(event.pointerId);
  }
  target.style.cursor = 'grab';
};

const handleClickCapture = (event: MouseEvent, index: number) => {
  if (!props.draggable) return;
  if (getRow(index).drag.travel > 6) {
    event.preventDefault();
    event.stopPropagation();
  }
};

const sectionStyle = computed<CSSProperties>(() => ({
  width: '100%',
  ...(props.fadeEdges ? { WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK } : {})
}));

const parallaxStyles = computed<CSSProperties>(() => ({
  ...(props.draggable ? { cursor: 'grab', userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'pan-y' } : {}),
  ...props.parallaxStyle
}));

const scrollerStyles = (index: number): CSSProperties => ({
  ...(props.fontSize !== undefined
    ? { fontSize: typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize, lineHeight: 1 }
    : {}),
  ...(props.fontWeight !== undefined ? { fontWeight: props.fontWeight } : {}),
  ...(props.color ? { color: props.color } : {}),
  ...(props.outlineAlternate && index % 2 !== 0 ? OUTLINE_STYLE : {}),
  ...props.scrollerStyle
});

onMounted(() => {
  if (typeof ResizeObserver === 'undefined') {
    updateWidths();
    window.addEventListener('resize', updateWidths);
    return;
  }
  observer = new ResizeObserver(entries => {
    entries.forEach(entry => {
      measure(entry.target as HTMLElement, entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width);
    });
  });
  observed.forEach((_, element) => observer?.observe(element));
});

onBeforeUnmount(() => {
  detachSpring?.();
  observer?.disconnect();
  window.removeEventListener('resize', updateWidths);
});
</script>

<style>
.parallax {
  position: relative;
  overflow: hidden;
}

.scroller {
  display: flex;
  white-space: nowrap;
  text-align: center;
  font-family: sans-serif;
  font-size: 2.25rem;
  font-weight: bold;
  letter-spacing: -0.02em;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.scroller span {
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .scroller {
    font-size: 5rem;
    line-height: 5rem;
  }
}
</style>
