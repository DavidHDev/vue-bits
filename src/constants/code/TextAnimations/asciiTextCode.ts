import code from '@/content/TextAnimations/AsciiText/AsciiText.vue?raw';
import { createCodeObject } from '../../../types/code';

export const asciiText = createCodeObject(code, 'TextAnimations/AsciiText', {
  installation: `npm install three @types/three`,
  usage: `<!-- Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE -->
  
<template>
  <AsciiText
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
  import AsciiText from "./AsciiText.vue";
</script>`
});
