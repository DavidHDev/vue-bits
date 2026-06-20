import code from '@/content/Animations/ShapeBlur/ShapeBlur.vue?raw';
import { createCodeObject } from '@/types/code';

export const shapeBlur = createCodeObject(code, 'Animations/ShapeBlur', {
  installation: `npm install three @types/three`,
  usage: `<template>
  <div
    style="
      position: relative;
      height: 500px;
      overflow: hidden;
    "
  >
    <ShapeBlur
      :variation="0"
      :pixel-ratio-prop="pixelRatio"
      :shape-size="0.5"
      :roundness="0.5"
      :border-size="0.05"
      :circle-size="0.5"
      :circle-edge="1"
    />
  </div>
</template>

<script setup lang="ts">
import ShapeBlur from './ShapeBlur.vue'

const pixelRatio = window.devicePixelRatio || 1
</script>`
});
