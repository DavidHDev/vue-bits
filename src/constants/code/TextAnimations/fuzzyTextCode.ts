import code from '@/content/TextAnimations/FuzzyText/FuzzyText.vue?raw';
import { createCodeObject } from '@/types/code';

export const fuzzyText = createCodeObject(code, 'TextAnimations/FuzzyText', {
  dependencies: '',
  usage: `<template>
  <FuzzyText
    :color-split="0"
    trigger="hover"
    direction="horizontal"
    :base-intensity="0.2"
    :hover-intensity="0.5"
    :fuzz-range="30"
    :slice-size="1"
    :fps="60"
    :transition-duration="0"
    :intro="true"
    :intro-duration="1400"
    :letter-spacing="0"
    :enable-hover="true"
    :click-effect="false"
    :glitch-mode="false"
    :glitch-interval="2000"
    :glitch-duration="200"
  >
    404
  </FuzzyText>
</template>

<script setup lang="ts">
import FuzzyText from './FuzzyText.vue'
</script>`
});
