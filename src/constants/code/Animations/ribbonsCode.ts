import code from '@/content/Animations/Ribbons/Ribbons.vue?raw';
import { createCodeObject } from '@/types/code';

export const ribbons = createCodeObject(code, 'Animations/Ribbons', {
  dependencies: '',
  usage: `<template>
  <div style="height: 500px; position: relative; overflow: hidden">
    <Ribbons
      :colors="['#42b883', '#7cff67', '#a0ffbc']"
      :thickness="30"
      :length="1.4"
    />
  </div>
</template>

<script setup lang="ts">
import Ribbons from './Ribbons.vue'
</script>`
});
