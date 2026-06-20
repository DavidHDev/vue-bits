import code from '@/content/Components/Folder/Folder.vue?raw';
import { createCodeObject } from '@/types/code';

export const folder = createCodeObject(code, 'Components/Folder', {
  usage: `<template>
  <div style="height: 600px; position: relative;">
    <Folder :size="2" color="#5227FF" class="custom-folder" />
  </div>
</template>

<script setup>
import Folder from './Folder.vue'
</script>`
});
