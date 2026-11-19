import code from '@/content/Backgrounds/LightPillar/LightPillar.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightPillar = createCodeObject(code, 'Backgrounds/LightPillar', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <LightPillar
      top-color="#42b883"
      bottom-color="#a0ffbc"
      :intensity="1"
      :glow-amount="0.002"
      :bloom="0.5"
      :pillar-width="3"
      :pillar-height="0.4"
      :pillar-rotation="25"
      :rotation-speed="0.3"
      interactive
      click-pulse
      intro
      quality="high"
      mix-blend-mode="screen"
    />
  </div>
</template>

<script setup lang="ts">
import LightPillar from './LightPillar.vue';
</script>`
});
