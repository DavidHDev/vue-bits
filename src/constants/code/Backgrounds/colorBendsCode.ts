import code from '@content/Backgrounds/ColorBends/ColorBends.vue?raw';
import { createCodeObject } from '../../../types/code';

export const colorBends = createCodeObject(code, 'Backgrounds/ColorBends', {
  installation: `npm install three`,
  usage: `<template>
  <ColorBends
    :colors="['#ff5c7a', '#8a5cff', '#00ffd1']"
    :rotation="30"
    :speed="0.3"
    :scale="1.2"
    :frequency="1.4"
    :warpStrength="1.2"
    :mouseInfluence="0.8"
    :parallax="0.6"
    :noise="0.08"
    transparent
  />
</template>

<script setup>
import ColorBends from './ColorBends.vue'
</script>`
});
