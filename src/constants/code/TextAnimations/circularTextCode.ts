import code from '@/content/TextAnimations/CircularText/CircularText.vue?raw';
import { createCodeObject } from '@/types/code';

export const circularText = createCodeObject(code, 'TextAnimations/CircularText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <CircularText
    text="VUE*BITS*COMPONENTS*"
    on-hover="speedUp"
    direction="clockwise"
    :spin-duration="20"
    :size="200"
    :font-size="24"
    :draggable="true"
    :hover-tilt="20"
    class-name="custom-class"
  />
</template>

<script setup lang="ts">
import CircularText from './CircularText.vue'
</script>`
});
