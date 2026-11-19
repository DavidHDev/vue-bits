import code from '@/content/Components/BorderGlow/BorderGlow.vue?raw';
import { createCodeObject } from '@/types/code';

export const borderGlow = createCodeObject(code, 'Components/BorderGlow', {
  dependencies: '',
  usage: `<template>
  <BorderGlow
    :edge-sensitivity="30"
    glow-color="40 80 80"
    background-color="#111111"
    :border-radius="28"
    :glow-radius="40"
    :glow-intensity="1.0"
    :cone-spread="25"
    :animated="false"
    :colors="['#7cff67', '#2dd4bf', '#38bdf8']"
  >
    <div style="padding: 2em">
      <h2>Your Content Here</h2>
      <p>Hover near the edges to see the glow.</p>
    </div>
  </BorderGlow>
</template>

<script setup lang="ts">
import BorderGlow from './BorderGlow.vue'
</script>`
});
