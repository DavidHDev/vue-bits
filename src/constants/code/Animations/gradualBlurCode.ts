import code from '@/content/Animations/GradualBlur/GradualBlur.vue?raw';
import { createCodeObject } from '@/types/code';

export const gradualBlur = createCodeObject(code, 'Animations/GradualBlur', {
  installation: `npm install mathjs`,
  usage: `<template>
  <section style="position: relative; height: 500px; overflow: hidden;">
    <div style="height: 100%; overflow-y: auto; padding: 6rem 2rem;">
      <!-- Content Here - such as an image or text -->
    </div>

    <GradualBlur
      target="parent"
      position="bottom"
      height="6rem"
      :strength="2"
      :divCount="5"
      curve="bezier"
      :exponential="true"
      :opacity="1"
    />
  </section>
</template>

<script setup lang="ts">
  import GradualBlur from "./GradualBlur.vue";
</script>`
});
