import code from '@content/Backgrounds/Lightfall/Lightfall.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightfall = createCodeObject(code, 'Backgrounds/Lightfall', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <Lightfall
      :colors="['#A8FFB6', '#27FF64', '#7CFF67']"
      background-color="#0A4A2A"
      :speed="0.5"
      :streak-count="2"
      :streak-width="1"
      :streak-length="1"
      :glow="1"
      :density="0.6"
      :twinkle="1"
      :zoom="3"
      :background-glow="0.5"
      :mouse-interaction="true"
      :mouse-strength="0.5"
      :mouse-radius="1"
    />
  </div>
</template>

<script setup lang="ts">
import Lightfall from "./Lightfall.vue";
</script>`
});
