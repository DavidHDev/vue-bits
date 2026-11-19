import code from '@/content/TextAnimations/MaskedHeading/MaskedHeading.vue?raw';
import { createCodeObject } from '@/types/code';

export const maskedHeading = createCodeObject(code, 'TextAnimations/MaskedHeading', {
  installation: `npm install gsap`,
  usage: `<template>
  <MaskedHeading
    text="Shot on location"
    media-type="video"
    src="/reel.mp4"
    poster="/reel-poster.jpg"
    :fill-scale="1.3"
    :parallax="34"
    reveal="scale"
    trigger="view"
    :spotlight="true"
    :spotlight-radius="180"
    :outline="true"
  />
</template>

<script setup lang="ts">
import MaskedHeading from './MaskedHeading.vue'
</script>`
});
