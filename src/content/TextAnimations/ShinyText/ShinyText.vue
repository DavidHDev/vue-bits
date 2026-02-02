<script setup lang="ts">
import { Motion, useAnimationFrame, useMotionValue, useTransform } from 'motion-v';
import { computed, ref, watch } from 'vue';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
}

const props = withDefaults(defineProps<ShinyTextProps>(), {
  disabled: false,
  speed: 2,
  className: '',
  color: '#b5b5b5',
  shineColor: '#ffffff',
  spread: 120,
  yoyo: false,
  pauseOnHover: false,
  direction: 'left',
  delay: 0
});

const isPaused = ref(false);
const progress = useMotionValue(0);
const elapsedRef = ref(0);
const lastTimeRef = ref<number | null>(null);
const directionRef = ref(props.direction === 'left' ? 1 : -1);

const animationDuration = computed(() => props.speed * 1000);
const delayDuration = computed(() => props.delay * 1000);

useAnimationFrame(time => {
  if (props.disabled || isPaused.value) {
    lastTimeRef.value = null;
    return;
  }

  if (lastTimeRef.value === null) {
    lastTimeRef.value = time;
    return;
  }

  const deltaTime = time - lastTimeRef.value;
  lastTimeRef.value = time;

  elapsedRef.value += deltaTime;

  // Animation goes from 0 to 100
  if (props.yoyo) {
    const cycleDuration = animationDuration.value + delayDuration.value;
    const fullCycle = cycleDuration * 2;
    const cycleTime = elapsedRef.value % fullCycle;

    if (cycleTime < animationDuration.value) {
      // Forward animation: 0 -> 100
      const p = (cycleTime / animationDuration.value) * 100;
      progress.set(directionRef.value === 1 ? p : 100 - p);
    } else if (cycleTime < cycleDuration) {
      // Delay at end
      progress.set(directionRef.value === 1 ? 100 : 0);
    } else if (cycleTime < cycleDuration + animationDuration.value) {
      // Reverse animation: 100 -> 0
      const reverseTime = cycleTime - cycleDuration;
      const p = 100 - (reverseTime / animationDuration.value) * 100;
      progress.set(directionRef.value === 1 ? p : 100 - p);
    } else {
      // Delay at start
      progress.set(directionRef.value === 1 ? 0 : 100);
    }
  } else {
    const cycleDuration = animationDuration.value + delayDuration.value;
    const cycleTime = elapsedRef.value % cycleDuration;

    if (cycleTime < animationDuration.value) {
      // Animation phase: 0 -> 100
      const p = (cycleTime / animationDuration.value) * 100;
      progress.set(directionRef.value === 1 ? p : 100 - p);
    } else {
      // Delay phase - hold at end (shine off-screen)
      progress.set(directionRef.value === 1 ? 100 : 0);
    }
  }
});

watch(
  () => props.direction,
  () => {
    directionRef.value = props.direction === 'left' ? 1 : -1;
    elapsedRef.value = 0;
    progress.set(0);
  },
  {
    immediate: true
  }
);

const backgroundPosition = useTransform(progress, p => `${150 - p * 2}% center`);

const handleMouseEnter = () => {
  if (props.pauseOnHover) isPaused.value = true;
};

const handleMouseLeave = () => {
  if (props.pauseOnHover) isPaused.value = false;
};

const gradientStyle = computed(() => ({
  backgroundImage: `linear-gradient(${props.spread}deg, ${props.color} 0%, ${props.color} 35%, ${props.shineColor} 50%, ${props.color} 65%, ${props.color} 100%)`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}));
</script>

<template>
  <Motion
    tag="span"
    :class="['inline-block', className]"
    :style="{ ...gradientStyle, backgroundPosition }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    {{ text }}
  </Motion>
</template>
