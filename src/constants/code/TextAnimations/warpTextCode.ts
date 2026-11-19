import code from '@/content/TextAnimations/WarpText/WarpText.vue?raw';
import { createCodeObject } from '@/types/code';

export const warpText = createCodeObject(code, 'TextAnimations/WarpText', {
  dependencies: 'ogl',
  usage: `<template>
  <WarpText
    text="Bend the moment"
    :warp-strength="0.08"
    :warp-scale="1.7"
    :speed="0.55"
    lens="bulge"
    :pointer-influence="0.42"
    :pointer-strength="0.38"
    :refraction="0.018"
    :chromatic="0.35"
    :idle-drift="0.2"
    :ripple="true"
    :click-ripple="true"
    :intro="true"
    font-size="clamp(3rem, 10vw, 9rem)"
    :font-weight="800"
    :style="{ height: '320px' }"
  />
</template>

<script setup lang="ts">
import WarpText from './WarpText.vue'
</script>`
});
