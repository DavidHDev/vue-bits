<script setup lang="ts">
import Lenis from 'lenis';
import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

interface CardTransform {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
}

interface ScrollStackProps {
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
}

const props = withDefaults(defineProps<ScrollStackProps>(), {
  className: '',
  itemDistance: 100,
  itemScale: 0.03,
  itemStackDistance: 30,
  stackPosition: '20%',
  scaleEndPosition: '10%',
  baseScale: 0.85,
  scaleDuration: 0.5,
  rotationAmount: 0,
  blurAmount: 0
});

const scrollerRef = useTemplateRef('scrollerRef');
const stackCompletedRef = ref(false);
const animationFrameRef = ref<number | null>(null);
const lenisRef = ref<Lenis | null>(null);
const cardsRef = ref<HTMLElement[]>([]);
const lastTransformsRef = ref(new Map<number, CardTransform>());
const isUpdatingRef = ref(false);

const calculateProgress = (scrollTop: number, start: number, end: number) => {
  if (scrollTop < start) return 0;
  if (scrollTop > end) return 1;
  return (scrollTop - start) / (end - start);
};

const parsePercentage = (value: string | number, containerHeight: number) => {
  if (typeof value === 'string' && value.includes('%')) {
    return (parseFloat(value) / 100) * containerHeight;
  }
  return parseFloat(value as string);
};

const updateCardTransforms = () => {
  const scroller = scrollerRef.value;
  if (!scroller || !cardsRef.value.length || isUpdatingRef.value) return;

  isUpdatingRef.value = true;

  const scrollTop = scroller.scrollTop;
  const containerHeight = scroller.clientHeight;
  const stackPositionPx = parsePercentage(props.stackPosition, containerHeight);
  const scaleEndPositionPx = parsePercentage(props.scaleEndPosition, containerHeight);
  const endElement = scroller.querySelector('.scroll-stack-end') as HTMLElement;
  const endElementTop = endElement ? endElement.offsetTop : 0;

  cardsRef.value.forEach((card, i) => {
    if (!card) return;

    const cardTop = card.offsetTop;
    const triggerStart = cardTop - stackPositionPx - props.itemStackDistance * i;
    const triggerEnd = cardTop - scaleEndPositionPx;
    const pinStart = cardTop - stackPositionPx - props.itemStackDistance * i;
    const pinEnd = endElementTop - containerHeight / 2;

    const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
    const targetScale = props.baseScale + i * props.itemScale;
    const scale = 1 - scaleProgress * (1 - targetScale);
    const rotation = props.rotationAmount ? i * props.rotationAmount * scaleProgress : 0;

    let blur = 0;
    if (props.blurAmount) {
      let topCardIndex = 0;
      for (let j = 0; j < cardsRef.value.length; j++) {
        const jCardTop = cardsRef.value[j].offsetTop;
        const jTriggerStart = jCardTop - stackPositionPx - props.itemStackDistance * j;
        if (scrollTop >= jTriggerStart) {
          topCardIndex = j;
        }
      }

      if (i < topCardIndex) {
        const depthInStack = topCardIndex - i;
        blur = Math.max(0, depthInStack * props.blurAmount);
      }
    }

    let translateY = 0;
    const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

    if (isPinned) {
      translateY = scrollTop - cardTop + stackPositionPx + props.itemStackDistance * i;
    } else if (scrollTop > pinEnd) {
      translateY = pinEnd - cardTop + stackPositionPx + props.itemStackDistance * i;
    }

    const newTransform = {
      translateY: Math.round(translateY * 100) / 100,
      scale: Math.round(scale * 1000) / 1000,
      rotation: Math.round(rotation * 100) / 100,
      blur: Math.round(blur * 100) / 100
    };

    const lastTransform = lastTransformsRef.value.get(i);
    const hasChanged =
      !lastTransform ||
      Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
      Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
      Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
      Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

    if (hasChanged) {
      const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
      const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

      card.style.transform = transform;
      card.style.filter = filter;

      lastTransformsRef.value.set(i, newTransform);
    }

    if (i === cardsRef.value.length - 1) {
      const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isInView && !stackCompletedRef.value) {
        stackCompletedRef.value = true;
        props.onStackComplete?.();
      } else if (!isInView && stackCompletedRef.value) {
        stackCompletedRef.value = false;
      }
    }
  });

  isUpdatingRef.value = false;
};

const handleScroll = () => {
  updateCardTransforms();
};

const setupLenis = () => {
  const scroller = scrollerRef.value;
  if (!scroller) return;

  const lenis = new Lenis({
    wrapper: scroller,
    content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
    infinite: false,
    gestureOrientation: 'vertical',
    wheelMultiplier: 1,
    lerp: 0.1,
    syncTouch: true,
    syncTouchLerp: 0.075
  });

  lenis.on('scroll', handleScroll);

  const raf = (time: number) => {
    lenis.raf(time);
    animationFrameRef.value = requestAnimationFrame(raf);
  };
  animationFrameRef.value = requestAnimationFrame(raf);

  lenisRef.value = lenis;
  return lenis;
};

let cleanup: (() => void) | null = null;
const setup = () => {
  const scroller = scrollerRef.value;
  if (!scroller) return;

  const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
  cardsRef.value = cards;
  const transformsCache = lastTransformsRef.value;

  cards.forEach((card, i) => {
    if (i < cards.length - 1) {
      card.style.marginBottom = `${props.itemDistance}px`;
    }
    card.style.willChange = 'transform, filter';
    card.style.transformOrigin = 'top center';
    card.style.backfaceVisibility = 'hidden';
    card.style.transform = 'translateZ(0)';
    card.style.webkitTransform = 'translateZ(0)';
    card.style.perspective = '1000px';
    card.style.webkitPerspective = '1000px';
  });

  setupLenis();

  updateCardTransforms();

  cleanup = () => {
    if (animationFrameRef.value) {
      cancelAnimationFrame(animationFrameRef.value);
    }
    if (lenisRef.value) {
      lenisRef.value.destroy();
    }
    stackCompletedRef.value = false;
    cardsRef.value = [];
    transformsCache.clear();
    isUpdatingRef.value = false;
  };
};

onMounted(async () => {
  await nextTick();
  setup();
});

onBeforeUnmount(() => {
  cleanup?.();
});

watch(
  () => props,
  () => {
    cleanup?.();
    setup();
  },
  { deep: true }
);
</script>

<script lang="ts">
export const ScrollStackItem = defineComponent({
  name: 'ScrollStackItem',
  props: {
    itemClassName: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class:
            `scroll-stack-card relative w-full h-80 my-8 p-12 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${props.itemClassName}`.trim(),
          style: {
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
          }
        },
        slots.default?.()
      );
  }
});
</script>

<template>
  <div
    ref="scrollerRef"
    :class="['relative w-full h-full overflow-y-auto overflow-x-visible', className]"
    :style="{
      overscrollBehavior: 'contain',
      WebkitOverflowScrolling: 'touch',
      scrollBehavior: 'smooth',
      WebkitTransform: 'translateZ(0)',
      transform: 'translateZ(0)',
      willChange: 'scroll-position'
    }"
  >
    <div class="px-20 pt-[20vh] pb-[50rem] min-h-screen scroll-stack-inner">
      <slot />
      <!-- Spacer so the last pin can release cleanly -->
      <div class="w-full h-px scroll-stack-end" />
    </div>
  </div>
</template>
