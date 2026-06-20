import code from '@/content/Animations/PixelTrail/PixelTrail.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelTrail = createCodeObject(code, 'Animations/PixelTrail', {
  installation: `npm install three @types/three`,
  usage: `<template>
  <div
    style="
      height: 500px;
      position: relative;
      overflow: hidden;
    "
  >
    <PixelTrail
      :grid-size="50"
      :trail-size="0.1"
      :max-age="250"
      :interpolate="5"
      color="#fff"
      :gooey-filter="{
        id: 'custom-goo-filter',
        strength: 2
      }"
    />
  </div>
</template>

<script setup lang="ts">
import PixelTrail from './PixelTrail.vue'
</script>`
});
