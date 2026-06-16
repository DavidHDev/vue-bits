import code from '@/content/Backgrounds/SoftAurora/SoftAurora.vue?raw';
import { createCodeObject } from '@/types/code';

export const softAurora = createCodeObject(code, 'Backgrounds/SoftAurora', {
  installation: `npm install ogl`,
  usage: `<template>
  <SoftAurora
    :speed="0.6"
    :scale="1.5"
    :brightness="1.0"
    color1="#f7f7f7"
    color2="#e100ff"
    :noise-frequency="2.5"
    :noise-amplitude="1.0"
    :band-height="0.5"
    :band-spread="1.0"
    :octave-decay="0.1"
    :layer-offset="0"
    :color-speed="1.0"
    :enable-mouse-interaction="true"
    :mouse-influence="0.25"
  />
</template>

<script setup lang="ts">
import SoftAurora from './SoftAurora.vue'
</script>`
});
