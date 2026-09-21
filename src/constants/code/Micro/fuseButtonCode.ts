import code from '@/content/Micro/FuseButton/FuseButton.vue?raw';
import { createCodeObject } from '@/types/code';

export const fuseButton = createCodeObject(code, 'Micro/FuseButton', {
  usage: `<script setup>
import FuseButton from './FuseButton.vue'

const archive = () => api.archive(id)
const restore = () => api.restore(id)
</script>

<template>
<FuseButton
  label="Archive"
  undoLabel="Undo"
  doneLabel="Archived"
  color="#f5f5f5"
  background="#27272a"
  fuseColor="#f5a524"
  size="md"
  :radius="22"
  :undoWindow="4000"
  fuse="outline"
  :fuseThickness="1.5"
  :crossfadeMs="200"
  commitOn="press"
  pauseOnHover
  settle="reset"
  @commit="archive"
  @undo="restore"
  @fuseEnd="() => console.log('window closed')"
  @phaseChange="phase => console.log(phase)"
/>

<!-- custom idle icon -->
<FuseButton label="Send" doneLabel="Sent">
  <template #icon>
    <MySendIcon />
  </template>
</FuseButton>
</template>`
});
