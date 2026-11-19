import code from '@/content/Backgrounds/FloatingLines/FloatingLines.vue?raw';
import { createCodeObject } from '@/types/code';

export const floatingLines = createCodeObject(code, 'Backgrounds/FloatingLines', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <FloatingLines
      :lines-gradient="['#7cff67', '#ffffff']"
      :enabled-waves="['top', 'middle', 'bottom']"
      :line-count="10"
      :line-distance="6"
      :bend-strength="-0.5"
      :interactive="true"
      :click-swirl="true"
    />
  </div>
</template>

<script setup lang="ts">
import FloatingLines from './FloatingLines.vue'
</script>`
});
