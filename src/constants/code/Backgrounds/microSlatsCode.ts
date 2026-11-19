import code from '@/content/Backgrounds/MicroSlats/MicroSlats.vue?raw';
import { createCodeObject } from '@/types/code';

export const microSlats = createCodeObject(code, 'Backgrounds/MicroSlats', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <MicroSlats
      preset="swell"
      color="#7cff67"
      glint-color="#ffffff"
      background-color="#000000"
      :slat-width="10"
      :slat-height="25"
      :gap="3"
      :roundness="0.75"
      interactive
      :cursor-strength="1"
      :cursor-size="40"
      :swirl="0"
      :trail="1.4"
      :lean="0"
      intro
    />
  </div>
</template>

<script setup lang="ts">
import MicroSlats from './MicroSlats.vue';
</script>`
});
