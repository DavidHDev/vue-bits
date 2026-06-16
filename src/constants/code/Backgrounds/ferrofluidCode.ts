import code from '@/content/Backgrounds/Ferrofluid/Ferrofluid.vue?raw';
import { createCodeObject } from '@/types/code';

export const ferrofluid = createCodeObject(code, 'Backgrounds/Ferrofluid', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Ferrofluid
      :colors="['#4F46E5', '#06B6D4', '#E0F2FE']"
      :speed="0.5"
      :scale="1"
      :turbulence="1"
      :fluidity="0.1"
      :rim-width="0.2"
      :sharpness="3"
      :shimmer="1"
      :glow="2"
      flow-direction="down"
      :opacity="1"
      :mouse-interaction="true"
      :mouse-strength="1"
      :mouse-radius="0.3"
    />
  </div>
</template>

<script setup lang="ts">
import Ferrofluid from './Ferrofluid.vue'
</script>`
});
