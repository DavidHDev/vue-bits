import code from '@/content/Animations/CrystalizedBall/CrystalizedBall.vue?raw';
import { createCodeObject } from '@/types/code';

export const crystalizedBall = createCodeObject(code, 'Animations/CrystalizedBall', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <CrystalizedBall
      preset="plasma"
      color="#42B883"
      :size="0.7"
      :crackle="0.85"
      :fill="0.5"
      interactive
      :hover-strength="0.7"
    />
  </div>
</template>

<script setup lang="ts">
import CrystalizedBall from './CrystalizedBall.vue'
</script>`
});
