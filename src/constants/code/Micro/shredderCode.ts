import code from '@/content/Micro/Shredder/Shredder.vue?raw';
import { createCodeObject } from '@/types/code';

export const shredder = createCodeObject(code, 'Micro/Shredder', {
  usage: `<script setup>
import { ref } from 'vue'
import Shredder from './Shredder.vue'

const items = ref([
  { id: '1', title: 'Harbour at dusk' },
  { id: '2', title: 'Studio, take two' }
])
</script>

<template>
<!-- drag a row into the slit, or press Delete/Backspace on a focused row -->
<Shredder :items="items" @shred="item => items = items.filter(i => i.id !== item.id)">
  <template #default="{ item }">{{ item.title }}</template>
</Shredder>

<Shredder
  :items="items"
  :width="340"
  :height="460"
  :inset="14"
  :gap="10"
  :slitHeight="4"
  :fallHeight="140"
  :feedSpeed="180"
  :bite="18"
  autoFeed
  :stripWidth="10"
  :curl="1"
  :autoAnimate="false"
  :loop="false"
  :loopAfterDelete="false"
  :dragTilt="6"
  :lift="1.02"
  slitColor="#3f3f46"
  color="#f5f5f5"
  @shred="onShred"
  @reorder="next => (items = next)"
>
  <template #default="{ item }">{{ item.title }}</template>
</Shredder>
</template>`
});
