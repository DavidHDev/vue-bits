import code from '@/content/TextAnimations/ScrollFloat/ScrollFloat.vue?raw';
import { createCodeObject } from '@/types/code';

export const scrollFloatCode = createCodeObject(code, 'TextAnimations/ScrollFloat', {
  installation: `npm install gsap`,
  usage: `<template>
  <ScrollFloat
    :animation-duration="1"
    ease="back.inOut(2)"
    scroll-start="center bottom+=50%"
    scroll-end="bottom bottom-=40%"
    :stagger="0.03"
  >
    Vue Bits
  </ScrollFloat>
</template>

<script setup>
import ScrollFloat from './ScrollFloat.vue'
</script>`
});
