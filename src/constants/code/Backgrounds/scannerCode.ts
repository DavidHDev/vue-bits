import code from '@/content/Backgrounds/Scanner/Scanner.vue?raw';
import { createCodeObject } from '@/types/code';

export const scanner = createCodeObject(code, 'Backgrounds/Scanner', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Scanner
      color1="#42b883"
      color2="#7cff67"
      color3="#FFFFFF"
      :speed="0.5"
      :sweep-speed="0.25"
      :sweep-width="1.6"
      :trail="0.5"
      :ripple="0.22"
      :band-density="11"
      :glow="0.6"
      scan-direction="vertical"
      :color-spread="0.7"
      :scanline="true"
      :scanline-intensity="0.5"
      :mouse-interaction="true"
      click-effect="ping"
    />
  </div>
</template>

<script setup lang="ts">
import Scanner from './Scanner.vue';
</script>`
});
