import code from '@content/Backgrounds/PixelSnow/PixelSnow.vue?raw';
import { createCodeObject } from '../../../types/code';

export const pixelSnow = createCodeObject(code, 'Backgrounds/PixelSnow', {
  installation: `npm install three`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <PixelSnow
      color="#ffffff"
      :flakeSize="0.01"
      :minFlakeSize="1.25"
      :pixelResolution="200"
      :speed="1.25"
      :density="0.3"
      :direction="125"
      :brightness="1"
    />
  </div>
</template>

<script setup>
import PixelSnow from './PixelSnow.vue'
</script>`
});
