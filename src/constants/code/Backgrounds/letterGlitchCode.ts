import code from '@/content/Backgrounds/LetterGlitch/LetterGlitch.vue?raw';
import { createCodeObject } from '@/types/code';

export const letterGlitch = createCodeObject(code, 'Backgrounds/LetterGlitch', {
  usage: `<template>
  <LetterGlitch
    :glitch-speed="50"
    center-vignette
    :outer-vignette="false"
    smooth
  />
</template>

<script setup lang="ts">
import LetterGlitch from './LetterGlitch.vue'
</script>`
});
