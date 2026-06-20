import code from '@/content/Backgrounds/Silk/Silk.vue?raw';
import { createCodeObject } from '@/types/code';

export const silk = createCodeObject(code, 'Backgrounds/Silk', {
  installation: `npm install ogl`,
  usage: `<template>
  <Silk
    :speed="5"
    :scale="1"
    color="#7B7481"
    :noise-intensity="1.5"
    :rotation="0"
  />
</template>

<script setup lang="ts">
import Silk from './Silk.vue'
</script>`
});
