import code from '@/content/TextAnimations/ASCIIText/ASCIIText.vue?raw';
import { createCodeObject } from '@/types/code';

export const asciiText = createCodeObject(code, 'TextAnimations/ASCIIText', {
  installation: `npm install three @types/three`,
  usage: `<!-- Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE -->
  
<template>
  <ASCIIText
    text="hello_world"
    :enable-waves="true"
    :ascii-font-size="8"
  />
</template>

<script setup>
import ASCIIText from './ASCIIText.vue'
</script>`
});
