import code from '@/content/Animations/BlobCursor/BlobCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const blobCursor = createCodeObject(code, 'Animations/BlobCursor', {
  installation: `npm install three @types/three`,
  usage: `<template>
  <div style="position: relative; height: 500px">
    <BlobCursor
      material="chrome"
      color="#3B82F6"
      :size="140"
    />
  </div>
</template>

<script setup lang="ts">
import BlobCursor from './BlobCursor.vue'
</script>`
});
