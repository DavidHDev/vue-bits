import code from '@/content/TextAnimations/VariableProximity/VariableProximity.vue?raw';
import { createCodeObject } from '@/types/code';

export const variableProximity = createCodeObject(code, 'TextAnimations/VariableProximity', {
  installation: `npm install motion-v`,
  usage: `<template>
  <div
    ref="containerRef"
    style="position: relative;"
  >
    <VariableProximity
      label="Hover me! And then star React Bits on GitHub, or else..."
      class="variable-proximity-demo"
      from-font-variation-settings="'wght' 400, 'opsz' 9"
      to-font-variation-settings="'wght' 1000, 'opsz' 40"
      :container-ref="containerRef"
      :radius="100"
      falloff="linear"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VariableProximity from './VariableProximity.vue'

const containerRef = ref(null)
</script>`
});
