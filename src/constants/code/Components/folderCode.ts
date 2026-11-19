import code from '@/content/Components/Folder/Folder.vue?raw';
import { createCodeObject } from '@/types/code';

export const folder = createCodeObject(code, 'Components/Folder', {
  dependencies: '',
  usage: `<template>
  <Folder
    label="Projects"
    :items="items"
    @item-click="(item, index) => console.log(item, index)"
  />

  <Folder mode="book" variant="glass" color="#7aa7ff" label="Photos" :items="items" />
</template>

<script setup lang="ts">
import Folder from './Folder.vue'

const items = [
  { title: 'Brand guidelines' },
  { title: 'Launch plan' },
  { image: '/photos/pier.jpg', title: 'The pier' }
];
</script>`
});
