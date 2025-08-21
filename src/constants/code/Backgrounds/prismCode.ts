import code from '@content/Backgrounds/Prism/Prism.vue?raw';
import { createCodeObject } from '../../../types/code';

export const prism = createCodeObject(code, 'Backgrounds/Prism', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <Prism
      animation-type="rotate"
      :time-scale="0.5"
      :height="3.5"
      :base-width="5.5"
      :scale="3.6"
      :hue-shift="0"
      :color-frequency="1"
      :noise="0.5"
      :glow="1"
    />
  </div>
</template>

<script setup lang="ts">
  import Prism from "./Prism.vue";
</script>`
});
