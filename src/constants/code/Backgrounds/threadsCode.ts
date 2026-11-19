import code from '@/content/Backgrounds/Threads/Threads.vue?raw';
import { createCodeObject } from '@/types/code';

export const threads = createCodeObject(code, 'Backgrounds/Threads', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Threads
      color="#ffffff"
      :line-count="90"
      :thickness="0.6"
      :softness="1.3"
      :amplitude="1.7"
      :distance="0.4"
      :waves="1.05"
      :speed="0.6"
      :split="0.04"
      :fray="0.5"
      :angle="25"
      :taper="0.85"
      :brightness="1.4"
      :parting="0"
      :enable-mouse-interaction="true"
      :fade="0"
      :opacity="1"
    />
  </div>
</template>

<script setup lang="ts">
import Threads from './Threads.vue';
</script>`
});
