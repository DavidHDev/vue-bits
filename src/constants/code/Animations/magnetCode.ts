import code from '@/content/Animations/Magnet/Magnet.vue?raw';
import { createCodeObject } from '@/types/code';

export const magnet = createCodeObject(code, 'Animations/Magnet', {
  dependencies: '',
  usage: `<template>
  <Magnet :padding="100" :magnet-strength="2">
    <button>Star Vue Bits on GitHub</button>
  </Magnet>
</template>

<script setup lang="ts">
import Magnet from './Magnet.vue'
</script>`
});
