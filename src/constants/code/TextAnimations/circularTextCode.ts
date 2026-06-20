import code from '@/content/TextAnimations/CircularText/CircularText.vue?raw';
import { createCodeObject } from '@/types/code';

export const circularText = createCodeObject(code, 'TextAnimations/CircularText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <CircularText
    text="VUE*BITS*COMPONENTS*"
    on-hover="speedUp"
    :spin-duration="20"
    class="custom-class"
  />
</template>

<script setup>
import CircularText from './CircularText.vue'
</script>`
});
