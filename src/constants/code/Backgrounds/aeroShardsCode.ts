import code from '@/content/Backgrounds/AeroShards/AeroShards.vue?raw';
import { createCodeObject } from '@/types/code';

export const aeroShards = createCodeObject(code, 'Backgrounds/AeroShards', {
  installation: `npm install vgpu`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <AeroShards
      shard-color="#6ABD89"
      accent-color="#7CFF67"
      placement="full"
      material="glass"
      markers="plus"
      :count="1300"
      :depth-of-field="0.75"
      :vignette="0.3"
      mouse-interaction
      pulse-on-click
      hold-to-gather
    />
  </div>
</template>

<script setup lang="ts">
import AeroShards from './AeroShards.vue';
</script>`
});
