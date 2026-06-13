import code from '@/content/Backgrounds/Orb/Orb.vue?raw';
import { createCodeObject } from '@/types/code';

export const orb = createCodeObject(code, 'Backgrounds/Orb', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      width: 100%;
      height: 600px;
      position: relative;
    "
  >
    <Orb
      :hover-intensity="0.5"
      :rotate-on-hover="true"
      :hue="0"
      :force-hover-state="false"
    />
  </div>
</template>

<script setup lang="ts">
import Orb from './Orb.vue'
</script>`
});
