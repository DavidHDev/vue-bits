<template>
  <h2 ref="containerRef" :class="`my-5 ${containerClassName}`">
    <p :class="`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`">
      <template v-for="(segment, index) in splitText" :key="index">
        <span v-if="segment.isWord" class="inline-block scroll-reveal-word word">{{ segment.text }}</span>
        <template v-else>{{ segment.text }}</template>
      </template>
    </p>
  </h2>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { computed, nextTick, onMounted, onUnmounted, useSlots, useTemplateRef, type Ref } from 'vue';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  scrollContainerRef?: Ref<HTMLElement | null> | HTMLElement | null;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const props = withDefaults(defineProps<ScrollRevealProps>(), {
  scrollContainerRef: null,
  enableBlur: true,
  baseOpacity: 0.1,
  baseRotation: 3,
  blurStrength: 4,
  containerClassName: '',
  textClassName: '',
  rotationEnd: 'bottom bottom',
  wordAnimationEnd: 'bottom bottom'
});

const slots = useSlots();
const containerRef = useTemplateRef<HTMLHeadingElement>('containerRef');

const text = computed<string>(() => {
  const vnodes = slots.default?.() ?? [];
  const extract = (nodes: ReturnType<NonNullable<typeof slots.default>>): string =>
    nodes
      .map(vnode => {
        if (typeof vnode.children === 'string') return vnode.children;
        if (Array.isArray(vnode.children))
          return extract(vnode.children as ReturnType<NonNullable<typeof slots.default>>);
        return '';
      })
      .join('');
  return extract(vnodes);
});

const splitText = computed<{ text: string; isWord: boolean }[]>(() =>
  text.value.split(/(\s+)/).map(segment => ({
    text: segment,
    isWord: !segment.match(/^\s+$/)
  }))
);

function resolveScroller(ref: ScrollRevealProps['scrollContainerRef']): HTMLElement | Window {
  if (!ref) return window;
  if (ref instanceof HTMLElement) return ref;
  return (ref as Ref<HTMLElement | null>).value ?? window;
}

let tweens: gsap.core.Tween[] = [];

onMounted(async () => {
  await nextTick();

  const el = containerRef.value;
  if (!el) return;

  const scroller = resolveScroller(props.scrollContainerRef);
  const wordElements = el.querySelectorAll<HTMLElement>('.scroll-reveal-word');

  tweens.push(
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: props.baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: props.rotationEnd,
          scrub: true
        }
      }
    )
  );

  tweens.push(
    gsap.fromTo(
      wordElements,
      { opacity: props.baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: props.wordAnimationEnd,
          scrub: true
        }
      }
    )
  );

  if (props.enableBlur) {
    tweens.push(
      gsap.fromTo(
        wordElements,
        { filter: `blur(${props.blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: props.wordAnimationEnd,
            scrub: true
          }
        }
      )
    );
  }
});

onUnmounted(() => {
  tweens.forEach(t => {
    t.scrollTrigger?.kill();
    t.kill();
  });
  tweens = [];
});
</script>
