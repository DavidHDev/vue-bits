import code from '@/content/Components/Stack/Stack.vue?raw';
import { createCodeObject } from '@/types/code';

export const stack = createCodeObject(code, 'Components/Stack', {
  installation: `npm install motion-v`,
  usage: `<template>
  <div style="width: 208px; height: 208px;">
    <Stack
      :random-rotation="true"
      :sensitivity="180"
      :send-to-back-on-click="true"
      :cardsData="images"
    />
  </div>
</template>

<script setup lang="ts">
import Stack from './Stack.vue'
const images = [
  { id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
  { id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
  { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
  { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" }
];
</script>`
});
