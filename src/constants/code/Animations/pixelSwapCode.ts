import code from '@/content/Animations/PixelSwap/PixelSwap.vue?raw';
import { createCodeObject } from '@/types/code';

export const pixelSwap = createCodeObject(code, 'Animations/PixelSwap', {
  usage: `<script setup>
import PixelSwap from './PixelSwap.vue'
</script>

<template>
<div :style="{ position: 'relative', width: '100%', height: '500px', background: '#050610' }">
  <PixelSwap
    :pixelSize="64"
    :gap="0"
    :pixelRadius="0"
    :pixelSpin="0"
    :pixelScale="0.35"
    :duration="1400"
    :pixelDuration="450"
    pattern="random"
    :randomness="0"
    fade
    trigger="click"
  >
    <template #first>
      <div class="click-prompt">
        <span>Click me</span>
      </div>
    </template>
    <template #second>
      <div class="found-message">
        <span>You found me</span>
      </div>
    </template>
  </PixelSwap>
</div>
</template>`
});
