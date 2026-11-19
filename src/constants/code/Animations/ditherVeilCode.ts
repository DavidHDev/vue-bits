import code from '@/content/Animations/DitherVeil/DitherVeil.vue?raw';
import { createCodeObject } from '@/types/code';

export const ditherVeil = createCodeObject(code, 'Animations/DitherVeil', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <DitherVeil
      src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop"
      pattern="floyd"
      :pixel-size="2"
      ink-color="#111111"
      paper-color="#f4f1ea"
      :reveal-radius="200"
      :softness="0.6"
      :linger="1"
    />
  </div>
</template>

<script setup lang="ts">
import DitherVeil from './DitherVeil.vue'
</script>`
});
