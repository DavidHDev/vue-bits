import code from '@/content/Animations/TargetCursor/TargetCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const targetCursor = createCodeObject(code, 'Animations/TargetCursor', {
  dependencies: '',
  usage: `<template>
  <div>
    <TargetCursor :spin-duration="2" hide-default-cursor parallax-on />

    <h1>Hover over the elements below</h1>
    <button class="cursor-target" data-cursor-label="Open">Click me!</button>
    <div class="cursor-target">Hover target</div>
  </div>
</template>

<script setup lang="ts">
import TargetCursor from './TargetCursor.vue'
</script>`
});
