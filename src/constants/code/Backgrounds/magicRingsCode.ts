import code from '@/content/Backgrounds/MagicRings/MagicRings.vue?raw';
import { createCodeObject } from '@/types/code';

export const magicRings = createCodeObject(code, 'Backgrounds/MagicRings', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 500px; position: relative">
    <MagicRings
      color="#7cff67"
      color-two="#42b883"
      motion="pulse"
      :ring-count="6"
      :speed="1"
      :line-thickness="2"
      :glow="1"
      :hover-scale="1.2"
      :click-burst="true"
    />
  </div>
</template>

<script setup lang="ts">
import MagicRings from './MagicRings.vue'
</script>`
});
