import code from '@/content/Components/SpecularButton/SpecularButton.vue?raw';
import { createCodeObject } from '@/types/code';

export const specularButton = createCodeObject(code, 'Components/SpecularButton', {
  dependencies: '',
  usage: `<template>
  <SpecularButton
    size="lg"
    :radius="18"
    tint="#ffffff"
    :tint-opacity="0.04"
    text-color="#f5f5f5"
    line-color="#ffffff"
    base-color="#525252"
    :intensity="1"
    :idle-intensity="0.35"
    :shine-size="10"
    :shine-fade="34"
    :thickness="1.2"
    :glow="1"
    follow-mouse
    :proximity="250"
    @click="handleClick"
  >
    Get Started
  </SpecularButton>
</template>

<script setup lang="ts">
import SpecularButton from './SpecularButton.vue'

const handleClick = () => {
  console.log('clicked')
}
</script>`
});
