import { createCodeObject } from '@/types/code';
import code from '@content/TextAnimations/ShinyText/ShinyText.vue?raw';

export const shinyText = createCodeObject(code, 'TextAnimations/ShinyText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <ShinyText 
    text="✨ Shiny Text Effect"
    :speed="2"
    :delay="0.5"
    :disabled="false"
    :color="'#b5b5b5'"
    :shine-color="'#ffffff'"
    :spread="120"
    :direction="'left'"
    :yoyo="false"
    :pause-on-hover="false"
  />
</template>

<script setup lang="ts">
  import ShinyText from "./ShinyText.vue";
</script>`
});
