import code from '@content/Backgrounds/LightPillar/LightPillar.vue?raw';
import { createCodeObject } from '../../../types/code';

export const lightPillar = createCodeObject(code, 'Backgrounds/LightPillar', {
  installation: `npm install three`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <LightPillar
      topColor="#48FF28"
      bottomColor="#9EF19E"
      :intensity="1.0"
      :rotationSpeed="0.3"
      :glowAmount="0.005"
      :pillarWidth="3.0"
      :pillarHeight="0.4"
      :noiseIntensity="0.5"
      :pillarRotation="0"
      :interactive="false"
      mixBlendMode="normal"
    />
  </div>
</template>

<script setup>
import LightPillar from './LightPillar.vue'
</script>`
});
