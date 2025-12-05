<template>
  <div ref="elementRef" :class="className">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  container?: string | HTMLElement | null;
  blur?: boolean;
  duration?: number;
  ease?: string | ((progress: number) => number);
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string | ((progress: number) => number);
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  container: null,
  blur: false,
  duration: 1000,
  ease: 'power2.out',
  delay: 0,
  threshold: 0.1,
  initialOpacity: 0,
  disappearAfter: 0,
  disappearDuration: 0.5,
  disappearEase: 'power2.in',
  className: ''
});

const emit = defineEmits<{
  complete: [];
  disappearanceComplete: [];
}>();

const elementRef = useTemplateRef<HTMLDivElement>('elementRef');
let scrollTriggerInstance: ScrollTrigger | null = null;
let timelineInstance: gsap.core.Timeline | null = null;

const getSeconds = (val: number): number => (typeof val === 'number' && val > 10 ? val / 1000 : val);

onMounted(() => {
  const el = elementRef.value;
  if (!el) return;

  let scrollerTarget: HTMLElement | string | null =
    props.container || document.getElementById('snap-main-container') || null;

  if (typeof scrollerTarget === 'string') {
    scrollerTarget = document.querySelector(scrollerTarget) as HTMLElement | null;
  }

  const startPct = (1 - props.threshold) * 100;

  gsap.set(el, {
    autoAlpha: props.initialOpacity,
    filter: props.blur ? 'blur(10px)' : 'blur(0px)',
    willChange: 'opacity, filter, transform'
  });

  timelineInstance = gsap.timeline({
    paused: true,
    delay: getSeconds(props.delay),
    onComplete: () => {
      emit('complete');
      props.onComplete?.();
      if (props.disappearAfter > 0) {
        gsap.to(el, {
          autoAlpha: props.initialOpacity,
          filter: props.blur ? 'blur(10px)' : 'blur(0px)',
          delay: getSeconds(props.disappearAfter),
          duration: getSeconds(props.disappearDuration),
          ease: props.disappearEase,
          onComplete: () => {
            emit('disappearanceComplete');
            props.onDisappearanceComplete?.();
          }
        });
      }
    }
  });

  timelineInstance.to(el, {
    autoAlpha: 1,
    filter: 'blur(0px)',
    duration: getSeconds(props.duration),
    ease: props.ease
  });

  scrollTriggerInstance = ScrollTrigger.create({
    trigger: el,
    scroller: scrollerTarget || window,
    start: `top ${startPct}%`,
    once: true,
    onEnter: () => timelineInstance?.play()
  });
});

onUnmounted(() => {
  scrollTriggerInstance?.kill();
  timelineInstance?.kill();
  if (elementRef.value) {
    gsap.killTweensOf(elementRef.value);
  }
});
</script>
