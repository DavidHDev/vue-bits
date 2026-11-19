import code from '@/content/TextAnimations/TrueFocus/TrueFocus.vue?raw';
import { createCodeObject } from '@/types/code';

export const trueFocus = createCodeObject(code, 'TextAnimations/TrueFocus', {
  installation: `npm install motion-v`,
  usage: `<template>
  <TrueFocus
    sentence="True Focus"
    :manual-mode="false"
    focus-style="brackets"
    easing="smooth"
    order="sequential"
    :blur-amount="5"
    :focus-scale="1"
    :unfocused-opacity="1"
    border-color="#7cff67"
    :corner-size="16"
    :border-width="3"
    :animation-duration="0.5"
    :pause-between-animations="1"
  />
</template>

<script setup lang="ts">
import TrueFocus from './TrueFocus.vue'
</script>`
});
