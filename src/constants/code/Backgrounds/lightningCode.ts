import code from '@/content/Backgrounds/Lightning/Lightning.vue?raw';
import { createCodeObject } from '@/types/code';

export const lightning = createCodeObject(code, 'Backgrounds/Lightning', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <Lightning
      color="#4d6bff"
      :bolts="1"
      :spread="0.6"
      :branches="0.5"
      :x-offset="0"
      :angle="0"
      :size="1"
      :thickness="1"
      :glow="1"
      :intensity="1"
      :speed="1"
      :flicker="0.6"
      :mouse-interaction="true"
      :mouse-strength="1"
      :click-strike="true"
      :intro="true"
      :fade="0"
      :opacity="1"
      :light-mode="false"
    />
  </div>
</template>

<script setup lang="ts">
import Lightning from './Lightning.vue';
</script>`
});
