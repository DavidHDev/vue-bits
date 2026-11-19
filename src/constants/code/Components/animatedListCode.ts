import code from '@/content/Components/AnimatedList/AnimatedList.vue?raw';
import { createCodeObject } from '@/types/code';

export const animatedList = createCodeObject(code, 'Components/AnimatedList', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <AnimatedList
    :items="items"
    :on-item-select="(item, index) => console.log(item, index)"
    animation="pop"
    theme="dark"
  />
</template>

<script setup lang="ts">
import AnimatedList from './AnimatedList.vue'

const items = [
  { title: 'Brand assets', description: '24 files', meta: '2m' },
  { title: 'Launch hero.png', description: '2.4 MB', meta: '18m' },
  { title: 'Product tour.mp4', description: '148 MB', meta: '1h' },
  { title: 'Pricing notes', description: '1,240 words', meta: '3h' }
]
</script>`
});
