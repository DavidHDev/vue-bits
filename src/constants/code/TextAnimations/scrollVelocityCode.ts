import code from '@/content/TextAnimations/ScrollVelocity/ScrollVelocity.vue?raw';
import { createCodeObject } from '@/types/code';

export const scrollVelocity = createCodeObject(code, 'TextAnimations/ScrollVelocity', {
  installation: `npm install gsap`,
  usage: `<template>
  <ScrollVelocity
    :texts="['Vue Bits', 'Scroll Down']"
    :velocity="velocity"
    class="custom-scroll-text"
  />
</template>

<script setup>
import { ref } from 'vue'
import ScrollVelocity from './ScrollVelocity.vue'

const velocity = ref(100)
</script>`
});
