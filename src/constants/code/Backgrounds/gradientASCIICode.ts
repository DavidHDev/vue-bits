import code from '@/content/Backgrounds/GradientASCII/GradientASCII.vue?raw';
import { createCodeObject } from '@/types/code';

export const gradientASCII = createCodeObject(code, 'Backgrounds/GradientASCII', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <GradientASCII
      :colors="['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8']"
      shape="horizon"
      characters=" =+xX0S8#@"
      :cell-size="18"
      :density="0.8"
    />
  </div>
</template>

<script setup lang="ts">
import GradientASCII from './GradientASCII.vue'
</script>`
});
