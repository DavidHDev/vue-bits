<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

interface ShuffleProps {
  text: string;
  shuffleDirection?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  duration?: number;
  animationMode?: 'evenodd' | 'random';
  shuffleTimes?: number;
  ease?: string;
  stagger?: number;
  threshold?: number;
  triggerOnce?: boolean;
  triggerOnHover?: boolean;
  respectReducedMotion?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<ShuffleProps>(), {
  shuffleDirection: 'right',
  duration: 0.4,
  animationMode: 'evenodd',
  shuffleTimes: 1.8,
  ease: 'power3.out',
  stagger: 0.1,
  threshold: 0.1,
  triggerOnce: true,
  triggerOnHover: true,
  respectReducedMotion: true,
  className: ''
});

const containerRef = useTemplateRef<HTMLElement>('containerRef');
const splitChars = ref<string[]>([]);
let tl: gsap.core.Timeline | null = null;

watch(
  () => props.text,
  newText => {
    const cleanText = newText.replace(/\s/g, '');
    let processed = '';
    for (let i = 0; i < cleanText.length; i++) {
      processed += cleanText[i];
      if ((i + 1) % 3 === 0 && i !== cleanText.length - 1) {
        processed += ' ';
      }
    }
    splitChars.value = processed.split('');
  },
  { immediate: true }
);

const getStaggerDelay = (index: number, total: number) => {
  if (props.animationMode === 'random') {
    return Math.random() * (props.stagger * total);
  }

  return index % 2 === 0 ? index * props.stagger : index * props.stagger + props.stagger * 2; // offset odds slightly?
};

const animate = () => {
  if (!containerRef.value) return;
  const chars = containerRef.value.querySelectorAll('.shuffle-char');
  if (!chars.length) return;

  if (tl) tl.kill();
  tl = gsap.timeline({
    onComplete: () => {}
  });

  chars.forEach((char, index) => {
    let xOffset = 0;
    let yOffset = 0;

    if (props.shuffleDirection === 'left') xOffset = 20;
    else if (props.shuffleDirection === 'right') xOffset = -20;
    else if (props.shuffleDirection === 'top') yOffset = 20;
    else if (props.shuffleDirection === 'bottom') yOffset = -20;
    else if (props.shuffleDirection === 'center') {
      const middle = (chars.length - 1) / 2;
      xOffset = index < middle ? 20 : -20;
      if (index === middle) xOffset = 0;
    }

    let rotateY = 0;
    let rotateX = 0;

    if (props.shuffleDirection === 'left') rotateY = -90;
    else if (props.shuffleDirection === 'right') rotateY = 90;
    else if (props.shuffleDirection === 'top') rotateX = -90;
    else if (props.shuffleDirection === 'bottom') rotateX = 90;
    else if (props.shuffleDirection === 'center') {
      const middle = (chars.length - 1) / 2;
      rotateY = index < middle ? -90 : 90;
      if (index === middle) rotateY = 0;
    }

    let delay = index * props.stagger;
    if (props.animationMode === 'evenodd') {
      const isOdd = index % 2 !== 0;
      delay = index * props.stagger + (isOdd ? 0.05 : 0);
    } else if (props.animationMode === 'random') {
      delay = Math.random() * (chars.length * props.stagger);
    }

    const targetChar = splitChars.value[index];
    const isSpace = targetChar.trim() === '';

    const toVars: any = {
      opacity: 1,
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: props.duration,
      ease: props.ease,
      delay: delay
    };

    if (!isSpace) {
      toVars.scrambleText = {
        text: targetChar,
        chars: '!@#$%^&*():;,.?0123456789',
        speed: 2,
        delimiter: ''
      };
    }

    tl!.fromTo(
      char,
      {
        opacity: 0,
        x: xOffset,
        y: yOffset,
        rotationY: rotateY,
        rotationX: rotateX,
        scale: 0.5,
        filter: 'blur(10px)',
        transformOrigin: '50% 50%'
      },
      toVars,
      0
    );
  });
};

const initScrollTrigger = () => {
  if (!containerRef.value) return;

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: `top+=${props.threshold * 100}% bottom`,
    onEnter: () => {
      if (!props.respectReducedMotion || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animate();
      }
    },
    once: props.triggerOnce
  });
};

onMounted(() => {
  nextTick(() => {
    initScrollTrigger();
  });
});

onUnmounted(() => {
  if (tl) tl.kill();
  ScrollTrigger.getAll().forEach(t => t.kill());
});

const handleMouseEnter = () => {
  if (props.triggerOnHover) {
    animate();
  }
};
</script>

<template>
  <div
    ref="containerRef"
    :class="className"
    @mouseenter="handleMouseEnter"
    style="display: inline-block; white-space: pre; perspective: 1000px"
  >
    <span
      v-for="(char, index) in splitChars"
      :key="index"
      class="shuffle-char inline-block will-change-transform opacity-0"
    >
      {{ char }}
    </span>
  </div>
</template>

<style scoped>
.shuffle-char {
  display: inline-block;
}
</style>
