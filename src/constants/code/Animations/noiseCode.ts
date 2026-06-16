import code from '@/content/Animations/Noise/Noise.vue?raw';
import { createCodeObject } from '@/types/code';

export const noise = createCodeObject(code, 'Animations/Noise', {
  usage: `<template>
  <div
    style="
      width: 600px;
      height: 400px;
      position: relative;
      overflow: hidden;
    "
  >
    <Noise
      :pattern-size="250"
      :pattern-scale-x="1"
      :pattern-scale-y="1"
      :pattern-refresh-interval="2"
      :pattern-alpha="15"
    />
  </div>
</template>

<script setup lang="ts">
import Noise from './Noise.vue'
</script>`
});
