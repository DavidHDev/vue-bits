<script lang="ts">
import { defineComponent, h, type PropType, type StyleValue } from 'vue';

export const ScrollStackItem = defineComponent({
  name: 'ScrollStackItem',
  props: {
    itemClassName: {
      type: String,
      default: ''
    },
    style: {
      type: [String, Object, Array] as PropType<StyleValue>,
      default: undefined
    }
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: `scroll-stack-card ${props.itemClassName}`.trim(), style: props.style }, [
        slots.default?.(),
        h('span', { class: 'scroll-stack-card__shade', 'aria-hidden': 'true' })
      ]);
  }
});
</script>

<script setup lang="ts">
import {
  Comment,
  Fragment,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  useSlots,
  useTemplateRef,
  watch,
  type VNode
} from 'vue';

interface ScrollStackProps {
  className?: string;
  itemDistance?: number;
  itemStackDistance?: number;
  stackPosition?: number | string;
  itemScale?: number;
  baseScale?: number;
  dimAmount?: number;
  blurAmount?: number;
  tiltAmount?: number;
  rotationAmount?: number;
  holdDistance?: number;
  smoothScroll?: boolean;
  snap?: boolean;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const props = withDefaults(defineProps<ScrollStackProps>(), {
  className: '',
  itemDistance: 100,
  itemStackDistance: 24,
  stackPosition: '15%',
  itemScale: 0.05,
  baseScale: 0.8,
  dimAmount: 0.2,
  blurAmount: 0,
  tiltAmount: 0,
  rotationAmount: 0,
  holdDistance: 200,
  smoothScroll: true,
  snap: false,
  useWindowScroll: false
});

const slots = useSlots();
const rootRef = useTemplateRef<HTMLDivElement>('rootRef');
const innerRef = useTemplateRef<HTMLDivElement>('innerRef');
const endRef = useTemplateRef<HTMLDivElement>('endRef');

const resolveOffset = (value: number | string, size: number) => {
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (text.endsWith('%')) return (parseFloat(text) / 100) * size;
  return parseFloat(text) || 0;
};

const toLength = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const scrollsInside = (node: Element | null, stop: Element, delta: number) => {
  for (let element: Element | null = node; element && element !== stop; element = element.parentElement) {
    if (element.scrollHeight <= element.clientHeight + 1) continue;
    const overflow = getComputedStyle(element).overflowY;
    if (overflow !== 'auto' && overflow !== 'scroll') continue;
    if (delta > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0) {
      return true;
    }
  }
  return false;
};

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap(node => {
    if (node.type === Comment) return [];
    if (node.type === Fragment && Array.isArray(node.children)) return flatten(node.children as VNode[]);
    return [node];
  });

const entries = () => {
  const items = flatten(slots.default?.() ?? []);
  return items.map((node, index) => {
    const gap = props.itemDistance - (items.length - index) * props.itemStackDistance;
    return {
      node,
      key: (node.key ?? index) as PropertyKey,
      spacer: { height: `${Math.max(0, gap)}px`, marginTop: `${Math.min(0, gap)}px` },
      slot: {
        top: `calc(${toLength(props.stackPosition)} + ${index * props.itemStackDistance}px)`,
        marginBottom: `${(items.length - 1 - index) * props.itemStackDistance}px`,
        zIndex: index + 1
      }
    };
  });
};

let scheduleUpdate: (() => void) | null = null;
let teardown: (() => void) | null = null;

const setup = () => {
  const root = rootRef.value;
  const inner = innerRef.value;
  const end = endRef.value;
  if (!root || !inner || !end) return;

  const windowed = props.useWindowScroll;
  const target: Window | HTMLElement = windowed ? window : root;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cache = new Map<string, string | number>();
  let frame = 0;
  let glide = 0;
  let rest = 0;
  let complete = false;
  let gliding = false;
  let pressed = false;
  let current = 0;
  let goal = 0;
  let written = 0;
  let last = 0;
  let points: number[] = [];
  let reach = 0;

  const readScroll = () => (windowed ? window.scrollY : root.scrollTop);
  const maxScroll = () =>
    windowed ? document.documentElement.scrollHeight - window.innerHeight : root.scrollHeight - root.clientHeight;
  const writeScroll = (value: number) => {
    written = value;
    target.scrollTo({ top: value, behavior: 'instant' });
  };

  const write = <T extends string | number>(key: string, value: T, apply: (value: T) => void) => {
    if (cache.get(key) === value) return false;
    cache.set(key, value);
    apply(value);
    return true;
  };

  const update = () => {
    frame = 0;
    const settings = props;
    const slotEls = (Array.from(inner.children) as HTMLElement[]).filter(child =>
      child.hasAttribute('data-stack-slot')
    );
    if (!slotEls.length) return;

    const viewHeight = windowed ? window.innerHeight : root.clientHeight;
    const viewTop = windowed ? 0 : root.getBoundingClientRect().top + root.clientTop;
    const stackTop = resolveOffset(settings.stackPosition, viewHeight);
    const offset = settings.itemStackDistance;
    const heights = slotEls.map(slot => slot.offsetHeight);
    const tops = slotEls.map(slot => slot.getBoundingClientRect().top);
    const lastPin = stackTop + (slotEls.length - 1) * offset;
    const padTop = windowed ? 0 : stackTop;
    const endHeight =
      settings.holdDistance + (windowed ? 0 : Math.max(0, viewHeight - lastPin - heights[heights.length - 1]));

    let moved = write('padTop', padTop, value => {
      inner.style.paddingTop = `${value}px`;
    });
    moved =
      write('endHeight', endHeight, value => {
        end.style.height = `${value}px`;
      }) || moved;

    let flow = inner.getBoundingClientRect().top - viewTop + readScroll() + padTop;
    points = heights.map((height, i) => {
      const point = flow - stackTop - i * offset;
      flow += height + settings.itemDistance;
      return point;
    });
    reach = Math.max(40, (heights[0] + settings.itemDistance - offset) / 2);

    const depths = slotEls.map(() => 0);
    let lastCover = 0;
    for (let j = 1; j < slotEls.length; j++) {
      const pinBefore = viewTop + stackTop + (j - 1) * offset;
      const start = pinBefore + heights[j - 1];
      const span = Math.max(1, start - pinBefore - offset);
      const cover = Math.min(1, Math.max(0, (start - tops[j]) / span));
      for (let i = 0; i < j; i++) depths[i] += cover;
      lastCover = cover;
    }

    const dimStep = Math.min(Math.max(settings.dimAmount, 0), 1);
    slotEls.forEach((slot, i) => {
      const card = slot.firstElementChild as HTMLElement | null;
      if (!card) return;
      const depth = depths[i];
      const lean = Math.min(depth, 1);
      const scale = Math.max(Math.min(settings.baseScale, 1), 1 - depth * settings.itemScale);
      const tilt = -lean * settings.tiltAmount;
      const turn = lean * settings.rotationAmount * (i % 2 ? -1 : 1);
      const blur = depth * settings.blurAmount;
      const dim = 1 - Math.pow(1 - dimStep, depth);
      const transform =
        depth < 0.0005
          ? ''
          : `perspective(1200px) rotateX(${tilt.toFixed(2)}deg) rotate(${turn.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      write(`transform${i}`, transform, value => {
        card.style.transform = value;
      });
      write(`filter${i}`, blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : '', value => {
        card.style.filter = value;
      });
      write(`dim${i}`, dim.toFixed(3), value => {
        card.style.setProperty('--scroll-stack-dim', value);
      });
    });

    const done = slotEls.length > 1 && lastCover >= 0.999;
    if (done !== complete) {
      complete = done;
      if (done) settings.onStackComplete?.();
    }

    if (moved) schedule();
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const step = (now: number) => {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (Math.abs(readScroll() - written) > 2) {
      gliding = false;
      glide = 0;
      settleSoon();
      return;
    }
    current += (goal - current) * (1 - Math.pow(0.9, dt * 60));
    if (Math.abs(goal - current) < 0.5) current = goal;
    writeScroll(current);
    if (current === goal) {
      gliding = false;
      glide = 0;
      settleSoon();
      return;
    }
    glide = requestAnimationFrame(step);
  };

  const glideTo = (value: number) => {
    goal = Math.min(Math.max(value, 0), maxScroll());
    if (motion.matches) {
      writeScroll(goal);
      return;
    }
    if (gliding) return;
    gliding = true;
    current = readScroll();
    written = current;
    last = performance.now();
    glide = requestAnimationFrame(step);
  };

  const settle = () => {
    rest = 0;
    if (!props.snap || gliding || pressed || !points.length) return;
    const now = readScroll();
    const nearest = points.reduce((best, point) => (Math.abs(point - now) < Math.abs(best - now) ? point : best));
    const gap = Math.abs(nearest - now);
    if (gap > 1 && gap < reach) glideTo(nearest);
  };

  const settleSoon = () => {
    window.clearTimeout(rest);
    rest = window.setTimeout(settle, 140);
  };

  const onScroll = () => {
    schedule();
    if (!gliding) settleSoon();
  };

  const onWheel = (input: Event) => {
    const event = input as WheelEvent;
    if (!props.smoothScroll || motion.matches || event.defaultPrevented || event.ctrlKey) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const page = windowed ? window.innerHeight : root.clientHeight;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? page : 1);
    if (!delta || scrollsInside(event.target as Element | null, windowed ? document.body : root, delta)) return;
    const base = gliding ? goal : readScroll();
    if ((delta < 0 && base <= 0) || (delta > 0 && base >= maxScroll() - 0.5)) return;
    event.preventDefault();
    window.clearTimeout(rest);
    glideTo(base + delta);
  };

  const onPress = () => {
    pressed = true;
    window.clearTimeout(rest);
  };

  const onRelease = () => {
    if (!pressed) return;
    pressed = false;
    settleSoon();
  };

  const observer = new ResizeObserver(schedule);
  observer.observe(root);
  observer.observe(inner);
  target.addEventListener('scroll', onScroll, { passive: true });
  target.addEventListener('wheel', onWheel, { passive: false });
  target.addEventListener('pointerdown', onPress, { passive: true });
  window.addEventListener('pointerup', onRelease, { passive: true });
  window.addEventListener('pointercancel', onRelease, { passive: true });
  window.addEventListener('resize', schedule);
  scheduleUpdate = schedule;
  update();

  teardown = () => {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(glide);
    window.clearTimeout(rest);
    observer.disconnect();
    target.removeEventListener('scroll', onScroll);
    target.removeEventListener('wheel', onWheel);
    target.removeEventListener('pointerdown', onPress);
    window.removeEventListener('pointerup', onRelease);
    window.removeEventListener('pointercancel', onRelease);
    window.removeEventListener('resize', schedule);
    scheduleUpdate = null;
  };
};

const cleanup = () => {
  teardown?.();
  teardown = null;
};

onMounted(setup);
onUpdated(() => scheduleUpdate?.());
onBeforeUnmount(cleanup);

watch(
  () => props.useWindowScroll,
  () => {
    cleanup();
    setup();
  },
  { flush: 'post' }
);

watch(
  () => [
    props.itemDistance,
    props.itemStackDistance,
    props.stackPosition,
    props.itemScale,
    props.baseScale,
    props.dimAmount,
    props.blurAmount,
    props.tiltAmount,
    props.rotationAmount,
    props.holdDistance,
    props.smoothScroll,
    props.snap
  ],
  () => scheduleUpdate?.(),
  { flush: 'post' }
);
</script>

<template>
  <div
    ref="rootRef"
    :class="`scroll-stack ${useWindowScroll ? 'scroll-stack--window' : 'scroll-stack--contained'} ${className}`.trim()"
  >
    <div ref="innerRef" class="scroll-stack__inner">
      <template v-for="(entry, index) in entries()" :key="entry.key">
        <div v-if="index > 0" aria-hidden="true" :style="entry.spacer" />
        <div data-stack-slot="" class="scroll-stack__slot" :style="entry.slot">
          <component :is="entry.node" />
        </div>
      </template>
      <div ref="endRef" class="scroll-stack__end" aria-hidden="true" />
    </div>
  </div>
</template>

<style>
.scroll-stack {
  position: relative;
  width: 100%;
}

.scroll-stack--contained {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.scroll-stack__inner {
  position: relative;
  padding-inline: clamp(1rem, 6%, 5rem);
}

.scroll-stack__slot {
  position: sticky;
}

.scroll-stack-card {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 20rem;
  padding: 2.5rem;
  border-radius: 28px;
  background: light-dark(#ffffff, #18181b);
  color: light-dark(#18181b, #fafafa);
  box-shadow:
    0 0 0 1px light-dark(rgb(0 0 0 / 0.06), rgb(255 255 255 / 0.08)),
    0 -12px 40px -16px rgb(0 0 0 / 0.35),
    0 24px 48px -24px rgb(0 0 0 / 0.4);
  transform-origin: 50% 0;
  will-change: transform;
}

.scroll-stack-card__shade {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #000;
  opacity: var(--scroll-stack-dim, 0);
  pointer-events: none;
}
</style>
