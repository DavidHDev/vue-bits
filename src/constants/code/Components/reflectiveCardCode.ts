import code from '@content/Components/ReflectiveCard/ReflectiveCard.vue?raw';
import { createCodeObject } from '../../../types/code';

export const reflectiveCard = createCodeObject(code, 'Components/ReflectiveCard', {
  installation: `npm install lucide-vue-next`,
  usage: `<template>
  <ReflectiveCard
    overlayColor="rgba(0, 0, 0, 0.2)"
    :blurStrength="10"
    :glassDistortion="15"
    :metalness="0.8"
    :roughness="0.5"
    :displacementStrength="25"
    :noiseScale="1.5"
    :specularConstant="2.0"
    :grayscale="0.5"
    color="#ffffff"
  />
</template>

<script setup lang="ts">
  import ReflectiveCard from "./ReflectiveCard.vue";
</script>`
});
