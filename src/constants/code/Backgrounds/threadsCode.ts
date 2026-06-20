import code from '@/content/Backgrounds/Threads/Threads.vue?raw';
import { createCodeObject } from '@/types/code';

export const threads = createCodeObject(code, 'Backgrounds/Threads', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Threads
      :amplitude="1"
      :distance="0"
      :enable-mouse-interaction="true"
    />
  </div>
</template>

<script setup lang="ts">
import Threads from './Threads.vue'
</script>`
});
