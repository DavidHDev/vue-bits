import code from '@/content/Backgrounds/Orb/Orb.vue?raw';
import { createCodeObject } from '@/types/code';

export const orb = createCodeObject(code, 'Backgrounds/Orb', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Orb
      :colors="['#7cff67', '#4cc2e9', '#0c4a3a']"
      :hover-intensity="1"
      :trail="1"
      :rotate-on-hover="true"
      :follow-cursor="true"
    />
  </div>
</template>

<script setup lang="ts">
import Orb from './Orb.vue';
</script>`
});
