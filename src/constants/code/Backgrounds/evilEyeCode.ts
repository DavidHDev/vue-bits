import code from '@content/Backgrounds/EvilEye/EvilEye.vue?raw';
import { createCodeObject } from '../../../types/code';

export const evilEye = createCodeObject(code, 'Backgrounds/EvilEye', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <EvilEye
      eyeColor="#FF6F37"
      :intensity="1.5"
      :pupilSize="0.6"
      :irisWidth="0.25"
      :glowIntensity="0.35"
      :scale="0.8"
      :noiseScale="1"
      :pupilFollow="1"
      :flameSpeed="1"
      backgroundColor="#060010"
    />
  </div>
</template>

<script setup>
import EvilEye from './EvilEye.vue';
</script>`
});
