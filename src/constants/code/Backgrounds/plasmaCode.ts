import code from '@/content/Backgrounds/Plasma/Plasma.vue?raw';
import { createCodeObject } from '@/types/code';

export const plasma = createCodeObject(code, 'Backgrounds/Plasma', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Plasma
      color="#a3b8aa"
      :speed="1"
      direction="forward"
      :scale="1"
      :twist="1"
      :softness="0.5"
      :shine="1"
      :mouse-interactive="true"
    />
  </div>
</template>

<script setup lang="ts">
import Plasma from './Plasma.vue';
</script>`
});
