import code from '@/content/Animations/PixelTransition/PixelTransition.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelTransition = createCodeObject(code, 'Animations/PixelTransition', {
  dependencies: '',
  usage: `<template>
  <PixelTransition
    pixel-color="#ffffff"
    :mosaic="0"
    :grid-size="10"
    pixel-shape="square"
    :gap="0"
    pattern="random"
    pixel-animation="pop"
    :randomness="0.3"
    :animation-step-duration="0.4"
    :fps="0"
    trigger="hover"
    :once="false"
    aspect-ratio="125%"
    :style="{ width: '300px' }"
  >
    <template #firstContent>
      <img
        src="/assets/demo/day-portrait.webp"
        alt=""
        style="width: 100%; height: 100%; object-fit: cover"
      />
    </template>

    <template #secondContent>
      <img
        src="/assets/demo/night-portrait.webp"
        alt=""
        style="width: 100%; height: 100%; object-fit: cover"
      />
    </template>
  </PixelTransition>
</template>

<script setup lang="ts">
import PixelTransition from './PixelTransition.vue'
</script>`
});
