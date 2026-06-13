import code from '@/content/Backgrounds/PlasmaWave/PlasmaWave.vue?raw';
import { createCodeObject } from '@/types/code';

export const plasmaWave = createCodeObject(code, 'Backgrounds/PlasmaWave', {
  installation: `npm install ogl`,
  usage: `<template>
  <PlasmaWave
    :colors="['#A855F7', '#06B6D4']"
    :speed1="0.05"
    :speed2="0.05"
    :focal-length="0.8"
    :bend1="1"
    :bend2="0.5"
    :dir2="1.0"
    :rotation-deg="0"
  />
</template>

<script setup lang="ts">
import PlasmaWave from './PlasmaWave.vue'
</script>`
});
