import code from '@/content/Animations/MagnetLines/MagnetLines.vue?raw';
import { createCodeObject } from '@/types/code';

export const magnetLines = createCodeObject(code, 'Animations/MagnetLines', {
  usage: `<template>
  <MagnetLines
    :rows="9"
    :columns="9"
    container-size="60vmin"
    line-color="tomato"
    line-width="0.8vmin"
    line-height="5vmin"
    :base-angle="0"
    :style="{ margin: '2rem auto' }"
  />
</template>

<script setup lang="ts">
import MagnetLines from './MagnetLines.vue'
</script>`
});
