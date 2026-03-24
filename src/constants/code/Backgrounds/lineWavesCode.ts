import code from '@content/Backgrounds/LineWaves/LineWaves.vue?raw';
import { createCodeObject } from '../../../types/code';

export const lineWaves = createCodeObject(code, 'Backgrounds/LineWaves', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <LineWaves
        :speed="0.3"
        :innerLineCount="32"
        :outerLineCount="36"
        :warpIntensity="1"
        :rotation="-45"
        :edgeFadeWidth="0"
        :colorCycleSpeed="1"
        :brightness="0.2"
        :color1="#ffffff"
        :color2="#ffffff"
        :color3="#ffffff"
        :enableMouseInteraction="true"
        :mouseInfluence="2"
    />
  </div>
</template>

<script setup lang="ts">
  import LineWaves from "./LineWaves.vue";
</script>`
});
