import code from '@/content/Components/MagicBento/MagicBento.vue?raw';
import { createCodeObject } from '@/types/code';

export const magicBento = createCodeObject(code, 'Components/MagicBento', {
  installation: `npm install gsap`,
  usage: `<template>
  <MagicBento 
    :text-auto-hide="true"
    :enable-stars="true"
    :enable-spotlight="true"
    :enable-border-glow="true"
    :enable-tilt="true"
    :enable-magnetism="true"
    :click-effect="true"
    :spotlight-radius="300"
    :particle-count="12"
    glow-color="132, 0, 255"
  />
</template>

<script setup>
import MagicBento from './MagicBento.vue'
</script>`
});
