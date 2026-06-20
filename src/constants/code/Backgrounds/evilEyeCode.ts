import code from '@/content/Backgrounds/EvilEye/EvilEye.vue?raw';
import { createCodeObject } from '@/types/code';

export const evilEye = createCodeObject(code, 'Backgrounds/EvilEye', {
  installation: `npm install ogl`,
  usage: `<template>
  <EvilEye
    eye-color="#FF6F37"
    :intensity="1.5"
    :pupil-size="0.6"
    :iris-width="0.25"
    :glow-intensity="0.35"
    :scale="0.8"
    :noise-scale="1.0"
    :pupil-follow="1.0"
    :flame-speed="1.0"
    background-color="#000000"
  />
</template>

<script setup lang="ts">
import EvilEye from './EvilEye.vue'
</script>`
});
