import code from '@/content/Backgrounds/ShapeWaves/ShapeWaves.vue?raw';
import { createCodeObject } from '@/types/code';

export const shapeWaves = createCodeObject(code, 'Backgrounds/ShapeWaves', {
  installation: `npm install vgpu`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <ShapeWaves
      text="</>"
      font-family='Geist, "Geist Sans", system-ui, sans-serif'
      :font-weight="500"
      :text-size="0.6"
      shapes="mixed"
      :cell-size="10"
      :dot-size="0.75"
      color="#929292"
      hover-color="#ffffff"
      background-color="#000000"
      :speed="1"
      :scale="1"
      :contrast="1"
      :brightness="0.4"
      :flow="0"
      :direction="0"
      :fade="0.25"
      :interactive="true"
      :splash-radius="40"
      :splash-strength="0.4"
      :glow="0.35"
      :intro="true"
      :intro-duration="1.6"
      :paused="false"
    />
  </div>
</template>

<script setup lang="ts">
import ShapeWaves from './ShapeWaves.vue'
</script>`
});
