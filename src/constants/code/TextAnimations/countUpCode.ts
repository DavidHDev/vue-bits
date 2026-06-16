import code from '@/content/TextAnimations/CountUp/CountUp.vue?raw';
import { createCodeObject } from '@/types/code';

export const countUp = createCodeObject(code, 'TextAnimations/CountUp', {
  usage: `<template>
  <CountUp
    :from="0"
    :to="100"
    separator=","
    direction="up"
    :duration="1"
    class="count-up-text"
  />
</template>

<script setup>
import CountUp from './CountUp.vue'
</script>`
});
