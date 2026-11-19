import code from '@/content/Backgrounds/Lightfall/Lightfall.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightfall = createCodeObject(code, 'Backgrounds/Lightfall', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Lightfall
      :colors="['#ffffff']"
      background-color="#94a3b8"
      :speed="0.3"
      :streak-count="2"
      :streak-width="0.8"
      :twinkle="0.3"
      :background-glow="0.1"
      :head-glow="0.6"
      :bloom="0.35"
      :mouse-interaction="true"
      :hold-to-warp="true"
      :intro="true"
    />
  </div>
</template>

<script setup lang="ts">
import Lightfall from './Lightfall.vue'
</script>`
});
