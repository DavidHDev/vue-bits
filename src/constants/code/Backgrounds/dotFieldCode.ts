import code from '@content/Backgrounds/DotField/DotField.vue?raw';
import { createCodeObject } from '@/types/code';

export const dotField = createCodeObject(code, 'Backgrounds/DotField', {
  usage: `<template>
  <div class="w-full h-[600px] relative">
    <DotField
      :dot-radius="1.5"
      :dot-spacing="14"
      :cursor-radius="500"
      :cursor-force="0.1"
      :bulge-only="true"
      :bulge-strength="67"
      :glow-radius="160"
      :sparkle="false"
      :wave-amplitude="0"
      gradient-from="rgba(168, 85, 247, 0.35)"
      gradient-to="rgba(180, 151, 207, 0.25)"
      glow-color="#120F17"
    />
  </div>
</template>

<script setup lang="ts">
import DotField from "./DotField.vue";
</script>`
});
