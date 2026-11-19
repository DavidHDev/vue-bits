import code from '@/content/TextAnimations/RotatingText/RotatingText.vue?raw';
import { createCodeObject } from '@/types/code';

export const rotatingText = createCodeObject(code, 'TextAnimations/RotatingText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <RotatingText
    :texts="['Vue', 'Bits', 'Is', 'Cool!']"
    effect="slide"
    direction="up"
    :highlight="true"
    highlight-color="#7cff67"
    stagger-from="last"
    :stagger-duration="0.025"
    split-level-class-name="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
    :rotation-interval="2000"
  />
</template>

<script setup lang="ts">
import RotatingText from './RotatingText.vue'
</script>`
});
