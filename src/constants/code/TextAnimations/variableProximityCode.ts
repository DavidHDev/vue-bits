import code from '@content/TextAnimations/VariableProximity/VariableProximity.vue?raw';
import { createCodeObject } from '@/types/code';

export const variableProximity = createCodeObject(code, 'TextAnimations/VariableProximity', {
  installation: `npm install motion-v`,
  usage: `<template>
  <div ref="containerRef" class="relative min-h-[400px] p-4">
    <VariableProximity
      label="Hover me! Variable font magic!"
      from-font-variation-settings="'wght' 400, 'opsz' 9"
      to-font-variation-settings="'wght' 1000, 'opsz' 40"
      :container-ref="containerRef"
      :radius="100"
      falloff="linear"
      class-name="text-4xl font-bold text-center"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import VariableProximity, { type FalloffType } from './VariableProximity.vue';

  const containerRef = ref<HTMLElement | null>(null);
</script>`
});
