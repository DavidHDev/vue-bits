import code from '@/content/TextAnimations/ASCIIText/ASCIIText.vue?raw';
import { createCodeObject } from '../../../types/code';

export const asciiText = createCodeObject(code, 'TextAnimations/ASCIIText', {
  installation: `npm install three @types/three`,
  usage: `<!-- Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE -->
  
<template>
  <ASCIIText
    text="Hey!"
    :ascii-font-size="8"
    :text-font-size="200"
    text-color="#fdf9f3"
    :plane-base-height="8"
    :enable-waves="true"
    class-name="w-full h-full"
  />
</template>

<script setup lang="ts">
  import ASCIIText from "./ASCIIText.vue";
</script>`
});
