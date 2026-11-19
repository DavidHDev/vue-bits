import code from '@/content/Animations/GlareHover/GlareHover.vue?raw';
import { createCodeObject } from '@/types/code';

export const glareHover = createCodeObject(code, 'Animations/GlareHover', {
  dependencies: '',
  usage: `<template>
  <GlareHover
    width="360px"
    height="240px"
    border-radius="20px"
    mode="hover"
    variant="streak"
    glare-color="#ffffff"
    :glare-opacity="0.5"
    :glare-size="30"
    :softness="0.6"
    :glare-angle="-45"
    blend-mode="screen"
    :rim-glint="true"
    :transition-duration="650"
  >
    <img src="/photo.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover" />
  </GlareHover>
</template>

<script setup lang="ts">
import GlareHover from './GlareHover.vue'
</script>`
});
