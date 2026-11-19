import code from '@/content/Backgrounds/AcidSquares/AcidSquares.vue?raw';
import { createCodeObject } from '@/types/code';

export const acidSquares = createCodeObject(code, 'Backgrounds/AcidSquares', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <AcidSquares
      color="#111111"
      accent-color="#42b883"
      secondary-color="#3b6bff"
      :tile-size="1"
      :gap="0.12"
      :roundness="0.25"
      :rotation="35"
      :waves="1"
      :pulse="1"
      lighting="split"
      :tilt="0.7"
      :grain="0.12"
      :intro="true"
      :mouse-interaction="true"
    />
  </div>
</template>

<script setup lang="ts">
import AcidSquares from './AcidSquares.vue'
</script>`
});
