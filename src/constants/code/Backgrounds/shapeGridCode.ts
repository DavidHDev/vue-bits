import code from '@/content/Backgrounds/ShapeGrid/ShapeGrid.vue?raw';
import { createCodeObject } from '@/types/code';

export const shapeGrid = createCodeObject(code, 'Backgrounds/ShapeGrid', {
  usage: `<template>
  <ShapeGrid
    :speed="0.5"
    :square-size="40"
    direction="diagonal"
    border-color="#fff"
    hover-fill-color="#222"
    shape="square"
    :hover-trail-amount="5"
  />
</template>

<script setup lang="ts">
import ShapeGrid from './ShapeGrid.vue'
</script>`
});
