import code from '@/content/Animations/Cubes/Cubes.vue?raw';
import { createCodeObject } from '@/types/code';

export const cubes = createCodeObject(code, 'Animations/Cubes', {
  installation: `npm install gsap`,
  usage: `// CREDIT
// Component inspired from Can Tastemel's original work for the lambda.ai landing page
// https://cantastemel.com

<template>
  <div
    style="
      height: 600px;
      position: relative;
    "
  >
    <Cubes
      :grid-size="8"
      :max-angle="60"
      :radius="4"
      border-style="2px dashed #5227FF"
      face-color="#0b0b0b"
      ripple-color="#ff6b6b"
      :ripple-speed="1.5"
      :auto-animate="true"
      :ripple-on-click="true"
    />
  </div>
</template>

<script setup lang="ts">
import Cubes from './Cubes.vue'
</script>`
});
