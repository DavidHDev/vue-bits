import code from '@/content/Backgrounds/GradientWaves/GradientWaves.vue?raw';
import { createCodeObject } from '@/types/code';

export const gradientWaves = createCodeObject(code, 'Backgrounds/GradientWaves', {
  dependencies: '',
  usage: `<template>
  <div :style="{ width: '100%', height: '600px', position: 'relative' }">
    <GradientWaves
      horizon-color="#42b883"
      wave-color="#a0ffbc"
      crest-color="#FFFFFF"
      :speed="0.4"
      :amplitude="2.5"
      :relief="1"
      :light-angle="120"
      :mouse-interaction="true"
      :swell-on-click="true"
    />
  </div>
</template>

<script setup lang="ts">
import GradientWaves from './GradientWaves.vue'
</script>`
});
