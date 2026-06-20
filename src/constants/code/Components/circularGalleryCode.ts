import code from '@/content/Components/CircularGallery/CircularGallery.vue?raw';
import { createCodeObject } from '@/types/code';

export const circularGallery = createCodeObject(code, 'Components/CircularGallery', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="height: 600px; position: relative;">
    <CircularGallery
      :bend="3"
      text-color="#ffffff"
      :border-radius="0.05"
      :scroll-ease="0.02"
      font-url="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
      font="bold 30px Orbitron"
    />
  </div>
</template>

<script setup>
import CircularGallery from './CircularGallery.vue'
</script>`
});
