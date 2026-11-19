import code from '@/content/Animations/SwarmCursor/SwarmCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const swarmCursor = createCodeObject(code, 'Animations/SwarmCursor', {
  dependencies: '',
  usage: `<template>
  <div style="position: relative; width: 100%; height: 600px">
    <SwarmCursor
      :count="800"
      :size="2.6"
      :spread="90"
      :swirl="0.6"
      click-effect="burst"
    >
      <!-- Your content here -->
    </SwarmCursor>
  </div>
</template>

<script setup lang="ts">
import SwarmCursor from './SwarmCursor.vue'
</script>`
});
