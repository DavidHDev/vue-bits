import code from '@/content/Backgrounds/PrismaticBurst/PrismaticBurst.vue?raw';
import { createCodeObject } from '@/types/code';

export const prismaticBurst = createCodeObject(code, 'Backgrounds/PrismaticBurst', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <PrismaticBurst
      :colors="['#7cff67', '#42b883', '#66c2a4']"
      animation-type="rotate3d"
      :intensity="2"
      :speed="0.5"
      :zoom="1"
      :ray-width="1"
      :twist="0"
      :mouse-interaction="true"
      :click-burst="true"
      :intro="true"
    />
  </div>
</template>

<script setup lang="ts">
import PrismaticBurst from './PrismaticBurst.vue'
</script>`
});
