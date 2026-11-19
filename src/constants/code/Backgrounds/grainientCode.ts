import code from '@/content/Backgrounds/Grainient/Grainient.vue?raw';
import { createCodeObject } from '@/types/code';

export const grainient = createCodeObject(code, 'Backgrounds/Grainient', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Grainient
      :colors="['#111111', '#2a0f0a', '#9a3412', '#f97316', '#fed7aa']"
      :angle="55"
      :flow="0.8"
      :silk="0.35"
      :grain-amount="0.08"
    />
  </div>
</template>

<script setup lang="ts">
import Grainient from './Grainient.vue';
</script>`
});
