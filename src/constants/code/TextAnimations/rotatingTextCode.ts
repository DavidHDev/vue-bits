import code from '@/content/TextAnimations/RotatingText/RotatingText.vue?raw';
import { createCodeObject } from '@/types/code';

export const rotatingText = createCodeObject(code, 'TextAnimations/RotatingText', {
  installation: `npm install motion-v`,
  usage: `<template>
    <RotatingText
      :texts="['Vue', 'Bits', 'is', 'Cool!']"
      mainClassName="px-2 sm:px-2 md:px-3 bg-green-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
      :staggerFrom="'last'"
      :initial="{ y: '100%' }"
      :animate="{ y: 0 }"
      :exit="{ y: '-120%' }"
      :staggerDuration="0.025"
      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
      :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
      :rotationInterval="2000"
    />
</template>

<script setup lang="ts">
  import RotatingText from "./RotatingText.vue";
</script>`
});
