import code from '@/content/TextAnimations/ScrollVelocity/ScrollVelocity.vue?raw';
import { createCodeObject } from '@/types/code';

export const scrollVelocity = createCodeObject(code, 'TextAnimations/ScrollVelocity', {
  installation: `npm install motion-v`,
  usage: `<template>
  <ScrollVelocity
    :texts="['Vue Bits', 'Scroll Down']"
    :velocity="100"
    :skew-with-velocity="16"
    :scale-with-velocity="0.18"
    :draggable="true"
    :font-size="104"
    :font-weight="900"
    class-name="custom-scroll-text"
  />
</template>

<script setup lang="ts">
import ScrollVelocity from './ScrollVelocity.vue'
</script>`
});
