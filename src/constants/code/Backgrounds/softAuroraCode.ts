import code from '@/content/Backgrounds/SoftAurora/SoftAurora.vue?raw';
import { createCodeObject } from '@/types/code';

export const softAurora = createCodeObject(code, 'Backgrounds/SoftAurora', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <SoftAurora
      :speed="0.6"
      :scale="1.5"
      :brightness="1"
      color1="#f7f7f7"
      color2="#7cff67"
      :band-height="0.5"
      :band-spread="1"
      enable-mouse-interaction
      :mouse-influence="0.25"
    />
  </div>
</template>

<script setup lang="ts">
import SoftAurora from './SoftAurora.vue';
</script>`
});
