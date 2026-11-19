<script setup lang="ts">
import type { AnimationPlaybackControls, MotionProps } from 'motion-v';
import {
  AnimatePresence,
  Motion,
  MotionConfig,
  animate as animateValue,
  useMotionValue,
  useReducedMotion
} from 'motion-v';
import { computed, onBeforeUnmount, ref, useTemplateRef, watch, type CSSProperties } from 'vue';

defineOptions({ inheritAttrs: false });

export type RotatingTextEffect = 'slide' | 'flip' | 'blur' | 'scale' | 'drop';
export type StaggerFrom = 'first' | 'last' | 'center' | 'random' | number;

type TransitionType = NonNullable<MotionProps['transition']>;
type TargetType = Record<string, unknown>;

interface EffectPreset {
  initial: TargetType;
  animate: TargetType;
  exit: TargetType;
  transition: TransitionType;
  exitTransition?: TransitionType;
}

export interface RotatingTextProps {
  texts: string[];
  transition?: TransitionType;
  initial?: TargetType;
  animate?: TargetType;
  exit?: TargetType;
  effect?: RotatingTextEffect;
  direction?: 'up' | 'down';
  highlight?: boolean;
  highlightColor?: string;
  animatePresenceMode?: 'sync' | 'wait';
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: StaggerFrom;
  loop?: boolean;
  auto?: boolean;
  pauseOnHover?: boolean;
  blur?: number;
  splitBy?: string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<RotatingTextProps>(), {
  transition: undefined,
  initial: undefined,
  animate: undefined,
  exit: undefined,
  effect: 'slide',
  direction: 'up',
  highlight: false,
  highlightColor: '#7cff67',
  animatePresenceMode: 'wait',
  animatePresenceInitial: false,
  rotationInterval: 2000,
  staggerDuration: 0,
  staggerFrom: 'first',
  loop: true,
  auto: true,
  pauseOnHover: false,
  blur: 0,
  splitBy: 'characters',
  mainClassName: '',
  splitLevelClassName: '',
  elementLevelClassName: '',
  style: undefined
});

const emit = defineEmits<{
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
}>();

const cn = (...classes: (string | undefined | null | boolean)[]): string => classes.filter(Boolean).join(' ');

type GraphemeSegmenter = { segment: (text: string) => Iterable<{ segment: string }> };
type SegmenterConstructor = new (locale: string, options: { granularity: 'grapheme' }) => GraphemeSegmenter;

const SegmenterImpl =
  typeof Intl !== 'undefined' ? (Intl as unknown as { Segmenter?: SegmenterConstructor }).Segmenter : undefined;
const segmenter = SegmenterImpl ? new SegmenterImpl('en', { granularity: 'grapheme' }) : null;

const splitIntoCharacters = (text: string): string[] =>
  segmenter ? Array.from(segmenter.segment(text), segment => segment.segment) : Array.from(text);

const withFilter = <T,>(state: T, filter: string): T =>
  state && typeof state === 'object' && !Array.isArray(state) ? ({ ...state, filter } as T) : state;

const LAYOUT_SPRING = { type: 'spring', damping: 25, stiffness: 300 } as TransitionType;
const WIDTH_SPRING = { type: 'spring', damping: 34, stiffness: 320 } as const;
const FLIP_STYLE: CSSProperties = { transformOrigin: '50% 50% -0.45em', backfaceVisibility: 'hidden' };

const EFFECTS: Record<RotatingTextEffect, (up: boolean) => EffectPreset> = {
  slide: up => ({
    initial: { y: up ? '100%' : '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: up ? '-120%' : '120%', opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  }),
  flip: up => ({
    initial: { rotateX: up ? -90 : 90, opacity: 0, transformPerspective: 480 },
    animate: { rotateX: 0, opacity: 1, transformPerspective: 480 },
    exit: { rotateX: up ? 90 : -90, opacity: 0, transformPerspective: 480 },
    transition: { type: 'tween', duration: 0.6, ease: [0.34, 1.4, 0.64, 1] },
    exitTransition: { type: 'tween', duration: 0.32, ease: [0.5, 0, 0.75, 0] }
  }),
  blur: up => ({
    initial: { y: up ? '45%' : '-45%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: up ? '-45%' : '45%', opacity: 0 },
    transition: { type: 'tween', duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }),
  scale: up => ({
    initial: { scale: up ? 0.35 : 1.7, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: up ? 1.7 : 0.35, opacity: 0 },
    transition: { type: 'spring', damping: 17, stiffness: 240 }
  }),
  drop: () => ({
    initial: { y: '-110%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '110%', opacity: 0 },
    transition: { type: 'spring', damping: 18, stiffness: 320, mass: 0.9 },
    exitTransition: { type: 'tween', duration: 0.3, ease: [0.55, 0, 1, 0.45] }
  })
};

const readableText = (color: string): string | undefined => {
  const value = String(color ?? '').trim();
  let rgb: number[] | null = null;
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    const digits = hex[1].length < 6 ? [...hex[1].slice(0, 3)].map(c => c + c).join('') : hex[1].slice(0, 6);
    rgb = [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16));
  } else {
    const fn = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    if (fn) rgb = fn.slice(1, 4).map(Number);
  }
  if (!rgb) return undefined;
  const [r, g, b] = rgb.map(channel => {
    const c = Math.min(Math.max(channel / 255, 0), 1);
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3 ? '#0b0b0c' : '#ffffff';
};

const currentTextIndex = ref(0);
const hovered = ref(false);
let indexValue = 0;

const contentRef = useTemplateRef<HTMLSpanElement>('contentRef');
const width = useMotionValue<number | string>('auto');
const reduceMotion = useReducedMotion();

const lastIndex = computed(() => Math.max(props.texts.length - 1, 0));
const activeIndex = computed(() => Math.min(currentTextIndex.value, lastIndex.value));

const elements = computed(() => {
  const currentText = props.texts[activeIndex.value] ?? '';
  const { splitBy } = props;
  if (splitBy === 'characters') {
    const words = currentText.split(' ');
    return words.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== words.length - 1
    }));
  }
  if (splitBy === 'words') {
    return currentText.split(' ').map((word, i, arr) => ({
      characters: [word],
      needsSpace: i !== arr.length - 1
    }));
  }
  if (splitBy === 'lines') {
    return currentText.split('\n').map((line, i, arr) => ({
      characters: [line],
      needsSpace: i !== arr.length - 1
    }));
  }
  return currentText.split(splitBy).map((part, i, arr) => ({
    characters: [part],
    needsSpace: i !== arr.length - 1
  }));
});

const order = computed(() => {
  const total = elements.value.reduce((sum, word) => sum + word.characters.length, 0);
  const shuffled = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);
  return { total, shuffled };
});

const getStaggerDelay = (index: number): number => {
  const { total, shuffled } = order.value;
  const { staggerFrom, staggerDuration } = props;
  if (staggerFrom === 'first') return index * staggerDuration;
  if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
  if (staggerFrom === 'center') return Math.abs(Math.floor(total / 2) - index) * staggerDuration;
  if (staggerFrom === 'random') return shuffled[index] * staggerDuration;
  return Math.abs((staggerFrom as number) - index) * staggerDuration;
};

const previousCount = (wordIndex: number) =>
  elements.value.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);

const goTo = (index: number) => {
  if (index === indexValue) return;
  indexValue = index;
  currentTextIndex.value = index;
  props.onNext?.(index);
};

const next = () => {
  const current = Math.min(indexValue, lastIndex.value);
  goTo(current < lastIndex.value ? current + 1 : props.loop ? 0 : current);
};

const previous = () => {
  const current = Math.min(indexValue, lastIndex.value);
  goTo(current > 0 ? current - 1 : props.loop ? lastIndex.value : current);
};

const jumpTo = (index: number) => goTo(Math.max(0, Math.min(index, lastIndex.value)));

const reset = () => goTo(0);

defineExpose({ next, previous, jumpTo, reset });

const paused = computed(() => props.pauseOnHover && hovered.value);

watch(
  [() => props.auto, paused, () => props.rotationInterval, activeIndex, lastIndex, () => props.loop],
  (_, __, onCleanup) => {
    if (!props.auto || paused.value) return;
    const timeoutId = setTimeout(next, props.rotationInterval);
    onCleanup(() => clearTimeout(timeoutId));
  },
  { immediate: true }
);

let stopFit: (() => void) | null = null;

watch(
  [() => props.highlight, reduceMotion, contentRef],
  () => {
    stopFit?.();
    stopFit = null;
    const content = contentRef.value;
    if (!props.highlight || !content) {
      width.set('auto');
      return;
    }
    let controls: AnimationPlaybackControls | null = null;
    let settled = false;
    const fit = () => {
      const target = content.offsetWidth + 1;
      controls?.stop();
      if (!settled || reduceMotion.value) {
        settled = true;
        width.set(target);
        return;
      }
      controls = animateValue(width, target, WIDTH_SPRING);
    };
    fit();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    observer?.observe(content);
    stopFit = () => {
      observer?.disconnect();
      controls?.stop();
    };
  },
  { immediate: true, flush: 'post' }
);

onBeforeUnmount(() => {
  stopFit?.();
  stopFit = null;
});

const handleMouseEnter = (event: MouseEvent) => {
  if (props.pauseOnHover) hovered.value = true;
  emit('mouseenter', event);
};

const handleMouseLeave = (event: MouseEvent) => {
  hovered.value = false;
  emit('mouseleave', event);
};

const motionPreset = computed(() => (EFFECTS[props.effect] ?? EFFECTS.slide)(props.direction !== 'down'));
const blurAmount = computed(() => (props.blur > 0 ? props.blur : props.effect === 'blur' ? 10 : 0));
const enterFrom = computed(() => {
  const state = props.initial ?? motionPreset.value.initial;
  return blurAmount.value > 0 ? withFilter(state, `blur(${blurAmount.value}px)`) : state;
});
const enterTo = computed(() => {
  const state = props.animate ?? motionPreset.value.animate;
  return blurAmount.value > 0 ? withFilter(state, 'blur(0px)') : state;
});
const leaveTo = computed(() => {
  const state = props.exit ?? motionPreset.value.exit;
  return blurAmount.value > 0 ? withFilter(state, `blur(${blurAmount.value}px)`) : state;
});
const charTransition = computed(() => props.transition ?? motionPreset.value.transition);
const exitTransition = computed(() => (props.transition || props.exit ? null : motionPreset.value.exitTransition));
const charStyle = computed(() => (props.effect === 'flip' ? FLIP_STYLE : undefined));

const charExit = (delay: number) =>
  exitTransition.value ? { ...leaveTo.value, transition: { ...exitTransition.value, delay } } : leaveTo.value;

const charTransitionWithDelay = (delay: number) => ({ ...charTransition.value, delay }) as TransitionType;

const blockStyle = computed(() =>
  props.highlight
    ? {
        ...props.style,
        width,
        backgroundColor: props.highlightColor,
        color: readableText(props.highlightColor) ?? props.style?.color
      }
    : props.style
);
</script>

<template>
  <MotionConfig reduced-motion="user">
    <Motion
      as="span"
      :class="cn('text-rotate', highlight && 'text-rotate-highlight', mainClassName)"
      v-bind="$attrs"
      :style="blockStyle as any"
      :layout="!highlight"
      :transition="transition ?? LAYOUT_SPRING"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <span class="text-rotate-sr-only">{{ texts[activeIndex] }}</span>
      <span v-if="highlight" ref="contentRef" class="text-rotate-highlight-content">
        <AnimatePresence :mode="animatePresenceMode" :initial="animatePresenceInitial">
          <Motion
            :key="activeIndex"
            as="span"
            :class="splitBy === 'lines' ? 'text-rotate-lines' : 'text-rotate'"
            :layout="!highlight"
            aria-hidden="true"
          >
            <span
              v-for="(wordObj, wordIndex) in elements"
              :key="wordIndex"
              :class="cn('text-rotate-word', splitLevelClassName)"
            >
              <Motion
                v-for="(char, charIndex) in wordObj.characters"
                :key="charIndex"
                as="span"
                :initial="enterFrom as any"
                :animate="enterTo as any"
                :exit="charExit(getStaggerDelay(previousCount(wordIndex) + charIndex)) as any"
                :transition="charTransitionWithDelay(getStaggerDelay(previousCount(wordIndex) + charIndex))"
                :class="cn('text-rotate-element', elementLevelClassName)"
                :style="charStyle"
              >
                {{ char }}
              </Motion>
              <span v-if="wordObj.needsSpace" class="text-rotate-space">{{ ' ' }}</span>
            </span>
          </Motion>
        </AnimatePresence>
      </span>
      <template v-else>
        <AnimatePresence :mode="animatePresenceMode" :initial="animatePresenceInitial">
          <Motion
            :key="activeIndex"
            as="span"
            :class="splitBy === 'lines' ? 'text-rotate-lines' : 'text-rotate'"
            :layout="!highlight"
            aria-hidden="true"
          >
            <span
              v-for="(wordObj, wordIndex) in elements"
              :key="wordIndex"
              :class="cn('text-rotate-word', splitLevelClassName)"
            >
              <Motion
                v-for="(char, charIndex) in wordObj.characters"
                :key="charIndex"
                as="span"
                :initial="enterFrom as any"
                :animate="enterTo as any"
                :exit="charExit(getStaggerDelay(previousCount(wordIndex) + charIndex)) as any"
                :transition="charTransitionWithDelay(getStaggerDelay(previousCount(wordIndex) + charIndex))"
                :class="cn('text-rotate-element', elementLevelClassName)"
                :style="charStyle"
              >
                {{ char }}
              </Motion>
              <span v-if="wordObj.needsSpace" class="text-rotate-space">{{ ' ' }}</span>
            </span>
          </Motion>
        </AnimatePresence>
      </template>
    </Motion>
  </MotionConfig>
</template>

<style>
.text-rotate {
  display: flex;
  flex-wrap: wrap;
  white-space: pre-wrap;
  position: relative;
}

.text-rotate-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-rotate-word {
  display: inline-flex;
}

.text-rotate-lines {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.text-rotate-element {
  display: inline-block;
}

.text-rotate-space {
  white-space: pre;
}

.text-rotate-highlight {
  box-sizing: content-box;
  flex-wrap: nowrap;
  justify-content: center;
  overflow: hidden;
  padding: 0.1em 0.28em;
  border-radius: 0.16em;
}

.text-rotate-highlight-content {
  display: flex;
  flex-shrink: 0;
  white-space: pre;
}
</style>
