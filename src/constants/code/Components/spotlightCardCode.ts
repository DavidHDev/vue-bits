import code from '@/content/Components/SpotlightCard/SpotlightCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const spotlightCard = createCodeObject(code, 'Components/SpotlightCard', {
  dependencies: '',
  usage: `<template>
  <SpotlightCard
    theme="dark"
    spotlight-color="#ffffff"
    :intensity="0.15"
    :spotlight-size="240"
    :softness="0.7"
    shape="circle"
    :border-glow="0.6"
    :proximity="80"
    :smoothing="0.3"
    :grain="0"
    :ambient="false"
    :flare="true"
  >
    <h3>Ethan Harrison</h3>
    <p>Product designer</p>
    <button>Get in touch</button>
  </SpotlightCard>
</template>

<script setup lang="ts">
import SpotlightCard from './SpotlightCard.vue'
</script>`
});
