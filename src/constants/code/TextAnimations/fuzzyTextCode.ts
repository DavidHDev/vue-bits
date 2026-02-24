import { createCodeObject } from '@/types/code';
import code from '@content/TextAnimations/FuzzyText/FuzzyText.vue?raw';

export const fuzzyText = createCodeObject(code, 'TextAnimations/FuzzyText', {
  usage: `<template>
  <FuzzyText
    :font-size="140"
    :font-weight="900"
    color="#fff"
    :enable-hover="true"
    :base-intensity="0.18"
    :hover-intensity="0.5"
  >
    404
  </FuzzyText>
</template>

<script setup lang="ts">
  import FuzzyText from "./FuzzyText.vue";
</script>`
});
