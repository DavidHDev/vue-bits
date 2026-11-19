import code from '@/content/Backgrounds/DotField/DotField.vue?raw';
import { createCodeObject } from '@/types/code';

export const dotField = createCodeObject(code, 'Backgrounds/DotField', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <DotField
      gradient-from="#7cff67"
      gradient-to="#a0ffbc"
      :dot-radius="1.5"
      :dot-spacing="14"
      :cursor-radius="240"
      :bulge-strength="0.6"
      :glow-radius="160"
    />
  </div>
</template>

<script setup lang="ts">
import DotField from './DotField.vue';
</script>`
});
