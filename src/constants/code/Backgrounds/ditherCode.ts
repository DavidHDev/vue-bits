import code from '@/content/Backgrounds/Dither/Dither.vue?raw';
import { createCodeObject } from '@/types/code';

export const dither = createCodeObject(code, 'Backgrounds/Dither', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Dither
      wave-color="#bcbcbc"
      background-color="#111111"
      dither-mode="bayer"
      :color-num="4"
      :pixel-size="2"
      :wave-speed="0.05"
      :wave-frequency="3"
      :wave-amplitude="0.3"
      mouse-effect="erase"
      :mouse-radius="0.3"
    />
  </div>
</template>

<script setup lang="ts">
import Dither from './Dither.vue';
</script>`
});
