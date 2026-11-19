import code from '@/content/Components/TiltedCard/TiltedCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const tiltedCard = createCodeObject(code, 'Components/TiltedCard', {
  dependencies: '',
  usage: `<template>
  <TiltedCard
    image-src="https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop"
    alt-text="Sunset clouds"
    caption-text="Afterglow"
    container-height="320px"
    container-width="320px"
    image-height="320px"
    image-width="320px"
    :rotate-amplitude="12"
    :scale-on-hover="1.05"
    :glare="0.5"
    :shadow="0.5"
  >
    <TiltedCardLayer :depth="30">
      <h3 style="position: absolute; left: 20px; bottom: 16px; color: #fff">Afterglow</h3>
    </TiltedCardLayer>

    <template #back>
      <p style="padding: 20px">The back of the card</p>
    </template>
  </TiltedCard>
</template>

<script setup lang="ts">
import TiltedCard, { TiltedCardLayer } from './TiltedCard.vue'
</script>`
});
