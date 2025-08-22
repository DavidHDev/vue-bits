import code from '@content/Backgrounds/Plasma/Plasma.vue?raw';
import { createCodeObject } from '../../../types/code';

export const plasma = createCodeObject(code, 'Backgrounds/Plasma', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <Plasma
      color="#ff6b35"
      :speed="0.6"
      direction="forward"
      :scale="1.1"
      :opacity="0.8"
      :mouseInteractive="true"
    />
  </div>
</template>

<script setup lang="ts">
  import Plasma from "./Plasma.vue";
</script>`
});
