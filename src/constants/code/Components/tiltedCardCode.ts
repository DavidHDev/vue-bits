import code from '@/content/Components/TiltedCard/TiltedCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const tiltedCard = createCodeObject(code, 'Components/TiltedCard', {
  installation: `npm install motion-v`,
  usage: `<template>
  <TiltedCard
    image-src="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
    alt-text="Kendrick Lamar - GNX Album Cover"
    caption-text="Kendrick Lamar - GNX"
    container-height="300px"
    container-width="300px"
    image-height="300px"
    image-width="300px"
    :rotate-amplitude="12"
    :scale-on-hover="1.2"
    :show-mobile-warning="false"
    :show-tooltip="true"
    :display-overlay-content="true"
  >
    <template #overlay>
      <p class="tilted-card-demo-text">
        Kendrick Lamar - GNX
      </p>
    </template>
  </TiltedCard>
</template>

<script setup>
import TiltedCard from './TiltedCard.vue'
</script>`
});
