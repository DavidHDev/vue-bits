import code from '@/content/Backgrounds/GridScan/GridScan.vue?raw';
import { createCodeObject } from '@/types/code';

export const gridScan = createCodeObject(code, 'Backgrounds/GridScan', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <GridScan
      lines-color="#4a4f4b"
      scan-color="#7dd3fc"
      :cells="8"
      :depth="3"
      :scan-duration="2.4"
      :scan-delay="1.6"
      click-effect="ping"
    />
  </div>
</template>

<script setup lang="ts">
import GridScan from './GridScan.vue';
</script>`
});
