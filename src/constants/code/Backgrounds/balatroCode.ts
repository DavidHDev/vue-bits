import code from '@/content/Backgrounds/Balatro/Balatro.vue?raw';
import { createCodeObject } from '@/types/code';

export const balatro = createCodeObject(code, 'Backgrounds/Balatro', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Balatro
      color1="#DE443B"
      color2="#006BB4"
      color3="#162325"
      :swirl="0.25"
      :pixel-size="1.5"
      :mouse-interaction="true"
    />
  </div>
</template>

<script setup lang="ts">
import Balatro from './Balatro.vue';
</script>`
});
