import code from '@content/Backgrounds/ShapeGrid/ShapeGrid.vue?raw';
import { createCodeObject } from '@/types/code';

export const shapeGrid = createCodeObject(code, 'Backgrounds/ShapeGrid', {
  usage: `<template>
  <div class="w-full h-[600px] relative">
    <ShapeGrid
      direction="diagonal"
      :speed="0.5"
      :square-size="40"
      border-color="#2F293A"
      hover-fill-color="#222222"
      shape="square"
      :hover-trail-amount="0"
    />
  </div>
</template>

<script setup lang="ts">
import ShapeGrid from "./ShapeGrid.vue";
</script>`
});
