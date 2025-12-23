import code from '@/content/Animations/Shuffle/Shuffle.vue?raw';
import { createCodeObject } from '@/types/code';

export const shuffle = createCodeObject(code, 'TextAnimations/Shuffle', {
  installation: `npm install gsap`,
  usage: `<template>
  <Shuffle
    text="Hello Vue"
    shuffle-direction="right"
    :duration="0.35"
    animation-mode="evenodd"
    :shuffle-times="1"
    ease="power3.out"
    :stagger="0.03"
    :threshold="0.1"
    :trigger-once="true"
    :trigger-on-hover="true"
    :respect-reduced-motion="true"
  />
</template>

<script setup lang="ts">
import Shuffle from './Shuffle.vue';
</script>`
});
