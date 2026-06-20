import code from '@/content/Backgrounds/GridMotion/GridMotion.vue?raw';
import { createCodeObject } from '@/types/code';

export const gridMotion = createCodeObject(code, 'Backgrounds/GridMotion', {
  installation: `npm install gsap`,
  usage: `<template>
    <GridMotion
      :items="images"
    />
</template>

<script setup lang="ts">
  import GridMotion from "./GridMotion.vue";

  const imageUrl = 'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const numberOfImages = 30;
  const images = Array.from({ length: numberOfImages }, () => imageUrl);
</script>`
});
