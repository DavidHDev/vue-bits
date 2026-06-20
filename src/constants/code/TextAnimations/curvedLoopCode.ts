import { createCodeObject } from '@/types/code';
import code from '@content/TextAnimations/CurvedLoop/CurvedLoop.vue?raw';

export const curvedLoop = createCodeObject(code, 'TextAnimations/CurvedLoop', {
  usage: `<template>
  <div>
    <!-- Basic usage -->
    <CurvedLoop marquee-text="Welcome to React Bits ✦" />

    <!-- With custom props -->
    <CurvedLoop 
      marquee-text="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
      :speed="3"
      :curve-amount="500"
      direction="right"
      :interactive="true"
      class="custom-text-style"
    />

    <!-- Non-interactive with slower speed -->
    <CurvedLoop 
      marquee-text="Smooth Curved Animation"
      :speed="1"
      :curve-amount="300"
      :interactive="false"
    />
  </div>
</template>

<script setup>
import CurvedLoop from './CurvedLoop.vue'
</script>`
});
