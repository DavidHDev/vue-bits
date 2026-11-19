import code from '@/content/Backgrounds/PixelSnow/PixelSnow.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelSnow = createCodeObject(code, 'Backgrounds/PixelSnow', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <PixelSnow
      color="#ffffff"
      variant="snowflake"
      :density="0.5"
      :speed="1"
      :wind="0.25"
      :flake-size="1"
      :pixel-size="3"
      :glow="0.8"
      :mouse-interaction="true"
    />
  </div>
</template>

<script setup lang="ts">
import PixelSnow from './PixelSnow.vue';
</script>`
});
