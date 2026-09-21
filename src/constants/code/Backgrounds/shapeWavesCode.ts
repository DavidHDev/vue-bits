import code from '@/content/Backgrounds/ShapeWaves/ShapeWaves.vue?raw';
import { createCodeObject } from '@/types/code';

export const shapeWaves = createCodeObject(code, 'Backgrounds/ShapeWaves', {
  usage: `<script setup>
import ShapeWaves from './ShapeWaves.vue'
</script>

<template>
<div :style="{ width: '100%', height: '600px', position: 'relative' }">
  <ShapeWaves
    text="React Bits"
    fontFamily='Geist, "Geist Sans", system-ui, sans-serif'
    :fontWeight="500"
    :textSize="0.6"
    shapes="mixed"
    :cellSize="10"
    :dotSize="0.75"
    color="#929292"
    hoverColor="#ffffff"
    backgroundColor="#000000"
    :speed="1"
    :scale="1"
    :contrast="1"
    :brightness="0.4"
    :flow="0"
    :direction="0"
    :fade="0.25"
    interactive
    :splashRadius="40"
    :splashStrength="0.4"
    :glow="0.35"
    intro
    :introDuration="1.6"
    :paused="false"
  />
</div>
</template>`
});
