import code from '@/content/TextAnimations/GlitchText/GlitchText.vue?raw';
import { createCodeObject } from '@/types/code';

export const glitchText = createCodeObject(code, 'TextAnimations/GlitchText', {
  dependencies: '',
  usage: `<template>
  <GlitchText
    children="Vue Bits"
    mode="slices"
    trigger="always"
    :speed="1"
    :intensity="0.5"
    :burst-duration="0.6"
    :offset="10"
    :skew="0"
    :flicker="false"
    :font-weight="900"
    :enable-shadows="true"
    :shadow-colors="['#ff0000', '#00ffff']"
    class-name="custom-class"
  />
</template>

<script setup lang="ts">
import GlitchText from './GlitchText.vue'
</script>`
});
