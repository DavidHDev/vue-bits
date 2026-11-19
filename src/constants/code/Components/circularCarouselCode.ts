import code from '@/content/Components/CircularCarousel/CircularCarousel.vue?raw';
import { createCodeObject } from '@/types/code';

export const circularCarousel = createCodeObject(code, 'Components/CircularCarousel', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 560px; position: relative">
    <CircularCarousel
      :items="items"
      preset="cylinder"
      intro="rise"
      :card-width="220"
      :aspect-ratio="1"
      :speed="14"
      captions
    />
  </div>
</template>

<script setup lang="ts">
import CircularCarousel, { type CircularCarouselItem } from './CircularCarousel.vue';

const items: CircularCarouselItem[] = [
  { src: '/images/valley.jpg', alt: 'Mist drifting through a valley', title: 'Valley', subtitle: 'Landscape' },
  { src: '/images/portrait.jpg', alt: 'A studio portrait', title: 'Portrait', subtitle: 'Studio' },
  { src: '/images/towers.jpg', alt: 'Glass towers from street level', title: 'Towers', subtitle: 'Architecture' }
];
</script>`
});
