import code from '@/content/Components/Carousel/Carousel.vue?raw';
import { createCodeObject } from '@/types/code';

export const carousel = createCodeObject(code, 'Components/Carousel', {
  installation: `npm install motion-v`,
  usage: `<template>
  <div style="height: 600px; position: relative;">
    <Carousel
      :base-width="300"
      :autoplay="true"
      :autoplay-delay="3000"
      :pause-on-hover="true"
      :loop="true"
      :round="false"
    />
  </div>
</template>

<script setup>
import Carousel from './Carousel.vue'
</script>`
});
