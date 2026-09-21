import code from '@/content/Micro/HoldButton/HoldButton.vue?raw';
import { createCodeObject } from '@/types/code';

export const holdButton = createCodeObject(code, 'Micro/HoldButton', {
  usage: `<script setup>
import HoldButton from './HoldButton.vue'

const remove = () => api.deleteAccount()
</script>

<template>
<HoldButton
  doneLabel="Deleted"
  backgroundColor="#27272a"
  fillColor="#5227FF"
  textColor="#f5f5f5"
  fillTextColor="#ffffff"
  size="md"
  :radius="14"
  fillDirection="right"
  :holdTime="2000"
  :releaseTime="200"
  :pressScale="0.97"
  wave
  :waveAmplitude="6"
  glow
  :resetAfter="1200"
  @hold="remove"
  @tap="() => console.log('too quick, hold it')"
>
  <template #icon>
    <MyTrashIcon />
  </template>
  <template #doneIcon>
    <MyCheckIcon />
  </template>
  Hold to delete
</HoldButton>
</template>`
});
