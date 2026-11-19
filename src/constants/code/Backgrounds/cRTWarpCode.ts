import code from '@/content/Backgrounds/CRTWarp/CRTWarp.vue?raw';
import { createCodeObject } from '@/types/code';

export const cRTWarp = createCodeObject(code, 'Backgrounds/CRTWarp', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <CRTWarp
      color="#7cff67"
      background-color="#111111"
      mask="aperture"
      :curvature="0.25"
      :persistence="0.4"
    />
  </div>
</template>

<script setup lang="ts">
import CRTWarp from './CRTWarp.vue'
</script>`
});
