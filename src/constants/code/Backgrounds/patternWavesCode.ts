import code from '@/content/Backgrounds/PatternWaves/PatternWaves.vue?raw';
import { createCodeObject } from '@/types/code';

export const patternWaves = createCodeObject(code, 'Backgrounds/PatternWaves', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <PatternWaves
      preset="silk"
      color="#ffffff"
      background-color="#000000"
      fade="edges"
      :interactive="true"
      :cursor-size="50"
      :cursor-strength="0.6"
    />
  </div>
</template>

<script setup lang="ts">
import PatternWaves from './PatternWaves.vue'
</script>`
});
