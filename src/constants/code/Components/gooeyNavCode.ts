import code from '@/content/Components/GooeyNav/GooeyNav.vue?raw';
import { createCodeObject } from '@/types/code';

export const gooeyNav = createCodeObject(code, 'Components/GooeyNav', {
  usage: `<template>
  <div style="height: 600px; position: relative;">
    <GooeyNav
      :items="items"
      :particle-count="15"
      :particle-distances="[90, 10]"
      :particle-r="100"
      :initial-active-index="0"
      :animation-time="600"
      :time-variance="300"
      :colors="[1, 2, 3, 1, 2, 3, 1, 4]"
    />
  </div>
</template>

<script setup>
import GooeyNav from './GooeyNav.vue'

const items = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" }
]
</script>

<style>
  /* Add these CSS custom properties to your global styles */
  :root {
    --color-1: #ff6b6b;
    --color-2: #4ecdc4;
    --color-3: #45b7d1;
    --color-4: #f9ca24;
  }
</style>`
});
