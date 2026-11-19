import code from '@/content/Backgrounds/LetterGlitch/LetterGlitch.vue?raw';
import { createCodeObject } from '@/types/code';

export const letterGlitch = createCodeObject(code, 'Backgrounds/LetterGlitch', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <LetterGlitch
      :glitch-colors="['#ffffff', '#61dca3']"
      :glitch-amount="0.5"
      :speed="1"
      :flow="0.5"
      click-effect="tear"
    />
  </div>
</template>

<script setup lang="ts">
import LetterGlitch from './LetterGlitch.vue';
</script>`
});
