import code from '@/content/Backgrounds/Galaxy/Galaxy.vue?raw';
import { createCodeObject } from '@/types/code';

export const galaxy = createCodeObject(code, 'Backgrounds/Galaxy', {
  installation: `npm install ogl`,
  usage: `<template>
  <!-- Basic usage -->
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Galaxy />
  </div>

  <!-- With custom prop values -->
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Galaxy
      :mouse-repulsion="true"
      :mouse-interaction="true"
      :density="1.5"
      :glow-intensity="0.5"
      :saturation="0.8"
      :hue-shift="240"
    />
  </div>
</template>

<script setup lang="ts">
import Galaxy from './Galaxy.vue'
</script>`
});
