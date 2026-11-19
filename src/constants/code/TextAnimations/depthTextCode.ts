import code from '@/content/TextAnimations/DepthText/DepthText.vue?raw';
import { createCodeObject } from '@/types/code';

export const depthText = createCodeObject(code, 'TextAnimations/DepthText', {
  dependencies: '',
  usage: `<template>
  <DepthText
    text="Elevate"
    :layers="34"
    :depth="2.4"
    depth-color="#42b883"
    :gradient-depth="false"
    :hover-push="0.5"
    :float="false"
    :tilt="7.5"
    :pointer-tracking="true"
    :smoothing="0.14"
    :perspective="900"
    :auto-orbit="true"
    :orbit-speed="0.35"
    font-size="clamp(3rem, 12vw, 7rem)"
    :font-weight="900"
    :shadow="true"
    :outline="false"
    :intro="true"
  />
</template>

<script setup lang="ts">
import DepthText from './DepthText.vue'
</script>`
});
