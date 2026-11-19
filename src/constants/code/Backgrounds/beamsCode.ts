import code from '@/content/Backgrounds/Beams/Beams.vue?raw';
import { createCodeObject } from '@/types/code';

export const beams = createCodeObject(code, 'Backgrounds/Beams', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Beams
      color="#ffffff"
      :beam-width="140"
      :rotation="30"
      :speed="1"
      :glow="0.6"
    />
  </div>
</template>

<script setup lang="ts">
import Beams from './Beams.vue';
</script>`
});
