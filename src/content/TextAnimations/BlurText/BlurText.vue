<template>
  <MotionConfig reduced-motion="user">
    <p
      ref="rootRef"
      :class="['blur-text flex flex-wrap', trigger === 'click' ? 'cursor-pointer' : '', className]"
      :style="{ color }"
      @pointerenter="handleRootEnter"
      @click="handleRootClick"
    >
      <span class="sr-only select-none">{{ text }}</span>
      <span
        v-for="(indices, w) in groups"
        :key="`word-${w}`"
        class="inline-flex"
        :style="wordStyle(w)"
        @pointerenter="handleWordEnter(w)"
        @pointerleave="handleWordLeave"
      >
        <Motion
          v-for="index in indices"
          :key="pieces[index].key"
          as="span"
          aria-hidden="true"
          class="inline-block will-change-[transform,filter,opacity]"
          :style="pieceStyleFor(index)"
          :initial="firstPhase === 'rest' ? false : fromSnapshot"
          :animate="target"
          :transition="transitionFor(index)"
        >
          {{ pieces[index].content }}
        </Motion>
      </span>
    </p>
  </MotionConfig>
</template>

<script setup lang="ts">
import { Motion, MotionConfig, type Easing, type Transition } from 'motion-v';
import { computed, ref, useTemplateRef, watch, type CSSProperties } from 'vue';

type Snapshot = Record<string, string | number>;
type Keyframes = Record<string, Array<string | number>>;
type Phase = 'from' | 'in' | 'out' | 'rest';

export type BlurTextEffect = 'blur' | 'zoom' | 'tilt' | 'focus' | 'drift';
export type BlurTextStaggerFrom = 'start' | 'center' | 'end' | 'random';
export type BlurTextTrigger = 'view' | 'load' | 'hover' | 'click';

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Snapshot;
  animationTo?: Snapshot[];
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
  blur?: number;
  distance?: number;
  effect?: BlurTextEffect;
  staggerFrom?: BlurTextStaggerFrom;
  trigger?: BlurTextTrigger;
  loop?: boolean;
  loopDelay?: number;
  color?: string;
  fromColor?: string;
  focusOnHover?: boolean;
};

interface EffectConfig {
  from: Snapshot;
  steps: Snapshot[];
  exit: Snapshot;
  times: number[];
  fade: Easing;
  bounce: number | null;
  settle: number;
  origin?: { originX: number; originY: number };
  exitEase: Easing;
}

interface Piece {
  word: number;
  content: string;
  key: string;
}

const AXES: Record<NonNullable<BlurTextProps['direction']>, ['x' | 'y', number]> = {
  top: ['y', -1],
  bottom: ['y', 1],
  left: ['x', -1],
  right: ['x', 1]
};

const EASE_OUT: Easing = [0.33, 1, 0.68, 1];
const EASE_IN_OUT: Easing = [0.65, 0, 0.35, 1];
const EASE_IN: Easing = [0.55, 0, 0.9, 0.45];
const CSS_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const MOVE_KEYS = ['x', 'y', 'scale', 'rotateX', 'rotateY', 'skewX'];
const INSTANT: Transition = { duration: 0 };

const blurTo = (px: number) => `blur(${Math.max(0, px)}px)`;

const buildEffect = (
  effect: BlurTextEffect,
  direction: NonNullable<BlurTextProps['direction']>,
  blur: number,
  distance: number
): EffectConfig => {
  const [axis, sign] = AXES[direction] || AXES.top;
  const b = Math.max(0, blur);
  const d = distance;

  if (effect === 'zoom') {
    return {
      from: { filter: blurTo(b * 1.2), opacity: 0, scale: 1.4, [axis]: sign * d * 0.35 },
      steps: [
        { filter: blurTo(b * 0.2), opacity: 0.9, scale: 0.97, [axis]: -sign * d * 0.03 },
        { filter: blurTo(0), opacity: 1, scale: 1, [axis]: 0 }
      ],
      exit: { filter: blurTo(b), opacity: 0, scale: 0.82, [axis]: -sign * d * 0.2 },
      times: [0, 0.6, 1],
      fade: EASE_OUT,
      bounce: 0.25,
      settle: 0.5,
      exitEase: EASE_IN
    };
  }

  if (effect === 'tilt') {
    const rotate = axis === 'y' ? 'rotateX' : 'rotateY';
    const lean = axis === 'y' ? -sign : sign;
    return {
      from: { filter: blurTo(b), opacity: 0, [rotate]: lean * 55, [axis]: sign * d * 0.5, transformPerspective: 600 },
      steps: [
        {
          filter: blurTo(b * 0.15),
          opacity: 0.95,
          [rotate]: -lean * 8,
          [axis]: -sign * d * 0.04,
          transformPerspective: 600
        },
        { filter: blurTo(0), opacity: 1, [rotate]: 0, [axis]: 0, transformPerspective: 600 }
      ],
      exit: { filter: blurTo(b), opacity: 0, [rotate]: -lean * 40, [axis]: -sign * d * 0.3, transformPerspective: 600 },
      times: [0, 0.6, 1],
      fade: EASE_OUT,
      bounce: 0.3,
      settle: 0.8,
      origin: { originX: axis === 'x' ? (sign < 0 ? 0 : 1) : 0.5, originY: axis === 'y' ? (sign < 0 ? 0 : 1) : 0.5 },
      exitEase: EASE_IN
    };
  }

  if (effect === 'focus') {
    const soft = { filter: blurTo(b * 1.4), opacity: 0.32, scale: 1.12 };
    return {
      from: soft,
      steps: [
        { filter: blurTo(b * 0.1), opacity: 0.95, scale: 0.995 },
        { filter: blurTo(0), opacity: 1, scale: 1 }
      ],
      exit: soft,
      times: [0, 0.72, 1],
      fade: EASE_IN_OUT,
      bounce: null,
      settle: 1,
      exitEase: EASE_IN_OUT
    };
  }

  if (effect === 'drift') {
    const h = direction === 'right' ? 1 : -1;
    const v = axis === 'y' ? sign : 0;
    return {
      from: { filter: blurTo(b), opacity: 0, x: h * d * 1.6, y: v * d * 0.3, skewX: h * 28 },
      steps: [
        { filter: blurTo(b * 0.15), opacity: 0.95, x: -h * d * 0.06, y: 0, skewX: -h * 7 },
        { filter: blurTo(0), opacity: 1, x: 0, y: 0, skewX: 0 }
      ],
      exit: { filter: blurTo(b), opacity: 0, x: -h * d * 1.2, y: -v * d * 0.2, skewX: h * 20 },
      times: [0, 0.62, 1],
      fade: EASE_OUT,
      bounce: 0.3,
      settle: 0.55,
      exitEase: EASE_IN
    };
  }

  return {
    from: { filter: blurTo(b), opacity: 0, [axis]: sign * d },
    steps: [
      { filter: blurTo(b / 2), opacity: 0.5, [axis]: (-sign * d) / 10 },
      { filter: blurTo(0), opacity: 1, [axis]: 0 }
    ],
    exit: { filter: blurTo(b), opacity: 0, [axis]: -sign * d * 0.6 },
    times: [0, 0.5, 1],
    fade: 'linear',
    bounce: 0.35,
    settle: 0.5,
    exitEase: EASE_IN
  };
};

const buildKeyframes = (from: Snapshot, steps: Snapshot[]): Keyframes => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes: Keyframes = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const buildRanks = (count: number, staggerFrom: BlurTextStaggerFrom, seedText: string): number[] => {
  const ranks = Array.from({ length: count }, (_, i) => i);
  if (staggerFrom === 'end') return ranks.map(i => count - 1 - i);
  if (staggerFrom === 'center') {
    const mid = (count - 1) / 2;
    const offset = count % 2 === 0 ? 0.5 : 0;
    return ranks.map(i => Math.abs(i - mid) - offset);
  }
  if (staggerFrom === 'random') {
    let seed = 2166136261;
    for (let i = 0; i < seedText.length; i++) seed = Math.imul(seed ^ seedText.charCodeAt(i), 16777619) >>> 0;
    const next = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const order = ranks.slice();
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    order.forEach((piece, rank) => {
      ranks[piece] = rank;
    });
  }
  return ranks;
};

const startPhase = (trigger: BlurTextTrigger): Phase =>
  trigger === 'load' ? 'in' : trigger === 'hover' || trigger === 'click' ? 'rest' : 'from';

const props = withDefaults(defineProps<BlurTextProps>(), {
  text: '',
  delay: 200,
  className: '',
  animateBy: 'words',
  direction: 'top',
  threshold: 0.1,
  rootMargin: '0px',
  stepDuration: 0.35,
  blur: 10,
  distance: 50,
  effect: 'blur',
  staggerFrom: 'start',
  trigger: 'view',
  loop: false,
  loopDelay: 2,
  focusOnHover: false
});

const rootRef = useTemplateRef<HTMLParagraphElement>('rootRef');
const phase = ref<Phase>(startPhase(props.trigger));
const firstPhase = phase.value;
const focusWord = ref(-1);
let settled = phase.value === 'rest';

const fx = computed(() => buildEffect(props.effect, props.direction, props.blur, props.distance));

const custom = computed(() => Boolean(props.animationFrom || props.animationTo || props.easing));
const fromSnapshot = computed(() => props.animationFrom ?? fx.value.from);
const toSnapshots = computed(() => props.animationTo ?? fx.value.steps);
const exitSnapshot = computed(() => props.animationFrom ?? fx.value.exit);
const restSnapshot = computed(() => toSnapshots.value[toSnapshots.value.length - 1]);
const animateKeyframes = computed(() =>
  buildKeyframes(fromSnapshot.value, custom.value ? toSnapshots.value : [restSnapshot.value])
);

const stepCount = computed(() => toSnapshots.value.length + 1);
const totalDuration = computed(() => props.stepDuration * (stepCount.value - 1));
const times = computed(() =>
  props.animationTo
    ? Array.from({ length: stepCount.value }, (_, i) => (stepCount.value === 1 ? 0 : i / (stepCount.value - 1)))
    : fx.value.times
);
const stagger = computed(() => Math.max(0, props.delay) / 1000);
const exitDuration = computed(() => props.stepDuration * 1.3);
const exitStagger = computed(() => stagger.value * 0.4);

const words = computed(() => props.text.split(' '));

const pieces = computed<Piece[]>(() => {
  const list: Piece[] = [];
  words.value.forEach((word, w) => {
    const isLast = w === words.value.length - 1;
    if (props.animateBy === 'words') {
      list.push({ word: w, content: isLast ? word : `${word} `, key: `word-${w}` });
      return;
    }
    Array.from(word).forEach((char, c) => list.push({ word: w, content: char, key: `char-${w}-${c}` }));
    if (!isLast) list.push({ word: w, content: ' ', key: `space-${w}` });
  });
  return list;
});

const groups = computed(() => {
  const list: number[][] = words.value.map(() => []);
  pieces.value.forEach((piece, index) => list[piece.word].push(index));
  return list;
});

const ranks = computed(() => buildRanks(pieces.value.length, props.staggerFrom, props.text));
const maxRank = computed(() => ranks.value.reduce((max, rank) => Math.max(max, rank), 0));
const inTotal = computed(
  () =>
    (totalDuration.value * (custom.value ? 1 : Math.max(1, fx.value.settle * 2.2)) + maxRank.value * stagger.value) *
    1000
);
const outTotal = computed(() => (exitDuration.value + maxRank.value * exitStagger.value) * 1000);

watch(
  [phase, () => props.trigger, () => props.threshold, () => props.rootMargin, rootRef],
  (_value, _old, onCleanup) => {
    if (phase.value !== 'from') return;
    if (props.trigger === 'load') {
      phase.value = 'in';
      return;
    }
    if (props.trigger === 'hover' || props.trigger === 'click') {
      phase.value = 'rest';
      return;
    }
    const element = rootRef.value;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (phase.value === 'from') phase.value = 'in';
          observer.disconnect();
        }
      },
      { threshold: props.threshold, rootMargin: props.rootMargin }
    );
    observer.observe(element);
    onCleanup(() => observer.disconnect());
  },
  { immediate: true, flush: 'post' }
);

watch(
  [phase, () => props.loop, () => props.loopDelay, inTotal, outTotal],
  (_value, _old, onCleanup) => {
    let timer = 0;
    if (phase.value === 'in') {
      settled = false;
      timer = window.setTimeout(() => {
        settled = true;
        props.onAnimationComplete?.();
        if (props.loop) timer = window.setTimeout(() => (phase.value = 'out'), Math.max(0, props.loopDelay) * 1000);
      }, inTotal.value);
    } else if (phase.value === 'rest') {
      settled = true;
      if (props.loop) timer = window.setTimeout(() => (phase.value = 'out'), Math.max(0, props.loopDelay) * 1000);
    } else if (phase.value === 'out') {
      settled = false;
      timer = window.setTimeout(() => (phase.value = 'in'), outTotal.value);
    }
    onCleanup(() => window.clearTimeout(timer));
  },
  { immediate: true }
);

const replay = () => {
  if (phase.value === 'out' || phase.value === 'from') return;
  phase.value = 'out';
};

const handleRootEnter = () => {
  if (props.trigger === 'hover' && settled) replay();
};

const handleRootClick = () => {
  if (props.trigger === 'click') replay();
};

const handleWordEnter = (w: number) => {
  if (props.focusOnHover) focusWord.value = w;
};

const handleWordLeave = () => {
  if (props.focusOnHover) focusWord.value = -1;
};

const inTransition = (rank: number): Transition => {
  const delayed = rank * stagger.value;
  if (custom.value)
    return { duration: totalDuration.value, times: times.value, delay: delayed, ease: props.easing ?? 'linear' };
  const transition: Record<string, unknown> = { duration: totalDuration.value, delay: delayed, ease: fx.value.fade };
  if (fx.value.bounce === null) return transition as Transition;
  const move = {
    type: 'spring',
    visualDuration: totalDuration.value * fx.value.settle,
    bounce: fx.value.bounce,
    delay: delayed
  };
  MOVE_KEYS.forEach(key => {
    if (key in fromSnapshot.value) transition[key] = move;
  });
  return transition as Transition;
};

const target = computed(() =>
  phase.value === 'in'
    ? animateKeyframes.value
    : phase.value === 'out'
      ? exitSnapshot.value
      : phase.value === 'rest'
        ? restSnapshot.value
        : fromSnapshot.value
);
const tinted = computed(() => Boolean(props.fromColor) && (phase.value === 'from' || phase.value === 'out'));
const dim = computed(() => Math.min(6, Math.max(2, props.blur * 0.3)));
const pieceStyle = computed<CSSProperties | undefined>(() =>
  fx.value.origin && !custom.value
    ? { transformOrigin: `${fx.value.origin.originX * 100}% ${fx.value.origin.originY * 100}% 0` }
    : undefined
);

const transitionFor = (index: number): Transition => {
  const rank = ranks.value[index];
  return phase.value === 'in'
    ? inTransition(rank)
    : phase.value === 'out'
      ? { duration: exitDuration.value, ease: fx.value.exitEase, delay: rank * exitStagger.value }
      : INSTANT;
};

const pieceStyleFor = (index: number): CSSProperties | undefined => {
  if (!props.fromColor) return pieceStyle.value;
  const rank = ranks.value[index];
  return {
    ...pieceStyle.value,
    color: tinted.value ? props.fromColor : undefined,
    transition:
      phase.value === 'in'
        ? `color ${totalDuration.value * 0.9}s ${CSS_EASE} ${rank * stagger.value}s`
        : phase.value === 'out'
          ? `color ${exitDuration.value}s ${CSS_EASE} ${rank * exitStagger.value}s`
          : 'none'
  };
};

const wordStyle = (w: number): CSSProperties | undefined => {
  if (!props.focusOnHover) return undefined;
  const dimmed = focusWord.value !== -1 && focusWord.value !== w;
  return {
    filter: dimmed ? `blur(${dim.value}px)` : 'blur(0px)',
    opacity: dimmed ? 0.3 : 1,
    transition: `filter 0.45s ${CSS_EASE}, opacity 0.45s ${CSS_EASE}`
  };
};
</script>
