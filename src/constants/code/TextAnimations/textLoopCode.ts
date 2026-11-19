import code from '@/content/TextAnimations/TextLoop/TextLoop.vue?raw';
import { createCodeObject } from '@/types/code';

export const textLoop = createCodeObject(code, 'TextAnimations/TextLoop', {
  installation: `npm install gsap`,
  usage: `<template>
  <TextLoop
    text="Vue ✦ Bits"
    shape="wave"
    :speed="90"
    direction="forward"
    separator="✦"
    :curviness="90"
    :tilt="0"
    :font-size="46"
    :font-weight="800"
    :letter-spacing="2"
    :uppercase="true"
    :ribbon="true"
    ribbon-color="#42b883"
    :ribbon-width="86"
    :edge-fade="0"
    :cross="false"
    :cross-angle="16"
    :draggable="false"
    :scroll-boost="0"
    :outline="false"
    :pause-on-hover="true"
  />
</template>

<script setup lang="ts">
import TextLoop from './TextLoop.vue'
</script>`
});
