import code from '@/content/Components/CardSwap/CardSwap.vue?raw';
import { createCodeObject } from '@/types/code';

export const cardSwap = createCodeObject(code, 'Components/CardSwap', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <div style="height: 600px">
    <CardSwap :items="items" :delay="4000" />
  </div>

  <div style="height: 600px">
    <CardSwap :width="420" :height="300">
      <Card>Your content</Card>
      <Card>Your content</Card>
      <Card>Your content</Card>
    </CardSwap>
  </div>
</template>

<script setup lang="ts">
import CardSwap, { Card, type CardSwapItem } from './CardSwap.vue';

const items: CardSwapItem[] = [
  { title: 'Golden hour', image: '/photos/sky.jpg' },
  { title: 'Canola field', image: '/photos/field.jpg' },
  { title: 'The pier', image: '/photos/pier.jpg' },
  { title: 'Pink drift', image: '/photos/clouds.jpg' }
];
</script>`
});
