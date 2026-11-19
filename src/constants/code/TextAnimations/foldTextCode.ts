import code from '@/content/TextAnimations/FoldText/FoldText.vue?raw';
import { createCodeObject } from '@/types/code';

export const foldText = createCodeObject(code, 'TextAnimations/FoldText', {
  installation: `npm install gsap`,
  usage: `<template>
  <FoldText
    text="Launch with clarity"
    fold-style="paper"
    split-by="char"
    hinge="top"
    trigger="scroll"
    :fold-angle="92"
    :duration="0.65"
    :stagger="0.045"
    stagger-from="start"
    ease="power3.out"
    :loop-delay="1.4"
    :hover-refold="true"
    :refold-radius="140"
    :refold-angle="45"
    :perspective="700"
    :crease-shading="0.55"
    font-size="clamp(3rem, 10vw, 7rem)"
    :font-weight="800"
  />
</template>

<script setup lang="ts">
import FoldText from './FoldText.vue'
</script>`
});
