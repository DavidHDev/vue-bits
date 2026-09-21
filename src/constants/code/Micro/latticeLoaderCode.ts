import code from '@/content/Micro/LatticeLoader/LatticeLoader.vue?raw';
import { createCodeObject } from '@/types/code';

export const latticeLoader = createCodeObject(code, 'Micro/LatticeLoader', {
  usage: `<script setup>
import { ref } from 'vue'
import LatticeLoader from './LatticeLoader.vue'

const status = ref('working')
</script>

<template>
<LatticeLoader
  label="Thinking"
  doneLabel="Done in"
  errorLabel="Failed after"
  :status="status"
  pattern="orbit"
  :grid="3"
  shape="round"
  color="currentColor"
  doneColor="#22c55e"
  errorColor="#ef4444"
  :cellSize="6"
  :gap="2"
  :fontSize="14"
  :step="90"
  :idleOpacity="0.15"
  :glow="false"
  showTimer
/>

<!-- a custom wave: one delay per cell, null for a hole -->
<LatticeLoader
  :pattern="{ cells: [0, 1, 2, 3, null, 4, 5, 6, 7], loop: 9, scale: 1 }"
  :elapsed="12.4"
/>
</template>`
});
