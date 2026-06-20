import code from '@/content/Backgrounds/Particles/Particles.vue?raw';
import { createCodeObject } from '@/types/code';

export const particles = createCodeObject(code, 'Backgrounds/Particles', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Particles
      :particle-colors="['#ffffff', '#ffffff']"
      :particle-count="200"
      :particle-spread="10"
      :speed="0.1"
      :particle-base-size="100"
      :move-particles-on-hover="true"
      :alpha-particles="false"
      :disable-rotation="false"
    />
  </div>
</template>

<script setup lang="ts">
import Particles from './Particles.vue'
</script>`
});
