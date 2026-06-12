import code from '@content/Backgrounds/Ferrofluid/Ferrofluid.vue?raw';
import { createCodeObject } from '@/types/code';

export const ferrofluid = createCodeObject(code, 'Backgrounds/Ferrofluid', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <Ferrofluid
      :colors="['#27FF64', '#7CFF67', '#A8FFB6']"
      :speed="0.5"
      :scale="1.6"
      :turbulence="1"
      :fluidity="0.1"
      :rim-width="0.2"
      :sharpness="2.5"
      :shimmer="1.5"
      :glow="2"
      flow-direction="down"
      :mouse-interaction="true"
      :mouse-strength="1"
      :mouse-radius="0.35"
    />
  </div>
</template>

<script setup lang="ts">
import Ferrofluid from "./Ferrofluid.vue";
</script>`
});
