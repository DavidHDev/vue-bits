import code from '@/content/Animations/Antigravity/Antigravity.vue?raw';
import { createCodeObject } from '@/types/code';

export const antigravity = createCodeObject(code, 'Animations/Antigravity', {
  installation: `npm install three @types/three`,
  usage: `<template>
  <Antigravity
    :count="300"
    :magnetRadius="10"
    :ringRadius="10"
    :waveSpeed="0.4"
    :waveAmplitude="1"
    :particleSize="2"
    :lerpSpeed="0.1"
    color="#FF9FFC"
    :autoAnimate="false"
    :particleVariance="1"
    :rotationSpeed="0"
    :depthFactor="1"
    :pulseSpeed="3"
    particleShape="capsule"
    :fieldStrength="10"
  />
</template>

<script setup lang="ts">
import Antigravity from "./Antigravity.vue";
</script>`
});
