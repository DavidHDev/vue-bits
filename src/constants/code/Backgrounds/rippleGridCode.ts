import code from '@/content/Backgrounds/RippleGrid/RippleGrid.vue?raw';
import { createCodeObject } from '@/types/code';

export const rippleGrid = createCodeObject(code, 'Backgrounds/RippleGrid', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <RippleGrid color="#ffffff" :cell-size="48" :ripple-strength="1" auto-ripple="center" />
  </div>
</template>

<script setup lang="ts">
import RippleGrid from './RippleGrid.vue';
</script>`
});
