import code from '@/content/Components/SpotlightCard/SpotlightCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const spotlightCard = createCodeObject(code, 'Components/SpotlightCard', {
  usage: `<template>
  <SpotlightCard class="custom-spotlight-card" spotlight-color="rgba(0, 229, 255, 0.2)">
    <!-- Content goes here -->
  </SpotlightCard>
</template>

<script setup>
import SpotlightCard from './SpotlightCard.vue'
</script>`
});
