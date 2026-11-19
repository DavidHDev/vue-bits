import code from '@/content/Animations/FadeContent/FadeContent.vue?raw';
import { createCodeObject } from '@/types/code';

export const fadeContent = createCodeObject(code, 'Animations/FadeContent', {
  installation: `npm install gsap`,
  usage: `<template>
  <FadeContent
    effect="mist"
    :duration="1.8"
    ease="power2.out"
    :stagger="0.1"
    :threshold="0.1"
  >
    <h2>Slow light over the bay</h2>
    <p>Every child fades in turn.</p>
  </FadeContent>
</template>

<script setup lang="ts">
import FadeContent from './FadeContent.vue'
</script>`
});
