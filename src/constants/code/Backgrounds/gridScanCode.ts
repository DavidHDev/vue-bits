import code from '@content/Backgrounds/GridScan/GridScan.vue?raw';
import { createCodeObject } from '@/types/code';

export const gridScan = createCodeObject(code, 'Backgrounds/GridScan', {
  installation: `npm install three postprocessing face-api.js`,
  usage: `<template>
  <div class="w-full h-[600px] relative">
    <GridScan
      :line-thickness="1"
      :grid-scale="0.1"
      :line-jitter="0.1"
      lines-color="#392e4e"
      scan-color="#FF9FFC"
      :enable-post="true"
      :chromatic-aberration="0.002"
      :noise-intensity="0.01"
      :scan-glow="0.5"
      :scan-softness="2"
      :enable-webcam="false"
      :show-preview="false"
    />
  </div>
</template>

<script setup lang="ts">
import GridScan from "./GridScan.vue";
</script>`
});
