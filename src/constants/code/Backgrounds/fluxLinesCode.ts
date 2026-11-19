import code from '@/content/Backgrounds/FluxLines/FluxLines.vue?raw';
import { createCodeObject } from '@/types/code';

export const fluxLines = createCodeObject(code, 'Backgrounds/FluxLines', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <FluxLines
      :colors="['#ffffff', '#ffffff', '#ffffff']"
      :glow="2"
      :rim-width="0.2"
      :line-width="1"
      flow-direction="down"
      :mouse-interaction="true"
      :click-swirl="true"
    />
  </div>
</template>

<script setup lang="ts">
import FluxLines from './FluxLines.vue'
</script>`
});
