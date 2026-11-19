import code from '@/content/Backgrounds/Waves/Waves.vue?raw';
import { createCodeObject } from '@/types/code';

export const waves = createCodeObject(code, 'Backgrounds/Waves', {
  dependencies: '',
  usage: `<template>
  <div style="position: relative; width: 100%; height: 600px">
    <Waves
      line-color="#ffffff"
      :spacing="10"
      :amplitude="32"
      :twist="1"
      :speed="1"
      :mouse-radius="175"
      :mouse-strength="1"
    />
  </div>
</template>

<script setup lang="ts">
import Waves from './Waves.vue'
</script>`
});
