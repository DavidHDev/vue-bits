import code from '@/content/Backgrounds/Iridescence/Iridescence.vue?raw';
import { createCodeObject } from '@/types/code';

export const iridescence = createCodeObject(code, 'Backgrounds/Iridescence', {
  installation: `npm install ogl`,
  usage: `<template>
  <Iridescence
    :color="[1, 1, 1]"
    :mouse-react="false"
    :amplitude="0.1"
    :speed="1.0"
  />
</template>

<script setup lang="ts">
import Iridescence from './Iridescence.vue'
</script>`
});
