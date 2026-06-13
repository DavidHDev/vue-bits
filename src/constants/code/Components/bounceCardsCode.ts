import code from '@/content/Components/BounceCards/BounceCards.vue?raw';
import { createCodeObject } from '@/types/code';

export const bounceCards = createCodeObject(code, 'Components/BounceCards', {
  installation: `npm install gsap`,
  usage: `<template>
  <BounceCards
    class="custom-bounceCards"
    :images="images"
    :container-width="500"
    :container-height="250"
    :animation-delay="1"
    :animation-stagger="0.08"
    ease-type="elastic.out(1, 0.5)"
    :transform-styles="transformStyles"
    :enable-hover="false"
  />
</template>

<script setup lang="ts">
import BounceCards from './BounceCards.vue'

const images = [
  "https://picsum.photos/400/400?grayscale",
  "https://picsum.photos/500/500?grayscale",
  "https://picsum.photos/600/600?grayscale",
  "https://picsum.photos/700/700?grayscale",
  "https://picsum.photos/300/300?grayscale"
]

const transformStyles = [
  "rotate(5deg) translate(-150px)",
  "rotate(0deg) translate(-70px)",
  "rotate(-5deg)",
  "rotate(5deg) translate(70px)",
  "rotate(-5deg) translate(150px)"
]
</script>`
});
