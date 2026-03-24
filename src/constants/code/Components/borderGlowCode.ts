import code from '@content/Components/BorderGlow/BorderGlow.vue?raw';
import { createCodeObject } from '../../../types/code';

export const borderGlow = createCodeObject(code, 'Components/BorderGlow', {
  usage: `<template>
  <BorderGlow
    :edgeSensitivity="30"
    glowColor="40 80 80"
    backgroundColor="#060010"
    :borderRadius="28"
    :glowRadius="40"
    :glowIntensity="1"
    :coneSpread="25"
    :animated="false"
    :colors="['#c084fc', '#f472b6', '#38bdf8']"
  >
    <div class="p-[2em]">
      <h2>Your Content Here</h2>
      <p>Hover near the edges to see the glow.</p>
    </div>
  </BorderGlow>
</template>

<script setup>
import BorderGlow from './BorderGlow.vue'
</script>`
});
