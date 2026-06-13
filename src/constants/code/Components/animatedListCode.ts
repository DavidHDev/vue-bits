import code from '@/content/Components/AnimatedList/AnimatedList.vue?raw';
import { createCodeObject } from '@/types/code';

export const animatedList = createCodeObject(code, 'Components/AnimatedList', {
  installation: `npm install motion-v`,
  usage: `<template>
  <AnimatedList
    :items="items"
    :on-item-select="handleItemSelect"
    :show-gradients="true"
    :enable-arrow-navigation="true"
    :display-scrollbar="true"
  />
</template>

<script setup lang="ts">
import AnimatedList from './AnimatedList.vue'

const items = [
  'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5',
  'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'
]

function handleItemSelect(item: string, index: number) {
  console.log(item, index)
}
</script>`
});
