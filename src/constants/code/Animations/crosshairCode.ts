import code from '@/content/Animations/Crosshair/Crosshair.vue?raw';
import { createCodeObject } from '@/types/code';

export const crosshair = createCodeObject(code, 'Animations/Crosshair', {
  dependencies: '',
  usage: `<template>
  <div ref="containerRef" style="position: relative; height: 400px">
    <Crosshair
      :container-ref="containerRef"
      color="#ffffff"
      target-effect="lock"
      :thickness="1"
      :opacity="0.85"
      :smoothing="0.35"
      :show-coordinates="true"
    />
    <a href="/docs">Read the docs</a>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Crosshair from './Crosshair.vue'

const containerRef = useTemplateRef<HTMLElement>('containerRef')
</script>`
});
