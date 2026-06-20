import code from '@/content/Animations/TargetCursor/TargetCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const targetCursor = createCodeObject(code, 'Animations/TargetCursor', {
  installation: `npm install gsap`,
  usage: `<template>
    <TargetCursor
        :spin-duration="2"
        :hide-default-cursor="true"
        :parallax-on="true"
    />

    <h1>Hover over the elements below</h1>
    <button class="cursor-target">Click me!</button>
    <div class="cursor-target">Hover target</div>
</template>

<script setup lang="ts">
  import TargetCursor from "./TargetCursor.vue";
</script>`
});
