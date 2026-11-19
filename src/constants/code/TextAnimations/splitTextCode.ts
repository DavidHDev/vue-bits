import code from '@/content/TextAnimations/SplitText/SplitText.vue?raw';
import { createCodeObject } from '@/types/code';

export const splitText = createCodeObject(code, 'TextAnimations/SplitText', {
  installation: `npm install gsap`,
  usage: `<template>
  <SplitText
    text="Hello, GSAP!"
    class-name="text-2xl font-semibold text-center"
    effect="rise"
    split-type="chars"
    :delay="50"
    :duration="1.25"
    stagger-from="start"
    trigger="view"
    hover-effect="lift"
    :loop="false"
    :loop-delay="1.5"
    :mask="false"
    :threshold="0.1"
    root-margin="-100px"
    text-align="center"
    @letter-animation-complete="handleAnimationComplete"
  />
</template>

<script setup lang="ts">
import SplitText from './SplitText.vue'

const handleAnimationComplete = () => {
  console.log('All letters have animated!')
}
</script>`
});
