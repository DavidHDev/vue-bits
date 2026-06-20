import code from '@/content/TextAnimations/TextCursor/TextCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const textCursor = createCodeObject(code, 'TextAnimations/TextCursor', {
  installation: `npm install motion-v`,
  usage: `<template>
  <TextCursor
    text="Hello!"
    :spacing="80"
    :follow-mouse-direction="true"
    :random-float="true"
    :exit-duration="0.3"
    :removal-interval="20"
    :max-points="10"
  />
</template>

<script setup>
import TextCursor from './TextCursor.vue'
</script>`
});
