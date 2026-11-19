import code from '@/content/TextAnimations/TechText/TechText.vue?raw';
import { createCodeObject } from '@/types/code';

export const techText = createCodeObject(code, 'TextAnimations/TechText', {
  dependencies: '',
  usage: `<template>
  <div :style="{ width: '100%', height: '480px', position: 'relative' }">
    <TechText
      text="Vue Bits"
      :font-weight="600"
      :font-size="150"
      reveal="letter"
      :dash-length="4"
      :dash-gap="2"
      :specks="15"
      intro="none"
      :intro-duration="2"
      :click-kick="true"
      :guides="false"
    />
  </div>
</template>

<script setup lang="ts">
import TechText from './TechText.vue'
</script>`
});
