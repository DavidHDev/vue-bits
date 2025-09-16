import code from '@content/Backgrounds/GradientBlinds/GradientBlinds.vue?raw';
import { createCodeObject } from '../../../types/code';

export const gradientBlinds = createCodeObject(code, 'Backgrounds/GradientBlinds', {
  installation: `npm install ogl`,
  usage: `<template>
  <div class="gradient-blinds-container">
    <GradientBlinds
      :gradient-colors="['#FF9FFC', '#5227FF']"
      :angle="20"
      :noise="0.5"
      :blind-count="16"
      :blind-min-width="60"
      :spotlight-radius="0.5"
      :spotlight-softness="1"
      :spotlight-opacity="1"
      :distort-amount="0"
      :mouse-dampening="0.15"
      :shine-direction="'left'"
      :mirror-gradient="false"
      :mix-blend-mode="'lighten'"
      :paused="false"
      class="w-full h-full"
    />
  </div>
</template>

<script setup lang="ts">
  import GradientBlinds from "./GradientBlinds.vue";
</script>

<style scoped>
  .gradient-blinds-container {
    width: 100%;
    height: 500px;
    position: relative;
    overflow: hidden;
  }
</style>`
});