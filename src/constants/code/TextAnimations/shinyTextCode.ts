import code from '@/content/TextAnimations/ShinyText/ShinyText.vue?raw';
import { createCodeObject } from '@/types/code';

export const shinyText = createCodeObject(code, 'TextAnimations/ShinyText', {
  dependencies: '',
  usage: `<template>
  <ShinyText
    text="Shiny Text Effect"
    color="#b5b5b5"
    shine-color="#ffffff"
    :speed="2"
    :shine-width="40"
    :softness="0.8"
    trigger="loop"
  />
</template>

<script setup lang="ts">
import ShinyText from './ShinyText.vue'
</script>`
});
