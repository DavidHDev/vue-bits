import code from '@/content/Backgrounds/MoltenMetal/MoltenMetal.vue?raw';
import { createCodeObject } from '@/types/code';

export const moltenMetal = createCodeObject(code, 'Backgrounds/MoltenMetal', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <MoltenMetal
      :colors="['#42b883', '#a0ffbc']"
      core-color="#FFFFFF"
      :speed="0.35"
      :scale="4"
      :detail="3"
      :glow="1.6"
      :thickness="1"
      :haze="0.75"
      :mouse-interaction="true"
      :flare-on-click="true"
    />
  </div>
</template>

<script setup lang="ts">
import MoltenMetal from './MoltenMetal.vue';
</script>`
});
