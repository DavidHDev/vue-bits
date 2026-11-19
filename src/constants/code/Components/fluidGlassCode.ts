import code from '@/content/Components/FluidGlass/FluidGlass.vue?raw';
import { createCodeObject } from '@/types/code';

export const fluidGlass = createCodeObject(code, 'Components/FluidGlass', {
  dependencies: '',
  usage: `<template>
  <div :style="{ width: '100%', height: '600px', position: 'relative' }">
    <FluidGlass
      text="Look closer."
      src="/hero.jpg"
      shape="lens"
      :size="260"
      :refraction="1"
      :dispersion="0.35"
      interaction="follow"
    />
  </div>
</template>

<script setup lang="ts">
import FluidGlass from './FluidGlass.vue'
</script>`
});
