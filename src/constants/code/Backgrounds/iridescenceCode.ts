import code from '@/content/Backgrounds/Iridescence/Iridescence.vue?raw';
import { createCodeObject } from '@/types/code';

export const iridescence = createCodeObject(code, 'Backgrounds/Iridescence', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Iridescence
      color="#8099cc"
      :hue-shift="0"
      :saturation="1"
      :brightness="1.5"
      :contrast="1"
      :speed="1"
      :scale="1"
      :detail="8"
      :warp="1"
      :rotation="0"
      :mouse-react="true"
      :amplitude="0.1"
      :stir="0.5"
      :sheen="0.3"
      :click-swirl="true"
      :grain="0"
      :fade="0"
    />
  </div>
</template>

<script setup lang="ts">
import Iridescence from './Iridescence.vue';
</script>`
});
