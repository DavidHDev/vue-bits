import code from '@content/Backgrounds/GradientBlinds/GradientBlinds.vue?raw';
import { createCodeObject } from '../../../types/code';

export const gradientBlinds = createCodeObject(code, 'Backgrounds/GradientBlinds', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <GradientBlinds
      :gradient-colors="['#1EA03F', '#182FFF']"
      :angle="0"
      :noise="0.3"
      :blind-count="12"
      :blind-min-width="50"
      :spotlight-radius="0.5"
      :spotlight-softness="1"
      :spotlight-opacity="1"
      :mouse-dampening="0.15"
      :distort-amount="0"
      shine-direction="left"
      mix-blend-mode="lighten"
    />
  </div>
</template>

<script setup lang="ts">
  import GradientBlinds from "./GradientBlinds.vue";
</script>`
});
