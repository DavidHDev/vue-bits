<template>
  <p ref="rootRef" class="flex flex-wrap blur-text" :class="className">
    <Motion
      v-for="(segment, index) in elements"
      :key="index"
      tag="span"
      :initial="fromSnapshot"
      :animate="inView ? buildKeyframes(fromSnapshot, toSnapshots) : fromSnapshot"
      :transition="getTransition(index)"
      @animation-complete="handleAnimationComplete(index)"
      style="display: inline-block; will-change: transform, filter, opacity"
    >
      {{ segment === ' ' ? '\u00A0' : segment }}
      <template v-if="animateBy === 'words' && index < elements.length - 1">&nbsp;</template>
    </Motion>
  </p>
</template>

<script setup lang="ts">
import { Motion, type Transition } from 'motion-v';
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const props = withDefaults(defineProps<BlurTextProps>(), {
  text: '',
  delay: 200,
  className: '',
  animateBy: 'words',
  direction: 'top',
  threshold: 0.1,
  rootMargin: '0px',
  easing: (t: number) => t,
  stepDuration: 0.35
});

const inView = ref(false);
const rootRef = useTemplateRef<HTMLParagraphElement>('rootRef');
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!rootRef.value) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        inView.value = true;
        observer?.unobserve(rootRef.value as Element);
      }
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin
    }
  );

  observer.observe(rootRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const elements = computed(() => (props.animateBy === 'words' ? props.text.split(' ') : props.text.split('')));

const defaultFrom = computed(() =>
  props.direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 }
);

const defaultTo = computed(() => [
  {
    filter: 'blur(5px)',
    opacity: 0.5,
    y: props.direction === 'top' ? 5 : -5
  },
  {
    filter: 'blur(0px)',
    opacity: 1,
    y: 0
  }
]);

const fromSnapshot = computed(() => props.animationFrom ?? defaultFrom.value);
const toSnapshots = computed(() => props.animationTo ?? defaultTo.value);

const stepCount = computed(() => toSnapshots.value.length + 1);
const totalDuration = computed(() => props.stepDuration * (stepCount.value - 1));

const times = computed(() =>
  Array.from({ length: stepCount.value }, (_, i) => (stepCount.value === 1 ? 0 : i / (stepCount.value - 1)))
);

const getTransition = (index: number): Transition => ({
  duration: totalDuration.value,
  times: times.value,
  delay: (index * props.delay) / 1000,
  ease: props.easing
});

const handleAnimationComplete = (index: number) => {
  if (index === elements.value.length - 1) {
    props.onAnimationComplete?.();
  }
};
</script>
