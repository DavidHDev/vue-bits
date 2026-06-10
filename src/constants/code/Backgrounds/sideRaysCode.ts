import code from '@content/Backgrounds/SideRays/SideRays.vue?raw';
import { createCodeObject } from '@/types/code';

export const sideRays = createCodeObject(code, 'Backgrounds/SideRays', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <SideRays
      :speed="2.5"
      ray-color1="#27FF64"
      ray-color2="#A8FFB6"
      :intensity="2"
      :spread="2"
      origin="top-right"
      :tilt="0"
      :saturation="1.5"
      :blend="0.75"
      :falloff="2.0"
      :opacity="1"
    />
  </div>
</template>

<script setup lang="ts">
import SideRays from "./SideRays.vue";
</script>`
});
