import code from '@/content/Backgrounds/Particles/Particles.vue?raw';
import { createCodeObject } from '@/types/code';

export const particles = createCodeObject(code, 'Backgrounds/Particles', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Particles
      :particle-colors="['#ffffff']"
      :particle-count="200"
      :particle-spread="10"
      :speed="0.1"
      :particle-base-size="100"
      :glow="0.5"
      :twinkle="0.3"
      :move-particles-on-hover="true"
      hover-effect="parallax"
    />
  </div>
</template>

<script setup lang="ts">
import Particles from './Particles.vue';
</script>`
});
