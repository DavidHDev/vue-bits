import code from '@/content/Components/Stack/Stack.vue?raw';
import { createCodeObject } from '@/types/code';

export const stack = createCodeObject(code, 'Components/Stack', {
  installation: `npm install motion-v`,
  usage: `<template>
  <div style="width: 230px; height: 230px">
    <Stack
      layout="fan"
      :send-to-back-on-click="true"
      :cards="cards"
    />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import Stack from './Stack.vue'

const images = [
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format'
]

const cards = images.map((src, i) => h('img', { src, alt: \`Card \${i + 1}\` }))
</script>`
});
