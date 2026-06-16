import code from '@/content/Animations/MagicRings/MagicRings.vue?raw';
import { createCodeObject } from '@/types/code';

export const magicRings = createCodeObject(code, 'Animations/MagicRings', {
  usage: `<template>
  <div
    style="
      width: 600px;
      height: 400px;
      position: relative;
    "
  >
    <MagicRings
      color="#fc42ff"
      color-two="#42fcff"
      :ring-count="6"
      :speed="1"
      :attenuation="10"
      :line-thickness="2"
      :base-radius="0.35"
      :radius-step="0.1"
      :scale-rate="0.1"
      :opacity="1"
      :blur="0"
      :noise-amount="0.1"
      :rotation="0"
      :ring-gap="1.5"
      :fade-in="0.7"
      :fade-out="0.5"
      :follow-mouse="false"
      :mouse-influence="0.2"
      :hover-scale="1.2"
      :parallax="0.05"
      :click-burst="false"
    />
  </div>
</template>

<script setup lang="ts">
import MagicRings from './MagicRings.vue'
</script>`
});
