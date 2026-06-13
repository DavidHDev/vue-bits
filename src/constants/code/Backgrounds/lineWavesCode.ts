import code from '@/content/Backgrounds/LineWaves/LineWaves.vue?raw';
import { createCodeObject } from '@/types/code';

export const lineWaves = createCodeObject(code, 'Backgrounds/LineWaves', {
  installation: `npm install ogl`,
  usage: `<template>
  <LineWaves
    :speed="0.3"
    :inner-line-count="32"
    :outer-line-count="36"
    :warp-intensity="1.0"
    :rotation="-45"
    :edge-fade-width="0.0"
    :color-cycle-speed="1.0"
    :brightness="0.2"
    color1="#ffffff"
    color2="#ffffff"
    color3="#ffffff"
    :enable-mouse-interaction="true"
    :mouse-influence="2.0"
  />
</template>

<script setup lang="ts">
import LineWaves from './LineWaves.vue'
</script>`
});
