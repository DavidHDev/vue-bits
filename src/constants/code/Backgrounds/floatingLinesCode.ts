import code from '@/content/Backgrounds/FloatingLines/FloatingLines.vue?raw';
import { createCodeObject } from '@/types/code';

export const floatingLines = createCodeObject(code, 'Backgrounds/FloatingLines', {
  installation: `npm install three`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <FloatingLines
      :enabled-waves="['top', 'middle', 'bottom']"
      :line-count="[10, 15, 20]"
      :line-distance="[8, 6, 4]"
      :bend-radius="5.0"
      :bend-strength="-0.5"
      :interactive="true"
      :parallax="true"
    />
  </div>
</template>

<script setup lang="ts">
import FloatingLines from './FloatingLines.vue'
</script>`
});
