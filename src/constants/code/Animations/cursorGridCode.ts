import code from '@/content/Animations/CursorGrid/CursorGrid.vue?raw';
import { createCodeObject } from '@/types/code';

export const cursorGrid = createCodeObject(code, 'Animations/CursorGrid', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <CursorGrid
      :cell-size="60"
      color="#ffffff"
      highlight="area"
      grid-style="lines"
      :radius="140"
      :hold-time="400"
      :fade-duration="800"
      :fill-opacity="0.06"
      :grid-opacity="0.08"
      :spotlight="0.6"
      click-pulse
    >
      <!-- Your content here -->
    </CursorGrid>
  </div>
</template>

<script setup lang="ts">
import CursorGrid from './CursorGrid.vue'
</script>`
});
