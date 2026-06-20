import code from '@/content/Backgrounds/Waves/Waves.vue?raw';
import { createCodeObject } from '@/types/code';

export const waves = createCodeObject(code, 'Backgrounds/Waves', {
  usage: `<template>
  <Waves
    line-color="#fff"
    background-color="rgba(255, 255, 255, 0.2)"
    :wave-speed-x="0.02"
    :wave-speed-y="0.01"
    :wave-amp-x="40"
    :wave-amp-y="20"
    :friction="0.9"
    :tension="0.01"
    :max-cursor-move="120"
    :x-gap="12"
    :y-gap="36"
  />
</template>

<script setup lang="ts">
import Waves from './Waves.vue'
</script>`
});
