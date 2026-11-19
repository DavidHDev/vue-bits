import code from '@/content/Animations/PixelTrail/PixelTrail.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelTrail = createCodeObject(code, 'Animations/PixelTrail', {
  dependencies: '',
  usage: `<template>
  <div style="height: 500px; position: relative; overflow: hidden">
    <PixelTrail
      :grid-size="50"
      :trail-size="0.1"
      :max-age="500"
      :interpolate="5"
      color="#7cff67"
    />
  </div>
</template>

<script setup lang="ts">
import PixelTrail from './PixelTrail.vue'
</script>`
});
