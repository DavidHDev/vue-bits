import code from '@/content/TextAnimations/CountUp/CountUp.vue?raw';
import { createCodeObject } from '@/types/code';

export const countUp = createCodeObject(code, 'TextAnimations/CountUp', {
  installation: `npm install motion-v`,
  usage: `<template>
  <CountUp
    :from="0"
    :to="100"
    mode="count"
    easing="easeOut"
    format="standard"
    separator=","
    prefix=""
    suffix=""
    direction="up"
    :duration="1"
    :delay="0"
    trigger="view"
    :replay-on-hover="true"
    class-name="count-up-text"
  />
</template>

<script setup lang="ts">
import CountUp from './CountUp.vue'
</script>`
});
