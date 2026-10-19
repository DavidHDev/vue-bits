import code from '@/content/Components/FlexCarousel/FlexCarousel.vue?raw';
import { createCodeObject } from '@/types/code';

export const flexCarousel = createCodeObject(code, 'Components/FlexCarousel', {
  usage: `<script setup>
import FlexCarousel from './FlexCarousel.vue'

const items = [
  { src: '/photos/one.jpg', alt: 'A chrome sculpture', title: 'Iridescence' },
  { src: '/photos/two.jpg', alt: 'A clay bust', title: 'Clay Study', subtitle: '2024' }
]
</script>

<template>
<div style="width: 100%; height: 540px; position: relative">
  <FlexCarousel
    :items="items"
    preset="liquid"
    intro="rise"
    fit="natural"
    :cardHeight="0.5"
    :gap="12"
    :radius="0"
    :squeeze="0.2"
    focusOnClick
    :autoplay="false"
    :interval="4"
    captions
    captureWheel
    @change="(index, item) => console.log(index, item)"
    @select="(index, item) => console.log('selected', item)"
  />
</div>
</template>`
});
