import code from '@/content/Micro/PaperCrumple/PaperCrumple.vue?raw';
import { createCodeObject } from '@/types/code';

export const paperCrumple = createCodeObject(code, 'Micro/PaperCrumple', {
  installation: `npm install three`,
  usage: `<template>
  <PaperCrumple
    src="/your-image.png"
    alt="A print to crumple"
    :width="320"
    :height="400"
    :scene-height="560"
    release-behavior="restore"
    :crumple-amount="0.85"
    :crumple-duration="0.55"
    :release-duration="0.4"
    :fold-count="6"
    :fold-sharpness="0.6"
    :wrinkle-depth="0.65"
    :crease-strength="0.18"
    paper-color="#f4f0e8"
    :paper-texture="0.08"
    draggable
    return-to-origin
  />
</template>

<script setup lang="ts">
import PaperCrumple from './PaperCrumple.vue'
</script>`
});
