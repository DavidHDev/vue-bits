import code from '@/content/TextAnimations/ScrollReveal/ScrollReveal.vue?raw';
import { createCodeObject } from '@/types/code';

export const scrollReveal = createCodeObject(code, 'TextAnimations/ScrollReveal', {
  installation: `npm install gsap`,
  usage: `<template>
  <ScrollReveal
    highlight-color=""
    mode="scrub"
    split-by="words"
    effect="fade"
    :stagger="0.05"
    :duration="0.8"
    :smoothing="0"
    :base-opacity="0.1"
    :base-rotation="3"
    :base-offset="0"
    :enable-blur="true"
    :blur-strength="4"
  >
    When does a man die? When he is hit by a bullet? No! When he suffers a disease?
    No! When he ate a soup made out of a poisonous mushroom?
    No! A man dies when he is forgotten!
  </ScrollReveal>
</template>

<script setup lang="ts">
import ScrollReveal from './ScrollReveal.vue'
</script>`
});
