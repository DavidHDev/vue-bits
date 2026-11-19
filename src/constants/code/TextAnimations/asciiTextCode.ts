import code from '@/content/TextAnimations/ASCIIText/ASCIIText.vue?raw';
import { createCodeObject } from '@/types/code';

export const asciiText = createCodeObject(code, 'TextAnimations/ASCIIText', {
  dependencies: '',
  usage: `<template>
  <div style="position: relative; width: 100%; height: 440px">
    <ASCIIText
      text="Hey!"
      :ascii-font-size="8"
      :colors="['#ff6188', '#fc9867', '#ffd866']"
      :text-scale="1"
      :blocks="0.9"
      :waves="1"
      :wave-speed="1"
      :chroma="1"
      :tilt="1"
      :hue-shift="1"
      :scramble="0.6"
      click-ripple
      idle
      interactive
    />
  </div>
</template>

<script setup lang="ts">
import ASCIIText from './ASCIIText.vue'
</script>`
});
