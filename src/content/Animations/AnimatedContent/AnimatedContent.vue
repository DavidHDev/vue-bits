<script lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type AnimatedContentWipe = 'none' | 'up' | 'down' | 'left' | 'right' | 'center';
export type AnimatedContentStaggerFrom = 'start' | 'end' | 'center' | 'edges' | 'random';

const WIPES: Record<string, string> = {
  up: 'linear-gradient(to top, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  down: 'linear-gradient(to bottom, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  left: 'linear-gradient(to left, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  right: 'linear-gradient(to right, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  center:
    'radial-gradient(farthest-corner at 50% 50%, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))'
};
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef, watch, type StyleValue } from 'vue';

interface AnimatedContentProps {
  container?: Element | string | null;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  blur?: number;
  rotate?: number;
  tilt?: number;
  wipe?: AnimatedContentWipe;
  threshold?: number;
  delay?: number;
  stagger?: number;
  staggerFrom?: AnimatedContentStaggerFrom;
  trigger?: 'scroll' | 'mount';
  once?: boolean;
  scrub?: boolean | number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  className?: string;
  style?: StyleValue;
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
  blur: 0,
  rotate: 0,
  tilt: 0,
  wipe: 'none',
  threshold: 0.1,
  delay: 0,
  stagger: 0,
  staggerFrom: 'start',
  trigger: 'scroll',
  once: true,
  scrub: false,
  disappearAfter: 0,
  disappearDuration: 0.5,
  disappearEase: 'power3.in',
  className: '',
  style: undefined
});

const emit = defineEmits<{
  start: [];
  complete: [];
  disappearanceComplete: [];
}>();

const rootRef = useTemplateRef<HTMLDivElement>('rootRef');
let teardown: (() => void) | null = null;

const build = () => {
  const el = rootRef.value;
  if (!el) return null;

  const {
    container,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    blur,
    rotate,
    tilt,
    wipe,
    threshold,
    delay,
    stagger,
    staggerFrom,
    trigger,
    once,
    scrub,
    disappearAfter,
    disappearDuration,
    disappearEase
  } = props;

  el.style.visibility = 'hidden';

  let scroller: Element | string | null = container || document.getElementById('snap-main-container') || null;
  if (typeof scroller === 'string') scroller = document.querySelector(scroller);

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const ctx = gsap.context(() => {
    const targets: Element[] = stagger > 0 && el.children.length ? Array.from(el.children) : [el];
    const horizontal = direction === 'horizontal';
    const axis = horizontal ? 'x' : 'y';
    const sign = reverse ? -1 : 1;
    const mask = WIPES[wipe];

    gsap.set(el, { visibility: 'visible' });

    if (reduce) {
      emit('complete');
      return;
    }

    const from: gsap.TweenVars = {
      [axis]: distance * sign,
      scale,
      opacity: animateOpacity ? initialOpacity : 1
    };
    const to: gsap.TweenVars = {
      [axis]: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease
    };

    if (blur > 0) {
      from.filter = `blur(${blur}px)`;
      to.filter = 'blur(0px)';
    }
    if (rotate) {
      from.rotation = rotate * sign;
      to.rotation = 0;
    }
    if (tilt) {
      const tiltAxis = horizontal ? 'rotationY' : 'rotationX';
      from[tiltAxis] = horizontal ? -tilt * sign : tilt * sign;
      to[tiltAxis] = 0;
      from.transformPerspective = 900;
      to.transformPerspective = 900;
    }
    if (mask) {
      gsap.set(targets, { maskImage: mask, webkitMaskImage: mask });
      from['--ac-wipe'] = 0;
      to['--ac-wipe'] = 1;
    }
    if (stagger > 0) to.stagger = { each: stagger, from: staggerFrom };

    const settle = () => {
      if (scrub) return;
      gsap.set(targets, { clearProps: mask ? 'filter,transform,maskImage,webkitMaskImage' : 'filter,transform' });
    };

    const disappear = () => {
      if (disappearAfter <= 0) return;
      const out: gsap.TweenVars = {
        [axis]: -distance * sign,
        scale: 0.8,
        opacity: animateOpacity ? initialOpacity : 0,
        delay: disappearAfter,
        duration: disappearDuration,
        ease: disappearEase,
        onComplete: () => emit('disappearanceComplete')
      };
      if (blur > 0) out.filter = `blur(${blur}px)`;
      if (stagger > 0) out.stagger = { each: stagger, from: staggerFrom };
      gsap.to(targets, out);
    };

    const tl = gsap.timeline({
      paused: true,
      onStart: () => emit('start'),
      onComplete: () => {
        emit('complete');
        settle();
        if (once && !scrub) disappear();
      }
    });
    tl.fromTo(targets, from, to, scrub ? 0 : Math.max(delay, 0));

    if (trigger === 'mount') {
      tl.play();
      return;
    }

    const start = `top ${(1 - threshold) * 100}%`;

    if (scrub) {
      ScrollTrigger.create({
        trigger: el,
        scroller: scroller || undefined,
        start,
        end: `top ${Math.max((1 - threshold) * 100 - 45, 5)}%`,
        scrub: scrub === true ? true : Math.max(Number(scrub) || 0, 0.01),
        animation: tl
      });
      return;
    }

    ScrollTrigger.create({
      trigger: el,
      scroller: scroller || undefined,
      start,
      once,
      onEnter: () => tl.play(),
      onLeaveBack: once
        ? undefined
        : () => {
            if (mask) gsap.set(targets, { maskImage: mask, webkitMaskImage: mask });
            tl.reverse();
          }
    });
  }, el);

  return () => ctx.revert();
};

const rebuild = () => {
  teardown?.();
  teardown = build();
};

onMounted(rebuild);

watch(
  [
    () => props.container,
    () => props.distance,
    () => props.direction,
    () => props.reverse,
    () => props.duration,
    () => props.ease,
    () => props.initialOpacity,
    () => props.animateOpacity,
    () => props.scale,
    () => props.blur,
    () => props.rotate,
    () => props.tilt,
    () => props.wipe,
    () => props.threshold,
    () => props.delay,
    () => props.stagger,
    () => props.staggerFrom,
    () => props.trigger,
    () => props.once,
    () => props.scrub,
    () => props.disappearAfter,
    () => props.disappearDuration,
    () => props.disappearEase
  ],
  rebuild,
  { flush: 'post' }
);

onBeforeUnmount(() => {
  teardown?.();
  teardown = null;
});
</script>

<template>
  <div ref="rootRef" :class="className" :style="style">
    <slot />
  </div>
</template>
