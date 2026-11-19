import code from '@/content/Backgrounds/LightRays/LightRays.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightRays = createCodeObject(code, 'Backgrounds/LightRays', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <LightRays
      rays-origin="top-center"
      rays-color="#ffffff"
      :rays-speed="1"
      :light-spread="0.5"
      :ray-length="3"
      :glow="0.6"
      :haze="0.25"
      follow-mouse
      :mouse-influence="0.1"
    />
  </div>
</template>

<script setup lang="ts">
import LightRays from './LightRays.vue';
</script>`
});
