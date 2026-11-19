import code from '@/content/Components/FlexCarousel/FlexCarousel.vue?raw';
import { createCodeObject } from '@/types/code';

export const flexCarousel = createCodeObject(code, 'Components/FlexCarousel', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 560px; position: relative">
    <FlexCarousel
      :items="items"
      preset="liquid"
      intro="rise"
      :card-height="0.5"
      :gap="12"
      :squeeze="0.2"
      :focus-on-click="true"
      :captions="true"
    />
  </div>
</template>

<script setup lang="ts">
import FlexCarousel from './FlexCarousel.vue'

const items = [
  { src: '/images/one.jpg', alt: 'A chrome sculpture', title: 'Iridescence' },
  { src: '/images/two.jpg', alt: 'A figure on a white set', title: 'White Room' },
  { src: '/images/three.jpg', alt: 'A clay bust in profile', title: 'Clay Study', subtitle: 'Studio 04' }
]
</script>`
});
