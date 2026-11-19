import code from '@/content/Animations/PixelSwap/PixelSwap.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelSwap = createCodeObject(code, 'Animations/PixelSwap', {
  dependencies: '',
  usage: `<template>
  <div style="width: 560px">
    <PixelSwap
      pattern="pointer"
      :pixel-size="48"
      :pixel-radius="0"
      :duration="400"
      :pixel-duration="350"
      :randomness="0.2"
      :bounce="0.3"
      trigger="hover"
      :style="{ borderRadius: '18px' }"
    >
      <template #firstContent>
        <img
          src="/assets/demo/day-sky.webp"
          alt=""
          style="width: 100%; height: 100%; object-fit: cover"
        />
      </template>
      <template #secondContent>
        <img
          src="/assets/demo/night-sky.webp"
          alt=""
          style="width: 100%; height: 100%; object-fit: cover"
        />
      </template>
    </PixelSwap>
  </div>
</template>

<script setup lang="ts">
import PixelSwap from './PixelSwap.vue'
</script>`
});
