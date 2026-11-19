import code from '@/content/Backgrounds/FaultyTerminal/FaultyTerminal.vue?raw';
import { createCodeObject } from '@/types/code';

export const faultyTerminal = createCodeObject(code, 'Backgrounds/FaultyTerminal', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <FaultyTerminal
      tint="#A7EF9E"
      glyphs="blocks"
      :scale="1.5"
      :digit-size="1.2"
      :time-scale="0.5"
      :brightness="0.75"
      :glow="0.5"
      :persistence="0.5"
      :mouse-strength="0.5"
      :mouse-glow="0.6"
      :curvature="0.1"
      :vignette="0.25"
      click-effect="glitch"
    />
  </div>
</template>

<script setup lang="ts">
import FaultyTerminal from './FaultyTerminal.vue';
</script>`
});
