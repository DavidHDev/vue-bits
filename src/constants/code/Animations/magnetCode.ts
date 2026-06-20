import code from '@/content/Animations/Magnet/Magnet.vue?raw';
import { createCodeObject } from '@/types/code';

export const magnet = createCodeObject(code, 'Animations/Magnet', {
  usage: `<template>
  <Magnet
    :padding="50"
    :disabled="false"
    :magnet-strength="50"
  >
    <p>Star Vue Bits on GitHub!</p>
  </Magnet>
</template>

<script setup lang="ts">
import Magnet from './Magnet.vue'
</script>`
});
