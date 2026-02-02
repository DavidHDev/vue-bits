import { createCodeObject } from '@/types/code';
import code from '@content/TextAnimations/GradientText/GradientText.vue?raw';

export const gradientText = createCodeObject(code, 'TextAnimations/GradientText', {
  installation: `npm install motion-v`,
  usage: `// For a smoother animation, the gradient should start and end with the same color
<template>
  <GradientText
    :colors="['#27FF64', '#27FF64', '#A0FFBC']"
    :animation-speed="3"
    :show-border="false"
    class-name="your-custom-class"
  >
    Add a splash of color!
  </GradientText>
</template>

<script setup lang="ts">
  import GradientText from "./GradientText.vue";
</script>`
});
