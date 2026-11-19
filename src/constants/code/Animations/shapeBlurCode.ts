import code from '@/content/Animations/ShapeBlur/ShapeBlur.vue?raw';
import { createCodeObject } from '@/types/code';

export const shapeBlur = createCodeObject(code, 'Animations/ShapeBlur', {
  dependencies: '',
  usage: `<template>
  <div style="position: relative; height: 500px">
    <ShapeBlur
      :size="0.6"
      :fill="true"
      color="#ffffff"
      :blur="16"
      :lens-size="0.3"
      :lens-softness="0.7"
      :chroma="0.3"
      :idle="true"
    />
  </div>
</template>

<script setup lang="ts">
import ShapeBlur from './ShapeBlur.vue'
</script>`
});
