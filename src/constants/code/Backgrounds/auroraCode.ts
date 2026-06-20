import code from '@/content/Backgrounds/Aurora/Aurora.vue?raw';
import { createCodeObject } from '@/types/code';

export const aurora = createCodeObject(code, 'Backgrounds/Aurora', {
  installation: `npm install ogl`,
  usage: `<template>
  <Aurora
    :color-stops="['#3A29FF', '#FF94B4', '#FF3232']"
    :blend="0.5"
    :amplitude="1.0"
    :speed="0.5"
  />
</template>

<script setup lang="ts">
import Aurora from './Aurora.vue'
</script>`
});
