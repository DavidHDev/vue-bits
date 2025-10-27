import code from '@/content/Animations/GhostCursor/GhostCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const ghostCursor = createCodeObject(code, 'Animations/GhostCursor', {
  installation: `npm install three`,
  usage: `<template>
  <div style="height: 600px; position: relative;">
    <GhostCursor
      color="#A0FFBC"
      :brightness="1"
      :edgeIntensity="0"
      :trailLength="50"
      :inertia="0.5"
      :grainIntensity="0.05"
      :bloomStrength="0.1"
      :bloomRadius="1.0"
      :bloomThreshold="0.025"
      :fadeDelayMs="1000"
      :fadeDurationMs="1500"
    />
  </div>
</template>

<script setup lang="ts">
import GhostCursor from './GhostCursor.vue'
</script>`
});
