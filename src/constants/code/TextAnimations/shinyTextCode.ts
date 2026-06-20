import code from '@/content/TextAnimations/ShinyText/ShinyText.vue?raw';
import { createCodeObject } from '@/types/code';

export const shinyText = createCodeObject(code, 'TextAnimations/ShinyText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <ShinyText
    text="✨ Shiny Text Effect"
    :speed="2"
    :delay="0"
    color="#b5b5b5"
    shine-color="#ffffff"
    :spread="120"
    direction="left"
    :yoyo="false"
    :pause-on-hover="false"
  />
</template>

<script setup>
import ShinyText from './ShinyText.vue'
</script>`
});
