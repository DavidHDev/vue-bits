import code from '@/content/Backgrounds/PixelBlast/PixelBlast.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelBlast = createCodeObject(code, 'Backgrounds/PixelBlast', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <PixelBlast
      variant="square"
      :pixel-size="3"
      color="#a0ffbc"
      :pattern-scale="2"
      :pattern-density="1"
      :softness="0.6"
      :glow="0.4"
      :twinkle="0.25"
      :drift="0.2"
      hover-effect="reveal"
      enable-ripples
      :edge-fade="0.25"
    />
  </div>
</template>

<script setup lang="ts">
import PixelBlast from './PixelBlast.vue';
</script>`
});
