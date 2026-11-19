import code from '@/content/Backgrounds/Ferrofluid/Ferrofluid.vue?raw';
import { createCodeObject } from '@/types/code';

export const ferrofluid = createCodeObject(code, 'Backgrounds/Ferrofluid', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Ferrofluid
      :colors="['#ffffff', '#ffffff', '#ffffff']"
      :spike-height="1"
      :sharpness="2.5"
      :tilt="48"
      :mouse-interaction="true"
      :click-pulse="true"
    />
  </div>
</template>

<script setup lang="ts">
import Ferrofluid from './Ferrofluid.vue'
</script>`
});
