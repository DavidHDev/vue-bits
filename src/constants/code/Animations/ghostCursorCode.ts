import code from '@/content/Animations/GhostCursor/GhostCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const ghostCursor = createCodeObject(code, 'Animations/GhostCursor', {
  dependencies: '',
  usage: `<template>
  <div style="height: 600px; position: relative">
    <GhostCursor
      color="#A0FFBC"
      :size="80"
      :trail-length="50"
      :inertia="0.5"
      :turbulence="0.5"
      :drift="0.3"
      :bloom-strength="0.6"
      :grain-intensity="0.05"
    />
  </div>
</template>

<script setup lang="ts">
import GhostCursor from './GhostCursor.vue'
</script>`
});
