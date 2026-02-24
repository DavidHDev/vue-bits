import { createCodeObject } from '@/types/code';
import code from '@content/TextAnimations/BlurText/BlurText.vue?raw';

export const blurText = createCodeObject(code, 'TextAnimations/BlurText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <BlurText
    text="Isn't this so cool?!"
    animate-by="words"
    direction="top"
    :delay="200"
    class-name="text-2xl font-semibold text-center"
    @animation-complete="handleAnimationComplete"
  />
</template>

<script setup lang="ts">
  import BlurText from "./BlurText.vue";

  const handleAnimationComplete = () => {
    console.log('All animations complete!');
};
</script>`
});
