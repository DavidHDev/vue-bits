import code from '@/content/Components/Counter/Counter.vue?raw';
import { createCodeObject } from '@/types/code';

export const counter = createCodeObject(code, 'Components/Counter', {
  dependencies: '',
  usage: `<template>
  <Counter
    :value="1284"
    :font-size="80"
    :font-weight="600"
  />
</template>

<script setup lang="ts">
import Counter from './Counter.vue'
</script>`
});
