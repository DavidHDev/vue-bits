import code from '@/content/Backgrounds/ColorBends/ColorBends.vue?raw';
import { createCodeObject } from '@/types/code';

export const colorBends = createCodeObject(code, 'Backgrounds/ColorBends', {
  installation: `npm install three`,
  usage: `<template>
  <ColorBends
    :colors="['#ff5c7a', '#8a5cff', '#00ffd1']"
    :rotation="90"
    :speed="0.2"
    :scale="1"
    :frequency="1"
    :warp-strength="1"
    :mouse-influence="1"
    :noise="0.15"
    :parallax="0.5"
    :iterations="1"
    :intensity="1.5"
    :band-width="6"
    transparent
  />
</template>

<script setup lang="ts">
import ColorBends from './ColorBends.vue'
</script>`
});
