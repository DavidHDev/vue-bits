import code from '@/content/TextAnimations/CurvedLoop/CurvedLoop.vue?raw';
import { createCodeObject } from '@/types/code';

export const curvedLoop = createCodeObject(code, 'TextAnimations/CurvedLoop', {
  dependencies: '',
  usage: `<template>
  <CurvedLoop
    marquee-text="Be ✦ Creative ✦ With ✦ Vue ✦ Bits ✦"
    shape="arc"
    :speed="2"
    :curve-amount="400"
    direction="left"
    :font-size="96"
    :font-weight="700"
    :letter-spacing="0"
    separator=""
    :outline="false"
    :scroll-boost="0"
    :edge-fade="0"
    :interactive="true"
    :pause-on-hover="false"
  />
</template>

<script setup lang="ts">
import CurvedLoop from './CurvedLoop.vue'
</script>`
});
