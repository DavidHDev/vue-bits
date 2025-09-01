import code from '@content/Backgrounds/PixelBlast/PixelBlast.vue?raw';
import { createCodeObject } from '../../../types/code';

export const pixelBlast = createCodeObject(code, 'Backgrounds/PixelBlast', {
  installation: `npm install three postprocessing`,
  usage: `// Component inspired by github.com/zavalit/bayer-dithering-webgl-demo

<template>
  <div style="width: 100%; height: 600px; position: relative">
    <PixelBlast
      variant="circle"
      :pixel-size="6"
      color="#A7EF9E"
      :pattern-scale="3"
      :pattern-density="1.2"
      :pixel-size-jitter="0.5"
      :enable-ripples="true"
      :ripple-speed="0.4"
      :ripple-thickness="0.12"
      :ripple-intensity-scale="1.5"
      :liquid="true"
      :liquid-strength="0.12"
      :liquid-radius="1.2"
      :liquid-wobble-speed="5"
      :speed="0.6"
      :edge-fade="0.25"
      :transparent="true"
    />
  </div>
</template>

<script setup>
import PixelBlast from './PixelBlast.vue'
</script>`
});
