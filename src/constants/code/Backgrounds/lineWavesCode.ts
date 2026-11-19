import code from '@/content/Backgrounds/LineWaves/LineWaves.vue?raw';
import { createCodeObject } from '@/types/code';

export const lineWaves = createCodeObject(code, 'Backgrounds/LineWaves', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <LineWaves
      color1="#ffffff"
      color2="#ffffff"
      color3="#ffffff"
      :speed="0.3"
      :line-count="72"
      :line-width="1.3"
      :highlight="1"
      :warp-intensity="1"
      :rotation="-33"
      :enable-mouse-interaction="true"
    />
  </div>
</template>

<script setup lang="ts">
import LineWaves from './LineWaves.vue'
</script>`
});
