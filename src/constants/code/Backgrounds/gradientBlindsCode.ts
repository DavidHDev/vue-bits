import code from '@/content/Backgrounds/GradientBlinds/GradientBlinds.vue?raw';
import { createCodeObject } from '@/types/code';

export const gradientBlinds = createCodeObject(code, 'Backgrounds/GradientBlinds', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <GradientBlinds
      :gradient-colors="['#a0ffbc', '#42b883']"
      :angle="20"
      :blind-count="16"
      :blind-min-width="60"
      :spotlight-radius="0.5"
      :shine="0.4"
      :relief="0.5"
      :glow="0.4"
      :sway="0.35"
      :hover-tilt="0.6"
      click-effect="ripple"
      :noise="0.3"
    />
  </div>
</template>

<script setup lang="ts">
import GradientBlinds from './GradientBlinds.vue';
</script>`
});
