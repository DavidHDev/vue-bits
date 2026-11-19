import code from '@/content/Animations/Strands/Strands.vue?raw';
import { createCodeObject } from '@/types/code';

export const strands = createCodeObject(code, 'Animations/Strands', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 480px; position: relative">
    <Strands />
  </div>

  <div style="width: 100%; height: 480px; position: relative">
    <Strands listening />
  </div>

  <div style="width: 100%; height: 480px; position: relative">
    <Strands :level="micLevel" />
  </div>

  <div style="width: 100%; height: 320px; position: relative">
    <Strands :glass="false" :energy="0.6" />
  </div>
</template>

<script setup lang="ts">
import Strands from './Strands.vue'
</script>`
});
