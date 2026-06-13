import code from '@/content/TextAnimations/TextType/TextType.vue?raw';
import { createCodeObject } from '@/types/code';

export const textType = createCodeObject(code, 'TextAnimations/TextType', {
  installation: `npm install gsap`,
  usage: `<template>
  <TextType 
    :text="['Text typing effect', 'for your websites', 'Happy coding!']"
    :typing-speed="75"
    :pause-duration="1500"
    :show-cursor="true"
    cursor-character="|"
  />
</template>

<script setup>
import TextType from './TextType.vue'
</script>`
});
