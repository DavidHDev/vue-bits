import code from '@/content/Backgrounds/LiquidEther/LiquidEther.vue?raw';
import { createCodeObject } from '@/types/code';

export const liquidEther = createCodeObject(code, 'Backgrounds/LiquidEther', {
  installation: `npm install three`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <LiquidEther
      :colors="['#5227FF', '#FF9FFC', '#B497CF']"
      :mouse-force="20"
      :cursor-size="100"
      :is-viscous="false"
      :viscous="30"
      :iterations-viscous="32"
      :iterations-poisson="32"
      :resolution="0.5"
      :is-bounce="false"
      :auto-demo="true"
      :auto-speed="0.5"
      :auto-intensity="2.2"
      :takeover-duration="0.25"
      :auto-resume-delay="3000"
      :auto-ramp-duration="0.6"
    />
  </div>
</template>

<script setup lang="ts">
import LiquidEther from './LiquidEther.vue'
</script>`
});
