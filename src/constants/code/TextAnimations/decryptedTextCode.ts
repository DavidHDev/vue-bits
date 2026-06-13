import code from '@/content/TextAnimations/DecryptedText/DecryptedText.vue?raw';
import { createCodeObject } from '@/types/code';

export const decryptedText = createCodeObject(code, 'TextAnimations/DecryptedText', {
  usage: `<template>
  <div>
    <!-- Example 1: Defaults (hover to decrypt) -->
    <DecryptedText text="Hover me!" />

    <!-- Example 2: Customized speed and characters -->
    <DecryptedText
      text="Customize me"
      :speed="100"
      :max-iterations="20"
      characters="ABCD1234!?"
      class="revealed"
      parent-class-name="all-letters"
      encrypted-class-name="encrypted"
    />

    <!-- Example 3: Click to decrypt (toggle mode) -->
    <DecryptedText
      text="Click to decrypt"
      animate-on="click"
      click-mode="toggle"
    />

    <!-- Example 4: Animate on view (runs once) -->
    <div style="margin-top: 4rem;">
      <DecryptedText
        text="This text animates when in view"
        animate-on="view"
        reveal-direction="center"
      />
    </div>
  </div>
</template>

<script setup>
import DecryptedText from './DecryptedText.vue'
</script>`
});
