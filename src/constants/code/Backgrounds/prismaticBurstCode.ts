import code from '@content/Backgrounds/PrismaticBurst/PrismaticBurst.vue?raw';
import { createCodeObject } from '../../../types/code';

export const prismaticBurst = createCodeObject(code, 'Backgrounds/PrismaticBurst', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <PrismaticBurst
      animationType="rotate3d"
      :intensity="2"
      :speed="0.5"
      :distort="1.0"
      :paused="false"
      :offset="{ x: 0, y: 0 }"
      :hoverDampness="0.25"
      :rayCount="24"
      mixBlendMode="lighten"
      :colors="['#ff007a', '#4d3dff', '#ffffff']"
    />
  </div>
</template>

<script setup lang="ts">
  import PrismaticBurst from "./PrismaticBurst.vue";
</script>`
});
