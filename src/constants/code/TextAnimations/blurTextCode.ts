import code from '@/content/TextAnimations/BlurText/BlurText.vue?raw';
import { createCodeObject } from '@/types/code';

export const blurText = createCodeObject(code, 'TextAnimations/BlurText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <BlurText
    text="Isn't this so cool?!"
    effect="blur"
    animate-by="words"
    direction="top"
    stagger-from="start"
    trigger="view"
    :delay="200"
    :step-duration="0.35"
    :blur="10"
    :distance="50"
    :on-animation-complete="handleAnimationComplete"
    class-name="text-2xl mb-8"
  />
</template>

<script setup lang="ts">
import BlurText from './BlurText.vue'

const handleAnimationComplete = () => {
  console.log('Animation completed!')
}
</script>`
});
