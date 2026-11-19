import code from '@/content/Animations/MetaBalls/MetaBalls.vue?raw';
import { createCodeObject } from '@/types/code';

export const metaBalls = createCodeObject(code, 'Animations/MetaBalls', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 480px; position: relative">
    <MetaBalls
      color="#ffffff"
      cursor-ball-color="#ffffff"
      variant="solid"
      motion="orbit"
      :ball-count="15"
      :animation-size="30"
      :gooeyness="0.5"
      :stretch="0.5"
      :wobble="0.5"
      :enable-transparency="true"
    />
  </div>
</template>

<script setup lang="ts">
import MetaBalls from './MetaBalls.vue'
</script>`
});
