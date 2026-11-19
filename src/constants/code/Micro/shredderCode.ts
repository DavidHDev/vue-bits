import code from '@/content/Micro/Shredder/Shredder.vue?raw';
import { createCodeObject } from '@/types/code';

export const shredder = createCodeObject(code, 'Micro/Shredder', {
  dependencies: '',
  usage: `<template>
  <Shredder
    :items="files"
    :width="340"
    :height="460"
    :feed-speed="180"
    :bite="18"
    :strip-width="10"
    :curl="1"
    :auto-animate="false"
    :loop="false"
    :loop-after-delete="false"
    :fall-height="140"
    @shred="file => (files = files.filter(f => f.id !== file.id))"
    @reorder="next => (files = next)"
  >
    <template #renderItem="{ item }">
      <div class="row">
        <span>{{ item.name }}</span>
        <span>{{ item.size }}</span>
      </div>
    </template>
  </Shredder>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Shredder from './Shredder.vue'

const files = ref([
  { id: 1, name: 'Harbour at dusk', size: '4.1 MB' },
  { id: 2, name: 'Studio, take two', size: '2.8 MB' },
  { id: 3, name: 'Fog over the bay', size: '6.3 MB' }
])
</script>`
});
