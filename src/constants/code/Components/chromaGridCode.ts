import code from '@/content/Components/ChromaGrid/ChromaGrid.vue?raw';
import { createCodeObject } from '@/types/code';

export const chromaGrid = createCodeObject(code, 'Components/ChromaGrid', {
  dependencies: '',
  usage: `<template>
  <ChromaGrid :items="items" :columns="3" :radius="260" />
</template>

<script setup lang="ts">
import ChromaGrid, { type ChromaItem } from './ChromaGrid.vue'

const items: ChromaItem[] = [
  {
    image: '/photos/field.jpg',
    title: 'Canola Field',
    subtitle: 'Midday',
    accent: '#ffd23f'
  },
  {
    image: '/photos/pier.jpg',
    title: 'The Pier',
    subtitle: 'Clear sky',
    accent: '#3fb8ff',
    url: 'https://example.com'
  }
]
</script>`
});
