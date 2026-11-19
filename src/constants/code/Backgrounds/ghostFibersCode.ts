import code from '@/content/Backgrounds/GhostFibers/GhostFibers.vue?raw';
import { createCodeObject } from '@/types/code';

export const ghostFibers = createCodeObject(code, 'Backgrounds/GhostFibers', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <GhostFibers
      glow-color="#42b883"
      :layers="3"
      :twist="1.2"
      :threads="72"
      fiber-style="dots"
      :depth-of-field="0.85"
      hover-effect="focus"
      :intro="true"
      :mouse-interaction="true"
    />
  </div>
</template>

<script setup lang="ts">
import GhostFibers from './GhostFibers.vue'
</script>`
});
