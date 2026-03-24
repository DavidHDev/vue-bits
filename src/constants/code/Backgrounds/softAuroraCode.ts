import code from '@content/Backgrounds/SoftAurora/SoftAurora.vue?raw';
import { createCodeObject } from '../../../types/code';

export const softAurora = createCodeObject(code, 'Backgrounds/SoftAurora', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <SoftAurora
        :speed="0.6"
        :scale="1.5"
        :brightness="1"
        :color1="'#f7f7f7'"
        :color2="'#27FF64'"
        :noise-frequency="2.5"
        :noise-amplitude="1"
        :band-height="0.5"
        :band-spread="1"
        :octave-decay="0.1"
        :layer-offset="0"
        :color-speed="1"
        :enable-mouse-interaction="true"
        :mouse-influence="0.25"
    />
  </div>
</template>

<script setup lang="ts">
  import SoftAurora from "./SoftAurora.vue";
</script>`
});
