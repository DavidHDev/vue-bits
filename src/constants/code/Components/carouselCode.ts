import code from '@/content/Components/Carousel/Carousel.vue?raw';
import { createCodeObject } from '@/types/code';

export const carousel = createCodeObject(code, 'Components/Carousel', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <div style="height: 600px; position: relative">
    <Carousel
      :items="items"
      :base-width="300"
      :aspect-ratio="1.25"
      effect="tilt"
      indicator="dots"
      :frame="true"
      :arrows="false"
      :loop="false"
      :autoplay="false"
      :autoplay-delay="3000"
      :pause-on-hover="false"
      theme="dark"
    />
  </div>
</template>

<script setup lang="ts">
import Carousel from './Carousel.vue';

const items = [
  { title: 'Open fields', description: 'Bright skies over rapeseed in full bloom.', image: '/fields.jpg' },
  { title: 'Moonrise', description: 'The same field, quiet under a full moon.', image: '/moon.jpg' },
  { title: 'The pier', description: 'Clear water and a long walk out.', image: '/pier.jpg' }
];
</script>`
});
