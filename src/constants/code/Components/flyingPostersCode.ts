import code from '@/content/Components/FlyingPosters/FlyingPosters.vue?raw';
import { createCodeObject } from '@/types/code';

export const flyingPosters = createCodeObject(code, 'Components/FlyingPosters', {
  dependencies: '',
  usage: `<template>
  <div style="height: 600px; position: relative">
    <FlyingPosters
      :items="items"
      :plane-width="320"
      :plane-height="320"
      :distortion="3"
      :scroll-ease="0.01"
      :camera-fov="45"
      :camera-z="20"
    />
  </div>
</template>

<script setup lang="ts">
import FlyingPosters from './FlyingPosters.vue';

const items = [
  '/assets/demo/day-portrait.webp',
  '/assets/demo/night-landscape.webp',
  '/assets/demo/day-landscape.webp',
  '/assets/demo/night-portrait.webp'
];
</script>`
});
