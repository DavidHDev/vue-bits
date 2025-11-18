import code from '@content/Backgrounds/FloatingLines/FloatingLines.vue?raw';
import { createCodeObject } from '../../../types/code';

export const floatingLines = createCodeObject(code, 'Backgrounds/FloatingLines', {
  installation: `npm install three`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <FloatingLines 
      :enabled-waves="['top', 'middle', 'bottom']"
      // Array - specify line count per wave; Number - same count for all waves
      :line-count="[10, 15, 20]"
      // Array - specify line distance per wave; Number - same distance for all waves
      :line-distance="[8, 6, 4]"
      :bend-radius="5.0"
      :bend-strength="-0.5"
      :interactive="true"
      :parallax="true"
    />
  </div>
</template>

<script setup>
import FloatingLines from './FloatingLines.vue'
</script>`
});
