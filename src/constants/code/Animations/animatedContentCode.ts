import code from '@/content/Animations/AnimatedContent/AnimatedContent.vue?raw';
import { createCodeObject } from '@/types/code';

export const animatedContent = createCodeObject(code, 'Animations/AnimatedContent', {
  installation: `npm install gsap`,
  usage: `<template>
  <AnimatedContent
    :distance="100"
    direction="vertical"
    :duration="0.8"
    ease="power3.out"
    :blur="0"
    :stagger="0.08"
    :threshold="0.1"
  >
    <h2>Ship it before lunch</h2>
    <p>Every child animates in turn.</p>
  </AnimatedContent>
</template>

<script setup lang="ts">
import AnimatedContent from './AnimatedContent.vue'
</script>`
});
