import code from '@/content/TextAnimations/SplitFlapText/SplitFlapText.vue?raw';
import { createCodeObject } from '@/types/code';

export const splitFlapText = createCodeObject(code, 'TextAnimations/SplitFlapText', {
  dependencies: '',
  usage: `<template>
  <SplitFlapText
    :words="['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE']"
    :flip-duration="0.12"
    :stagger="0.06"
    :cycle-delay="2400"
    charset="alphanumeric"
    :flips-per-char="8"
    order="left"
    align="left"
    tile-style="board"
    tile-color="#111827"
    text-color="#f8fafc"
    :glare="0"
    :depth="0.5"
    :tile-radius="8"
    :gap="6"
    :font-size="52"
    :loop="true"
    :pad-to="12"
    :intro="true"
  />
</template>

<script setup lang="ts">
import SplitFlapText from './SplitFlapText.vue'
</script>`
});
