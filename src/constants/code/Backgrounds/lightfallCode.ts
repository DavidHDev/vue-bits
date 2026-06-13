import code from '@/content/Backgrounds/Lightfall/Lightfall.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightfall = createCodeObject(code, 'Backgrounds/Lightfall', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Lightfall
      :colors="['#A6C8FF', '#5227FF', '#FF9FFC']"
      background-color="#0A29FF"
      :speed="1"
      :streak-count="8"
      :streak-width="1"
      :streak-length="1"
      :glow="1"
      :density="1"
      :twinkle="1"
      :zoom="2"
      :background-glow="1"
      :opacity="1"
      :mouse-interaction="true"
      :mouse-strength="1"
      :mouse-radius="0.6"
    />
  </div>
</template>

<script setup lang="ts">
import Lightfall from './Lightfall.vue'
</script>`
});
