<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedContentProps {
  container?: string | HTMLElement | null;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string | ((progress: number) => number);
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string | ((progress: number) => number);
  className?: string;
}

const props = withDefaults(defineProps<AnimatedContentProps>(), {
  container: null,
  distance: 100,
  direction: 'vertical',
  reverse: false,
  duration: 0.8,
  ease: 'power3.out',
  initialOpacity: 0,
  animateOpacity: true,
  scale: 1,
  threshold: 0.1,
  delay: 0,
  disappearAfter: 0,
  disappearDuration: 0.5,
  disappearEase: 'power3.in',
  className: ''
});

const emit = defineEmits<{
  complete: [];
  disappearanceComplete: [];
}>();

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
let scrollTriggerInstance: ScrollTrigger | null = null;
let timelineInstance: gsap.core.Timeline | null = null;

onMounted(() => {
  const el = containerRef.value;
  if (!el) return;

  let scrollerTarget: HTMLElement | string | null =
    props.container || document.getElementById('snap-main-container') || null;

  if (typeof scrollerTarget === 'string') {
    scrollerTarget = document.querySelector(scrollerTarget) as HTMLElement | null;
  }

  const axis = props.direction === 'horizontal' ? 'x' : 'y';
  const offset = props.reverse ? -props.distance : props.distance;
  const startPct = (1 - props.threshold) * 100;

  gsap.set(el, {
    [axis]: offset,
    scale: props.scale,
    opacity: props.animateOpacity ? props.initialOpacity : 1,
    visibility: 'visible'
  });

  timelineInstance = gsap.timeline({
    paused: true,
    delay: props.delay,
    onComplete: () => {
      emit('complete');
      if (props.disappearAfter > 0) {
        gsap.to(el, {
          [axis]: props.reverse ? props.distance : -props.distance,
          scale: 0.8,
          opacity: props.animateOpacity ? props.initialOpacity : 0,
          delay: props.disappearAfter,
          duration: props.disappearDuration,
          ease: props.disappearEase,
          onComplete: () => emit('disappearanceComplete')
        });
      }
    }
  });

  timelineInstance.to(el, {
    [axis]: 0,
    scale: 1,
    opacity: 1,
    duration: props.duration,
    ease: props.ease
  });

  scrollTriggerInstance = ScrollTrigger.create({
    trigger: el,
    scroller: scrollerTarget,
    start: `top ${startPct}%`,
    once: true,
    onEnter: () => timelineInstance?.play()
  });
});

onUnmounted(() => {
  scrollTriggerInstance?.kill();
  timelineInstance?.kill();
});
</script>

<template>
  <div ref="containerRef" :class="className" style="visibility: hidden">
    <slot />
  </div>
</template>

<style scoped>
/* GSAP will handle all transforms and opacity */
</style>
