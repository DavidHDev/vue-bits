import code from '@/content/Animations/AnimatedContent/AnimatedContent.vue?raw';
import { createCodeObject } from '@/types/code';

export const animatedContent = createCodeObject(code, 'Animations/AnimatedContent', {
  installation: `npm install gsap`,
  usage: `<template>
  <AnimatedContent
    :distance="100"
    direction="vertical"
    :reverse="false"
    :duration="0.8"
    ease="power3.out"
    :initial-opacity="0"
    :animate-opacity="true"
    :scale="1"
    :threshold="0.1"
    :delay="0"
    :disappear-after="0"
    :disappear-duration="0.5"
    disappear-ease="power3.in"
    @complete="handleComplete"
    @disappearance-complete="handleDisappearance"
  >
    <div class="your-content">
      Content to animate
    </div>
  </AnimatedContent>
</template>

<script setup lang="ts">
  import AnimatedContent from "./AnimatedContent.vue";
  
  const handleComplete = () => {
    console.log("Animation completed!");
  };

  const handleDisappearance = () => {
    console.log("Disappearance completed!");
  };
</script>`
});
