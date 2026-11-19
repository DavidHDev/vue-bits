import code from '@/content/Components/Masonry/Masonry.vue?raw';
import { createCodeObject } from '@/types/code';

export const masonry = createCodeObject(code, 'Components/Masonry', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <Masonry
    :items="items"
    :column-width="240"
    :gap="12"
    :radius="12"
    animate-from="bottom"
    hover-effect="zoom"
    captions="hover"
    :lightbox="true"
    :draggable="true"
  />
</template>

<script setup lang="ts">
import Masonry from './Masonry.vue'

const items = [
  {
    id: '1',
    img: 'https://picsum.photos/id/1015/600/900?grayscale',
    width: 600,
    height: 900,
    title: 'Alexey Topolyanskiy',
    url: 'https://unsplash.com/photos/-oWyJoSqBRM'
  },
  {
    id: '2',
    img: 'https://picsum.photos/id/1011/600/750?grayscale',
    width: 600,
    height: 750,
    title: 'Roberto Nickson',
    url: 'https://unsplash.com/photos/7BjmDICVloE'
  }
]
</script>`
});
