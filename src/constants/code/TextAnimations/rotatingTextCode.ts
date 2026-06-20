import code from '@/content/TextAnimations/RotatingText/RotatingText.vue?raw';
import { createCodeObject } from '@/types/code';

export const rotatingText = createCodeObject(code, 'TextAnimations/RotatingText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <RotatingText
    :texts="['Vue', 'Bits', 'Is', 'Cool!']"
    main-class-name="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
    stagger-from="last"
    :initial="{ y: '100%' }"
    :animate="{ y: 0 }"
    :exit="{ y: '-120%' }"
    :stagger-duration="0.025"
    split-level-class-name="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
    :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
    :rotation-interval="2000"
  />
</template>

<script setup>
import RotatingText from './RotatingText.vue'
</script>`
});
