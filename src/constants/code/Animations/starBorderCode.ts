import code from '@/content/Animations/StarBorder/StarBorder.vue?raw';
import { createCodeObject } from '@/types/code';

export const starBorder = createCodeObject(code, 'Animations/StarBorder', {
  dependencies: '',
  usage: `<template>
  <StarBorder
    color="#ffffff"
    trail-color="#ffffff"
    :duration="4"
    direction="clockwise"
    :stars="1"
    :trail-length="0.3"
    :thickness="1"
    :radius="12"
    :glow="0.6"
    hover="lap"
    :sparkle="false"
    click-pulse
    theme="dark"
  >
    Get started
  </StarBorder>
</template>

<script setup lang="ts">
import StarBorder from './StarBorder.vue'
</script>`
});
