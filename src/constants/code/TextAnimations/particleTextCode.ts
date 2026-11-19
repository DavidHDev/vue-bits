import code from '@/content/TextAnimations/ParticleText/ParticleText.vue?raw';
import { createCodeObject } from '@/types/code';

export const particleText = createCodeObject(code, 'TextAnimations/ParticleText', {
  dependencies: '',
  usage: `<template>
  <div :style="{ width: '100%', height: '360px' }">
    <ParticleText
      text="Launch Faster"
      :particle-size="2"
      :density="4"
      color="currentColor"
      highlight-color="#ff5a36"
      highlight-mode="motion"
      shape="circle"
      intro="gather"
      :scatter="180"
      :gather-duration="1600"
      :stagger="420"
      :click-burst="true"
      :burst-strength="1"
      :pointer-repel="40"
      :repel-radius="120"
      :idle-drift="0.7"
      trigger="hover"
      font-size="clamp(3rem, 12vw, 8rem)"
      :font-weight="800"
      font-family="inherit"
      :glow="true"
    />
  </div>
</template>

<script setup lang="ts">
import ParticleText from './ParticleText.vue'
</script>`
});
