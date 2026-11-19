import code from '@/content/TextAnimations/VariableProximity/VariableProximity.vue?raw';
import { createCodeObject } from '@/types/code';

export const variableProximity = createCodeObject(code, 'TextAnimations/VariableProximity', {
  dependencies: '',
  usage: `<template>
  <div ref="containerRef" style="position: relative">
    <VariableProximity
      label="Hover me! And then star Vue Bits on GitHub, or else..."
      class-name="variable-proximity-demo"
      from-font-variation-settings="'wght' 400, 'opsz' 9"
      to-font-variation-settings="'wght' 1000, 'opsz' 40"
      :container-ref="containerRef"
      :radius="100"
      falloff="linear"
      :smoothing="0.2"
      :scale="1"
      :lift="0"
      :idle-wave="false"
      :font-size="64"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VariableProximity from './VariableProximity.vue'

const containerRef = ref<HTMLElement | null>(null)
</script>`
});
