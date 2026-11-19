import code from '@/content/Animations/ElectricBorder/ElectricBorder.vue?raw';
import { createCodeObject } from '@/types/code';

export const electricBorder = createCodeObject(code, 'Animations/ElectricBorder', {
  dependencies: '',
  usage: `<template>
  <ElectricBorder
    color="#7df9ff"
    :speed="1"
    :chaos="0.5"
    :spread="0.6"
    :strands="3"
    :thickness="1.5"
    :border-radius="24"
  >
    <div style="width: 300px; height: 360px; border-radius: 24px">
      Your content
    </div>
  </ElectricBorder>
</template>

<script setup lang="ts">
import ElectricBorder from './ElectricBorder.vue'
</script>`
});
