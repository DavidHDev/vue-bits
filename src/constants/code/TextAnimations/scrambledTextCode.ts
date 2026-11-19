import code from '@/content/TextAnimations/ScrambledText/ScrambledText.vue?raw';
import { createCodeObject } from '@/types/code';

export const scrambledText = createCodeObject(code, 'TextAnimations/ScrambledText', {
  installation: `npm install gsap`,
  usage: `<template>
  <ScrambledText
    class-name="scrambled-text-demo"
    effect="scramble"
    :radius="100"
    :strength="1"
    :trail="0.6"
    :duration="1.2"
    :speed="0.5"
    scramble-chars=".:"
    :click-burst="true"
    :intro="true"
  >
    Lorem ipsum dolor sit amet consectetur adipisicing elit.
    Similique pariatur dignissimos porro eius quam doloremque
    et enim velit nobis maxime.
  </ScrambledText>
</template>

<script setup lang="ts">
import ScrambledText from './ScrambledText.vue'
</script>`
});
