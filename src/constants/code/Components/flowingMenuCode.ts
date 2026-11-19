import code from '@/content/Components/FlowingMenu/FlowingMenu.vue?raw';
import { createCodeObject } from '@/types/code';

export const flowingMenu = createCodeObject(code, 'Components/FlowingMenu', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <div style="height: 600px; position: relative">
    <FlowingMenu
      :items="items"
      :speed="60"
      :stretch="0.6"
      :magnet="0.25"
      :follow-cursor="0.4"
      text-color="#ffffff"
      bg-color="#111111"
      marquee-bg-color="#ffffff"
      marquee-text-color="#111111"
    />
  </div>
</template>

<script setup lang="ts">
import FlowingMenu from './FlowingMenu.vue';

const items = [
  { link: '#', text: 'Mojave', image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { link: '#', text: 'Sonoma', image: 'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { link: '#', text: 'Monterey', image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { link: '#', text: 'Sequoia', image: 'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' }
];
</script>`
});
