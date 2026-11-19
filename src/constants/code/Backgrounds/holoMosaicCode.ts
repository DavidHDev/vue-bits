import code from '@/content/Backgrounds/HoloMosaic/HoloMosaic.vue?raw';
import { createCodeObject } from '@/types/code';

export const holoMosaic = createCodeObject(code, 'Backgrounds/HoloMosaic', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <HoloMosaic
      color="#111111"
      metal-color="#e8ebf1"
      spectrum="full"
      :tile-size="1"
      :gap="0.08"
      :scatter="0.3"
      :tilt="0.35"
      :saturation="0.1"
      :intensity="1.25"
      :ripple="0.6"
      :glitter="0.85"
      :sheen="0.8"
      :grain="0.08"
      :speed="0.5"
      :intro="true"
      :mouse-interaction="true"
      :flip-on-click="true"
    />
  </div>
</template>

<script setup lang="ts">
import HoloMosaic from './HoloMosaic.vue';
</script>`
});
