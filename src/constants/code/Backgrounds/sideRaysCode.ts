import code from '@/content/Backgrounds/SideRays/SideRays.vue?raw';
import { createCodeObject } from '@/types/code';

export const sideRays = createCodeObject(code, 'Backgrounds/SideRays', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <SideRays
      ray-color1="#FFC46B"
      ray-color2="#96c8ff"
      origin="top-right"
      :speed="2.5"
      :intensity="2"
      :spread="2"
      :density="5"
      :follow-mouse="true"
    />
  </div>
</template>

<script setup lang="ts">
import SideRays from './SideRays.vue';
</script>`
});
