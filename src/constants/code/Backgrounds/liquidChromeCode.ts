import code from '@/content/Backgrounds/LiquidChrome/LiquidChrome.vue?raw';
import { createCodeObject } from '@/types/code';

export const liquidChrome = createCodeObject(code, 'Backgrounds/LiquidChrome', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <LiquidChrome
      :base-color="[0.1, 0.1, 0.1]"
      :speed="1"
      :amplitude="0.6"
      :interactive="true"
    />
  </div>
</template>

<script setup lang="ts">
import LiquidChrome from './LiquidChrome.vue'
</script>`
});
