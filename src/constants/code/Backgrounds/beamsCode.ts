import code from '@/content/Backgrounds/Beams/Beams.vue?raw';
import { createCodeObject } from '@/types/code';

export const beams = createCodeObject(code, 'Backgrounds/Beams', {
  installation: `npm install three @types/three`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Beams
      :beam-width="2"
      :beam-height="15"
      :beam-number="12"
      light-color="#ffffff"
      :speed="2"
      :noise-intensity="1.75"
      :scale="0.2"
      :rotation="0"
    />
  </div>
</template>

<script setup lang="ts">
import Beams from './Beams.vue'
</script>`
});
