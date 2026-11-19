import code from '@/content/Backgrounds/SlicedWaves/SlicedWaves.vue?raw';
import { createCodeObject } from '@/types/code';

export const slicedWaves = createCodeObject(code, 'Backgrounds/SlicedWaves', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <SlicedWaves
      color1="#ffd9a8"
      color2="#42b883"
      color3="#5b8cff"
      :ribbons="3"
      :spacing="28"
      :perspective="0.45"
      :blur="0.6"
      :glow="1"
      :position="0.78"
      :mouse-interaction="true"
    />
  </div>
</template>

<script setup lang="ts">
import SlicedWaves from './SlicedWaves.vue';
</script>`
});
