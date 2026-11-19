import code from '@/content/Backgrounds/MagnetLines/MagnetLines.vue?raw';
import { createCodeObject } from '@/types/code';

export const magnetLines = createCodeObject(code, 'Backgrounds/MagnetLines', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <MagnetLines
      line-color="#efefef"
      :spacing="30"
      :line-width="2"
      :line-height="18"
      mode="orbit"
      shape="line"
      :radius="200"
      :fade="0.65"
    />
  </div>
</template>

<script setup lang="ts">
import MagnetLines from './MagnetLines.vue'
</script>`
});
