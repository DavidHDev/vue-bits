import code from '@/content/Backgrounds/DotField/DotField.vue?raw';
import { createCodeObject } from '@/types/code';

export const dotField = createCodeObject(code, 'Backgrounds/DotField', {
  usage: `<template>
  <div
    :style="{
      width: '100%',
      height: '600px',
      position: 'relative'
    }"
  >
    <DotField
      :dot-radius="1.5"
      :dot-spacing="14"
      :bulge-strength="67"
      :glow-radius="160"
      :sparkle="false"
      :wave-amplitude="0"
      :cursor-radius="500"
      :cursor-force="0.1"
      bulge-only
      gradient-from="#7cff67"
      gradient-to="#A0FFBC"
      glow-color="#120F17"
    />
  </div>
</template>

<script setup lang="ts">
  import DotField from "./DotField.vue";
</script>`
});
