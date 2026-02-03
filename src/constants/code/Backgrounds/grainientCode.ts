import code from '@content/Backgrounds/Grainient/Grainient.vue?raw';
import { createCodeObject } from '../../../types/code';

export const grainient = createCodeObject(code, 'Backgrounds/Grainient', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <Grainient
      color1="#5227FF"
      color2="#FF9FFC"
      color3="#B19EEF"
      :time-speed="0.25"
      :color-balance="0.0"
      :warp-strength="1.0"
      :warp-frequency="5.0"
      :warp-speed="2.0"
      :warp-amplitude="50.0"
      :blend-angle="0.0"
      :blend-softness="0.05"
      :rotation-amount="500.0"
      :noise-scale="2.0"
      :grain-amount="0.1"
      :grain-scale="2.0"
      :grain-animated="false"
      :contrast="1.5"
      :gamma="1.0"
      :saturation="1.0"
      :center-x="0.0"
      :center-y="0.0"
      :zoom="0.9"
    />
  </div>
</template>

<script setup lang="ts">
  import Grainient from "./Grainient.vue";
</script>`
});
