import code from '@content/Components/FluidGlass/FluidGlass.vue?raw';
import { createCodeObject } from '../../../types/code';

export const fluidGlass = createCodeObject(code, 'Components/FluidGlass', {
  installation: `npm install three`,
  usage: `<template>
  <div class="h-[520px]">
    <FluidGlass
      mode="lens"
      title="Vue Bits"
      :images="images"
      :lens-props="{
        scale: 0.25,
        ior: 1.15,
        thickness: 2,
        chromaticAberration: 0.05,
        anisotropy: 0.01
      }"
    />
  </div>
</template>

<script setup lang="ts">
  import FluidGlass from './FluidGlass.vue';

  const images = [
    '/images/fluid-glass-1.webp',
    '/images/fluid-glass-2.webp',
    '/images/fluid-glass-3.webp',
    '/images/fluid-glass-1.webp',
    '/images/fluid-glass-2.webp'
  ];
</script>`
});
