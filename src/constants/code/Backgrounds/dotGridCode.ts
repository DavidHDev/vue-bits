import code from '@/content/Backgrounds/DotGrid/DotGrid.vue?raw';
import { createCodeObject } from '@/types/code';

export const dotGrid = createCodeObject(code, 'Backgrounds/DotGrid', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <DotGrid
      base-color="#343b36"
      active-color="#ffffff"
      shape="circle"
      :dot-size="5"
      :gap="18"
      :proximity="140"
      :strength="1"
      :bounce="0.6"
      :tension="0.4"
      :return-duration="0.8"
      :shock-radius="320"
      :shock-strength="5"
      :swell="0.8"
      :stretch="0.5"
      :glow="0.5"
      :fade="0"
      :intro="true"
    />
  </div>
</template>

<script setup lang="ts">
import DotGrid from './DotGrid.vue'
</script>`
});
