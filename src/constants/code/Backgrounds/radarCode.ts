import code from '@/content/Backgrounds/Radar/Radar.vue?raw';
import { createCodeObject } from '@/types/code';

export const radar = createCodeObject(code, 'Backgrounds/Radar', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Radar
      color="#3ef09a"
      mode="sweep"
      :speed="1"
      :trail="0.35"
      :scale="0.9"
      :ring-count="6"
      :spoke-count="12"
      :targets="6"
      :clutter="0.35"
      :mouse-interaction="true"
    />
  </div>
</template>

<script setup lang="ts">
import Radar from './Radar.vue';
</script>`
});
