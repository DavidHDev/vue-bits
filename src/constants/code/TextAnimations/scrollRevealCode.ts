import code from '@/content/TextAnimations/ScrollReveal/ScrollReveal.vue?raw';
import { createCodeObject } from '@/types/code';

export const scrollRevealCode = createCodeObject(code, 'TextAnimations/ScrollReveal', {
  installation: `npm install gsap`,
  usage: `<template>
  <ScrollReveal
    :base-opacity="0"
    :enable-blur="true"
    :base-rotation="5"
    :blur-strength="10"
  >
    When does a man die? When he is hit by a bullet? No! When he suffers a disease?
    No! When he ate a soup made out of a poisonous mushroom?
    No! A man dies when he is forgotten!
  </ScrollReveal>
</template>

<script setup>
import ScrollReveal from './ScrollReveal.vue'
</script>`
});
