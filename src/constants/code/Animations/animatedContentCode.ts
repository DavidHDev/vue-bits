import code from '@/content/Animations/AnimatedContent/AnimatedContent.vue?raw';
import { createCodeObject } from '@/types/code';

export const animatedContent = createCodeObject(code, 'Animations/AnimatedContent', {
  installation: `npm install gsap`,
  usage: `<template>
  <AnimatedContent
    :distance="150"
    direction="horizontal"
    :reverse="false"
    :duration="1.2"
    ease="bounce.out"
    :initial-opacity="0.2"
    :animate-opacity="true"
    :scale="1.1"
    :threshold="0.2"
    :delay="0.3"
  >
    <div>Content to Animate</div>
  </AnimatedContent>
</template>

<script setup lang="ts">
import AnimatedContent from './AnimatedContent.vue'
</script>`
});
