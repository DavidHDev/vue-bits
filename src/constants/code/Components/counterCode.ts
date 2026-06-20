import code from '@/content/Components/Counter/Counter.vue?raw';
import { createCodeObject } from '@/types/code';

export const counter = createCodeObject(code, 'Components/Counter', {
  installation: `npm i motion-v`,
  usage: `<template>
  <Counter
    :value="1"
    :places="[100, 10, 1]"
    :font-size="80"
    :padding="5"
    :gap="10"
    text-color="white"
    :font-weight="900"
  />
</template>

<script setup>
import Counter from './Counter.vue'
</script>`
});
