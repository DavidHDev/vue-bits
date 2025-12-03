import code from '@content/Animations/FadeContent/FadeContent.vue?raw';
import { createCodeObject } from '@/types/code';

export const fadeContent = createCodeObject(code, 'Animations/FadeContent', {
  installation: `npm install gsap`,
  usage: `<template>
  <FadeContent
    :blur="true"
    :duration="1"
    :delay="0.2"
    :threshold="0.1"
    :initial-opacity="0"
    ease="power2.out"
    :disappear-after="0"
    :disappear-duration="0.5"
    disappear-ease="power2.in"
    class-name="my-fade-content"
    @complete="handleComplete"
    @disappearance-complete="handleDisappearance"
  >
    <div class="content-to-fade">
      <h2>This content will fade in!</h2>
      <p>It appears when scrolled into view.</p>
    </div>
  </FadeContent>
</template>

<script setup lang="ts">
  import FadeContent from "./FadeContent.vue";

  const handleComplete = () => {
    console.log("Fade completed!");
  };

  const handleDisappearance = () => {
    console.log("Disappearance completed!");
  };
</script>`
});
