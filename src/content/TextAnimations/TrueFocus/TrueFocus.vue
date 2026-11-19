<script setup lang="ts">
import { motion, useReducedMotion, type Transition } from 'motion-v';
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch, type CSSProperties } from 'vue';

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  focusStyle?: 'brackets' | 'box' | 'underline' | 'highlight';
  order?: 'sequential' | 'random';
  easing?: 'smooth' | 'spring';
  blurAmount?: number;
  focusScale?: number;
  borderColor?: string;
  highlightColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  cornerSize?: number;
  borderWidth?: number;
  unfocusedOpacity?: number;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const CORNERS: Corner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const FRAME_GAP = 10;
const SMOOTH_EASE = [0.65, 0, 0.35, 1] as const;
const SMOOTH_CSS = 'cubic-bezier(0.65, 0, 0.35, 1)';
const SPRING_CSS = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const props = withDefaults(defineProps<TrueFocusProps>(), {
  sentence: 'True Focus',
  separator: ' ',
  manualMode: false,
  focusStyle: 'brackets',
  order: 'sequential',
  easing: 'smooth',
  blurAmount: 5,
  focusScale: 1,
  borderColor: 'green',
  highlightColor: undefined,
  glowColor: 'transparent',
  animationDuration: 0.5,
  pauseBetweenAnimations: 1,
  cornerSize: 16,
  borderWidth: 3,
  unfocusedOpacity: 1
});

const words = computed(() => props.sentence.split(props.separator).filter(word => word.trim() !== ''));
const currentIndex = ref(0);
const focusRect = shallowRef<FocusRect | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const wordRefs: (HTMLSpanElement | null)[] = [];
const reduceMotion = useReducedMotion();
const duration = computed(() => (reduceMotion.value ? 0 : props.animationDuration));
const activeIndex = computed(() => (words.value.length ? currentIndex.value % words.value.length : -1));
const spring = computed(() => props.easing === 'spring' && !reduceMotion.value);
const transition = computed<Transition>(() =>
  spring.value
    ? { type: 'spring', visualDuration: duration.value, bounce: 0.38 }
    : { duration: duration.value, ease: SMOOTH_EASE }
);

const setWordRef = (el: unknown, index: number) => {
  wordRefs[index] = (el as HTMLSpanElement | null) ?? null;
};

watch(
  () =>
    [props.manualMode, props.animationDuration, props.pauseBetweenAnimations, words.value.length, props.order] as const,
  ([manualMode, animationDuration, pauseBetweenAnimations, length, order], _prev, onCleanup) => {
    if (manualMode || length < 2) return;
    const interval = setInterval(
      () => {
        const roll = Math.random();
        const current = currentIndex.value % length;
        if (order !== 'random') {
          currentIndex.value = (current + 1) % length;
          return;
        }
        const next = Math.floor(roll * (length - 1));
        currentIndex.value = next >= current ? next + 1 : next;
      },
      (animationDuration + pauseBetweenAnimations) * 1000
    );
    onCleanup(() => clearInterval(interval));
  },
  { immediate: true }
);

let observer: ResizeObserver | null = null;

const disconnect = () => {
  observer?.disconnect();
  observer = null;
};

const track = () => {
  disconnect();
  const container = containerRef.value;
  const word = wordRefs[activeIndex.value];
  if (!container || !word) return;

  const measure = () => {
    const next = { x: word.offsetLeft, y: word.offsetTop, width: word.offsetWidth, height: word.offsetHeight };
    const prev = focusRect.value;
    if (prev && prev.x === next.x && prev.y === next.y && prev.width === next.width && prev.height === next.height)
      return;
    focusRect.value = next;
  };

  measure();
  if (typeof ResizeObserver === 'undefined') return;
  observer = new ResizeObserver(measure);
  observer.observe(container);
  wordRefs.forEach(node => node && observer!.observe(node));
};

onMounted(() => {
  track();
  watch([activeIndex, () => props.sentence, () => props.separator], track, { flush: 'post' });
});

onBeforeUnmount(disconnect);

const frame = computed<FocusRect | null>(() => {
  const rect = focusRect.value;
  if (!rect) return null;
  return {
    x: rect.x - (rect.width * (props.focusScale - 1)) / 2,
    y: rect.y - (rect.height * (props.focusScale - 1)) / 2,
    width: rect.width * props.focusScale,
    height: rect.height * props.focusScale
  };
});

const corners = computed<Record<Corner, { x: number; y: number }> | null>(() => {
  const f = frame.value;
  if (!f) return null;
  const size = props.cornerSize;
  return {
    'top-left': { x: f.x - FRAME_GAP, y: f.y - FRAME_GAP },
    'top-right': { x: f.x + f.width + FRAME_GAP - size, y: f.y - FRAME_GAP },
    'bottom-left': { x: f.x - FRAME_GAP, y: f.y + f.height + FRAME_GAP - size },
    'bottom-right': {
      x: f.x + f.width + FRAME_GAP - size,
      y: f.y + f.height + FRAME_GAP - size
    }
  };
});

const shapes = computed(() => {
  const f = frame.value;
  if (!f) return null;
  return {
    box: {
      x: f.x - FRAME_GAP,
      y: f.y - FRAME_GAP,
      width: f.width + FRAME_GAP * 2,
      height: f.height + FRAME_GAP * 2
    },
    underline: {
      x: f.x,
      y: f.y + f.height + FRAME_GAP * 0.4,
      width: f.width,
      height: props.borderWidth
    },
    highlight: {
      x: f.x - f.height * 0.14,
      y: f.y + f.height * 0.04,
      width: f.width + f.height * 0.28,
      height: f.height * 0.92
    }
  };
});

const frameStyle = computed(
  () =>
    ({
      '--border-color': props.borderColor,
      '--highlight-color': `color-mix(in srgb, ${props.highlightColor ?? props.borderColor} 30%, transparent)`,
      '--glow-color': props.glowColor,
      '--corner-size': `${props.cornerSize}px`,
      '--border-width': `${props.borderWidth}px`
    }) as CSSProperties
);

const wordStyle = (index: number): CSSProperties => {
  const isActive = index === activeIndex.value;
  return {
    filter: `blur(${isActive ? 0 : props.blurAmount}px)`,
    opacity: isActive ? 1 : props.unfocusedOpacity,
    transform: props.focusScale !== 1 ? `scale(${isActive ? props.focusScale : 1})` : undefined,
    transition: `filter ${duration.value}s ease, opacity ${duration.value}s ease, transform ${duration.value}s ${spring.value ? SPRING_CSS : SMOOTH_CSS}`
  };
};

const handleMouseEnter = (index: number) => {
  if (props.manualMode) currentIndex.value = index;
};
</script>

<template>
  <div ref="containerRef" class="focus-container" :style="frameStyle">
    <motion.span
      v-if="focusStyle === 'highlight' && shapes"
      class="focus-highlight"
      aria-hidden="true"
      :initial="{ ...shapes.highlight, opacity: 0 }"
      :animate="{ ...shapes.highlight, opacity: 1 }"
      :transition="transition"
    />

    <span
      v-for="(word, index) in words"
      :key="index"
      :ref="el => setWordRef(el, index)"
      :class="`focus-word ${manualMode ? 'manual' : ''} ${index === activeIndex && !manualMode ? 'active' : ''}`"
      :style="wordStyle(index)"
      @mouseenter="handleMouseEnter(index)"
    >
      {{ word }}
    </span>

    <div v-if="shapes && corners && focusStyle !== 'highlight'" class="focus-frame" aria-hidden="true">
      <motion.span
        v-if="focusStyle === 'box'"
        class="focus-box"
        :initial="{ ...shapes.box, opacity: 0 }"
        :animate="{ ...shapes.box, opacity: 1 }"
        :transition="transition"
      />
      <motion.span
        v-if="focusStyle === 'underline'"
        class="focus-underline"
        :initial="{ ...shapes.underline, opacity: 0 }"
        :animate="{ ...shapes.underline, opacity: 1 }"
        :transition="transition"
      />
      <template v-if="focusStyle !== 'box' && focusStyle !== 'underline'">
        <motion.span
          v-for="corner in CORNERS"
          :key="corner"
          :class="`corner ${corner}`"
          :initial="{ ...corners[corner], opacity: 0 }"
          :animate="{ ...corners[corner], opacity: 1 }"
          :transition="transition"
        />
      </template>
    </div>
  </div>
</template>

<style>
.focus-container {
  position: relative;
  display: flex;
  gap: 1em;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  outline: none;
  user-select: none;
}

.focus-word {
  position: relative;
  font-size: 3rem;
  font-weight: 900;
  cursor: pointer;
  transition:
    filter 0.3s ease,
    color 0.3s ease;
  outline: none;
  user-select: none;
}

.focus-word.active {
  filter: blur(0);
}

.focus-frame {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.focus-highlight {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 6px;
  background-color: var(--highlight-color);
  pointer-events: none;
}

.focus-box {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  border: var(--border-width, 3px) solid var(--border-color, currentColor);
  border-radius: 6px;
  filter: drop-shadow(0 0 4px var(--glow-color, transparent));
}

.focus-underline {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: calc(var(--border-width, 3px) / 2);
  background-color: var(--border-color, currentColor);
  filter: drop-shadow(0 0 4px var(--glow-color, transparent));
}

.corner {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: var(--corner-size, 1rem);
  height: var(--corner-size, 1rem);
  border: var(--border-width, 3px) solid var(--border-color, currentColor);
  border-radius: 3px;
  filter: drop-shadow(0 0 4px var(--glow-color, transparent));
}

.top-left {
  border-right: none;
  border-bottom: none;
}

.top-right {
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  border-right: none;
  border-top: none;
}

.bottom-right {
  border-left: none;
  border-top: none;
}
</style>
