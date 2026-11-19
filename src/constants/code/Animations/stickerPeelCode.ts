import code from '@/content/Animations/StickerPeel/StickerPeel.vue?raw';
import { createCodeObject } from '@/types/code';

export const stickerPeel = createCodeObject(code, 'Animations/StickerPeel', {
  dependencies: '',
  usage: `<template>
  <div style="position: relative; width: 100%; height: 400px">
    <StickerPeel
      :image-src="logo"
      :width="200"
      finish="gloss"
      :peel-back-hover-pct="25"
      :peel-back-active-pct="40"
    />
  </div>
</template>

<script setup lang="ts">
import StickerPeel from './StickerPeel.vue'
import logo from './assets/sticker.png'
</script>`
});
