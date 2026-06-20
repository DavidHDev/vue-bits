import code from '@/content/Animations/GhostCursor/GhostCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const ghostCursor = createCodeObject(code, 'Animations/GhostCursor', {
  installation: `npm install three`,
  usage: `<template>
  <div
    style="
      height: 600px;
      position: relative;
    "
  >
    <GhostCursor
      color="#B497CF"
      :brightness="1"
      :edge-intensity="0"
      :trail-length="50"
      :inertia="0.5"
      :grain-intensity="0.05"
      :bloom-strength="0.1"
      :bloom-radius="1.0"
      :bloom-threshold="0.025"
      :fade-delay-ms="1000"
      :fade-duration-ms="1500"
    />
  </div>
</template>

<script setup lang="ts">
import GhostCursor from './GhostCursor.vue'
</script>`
});
