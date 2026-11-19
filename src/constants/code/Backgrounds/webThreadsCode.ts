import code from '@/content/Backgrounds/WebThreads/WebThreads.vue?raw';
import { createCodeObject } from '@/types/code';

export const webThreads = createCodeObject(code, 'Backgrounds/WebThreads', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <WebThreads
      :colors="['#42b883', '#a0ffbc']"
      core-color="#FFFFFF"
      :thread-count="6"
      :spread="0.18"
    />
  </div>
</template>

<script setup lang="ts">
import WebThreads from './WebThreads.vue'
</script>`
});
