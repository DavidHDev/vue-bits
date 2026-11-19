import code from '@/content/Components/MagicBento/MagicBento.vue?raw';
import { createCodeObject } from '@/types/code';

export const magicBento = createCodeObject(code, 'Components/MagicBento', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <MagicBento
    :columns="4"
    :row-height="200"
    :gap="12"
    :radius="20"
    :enable-border-glow="true"
    :enable-spotlight="true"
    :spotlight-radius="300"
    :click-effect="true"
  />
</template>

<script setup lang="ts">
import MagicBento from './MagicBento.vue'
</script>`
});
