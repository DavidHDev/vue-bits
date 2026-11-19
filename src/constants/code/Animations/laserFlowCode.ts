import code from '@/content/Animations/LaserFlow/LaserFlow.vue?raw';
import { createCodeObject } from '@/types/code';

export const laserFlow = createCodeObject(code, 'Animations/LaserFlow', {
  dependencies: '',
  usage: `<template>
  <div style="position: relative; height: 600px; overflow: hidden">
    <LaserFlow
      :surface-ref="cardRef"
      :beam-position="0.6"
      color="#7cff67"
      :intensity="1.8"
      :flare="1.5"
      :spread="1.5"
      :spill="1"
      :fog="0.2"
      :dust="1.6"
      reveal-image="/your-ui.png"
      :reveal-radius="220"
      :reveal-opacity="0.6"
    />

    <div
      ref="cardRef"
      style="
        position: absolute;
        left: 18%;
        right: 28%;
        top: 52%;
        bottom: -24px;
        border-radius: 14px;
        background: #0b0b0d;
      "
    >
      <!-- Your content here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import LaserFlow from './LaserFlow.vue'

const cardRef = useTemplateRef<HTMLElement>('cardRef')
</script>`
});
