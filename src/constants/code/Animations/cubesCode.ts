import code from '@/content/Animations/Cubes/Cubes.vue?raw';
import { createCodeObject } from '@/types/code';

export const cubes = createCodeObject(code, 'Animations/Cubes', {
  dependencies: '',
  usage: `// CREDIT
// Component inspired from Can Tastemel's original work for the lambda.ai landing page
// https://cantastemel.com

<template>
  <div style="height: 600px; position: relative">
    <Cubes
      :grid-size="10"
      face-color="#111111"
      edge-color="#ffffff"
      :max-angle="45"
      :radius="3"
    />
  </div>
</template>

<script setup lang="ts">
import Cubes from './Cubes.vue'
</script>`
});
