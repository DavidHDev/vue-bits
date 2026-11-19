import code from '@/content/Backgrounds/Silk/Silk.vue?raw';
import { createCodeObject } from '@/types/code';

export const silk = createCodeObject(code, 'Backgrounds/Silk', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Silk
      color="#42b883"
      sheen-color="#ffffff"
      :speed="5"
      :scale="1"
      :rotation="0"
      :sheen="0.5"
      :depth="0.5"
      :glow="0.3"
      :noise-intensity="1.5"
      mouse-interaction
      click-ripple
      intro
    />
  </div>
</template>

<script setup lang="ts">
import Silk from './Silk.vue'
</script>`
});
