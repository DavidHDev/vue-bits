import code from '@/content/Animations/GradualBlur/GradualBlur.vue?raw';
import { createCodeObject } from '@/types/code';

export const gradualBlur = createCodeObject(code, 'Animations/GradualBlur', {
  dependencies: '',
  usage: `<!-- Component added by Ansh - github.com/ansh-dhanani -->

<template>
  <section style="position: relative; height: 500px; overflow: hidden">
    <div style="height: 100%; overflow-y: auto">
      <!-- Scrolling content -->
    </div>

    <GradualBlur
      position="bottom"
      height="6rem"
      :strength="2"
      :layers="8"
      curve="linear"
      :exponential="true"
      tint="rgba(17, 17, 17, 0.6)"
      :auto-hide="true"
    />
  </section>
</template>

<script setup lang="ts">
import GradualBlur from './GradualBlur.vue'
</script>`
});
