import code from '@/content/Backgrounds/LiquidChrome/LiquidChrome.vue?raw';
import { createCodeObject } from '@/types/code';

export const liquidChrome = createCodeObject(code, 'Backgrounds/LiquidChrome', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <LiquidChrome
      color="#ffffff"
      :speed="0.2"
      :amplitude="0.3"
      :detail="4"
      :thickness="1"
      :interactive="true"
    />
  </div>
</template>

<script setup lang="ts">
import LiquidChrome from './LiquidChrome.vue';
</script>`
});
