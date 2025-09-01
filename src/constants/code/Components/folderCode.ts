import code from '@content/Components/Folder/Folder.vue?raw';
import { createCodeObject } from '../../../types/code';

export const folder = createCodeObject(code, 'Components/Folder', {
  usage: `<template>
  <Folder :items="items" :size="2" color="#27FF64" class="my-folder-class" />
</template>

<script setup lang="ts">
  import Folder from "./Folder.vue";

  const items = ['Doc 1', 'Doc 2', 'Doc 3'];
</script>`
});
