import code from '@/content/Animations/GlareHover/GlareHover.vue?raw';
import { createCodeObject } from '@/types/code';

export const glareHover = createCodeObject(code, 'Animations/GlareHover', {
  usage: `<template>
  <div
    style="
      height: 600px;
      position: relative;
    "
  >
    <GlareHover
      glare-color="#ffffff"
      :glare-opacity="0.3"
      :glare-angle="-30"
      :glare-size="300"
      :transition-duration="800"
      :play-once="false"
    >
      <h2
        style="
          font-size: 3rem;
          font-weight: 900;
          color: #333;
          margin: 0;
        "
      >
        Hover Me
      </h2>
    </GlareHover>
  </div>
</template>

<script setup lang="ts">
import GlareHover from './GlareHover.vue'
</script>`
});
