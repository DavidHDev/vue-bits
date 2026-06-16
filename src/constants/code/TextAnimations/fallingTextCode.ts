import code from '@/content/TextAnimations/FallingText/FallingText.vue?raw';
import { createCodeObject } from '@/types/code';

export const fallingText = createCodeObject(code, 'TextAnimations/FallingText', {
  installation: `npm install matter-js @types/matter-js`,
  usage: `<template>
  <FallingText
    text="Vue Bits is a library of animated and interactive Vue components designed to streamline UI development and simplify your workflow."
    :highlight-words="['Vue', 'Bits', 'animated', 'components', 'simplify']"
    highlight-class="highlighted"
    trigger="hover"
    background-color="transparent"
    :wireframes="false"
    :gravity="0.56"
    font-size="2rem"
    :mouse-constraint-stiffness="0.9"
  />
</template>

<script setup>
import FallingText from './FallingText.vue'
</script>`
});
