import code from '@/content/Backgrounds/Aurora/Aurora.vue?raw';
import { createCodeObject } from '@/types/code';

export const aurora = createCodeObject(code, 'Backgrounds/Aurora', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Aurora
      :color-stops="['#42b883', '#7cff67', '#42b883']"
      :amplitude="1"
      :blend="0.5"
      :height="0.45"
      :speed="1"
      :glow="0.6"
    />
  </div>
</template>

<script setup lang="ts">
import Aurora from './Aurora.vue';
</script>`
});
