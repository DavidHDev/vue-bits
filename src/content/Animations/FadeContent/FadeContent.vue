<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, type HTMLAttributes } from 'vue';

gsap.registerPlugin(ScrollTrigger);

interface FadeContentProps extends /* @vue-ignore */ HTMLAttributes {
  container?: Element | string | null;
  blur?: boolean;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
}

const props = withDefaults(defineProps<FadeContentProps>(), {
  container: null,
  blur: false,
  duration: 1000,
  ease: 'power2.out',
  delay: 0,
  threshold: 0.1,
  initialOpacity: 0,
  disappearAfter: 0,
  disappearDuration: 0.5,
  disappearEase: 'power2.in'
});

const emit = defineEmits<{
  complete: [];
  disappearanceComplete: [];
}>();

const attrs = useAttrs();

const fadeRef = ref<HTMLDivElement | null>(null);

let tl: gsap.core.Timeline | null = null;
let st: ScrollTrigger | null = null;

const classes = computed(() => attrs.class);

const getSeconds = (val: number) => {
  return val > 10 ? val / 1000 : val;
};

onMounted(() => {
  const el = fadeRef.value;

  if (!el) return;

  let scrollerTarget: Element | string | null =
    props.container || document.getElementById('snap-main-container') || null;

  if (typeof scrollerTarget === 'string') {
    scrollerTarget = document.querySelector(scrollerTarget);
  }

  const startPct = (1 - props.threshold) * 100;

  gsap.set(el, {
    autoAlpha: props.initialOpacity,
    filter: props.blur ? 'blur(10px)' : 'blur(0px)',
    willChange: 'opacity, filter, transform'
  });

  tl = gsap.timeline({
    paused: true,
    delay: getSeconds(props.delay),
    onComplete: () => {
      emit('complete');

      if (props.disappearAfter > 0) {
        gsap.to(el, {
          autoAlpha: props.initialOpacity,
          filter: props.blur ? 'blur(10px)' : 'blur(0px)',
          delay: getSeconds(props.disappearAfter),
          duration: getSeconds(props.disappearDuration),
          ease: props.disappearEase,
          onComplete: () => {
            emit('disappearanceComplete');
          }
        });
      }
    }
  });

  tl.to(el, {
    autoAlpha: 1,
    filter: 'blur(0px)',
    duration: getSeconds(props.duration),
    ease: props.ease
  });

  st = ScrollTrigger.create({
    trigger: el,
    scroller: (scrollerTarget as Element) || window,
    start: `top ${startPct}%`,
    once: true,
    onEnter: () => {
      tl?.play();
    }
  });
});

onBeforeUnmount(() => {
  if (st) {
    st.kill();
    st = null;
  }

  if (tl) {
    tl.kill();
    tl = null;
  }

  if (fadeRef.value) {
    gsap.killTweensOf(fadeRef.value);
  }
});
</script>

<template>
  <div ref="fadeRef" :class="classes" v-bind="attrs">
    <slot />
  </div>
</template>
