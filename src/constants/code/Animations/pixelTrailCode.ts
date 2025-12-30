import code from '@/content/Animations/PixelTrail/PixelTrail.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelTrail = createCodeObject(code, 'Animations/PixelTrail', {
  installation: `npm install three @types/three`,
  usage: `<template>
  <div class="relative w-full h-[400px]">
    <PixelTrail
      :grid-size="50"
      :trail-size="0.1"
      :max-age="250"
      :interpolate="5"
      color="#5227FF"
      :gooey-filter="{ id: 'goo-filter', strength: 2 }"
    />
  </div>
</template>

<script setup lang="ts">
  import PixelTrail from "./PixelTrail.vue";
</script>`
});
