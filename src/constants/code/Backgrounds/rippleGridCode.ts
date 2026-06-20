import code from '@/content/Backgrounds/RippleGrid/RippleGrid.vue?raw';
import { createCodeObject } from '@/types/code';

export const rippleGrid = createCodeObject(code, 'Backgrounds/RippleGrid', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      position: relative;
      height: 500px;
      overflow: hidden;
    "
  >
    <RippleGrid
      :enable-rainbow="false"
      grid-color="#ffffff"
      :ripple-intensity="0.05"
      :grid-size="10"
      :grid-thickness="15"
      :mouse-interaction="true"
      :mouse-interaction-radius="1.2"
      :opacity="0.8"
    />
  </div>
</template>

<script setup lang="ts">
import RippleGrid from './RippleGrid.vue'
</script>`
});
