import code from '@/content/TextAnimations/GradientText/GradientText.vue?raw';
import { createCodeObject } from '@/types/code';

export const gradientText = createCodeObject(code, 'TextAnimations/GradientText', {
  installation: `npm install motion-v`,
  usage: `// For a smoother animation, the gradient should start and end with the same color

<template>
  <GradientText
    :colors="['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa']"
    :animation-speed="3"
    :show-border="false"
    class="custom-class"
  >
    Add a splash of color!
  </GradientText>
</template>

<script setup>
import GradientText from './GradientText.vue'
</script>  `
});
