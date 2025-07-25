import code from '@/content/TextAnimations/DecryptedText/DecryptedText.vue?raw';
import { createCodeObject } from '@/types/code';

export const decryptedText = createCodeObject(code, 'TextAnimations/DecryptedText', {
  usage: `<template>
  <DecryptedText
    text="Hello World!"
    :speed="50"
    :max-iterations="10"
    :sequential="false"
    reveal-direction="start"
    :use-original-chars-only="false"
    animate-on="hover"
    class-name="text-green-500"
    encrypted-class-name="text-red-500"
  />
</template>

<script setup lang="ts">
  import DecryptedText from "./DecryptedText.vue";
</script>`
});
