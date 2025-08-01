import code from '@content/Backgrounds/FaultyTerminal/FaultyTerminal.vue?raw';
import { createCodeObject } from '../../../types/code';

export const faultyTerminal = createCodeObject(code, 'Backgrounds/FaultyTerminal', {
  installation: `npm install ogl`,
  usage: `<template>
  <div class="relative w-full h-[600px]">
    <FaultyTerminal
        :scale="1.5"
        :grid-mul="[2, 1]"
        :digit-size="1.2"
        :time-scale="1"
        :pause="false"
        :scanline-intensity="1"
        :glitch-amount="1"
        :flicker-amount="1"
        :noise-amp="1"
        :chromatic-aberration="0"
        :dither="0"
        :curvature="0"
        tint="#ffffff"
        :mouse-react="true"
        :mouse-strength="0.5"
        :page-load-animation="false"
        :brightness="1"
    />
  </div>
</template>

<script setup lang="ts">
  import FaultyTerminal from "./FaultyTerminal.vue";
</script>`
});
