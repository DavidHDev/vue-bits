import code from '@/content/Components/MorphSlider/MorphSlider.vue?raw';
import { createCodeObject } from '@/types/code';

export const morphSlider = createCodeObject(code, 'Components/MorphSlider', {
  installation: `npm install ogl gsap`,
  usage: `<template>
  <div style="height: 500px; position: relative">
    <MorphSlider
      :items="items"
      transition="melt"
      :intensity="0.55"
      :aberration="0.35"
      :drift="0.4"
      autoplay
    />
  </div>
</template>

<script setup lang="ts">
import MorphSlider from './MorphSlider.vue';

const items = [
  { image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=1600&auto=format&fit=crop', caption: 'One' },
  { image: 'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=1600&auto=format&fit=crop', caption: 'Two' },
  { image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=1600&auto=format&fit=crop', caption: 'Three' }
];
</script>`
});
