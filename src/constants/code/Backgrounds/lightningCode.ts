import code from '@/content/Backgrounds/Lightning/Lightning.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightning = createCodeObject(code, 'Backgrounds/Lightning', {
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Lightning
      :hue="220"
      :x-offset="0"
      :speed="1"
      :intensity="1"
      :size="1"
    />
  </div>
</template>

<script setup lang="ts">
import Lightning from './Lightning.vue'
</script>`
});
