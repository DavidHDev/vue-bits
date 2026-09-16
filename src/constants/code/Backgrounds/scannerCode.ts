import code from '@/content/Backgrounds/Scanner/Scanner.vue?raw';
import { createCodeObject } from '@/types/code';

export const scanner = createCodeObject(code, 'Backgrounds/Scanner', {
  installation: `npm install ogl`,
  usage: `<template>
  <Scanner
    color1="#5227FF"
    color2="#FF9FFC"
    color3="#FFFFFF"
    :speed="0.5"
    :sweep-speed="0.25"
    :sweep-width="1.6"
    scan-direction="vertical"
    :mouse-interaction="true"
  />
</template>

<script setup lang="ts">
import Scanner from './Scanner.vue'
</script>`
});
