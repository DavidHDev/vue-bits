import code from '@/content/Micro/RefineFrame/RefineFrame.vue?raw';
import { createCodeObject } from '@/types/code';

export const refineFrame = createCodeObject(code, 'Micro/RefineFrame', {
  usage: `<script setup>
import { ref } from 'vue'
import RefineFrame from './RefineFrame.vue'

// 'queued' | 'generating' | 'refining' | 'complete' | 'error'
const status = ref('queued')
</script>

<template>
<RefineFrame
  :status="status"
  aspectRatio="4 / 3"
  :width="320"
  :radius="16"
  background="#27272a"
  color="#f5f5f5"
  :stageDuration="400"
  sweep
  showStatus
  :hideAfter="1200"
  retryLabel="Retry"
  @retry="generate"
>
  <!-- crossorigin lets the frame read the pixels; an img, video or canvas all work -->
  <img src="/result.jpg" alt="" crossorigin="anonymous" draggable="false" />
</RefineFrame>
</template>`
});
