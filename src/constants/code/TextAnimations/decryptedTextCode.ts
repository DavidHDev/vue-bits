import code from '@/content/TextAnimations/DecryptedText/DecryptedText.vue?raw';
import { createCodeObject } from '@/types/code';

export const decryptedText = createCodeObject(code, 'TextAnimations/DecryptedText', {
  installation: `npm install motion-v`,
  usage: `<template>
  <DecryptedText
    text="Hacking into the mainframe..."
    animate-on="inViewHover"
    effect="scramble"
    :sequential="true"
    reveal-direction="start"
    :speed="60"
    :max-iterations="10"
    :hover-radius="100"
    scramble-color="#2bb673"
    :loop="false"
    :loop-delay="2000"
    :use-original-chars-only="false"
    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"
    class-name="revealed"
    encrypted-class-name="encrypted"
  />
</template>

<script setup lang="ts">
import DecryptedText from './DecryptedText.vue'
</script>`
});
