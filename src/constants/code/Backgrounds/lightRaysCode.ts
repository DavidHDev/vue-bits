import code from '@content/Backgrounds/LightRays/LightRays.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightRays = createCodeObject(code, 'Backgrounds/LightRays', {
  installation: `npm install ogl`,
  usage: `<template>
  <div class="w-full h-[600px] relative">
    <LightRays
      rays-origin="top-center"
      rays-color="#00ffff"
      :rays-speed="1.5"
      :light-spread="0.8"
      :ray-length="1.2"
      :follow-mouse="true"
      :mouse-influence="0.1"
      :noise-amount="0.1"
      :distortion="0.05"
      class-name="custom-rays"
    />
  </div>
</template>

<script setup lang="ts">
import LightRays from "./LightRays.vue";
</script>`
});
