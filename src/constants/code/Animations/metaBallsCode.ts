import code from '@/content/Animations/MetaBalls/MetaBalls.vue?raw';
import { createCodeObject } from '@/types/code';

export const metaBalls = createCodeObject(code, 'Animations/MetaBalls', {
  installation: `npm install ogl`,
  usage: `<template>
  <MetaBalls
    color="#ffffff"
    cursor-ball-color="#ffffff"
    :cursor-ball-size="2"
    :ball-count="15"
    :animation-size="30"
    :enable-mouse-interaction="true"
    :enable-transparency="true"
    :hover-smoothness="0.05"
    :clump-factor="1"
    :speed="0.3"
  />
</template>

<script setup lang="ts">
import MetaBalls from './MetaBalls.vue'
</script>`
});
