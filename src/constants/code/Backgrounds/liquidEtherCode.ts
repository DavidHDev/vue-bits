import code from '@/content/Backgrounds/LiquidEther/LiquidEther.vue?raw';
import { createCodeObject } from '@/types/code';

export const liquidEther = createCodeObject(code, 'Backgrounds/LiquidEther', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <LiquidEther
      :colors="['#42b883', '#7cff67', '#a0ffbc']"
      :mouse-force="20"
      :cursor-size="100"
      :persistence="0.75"
      :auto-demo="true"
      :auto-speed="0.5"
      :auto-intensity="2.2"
    />
  </div>
</template>

<script setup lang="ts">
import LiquidEther from './LiquidEther.vue'
</script>`
});
