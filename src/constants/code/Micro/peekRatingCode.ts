import code from '@/content/Micro/PeekRating/PeekRating.vue?raw';
import { createCodeObject } from '@/types/code';

export const peekRating = createCodeObject(code, 'Micro/PeekRating', {
  usage: `<script setup>
import { ref } from 'vue'
import PeekRating from './PeekRating.vue'

const rating = ref(3)
</script>

<template>
<PeekRating
  :value="rating"
  :count="5"
  shape="star"
  :labels="['Poor', 'Fair', 'Good', 'Great', 'Superb']"
  activeColor="#f5b400"
  idleColor="#52525b"
  tipColor="#27272a"
  tipTextColor="#f5f5f5"
  :size="40"
  :lift="8"
  :magnify="1.15"
  :riseDuration="320"
  :popScale="1.3"
  showTip
  allowClear
  @change="value => (rating = value)"
  @preview="value => console.log('previewing', value)"
/>

<!-- display only -->
<PeekRating :value="4" readOnly :size="20" />
</template>`
});
