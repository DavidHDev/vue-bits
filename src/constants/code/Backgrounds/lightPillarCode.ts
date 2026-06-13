import code from '@/content/Backgrounds/LightPillar/LightPillar.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightPillar = createCodeObject(code, 'Backgrounds/LightPillar', {
  installation: `npm install three`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <LightPillar
      top-color="#5227FF"
      bottom-color="#FF9FFC"
      :intensity="1.0"
      :rotation-speed="0.3"
      :glow-amount="0.005"
      :pillar-width="3.0"
      :pillar-height="0.4"
      :noise-intensity="0.5"
      :pillar-rotation="0"
      :interactive="false"
      mix-blend-mode="normal"
    />
  </div>
</template>

<script setup lang="ts">
import LightPillar from './LightPillar.vue'
</script>`
});
