import code from '@/content/Backgrounds/SideRays/SideRays.vue?raw';
import { createCodeObject } from '@/types/code';

export const sideRays = createCodeObject(code, 'Backgrounds/SideRays', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <SideRays
      :speed="2.5"
      ray-color1="#EAB308"
      ray-color2="#96c8ff"
      :intensity="2"
      :spread="2"
      origin="top-right"
      :tilt="0"
      :saturation="1.5"
      :blend="0.75"
      :falloff="1.6"
      :opacity="1.0"
    />
  </div>
</template>

<script setup lang="ts">
import SideRays from './SideRays.vue'
</script>`
});
