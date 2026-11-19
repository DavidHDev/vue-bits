import code from '@/content/Animations/ElectricLogo/ElectricLogo.vue?raw';
import { createCodeObject } from '@/types/code';

export const electricLogo = createCodeObject(code, 'Animations/ElectricLogo', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 480px; position: relative">
    <ElectricLogo
      src="/logo.svg"
      color="#dcffd5"
      glow-color="#7cff67"
      :scale="0.7"
      :strands="4"
      :bend="0.6"
      :crackle="1.5"
      :arcs="1"
      :speed="2.5"
      interactive
    />
  </div>
</template>

<script setup lang="ts">
import ElectricLogo from './ElectricLogo.vue'
</script>`
});
