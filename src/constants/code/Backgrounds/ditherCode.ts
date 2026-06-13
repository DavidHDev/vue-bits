import code from '@/content/Backgrounds/Dither/Dither.vue?raw';
import { createCodeObject } from '@/types/code';

export const dither = createCodeObject(code, 'Backgrounds/Dither', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Dither
      :wave-color="[0.5, 0.5, 0.5]"
      :disable-animation="false"
      :enable-mouse-interaction="true"
      :mouse-radius="0.3"
      :color-num="4"
      :wave-amplitude="0.3"
      :wave-frequency="3"
      :wave-speed="0.05"
    />
  </div>
</template>

<script setup lang="ts">
import Dither from './Dither.vue'
</script>`
});
