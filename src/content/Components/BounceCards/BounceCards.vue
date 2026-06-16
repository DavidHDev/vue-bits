<template>
  <div
    :class="['relative flex items-center justify-center', className]"
    :style="{
      width: `${containerWidth}px`,
      height: `${containerHeight}px`
    }"
  >
    <div
      v-for="(src, idx) in images"
      :key="idx"
      ref="cardRefs"
      :class="`card card-${idx} absolute w-[200px] aspect-square border-8 border-white rounded-[30px] overflow-hidden`"
      :style="{
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        transform: transformStyles[idx] ?? 'none'
      }"
      @mouseenter="pushSiblings(idx)"
      @mouseleave="resetSiblings"
    >
      <img class="w-full h-full object-cover" :src="src" :alt="`card-${idx}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

export interface BounceCardsProps {
  className?: string;
  images?: string[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
}

const props = withDefaults(defineProps<BounceCardsProps>(), {
  className: '',
  images: () => [],
  containerWidth: 400,
  containerHeight: 400,
  animationDelay: 0.5,
  animationStagger: 0.06,
  easeType: 'elastic.out(1, 0.8)',
  transformStyles: () => [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)'
  ],
  enableHover: false
});

const cardRefs = ref<HTMLElement[]>([]);

const getNoRotationTransform = (transformStr: string): string => {
  const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
  if (hasRotate) {
    return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
  } else if (transformStr === 'none') {
    return 'rotate(0deg)';
  } else {
    return `${transformStr} rotate(0deg)`;
  }
};

const getPushedTransform = (baseTransform: string, offsetX: number): string => {
  const translateRegex = /translate\(([-0-9.]+)px\)/;
  const match = baseTransform.match(translateRegex);
  if (match) {
    const currentX = parseFloat(match[1]);
    const newX = currentX + offsetX;
    return baseTransform.replace(translateRegex, `translate(${newX}px)`);
  } else {
    return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
  }
};

const pushSiblings = (hoveredIdx: number) => {
  if (!props.enableHover || !cardRefs.value.length) return;

  props.images.forEach((_, i) => {
    gsap.killTweensOf(cardRefs.value[i]);

    const baseTransform = props.transformStyles[i] || 'none';

    if (i === hoveredIdx) {
      gsap.to(cardRefs.value[i], {
        transform: getNoRotationTransform(baseTransform),
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto'
      });
    } else {
      const offsetX = i < hoveredIdx ? -160 : 160;
      const distance = Math.abs(hoveredIdx - i);
      gsap.to(cardRefs.value[i], {
        transform: getPushedTransform(baseTransform, offsetX),
        duration: 0.4,
        ease: 'back.out(1.4)',
        delay: distance * 0.05,
        overwrite: 'auto'
      });
    }
  });
};

const resetSiblings = () => {
  if (!props.enableHover || !cardRefs.value.length) return;

  props.images.forEach((_, i) => {
    gsap.killTweensOf(cardRefs.value[i]);
    gsap.to(cardRefs.value[i], {
      transform: props.transformStyles[i] || 'none',
      duration: 0.4,
      ease: 'back.out(1.4)',
      overwrite: 'auto'
    });
  });
};

const playEntranceAnimation = () => {
  gsap.fromTo(
    cardRefs.value,
    { scale: 0 },
    {
      scale: 1,
      stagger: props.animationStagger,
      ease: props.easeType,
      delay: props.animationDelay
    }
  );
};

onMounted(playEntranceAnimation);

watch(
  () => [props.animationDelay, props.animationStagger, props.easeType],
  async () => {
    await nextTick();
    playEntranceAnimation();
  }
);

onUnmounted(() => {
  gsap.killTweensOf(cardRefs.value);
});
</script>
