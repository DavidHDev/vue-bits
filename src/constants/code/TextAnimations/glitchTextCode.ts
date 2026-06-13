import code from '@/content/TextAnimations/GlitchText/GlitchText.vue?raw';
import { createCodeObject } from '@/types/code';

export const glitchText = createCodeObject(code, 'TextAnimations/GlitchText', {
  usage: `<template>
  <GlitchText
    :speed="1"
    :enable-shadows="true"
    :enable-on-hover="true"
    class="custom-class"
  >
    React Bits
  </GlitchText>
</template>

<script setup>
import GlitchText from './GlitchText.vue'
</script>`
});
