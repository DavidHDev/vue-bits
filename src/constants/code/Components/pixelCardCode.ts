import code from '@/content/Components/PixelCard/PixelCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelCard = createCodeObject(code, 'Components/PixelCard', {
  dependencies: '',
  usage: `<template>
  <PixelCard
    :colors="['#f8fafc', '#f1f5f9', '#cbd5e1']"
    glow-color="#cbd5e1"
    shape="square"
    origin="center"
    :gap="5"
    :pixel-size="2"
    :speed="35"
    :reveal-duration="600"
    :spotlight="0.5"
    :glow="0.5"
    :opacity="0.35"
    :fade="0.7"
    trigger="hover"
    :radius="24"
    :click-pulse="true"
    :intro="true"
    theme="dark"
  >
    <YourIcon />
  </PixelCard>
</template>

<script setup lang="ts">
import PixelCard from './PixelCard.vue'
</script>`
});
