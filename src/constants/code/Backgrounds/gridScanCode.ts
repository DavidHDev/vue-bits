import code from '@/content/Backgrounds/GridScan/GridScan.vue?raw';
import { createCodeObject } from '@/types/code';

export const gridScan = createCodeObject(code, 'Backgrounds/GridScan', {
  installation: `npm install three postprocessing face-api.js`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <GridScan
      :sensitivity="0.55"
      :line-thickness="1"
      lines-color="#2F293A"
      :grid-scale="0.1"
      scan-color="#FF9FFC"
      :scan-opacity="0.4"
      enable-post
      :bloom-intensity="0.6"
      :chromatic-aberration="0.002"
      :noise-intensity="0.01"
    />
  </div>
</template>

<script setup lang="ts">
import GridScan from './GridScan.vue'
</script>`
});
