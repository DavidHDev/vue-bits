import code from '@/content/Backgrounds/ShapeGrid/ShapeGrid.vue?raw';
import { createCodeObject } from '@/types/code';

export const shapeGrid = createCodeObject(code, 'Backgrounds/ShapeGrid', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <ShapeGrid
      shape="square"
      direction="diagonal"
      line-color="#272a27"
      hover-color="#ffffff"
      hover-fill-color="#ffffff"
      :fill-opacity="0.15"
      :cell-size="40"
      :speed="0.5"
      :tilt-x="0"
      :tilt-y="0"
      :rainbow="false"
    />
  </div>
</template>

<script setup lang="ts">
import ShapeGrid from './ShapeGrid.vue';
</script>`
});
