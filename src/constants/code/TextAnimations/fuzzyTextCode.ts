import code from '@/content/TextAnimations/FuzzyText/FuzzyText.vue?raw';
import { createCodeObject } from '@/types/code';

export const fuzzyText = createCodeObject(code, 'TextAnimations/FuzzyText', {
  usage: `<template>
  <FuzzyText 
    :base-intensity="0.2" 
    :hover-intensity="hoverIntensity" 
    :enable-hover="enableHover"
  >
    404
  </FuzzyText>
</template>

<script setup>
import { ref } from 'vue'
import FuzzyText from './FuzzyText.vue'

const hoverIntensity = ref(0.5)
const enableHover = ref(true)
</script>`
});
