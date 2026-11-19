import code from '@/content/TextAnimations/GradientText/GradientText.vue?raw';
import { createCodeObject } from '@/types/code';

export const gradientText = createCodeObject(code, 'TextAnimations/GradientText', {
  dependencies: '',
  usage: `<template>
  <GradientText
    :colors="['#42b883', '#7cff67', '#a0ffbc']"
    :animation-speed="8"
    variant="flow"
    :glow="0.4"
  >
    Add a splash of color!
  </GradientText>
</template>

<script setup lang="ts">
import GradientText from './GradientText.vue'
</script>`
});
