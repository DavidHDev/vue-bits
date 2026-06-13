import code from '@/content/Animations/StickerPeel/StickerPeel.vue?raw';
import { createCodeObject } from '@/types/code';

export const stickerPeel = createCodeObject(code, 'Animations/StickerPeel', {
  installation: `npm install gsap`,
  usage: `<template>
  <StickerPeel
    :image-src="logo"
    :width="200"
    :rotate="30"
    :peel-back-hover-pct="20"
    :peel-back-active-pct="40"
    :shadow-intensity="0.6"
    :lighting-intensity="0.1"
    :initial-position="{
      x: -100,
      y: 100
    }"
  />
</template>

<script setup lang="ts">
import StickerPeel from './StickerPeel.vue'
import logo from './assets/sticker.png'
</script>`
});
