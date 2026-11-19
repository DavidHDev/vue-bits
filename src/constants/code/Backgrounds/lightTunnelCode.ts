import code from '@/content/Backgrounds/LightTunnel/LightTunnel.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightTunnel = createCodeObject(code, 'Backgrounds/LightTunnel', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <LightTunnel
      cable-color="#ffffff"
      pulse-color="#ffffff"
      :cable-count="56"
      :pulse-density="0.5"
      flow-direction="inward"
      :mouse-interaction="true"
      :click-surge="true"
    />
  </div>
</template>

<script setup lang="ts">
import LightTunnel from './LightTunnel.vue';
</script>`
});
