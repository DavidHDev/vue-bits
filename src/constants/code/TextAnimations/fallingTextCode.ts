import code from '@/content/TextAnimations/FallingText/FallingText.vue?raw';
import { createCodeObject } from '@/types/code';

export const fallingText = createCodeObject(code, 'TextAnimations/FallingText', {
  installation: `npm install matter-js`,
  usage: `<template>
  <div :style="{ height: '400px', position: 'relative' }">
    <FallingText
      text="Some sentences are built to last. This one falls apart on contact."
      :highlight-words="['falls', 'apart']"
      trigger="hover"
      font-size="2rem"
      :gravity="1"
      :restore-delay="2"
    />
  </div>
</template>

<script setup lang="ts">
import FallingText from './FallingText.vue'
</script>`
});
