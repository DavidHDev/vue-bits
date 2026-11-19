import code from '@/content/Animations/HalftoneReveal/HalftoneReveal.vue?raw';
import { createCodeObject } from '@/types/code';

export const halftoneReveal = createCodeObject(code, 'Animations/HalftoneReveal', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <HalftoneReveal
      src="https://images.unsplash.com/photo-1693250707557-a846a014b321?q=80&w=1400&auto=format&fit=crop"
      mode="mono"
      shape="dot"
      :cell-size="6"
      :angle="45"
      ink-color="#111111"
      paper-color="#ffffff"
      :reveal-radius="160"
    />
  </div>
</template>

<script setup lang="ts">
import HalftoneReveal from './HalftoneReveal.vue'
</script>`
});
