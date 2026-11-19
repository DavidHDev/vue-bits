import code from '@/content/TextAnimations/TextCursor/TextCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const textCursor = createCodeObject(code, 'TextAnimations/TextCursor', {
  dependencies: '',
  usage: `<template>
  <div :style="{ height: '400px', position: 'relative' }">
    <TextCursor
      text="Hello"
      mode="stamp"
      :font-size="28"
      :spacing="88"
      :max-points="7"
      :shrink="0.5"
      :fade="0.6"
      :smoothing="0.3"
      :exit-duration="0.5"
      :removal-interval="30"
      :follow-mouse-direction="true"
      :keep-upright="true"
      :random-float="true"
      :pop-in="true"
    />
  </div>
</template>

<script setup lang="ts">
import TextCursor from './TextCursor.vue'
</script>`
});
