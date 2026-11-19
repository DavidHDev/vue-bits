import code from '@/content/Backgrounds/PlasmaWave/PlasmaWave.vue?raw';
import { createCodeObject } from '@/types/code';

export const plasmaWave = createCodeObject(code, 'Backgrounds/PlasmaWave', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <PlasmaWave
      :colors="['#7cff67', '#06B6D4']"
      :speed="1"
      :bend1="1"
      :bend2="0.5"
      :thickness="0.3"
      :glow="1"
      :core="0.6"
      :mouse-interaction="true"
    />
  </div>
</template>

<script setup lang="ts">
import PlasmaWave from './PlasmaWave.vue';
</script>`
});
