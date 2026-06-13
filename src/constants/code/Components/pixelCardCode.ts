import code from '@/content/Components/PixelCard/PixelCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelCard = createCodeObject(code, 'Components/PixelCard', {
  usage: `<template>
  <PixelCard variant="pink">
    <!-- your card content (use position: absolute) -->
  </PixelCard>
</template>

<script setup>
import PixelCard from './PixelCard.vue'
</script>`
});
