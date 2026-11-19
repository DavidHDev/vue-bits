import code from '@/content/Backgrounds/Galaxy/Galaxy.vue?raw';
import { createCodeObject } from '@/types/code';

export const galaxy = createCodeObject(code, 'Backgrounds/Galaxy', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Galaxy
      :density="1"
      :glow-intensity="0.3"
      :flare-intensity="1"
      :star-speed="0.5"
      mouse-repulsion
      click-warp
    />
  </div>
</template>

<script setup lang="ts">
import Galaxy from './Galaxy.vue';
</script>`
});
