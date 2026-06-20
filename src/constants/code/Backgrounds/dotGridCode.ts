import code from '@/content/Backgrounds/DotGrid/DotGrid.vue?raw';
import { createCodeObject } from '@/types/code';

export const dotGrid = createCodeObject(code, 'Backgrounds/DotGrid', {
  installation: `npm install gsap`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <DotGrid
      :dot-size="10"
      :gap="15"
      base-color="#5227FF"
      active-color="#5227FF"
      :proximity="120"
      :shock-radius="250"
      :shock-strength="5"
      :resistance="750"
      :return-duration="1.5"
    />
  </div>
</template>

<script setup lang="ts">
import DotGrid from './DotGrid.vue'
</script>`
});
