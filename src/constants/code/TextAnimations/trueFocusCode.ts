import code from '@/content/TextAnimations/TrueFocus/TrueFocus.vue?raw';
import { createCodeObject } from '@/types/code';

export const trueFocus = createCodeObject(code, 'TextAnimations/TrueFocus', {
  installation: `npm install motion-v`,
  usage: `<template>
  <TrueFocus 
    sentence="True Focus"
    :manual-mode="false"
    :blur-amount="5"
    border-color="red"
    :animation-duration="2"
    :pause-between-animations="1"
  />
</template>

<script setup>
import TrueFocus from './TrueFocus.vue'
</script>`
});
