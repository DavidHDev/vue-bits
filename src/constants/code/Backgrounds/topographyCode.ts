import code from '@/content/Backgrounds/Topography/Topography.vue?raw';
import { createCodeObject } from '@/types/code';

export const topography = createCodeObject(code, 'Backgrounds/Topography', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Topography
      color="#4f7cff"
      :line-count="22"
      :line-width="1.2"
      :elevation="1"
      :foreground="0.2"
      :tilt="32"
      :speed="0.25"
      direction="forward"
      :glow="0.6"
      :depth-of-field="0.4"
      :fog="0.35"
      hover-effect="lift"
      click-effect="pulse"
    />
  </div>
</template>

<script setup lang="ts">
import Topography from './Topography.vue';
</script>`
});
