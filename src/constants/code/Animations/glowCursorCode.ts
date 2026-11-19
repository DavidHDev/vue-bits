import code from '@/content/Animations/GlowCursor/GlowCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const glowCursor = createCodeObject(code, 'Animations/GlowCursor', {
  dependencies: '',
  usage: `<template>
  <div style="position: relative; width: 100%; height: 500px">
    <GlowCursor
      color="#5f8bff"
      :intensity="1.3"
      :trail-width="3"
      :linger="1.4"
      :glow="1.2"
      click-burst
      theme="dark"
    >
      <!-- Your content here -->
    </GlowCursor>
  </div>
</template>

<script setup lang="ts">
import GlowCursor from './GlowCursor.vue'
</script>`
});
