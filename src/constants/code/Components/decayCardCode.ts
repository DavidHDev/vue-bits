import code from '@/content/Components/DecayCard/DecayCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const decayCard = createCodeObject(code, 'Components/DecayCard', {
  installation: `npm install gsap`,
  usage: `<template>
  <DecayCard :width="200" :height="300" image="https://picsum.photos/300/400?grayscale">
    <h2>Decay<br/>Card</h2>
  </DecayCard>
</template>

<script setup>
import DecayCard from './DecayCard.vue'
</script>`
});
