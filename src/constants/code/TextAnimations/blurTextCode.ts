import code from '@/content/TextAnimations/BlurText/BlurText.vue?raw';
import { createCodeObject } from '@/types/code';

export const blurText = createCodeObject(code, 'TextAnimations/BlurText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <BlurText
    text="Isn't this so cool?!"
    :delay="150"
    animate-by="words"
    direction="top"
    class="text-2xl mb-8"
    @animation-complete="handleAnimationComplete"
  />
</template>

<script setup>
import BlurText from './BlurText.vue'

const handleAnimationComplete = () => {
  console.log('Animation completed!')
}
</script>`
});
