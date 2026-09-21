import code from '@/content/Micro/SwipeToast/SwipeToast.vue?raw';
import { createCodeObject } from '@/types/code';

export const swipeToast = createCodeObject(code, 'Micro/SwipeToast', {
  usage: `<script setup>
import { ref } from 'vue'
import SwipeToast from './SwipeToast.vue'

const open = ref(true)
</script>

<template>
<!-- fixed to the bottom-right by default; add inline to keep it in flow -->
<SwipeToast
  :open="open"
  title="File archived"
  description="Moved to Archive"
  actionLabel="Undo"
  @action="undo"
  @close="open = false"
/>

<SwipeToast
  :open="open"
  title="File archived"
  description="Moved to Archive"
  actionLabel="Undo"
  background="#27272a"
  color="#f5f5f5"
  fuseColor="#f5a524"
  :width="356"
  :radius="12"
  :slideMs="400"
  :settleBounce="0.2"
  :swipeDistance="40"
  :duration="4000"
  fuse="bottom"
  pauseOnHover
  closeButton
  inline
  @close="reason => (open = false)"
>
  <template #icon><CheckIcon /></template>
</SwipeToast>
</template>`
});
