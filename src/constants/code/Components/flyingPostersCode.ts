import code from '@/content/Components/FlyingPosters/FlyingPosters.vue?raw';
import { createCodeObject } from '@/types/code';

export const flyingPosters = createCodeObject(code, 'Components/FlyingPosters', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="height: 600px; position: relative;">
    <FlyingPosters :items="items" />
  </div>
</template>

<script setup>
import FlyingPosters from './FlyingPosters.vue'

const items = [
  'https://picsum.photos/500/500?grayscale', 
  'https://picsum.photos/600/600?grayscale', 
  'https://picsum.photos/400/400?grayscale'
]
</script>`
});
