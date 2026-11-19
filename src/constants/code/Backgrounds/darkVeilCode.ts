import code from '@/content/Backgrounds/DarkVeil/DarkVeil.vue?raw';
import { createCodeObject } from '@/types/code';

export const darkVeil = createCodeObject(code, 'Backgrounds/DarkVeil', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <DarkVeil />
  </div>
</template>

<script setup lang="ts">
import DarkVeil from './DarkVeil.vue';
</script>`
});
