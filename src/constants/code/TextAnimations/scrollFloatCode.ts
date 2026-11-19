import code from '@/content/TextAnimations/ScrollFloat/ScrollFloat.vue?raw';
import { createCodeObject } from '@/types/code';

export const scrollFloat = createCodeObject(code, 'TextAnimations/ScrollFloat', {
  installation: `npm install gsap`,
  usage: `<template>
  <ScrollFloat
    effect="float"
    split-by="chars"
    direction="up"
    order="start"
    from-color="currentColor"
    :animation-duration="1"
    ease="back.inOut(2)"
    scroll-start="center bottom+=50%"
    scroll-end="bottom bottom-=40%"
    :stagger="0.03"
    :distance="120"
    :stretch="2.3"
    :smoothing="0"
  >
    Vue Bits
  </ScrollFloat>
</template>

<script setup lang="ts">
import ScrollFloat from './ScrollFloat.vue'
</script>`
});
