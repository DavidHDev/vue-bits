import code from '@/content/TextAnimations/StrokeText/StrokeText.vue?raw';
import { createCodeObject } from '@/types/code';

export const strokeText = createCodeObject(code, 'TextAnimations/StrokeText', {
  installation: `npm install gsap`,
  usage: `<template>
  <StrokeText
    text="Draw Attention"
    stroke-color="#7cff67"
    stroke-style="solid"
    :stroke-width="1.4"
    :dash-length="10"
    :draw-duration="1.6"
    :fill-delay="0.2"
    :stagger="0.05"
    ease="power2.out"
    trigger="mount"
    fill-mode="wipe"
    wipe-from="left"
    :font-size="128"
    :font-weight="800"
    :letter-spacing="-4"
    :marching="false"
    :hover-redraw="true"
    :shadow="false"
  />
</template>

<script setup lang="ts">
import StrokeText from './StrokeText.vue'
</script>`
});
