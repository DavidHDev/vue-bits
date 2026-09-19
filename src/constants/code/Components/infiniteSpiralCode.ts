import code from '@/content/Components/InfiniteSpiral/InfiniteSpiral.vue?raw';
import { createCodeObject } from '@/types/code';

export const infiniteSpiral = createCodeObject(code, 'Components/InfiniteSpiral', {
  usage: `<script setup>
import InfiniteSpiral from './InfiniteSpiral'

const images = [
  { src: '/images/landscape-1.jpg', alt: 'Mountain lake' },
  { src: '/images/landscape-2.jpg', alt: 'Forest path' },
  { src: '/images/landscape-3.jpg', alt: 'Rocky summit' },
  { src: '/images/landscape-4.jpg', alt: 'Ocean shore' },
  { src: '/images/landscape-5.jpg', alt: 'Green meadow' },
  { src: '/images/landscape-6.jpg', alt: 'Desert light' }
];
</script>

<template>
<div :style="{ height: '600px', position: 'relative', overflow: 'hidden' }">
  <InfiniteSpiral
    :items="images"
    animationMode="all"
    :speed="0.55"
    :radius="170"
    :cardWidth="100"
    :cardHeight="100"
    :verticalSpacing="60"
    :perspective="1000"
    :cardRadius="10"
    :centerScale="1.2"
    :edgeBlur="6"
    :cardsPerTurn="7"
    pauseOnHover
  />
</div>
</template>`
});
