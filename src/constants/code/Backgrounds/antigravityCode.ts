import code from '@/content/Backgrounds/Antigravity/Antigravity.vue?raw';
import { createCodeObject } from '@/types/code';

export const antigravity = createCodeObject(code, 'Backgrounds/Antigravity', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 400px; position: relative">
    <Antigravity
      :colors="['#7cff67', '#a0ffbc', '#42b883']"
      :count="1500"
      :magnet-radius="9"
      :ring-radius="7"
      :particle-size="0.9"
      :auto-animate="true"
    />
  </div>
</template>

<script setup lang="ts">
import Antigravity from './Antigravity.vue';
</script>`
});
