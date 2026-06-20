import code from '@/content/Animations/Antigravity/Antigravity.vue?raw';
import { createCodeObject } from '@/types/code';

export const antigravity = createCodeObject(code, 'Animations/Antigravity', {
  installation: `npm install three @types/three`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 400px;
      position: relative;
    "
  >
    <Antigravity
      :count="300"
      :magnet-radius="6"
      :ring-radius="7"
      :wave-speed="0.4"
      :wave-amplitude="1"
      :particle-size="1.5"
      :lerp-speed="0.05"
      color="#FF9FFC"
      :auto-animate="true"
      :particle-variance="1"
    />
  </div>
</template>

<script setup lang="ts">
import Antigravity from './Antigravity.vue'
</script>`
});
