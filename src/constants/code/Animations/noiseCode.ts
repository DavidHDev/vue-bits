import code from '@/content/Animations/Noise/Noise.vue?raw';
import { createCodeObject } from '@/types/code';

export const noise = createCodeObject(code, 'Animations/Noise', {
  dependencies: '',
  usage: `<template>
  <div style="position: relative; width: 100%; height: 500px">
    <img src="/photo.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover" />
    <Noise
      :opacity="0.2"
      :size="1"
      :fps="24"
      blend-mode="overlay"
      :contrast="0.6"
      :colored="false"
      :dust="0"
      :scratches="0"
      :scanlines="0"
      :flicker="0"
    />
  </div>
</template>

<script setup lang="ts">
import Noise from './Noise.vue'
</script>`
});
