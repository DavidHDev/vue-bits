import code from '@/content/Components/CircularGallery/CircularGallery.vue?raw';
import { createCodeObject } from '@/types/code';

export const circularGallery = createCodeObject(code, 'Components/CircularGallery', {
  dependencies: '',
  usage: `<template>
  <div style="height: 600px; position: relative">
    <CircularGallery
      :bend="3"
      text-color="#ffffff"
      :border-radius="0.05"
      :scroll-ease="0.05"
      @item-click="(item, index) => console.log(item.text, index)"
    />
  </div>
</template>

<script setup lang="ts">
import CircularGallery from './CircularGallery.vue';
</script>`
});
