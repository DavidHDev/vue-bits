import code from '@/content/TextAnimations/CountUp/CountUp.vue?raw';
import { createCodeObject } from '@/types/code';

export const countup = createCodeObject(code, 'TextAnimations/CountUp', {
  usage: `<template>
  <CountUp
    :from="0"
    :to="100"
    separator=","
    direction="up"
    :duration="1"
    :delay="0"
    :start-when="true"
    class-name="count-up-text"
    @start="handleStart"
    @end="handleEnd"
  />
</template>

<script setup lang="ts">
  import CountUp from "./CountUp.vue";
  
  const handleStart = () => {
    console.log("Count animation started!");
  };
  
  const handleEnd = () => {
    console.log("Count animation ended!");
  };
</script>`
});
