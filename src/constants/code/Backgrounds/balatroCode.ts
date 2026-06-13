import code from '@/content/Backgrounds/Balatro/Balatro.vue?raw';
import { createCodeObject } from '@/types/code';

export const balatro = createCodeObject(code, 'Backgrounds/Balatro', {
  installation: `npm install ogl`,
  usage: `<template>
  <Balatro
    :is-rotate="false"
    :mouse-interaction="true"
    :pixel-filter="700"
  />
</template>

<script setup lang="ts">
import Balatro from './Balatro.vue'
</script>`
});
