import code from '@/content/Backgrounds/GridDistortion/GridDistortion.vue?raw';
import { createCodeObject } from '@/types/code';

export const gridDistortion = createCodeObject(code, 'Backgrounds/GridDistortion', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <GridDistortion
      image-src="/assets/demo/night-landscape.webp"
      :grid="15"
      :radius="0.18"
      :strength="0.15"
      :relaxation="0.96"
      mode="drag"
      :softness="0"
      :chroma="0"
      :idle="0.3"
      :click-ripple="true"
      :intro="true"
    />
  </div>
</template>

<script setup lang="ts">
import GridDistortion from './GridDistortion.vue'
</script>`
});
