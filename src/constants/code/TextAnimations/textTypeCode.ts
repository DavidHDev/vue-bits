import code from '@/content/TextAnimations/TextType/TextType.vue?raw';
import { createCodeObject } from '@/types/code';

export const textType = createCodeObject(code, 'TextAnimations/TextType', {
  installation: `npm install gsap`,
  usage: `<template>
  <TextType
    :text="['Text typing effect', 'for your websites', 'Happy coding!']"
    :typing-speed="75"
    :pause-duration="1500"
    :deleting-speed="50"
    delete-mode="backspace"
    type-effect="fade"
    :mistakes="0.2"
    cursor-style="bar"
    :cursor-glide="true"
    :show-cursor="true"
  />
</template>

<script setup lang="ts">
import TextType from './TextType.vue'
</script>`
});
