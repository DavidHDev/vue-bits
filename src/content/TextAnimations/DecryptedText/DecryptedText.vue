<script lang="ts">
const FADE_FLOOR = 0.16;
const FADE_PEAK = 0.62;
const FADE_LEAD = 6;
const SETTLE = 'color 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)';

interface Frame {
  shown: string[];
  revealed: boolean[];
  tint: number[];
  dim: number[];
  squeeze: number[];
}

interface FontMetrics {
  font: string;
  spacing: number;
}

interface Run {
  forward: boolean;
  cycle: boolean;
  iteration: number;
  queue: (number | null)[];
}

interface RunOptions {
  from?: boolean[];
  cycle?: boolean;
  lead?: number;
}

type Point = { x: number; y: number };

type Group = string | { key: number; letters: number[] };

const isSpace = (char: string) => /\s/.test(char);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

const glyphWidths = new Map<string, Map<string, number>>();
let measureContext: CanvasRenderingContext2D | null = null;

const readFont = (node: Element): FontMetrics => {
  const style = window.getComputedStyle(node);
  return {
    font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
    spacing: parseFloat(style.letterSpacing) || 0
  };
};

const advance = (font: string, glyph: string): number => {
  let widths = glyphWidths.get(font);
  if (!widths) {
    widths = new Map<string, number>();
    glyphWidths.set(font, widths);
  }
  let width = widths.get(glyph);
  if (width === undefined) {
    measureContext = measureContext || document.createElement('canvas').getContext('2d');
    if (!measureContext) return 0;
    measureContext.font = font;
    width = measureContext.measureText(glyph).width;
    widths.set(glyph, width);
  }
  return width;
};

const flipFrames = (angle: number, opacity: number): Keyframe[] => [
  { transform: `perspective(4em) translateZ(-0.42em) rotateX(${angle}deg) translateZ(0.42em)`, opacity },
  { transform: 'perspective(4em) translateZ(-0.42em) rotateX(0deg) translateZ(0.42em)', opacity: 1 }
];
</script>

<script setup lang="ts">
import { Motion } from 'motion-v';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type ComponentPublicInstance,
  type CSSProperties
} from 'vue';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center' | 'random';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'inViewHover' | 'click';
  clickMode?: 'once' | 'toggle';
  effect?: 'scramble' | 'flip' | 'fade';
  scrambleColor?: string;
  loop?: boolean;
  loopDelay?: number;
  hoverRadius?: number;
}

const props = withDefaults(defineProps<DecryptedTextProps>(), {
  speed: 50,
  maxIterations: 10,
  sequential: false,
  revealDirection: 'start',
  useOriginalCharsOnly: false,
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className: '',
  parentClassName: '',
  encryptedClassName: '',
  animateOn: 'hover',
  clickMode: 'once',
  effect: 'scramble',
  scrambleColor: '',
  loop: false,
  loopDelay: 2000,
  hoverRadius: 0
});

const chars = computed(() => Array.from(String(props.text ?? '')));

const pool = computed(() => {
  const letters = chars.value.filter(char => !isSpace(char));
  const source = props.useOriginalCharsOnly ? Array.from(new Set(letters)) : Array.from(props.characters);
  return source.length ? source : letters;
});

const startsHidden = props.animateOn === 'click' || props.animateOn === 'view' || props.animateOn === 'inViewHover';
const hoverable = computed(() => props.animateOn === 'hover' || props.animateOn === 'inViewHover');
const local = computed(() => hoverable.value && props.hoverRadius > 0);
const step = computed(() => Math.max(16, props.speed));

const initialFrame = (): Frame => {
  const list = chars.value;
  const glyphs = pool.value;
  const revealed = list.map(char => !startsHidden || isSpace(char));
  return {
    shown: list.map((char, index) =>
      revealed[index] ? char : glyphs[((char.codePointAt(0) ?? 0) + index * 7) % glyphs.length]
    ),
    revealed,
    tint: revealed.map(shown => (shown ? 0 : 1)),
    dim: revealed.map(shown => (shown ? 1 : FADE_FLOOR)),
    squeeze: revealed.map(() => 1)
  };
};

const frame = shallowRef<Frame>(initialFrame());

const rootRef = ref<ComponentPublicInstance | null>(null);
const cells: (HTMLSpanElement | null)[] = [];
let centers: (Point | null)[] = [];
let mask: boolean[] = frame.value.revealed;
let heat: number[] = [];
let warmActive = false;
let pointer: Point | null = null;
let run: Run | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
let hold: ReturnType<typeof setTimeout> | undefined;
let pending: (() => void) | null = null;
let visible = true;
let target = !startsHidden;
let played = false;
let fontMetrics: FontMetrics | null = null;
let resizeObserver: ResizeObserver | null = null;
let viewCleanup: (() => void) | null = null;

const container = () => (rootRef.value?.$el as HTMLSpanElement | undefined) ?? null;

const setCell = (index: number, el: Element | ComponentPublicInstance | null) => {
  cells[index] = (el as HTMLSpanElement | null) ?? null;
};

const revealOrder = () => {
  const list = chars.value;
  const order: number[] = [];
  list.forEach((char, index) => {
    if (!isSpace(char)) order.push(index);
  });
  if (props.revealDirection === 'end') return order.reverse();
  if (props.revealDirection === 'center') {
    const middle = Math.floor(list.length / 2);
    return order.sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle));
  }
  if (props.revealDirection === 'random') {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  return order;
};

const fit = (index: number, glyph: string): number => {
  const node = container();
  if (!fontMetrics && node) fontMetrics = readFont(node);
  const metrics = fontMetrics;
  if (!metrics) return 1;
  const room = advance(metrics.font, chars.value[index] ?? glyph) + metrics.spacing;
  const need = advance(metrics.font, glyph) + metrics.spacing;
  return need > room + 0.01 ? Math.round(Math.max(0.05, room / need) * 1000) / 1000 : 1;
};

const paint = () => {
  const glyphs = pool.value;
  const ranks = run?.forward && props.sequential ? new Map(run.queue.map((index, rank) => [index, rank])) : null;
  const ramp = run?.forward && !props.sequential ? Math.min(1, run.iteration / Math.max(1, props.maxIterations)) : 0;
  const next: Frame = { shown: [], revealed: [], tint: [], dim: [], squeeze: [] };

  chars.value.forEach((char, index) => {
    const blank = isSpace(char);
    const hot = blank ? 0 : heat[index] || 0;
    const hidden = !blank && !mask[index];
    const scrambled = hidden || (hot > 0 && Math.random() < hot * 2);

    const glyph = scrambled ? glyphs[Math.floor(Math.random() * glyphs.length)] : char;
    next.revealed.push(!scrambled);
    next.shown.push(glyph);
    next.squeeze.push(scrambled ? fit(index, glyph) : 1);

    if (!scrambled) {
      next.tint.push(0);
      next.dim.push(1);
    } else if (!hidden) {
      const level = Math.min(1, hot * 1.5);
      next.tint.push(level);
      next.dim.push(1 - (1 - FADE_FLOOR) * level);
    } else {
      const rank = ranks?.get(index);
      const lift = rank === undefined ? ramp : Math.max(0, 1 - rank / FADE_LEAD);
      next.tint.push(1);
      next.dim.push(FADE_FLOOR + (FADE_PEAK - FADE_FLOOR) * lift);
    }
  });

  frame.value = next;
};

const refit = () => {
  const previous = frame.value;
  frame.value = {
    ...previous,
    squeeze: previous.shown.map((glyph, index) => (previous.revealed[index] ? 1 : fit(index, glyph)))
  };
};

const stopTicker = () => {
  clearInterval(timer);
  timer = undefined;
};

const ensureTicker = () => {
  if (timer) return;
  timer = setInterval(() => tick(), step.value);
};

const stopRun = () => {
  run = null;
  clearTimeout(hold);
  hold = undefined;
  pending = null;
};

const schedule = (task: () => void, delay: number) => {
  clearTimeout(hold);
  hold = setTimeout(() => {
    hold = undefined;
    if (visible) task();
    else pending = task;
  }, delay);
};

const startRun = (forward: boolean, { from, cycle = false, lead = 0 }: RunOptions = {}) => {
  stopRun();
  target = forward;
  if (from) mask = from;

  if (prefersReducedMotion()) {
    mask = chars.value.map(char => forward || isSpace(char));
    paint();
    return;
  }

  const current = mask;
  const order = forward ? revealOrder() : revealOrder().reverse();
  const queue = props.sequential ? order.filter(index => current[index] !== forward) : [];

  run = {
    forward,
    cycle,
    iteration: 0,
    queue: [...new Array<null>(lead).fill(null), ...queue]
  };
  paint();
  ensureTicker();
};

const finishRun = (finished: Run) => {
  if (!props.loop) return;
  if (finished.forward) {
    schedule(() => startRun(false, { cycle: true }), Math.max(0, props.loopDelay));
  } else if (finished.cycle) {
    startRun(true, { cycle: true, lead: props.sequential ? Math.max(2, Math.round(320 / step.value)) : 0 });
  }
};

const warm = () => {
  const node = container();
  const box = pointer && node ? node.getBoundingClientRect() : null;
  const cool = 1 / Math.max(1, props.maxIterations);
  let active = false;

  chars.value.forEach((char, index) => {
    if (isSpace(char)) return;
    let goal = 0;
    const center = centers[index];
    if (box && center && pointer) {
      const distance =
        Math.hypot(box.left + center.x - pointer.x, box.top + center.y - pointer.y) / Math.max(1, props.hoverRadius);
      if (distance < 1) goal = 1 - distance * distance * (3 - 2 * distance);
    }
    const value = Math.max((heat[index] || 0) - cool, goal);
    heat[index] = value > 0.001 ? value : 0;
    if (heat[index] > 0) active = true;
  });

  warmActive = active;
};

const tick = () => {
  const current = run;

  if (current) {
    current.iteration += 1;
    let next = mask;
    let done: boolean;
    const list = chars.value;

    if (props.sequential) {
      const index = current.queue.shift();
      if (index !== undefined && index !== null) {
        next = next.slice();
        next[index] = current.forward;
      }
      done = current.queue.length === 0;
    } else if (current.forward) {
      done = current.iteration >= props.maxIterations;
      if (done) next = list.map(() => true);
    } else {
      const shownIndices: number[] = [];
      next.forEach((shown, index) => {
        if (shown && !isSpace(list[index])) shownIndices.push(index);
      });
      const hideCount = Math.max(
        1,
        Math.ceil(list.filter(char => !isSpace(char)).length / Math.max(1, props.maxIterations))
      );
      next = next.slice();
      for (let i = 0; i < hideCount && shownIndices.length; i++) {
        next[shownIndices.splice(Math.floor(Math.random() * shownIndices.length), 1)[0]] = false;
      }
      done = shownIndices.length === 0 || current.iteration >= props.maxIterations;
      if (done) next = list.map(char => isSpace(char));
    }

    mask = next;
    if (done) {
      run = null;
      finishRun(current);
    }
  }

  if (local.value) warm();
  else warmActive = false;

  paint();
  if (!run && !warmActive) stopTicker();
};

const measure = () => {
  const node = container();
  if (!node) return;
  const box = node.getBoundingClientRect();
  centers = chars.value.map((char, index) => {
    const cell = cells[index];
    if (isSpace(char) || !cell) return null;
    const rect = cell.getBoundingClientRect();
    return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2 };
  });
};

const reset = () => {
  stopRun();
  played = false;
  const hidden =
    props.animateOn === 'click' ||
    ((props.animateOn === 'view' || props.animateOn === 'inViewHover') && !prefersReducedMotion());
  target = !hidden;
  mask = chars.value.map(char => !hidden || isSpace(char));
  heat = chars.value.map(() => 0);
  pointer = null;
  paint();
};

const observeView = () => {
  viewCleanup?.();
  viewCleanup = null;
  const viewTrigger = props.animateOn === 'view' || props.animateOn === 'inViewHover';
  const looping = props.loop;
  if (!viewTrigger && !looping) return;
  const node = container();
  if (!node || typeof IntersectionObserver === 'undefined') return;
  const observer = new IntersectionObserver(
    entries => {
      const isVisible = entries.some(entry => entry.isIntersecting);
      visible = isVisible;
      if (!isVisible) return;
      if (viewTrigger && !played) {
        played = true;
        startRun(true);
      }
      const resume = pending;
      pending = null;
      resume?.();
      if (!looping) observer.disconnect();
    },
    { threshold: 0.1 }
  );
  observer.observe(node);
  viewCleanup = () => {
    observer.disconnect();
    visible = true;
  };
};

watch([() => props.animateOn, chars], () => reset());

watch(step, () => {
  if (!timer) return;
  clearInterval(timer);
  timer = undefined;
  ensureTicker();
});

watch(
  () => props.loop,
  value => {
    if (value) return;
    clearTimeout(hold);
    hold = undefined;
    pending = null;
  }
);

watch([() => props.animateOn, () => props.loop, chars], () => observeView(), { flush: 'post' });

watch(
  frame,
  (next, previous) => {
    if (props.effect !== 'flip' || !previous || previous.shown === next.shown || prefersReducedMotion()) return;
    next.revealed.forEach((revealed, index) => {
      const node = cells[index];
      if (!node || typeof node.animate !== 'function' || isSpace(chars.value[index] ?? ' ')) return;
      if (!revealed) {
        node.animate(flipFrames(58 + Math.random() * 26, 0.3), {
          duration: Math.min(step.value * 0.92, 240),
          easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)'
        });
      } else if (previous.revealed[index] === false) {
        node.animate(flipFrames(90, 0), {
          duration: Math.min(Math.max(step.value * 7, 360), 760),
          easing: 'cubic-bezier(0.34, 1.45, 0.64, 1)'
        });
      }
    });
  },
  { flush: 'post' }
);

onMounted(() => {
  reset();
  const node = container();
  if (node && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      const metrics = readFont(node);
      glyphWidths.delete(metrics.font);
      fontMetrics = metrics;
      refit();
    });
    resizeObserver.observe(node);
  }
  observeView();
});

onBeforeUnmount(() => {
  clearInterval(timer);
  clearTimeout(hold);
  resizeObserver?.disconnect();
  viewCleanup?.();
});

const trackPointer = (event: MouseEvent) => {
  if (prefersReducedMotion()) return;
  if (!pointer) measure();
  pointer = { x: event.clientX, y: event.clientY };
  ensureTicker();
};

const handleMouseEnter = (event: MouseEvent) => {
  if (local.value) {
    trackPointer(event);
    return;
  }
  if (run) return;
  startRun(true, { from: chars.value.map(char => isSpace(char)) });
};

const handleMouseMove = (event: MouseEvent) => {
  if (local.value) trackPointer(event);
};

const handleMouseLeave = () => {
  if (local.value) {
    pointer = null;
    return;
  }
  stopRun();
  target = true;
  mask = chars.value.map(() => true);
  paint();
  if (props.loop && props.animateOn === 'inViewHover') {
    schedule(() => startRun(false, { cycle: true }), Math.max(0, props.loopDelay));
  }
};

const handleClick = () => {
  if (props.clickMode === 'toggle') {
    startRun(!target);
    return;
  }
  if (!target) startRun(true);
};

const groups = computed(() => {
  const result: Group[] = [];
  let word: { key: number; letters: number[] } | null = null;
  chars.value.forEach((char, index) => {
    if (isSpace(char)) {
      result.push(char);
      word = null;
      return;
    }
    if (!word) {
      word = { key: index, letters: [] };
      result.push(word);
    }
    word.letters.push(index);
  });
  return result;
});

const tinted = computed(() => Boolean(props.scrambleColor));
const fading = computed(() => props.effect === 'fade');
const flipping = computed(() => props.effect === 'flip');
const settles = computed(() => tinted.value || fading.value);

const glyphStyle = (index: number): CSSProperties | undefined => {
  const squeeze = frame.value.squeeze[index] ?? 1;
  return squeeze < 1 ? { transform: `scaleX(${squeeze})` } : undefined;
};

const cellClass = (revealed: boolean) =>
  [revealed && !flipping.value ? '' : 'relative inline-block', revealed ? props.className : props.encryptedClassName]
    .filter(Boolean)
    .join(' ');

const cellStyle = (index: number, revealed: boolean): CSSProperties => {
  const style: CSSProperties = {};
  if (settles.value) style.transition = revealed ? SETTLE : `color 0.12s linear, opacity ${step.value}ms linear`;
  if (tinted.value && !revealed) {
    const amount = Math.round((frame.value.tint[index] ?? 1) * 100);
    style.color =
      amount >= 100 ? props.scrambleColor : `color-mix(in srgb, ${props.scrambleColor} ${amount}%, currentColor)`;
  }
  if (fading.value) style.opacity = revealed ? 1 : (frame.value.dim[index] ?? FADE_FLOOR);
  return style;
};

const animateListeners = computed(() =>
  hoverable.value
    ? { mouseenter: handleMouseEnter, mousemove: handleMouseMove, mouseleave: handleMouseLeave }
    : props.animateOn === 'click'
      ? { click: handleClick }
      : {}
);
</script>

<template>
  <Motion
    ref="rootRef"
    as="span"
    :class="`inline-block whitespace-pre-wrap ${parentClassName}`"
    v-on="animateListeners"
  >
    <span class="sr-only">{{ chars.join('') }}</span>

    <span aria-hidden="true">
      <template v-for="(group, groupIndex) in groups" :key="typeof group === 'string' ? `s${groupIndex}` : group.key">
        <template v-if="typeof group === 'string'">{{ group }}</template>
        <span v-else class="whitespace-nowrap">
          <span
            v-for="index in group.letters"
            :key="index"
            :ref="el => setCell(index, el)"
            :class="cellClass(frame.revealed[index] ?? true)"
            :style="cellStyle(index, frame.revealed[index] ?? true)"
          >
            <template v-if="frame.revealed[index] ?? true">{{ chars[index] }}</template>
            <template v-else>
              <span class="invisible">{{ chars[index] }}</span>
              <span class="absolute top-0 left-1/2 -translate-x-1/2" :style="glyphStyle(index)">
                {{ frame.shown[index] ?? chars[index] }}
              </span>
            </template>
          </span>
        </span>
      </template>
    </span>
  </Motion>
</template>
