import code from '@/content/Animations/DitherVeil/DitherVeil.vue?raw';
import { createCodeObject } from '@/types/code';

export const ditherVeil = createCodeObject(code, 'Animations/DitherVeil', {
  usage: `<script setup>
import DitherVeil from './DitherVeil.vue'
</script>

<template>
<!-- move the cursor over the image to reveal it in colour -->
<DitherVeil src="/photo.jpg" />

<DitherVeil
  src="/photo.jpg"
  fit="contain"
  pattern="floyd"
  :pixelSize="2"
  :levels="2"
  palette="duotone"
  inkColor="#120f17"
  paperColor="#f4f1ea"
  :contrast="1.15"
  :brightness="0"
  :revealRadius="200"
  :softness="0.6"
  :linger="1"
  rimColor="#a78bfa"
  :rim="0"
  :reverse="false"
  :wander="false"
  clickBurst
/>
</template>`
});
