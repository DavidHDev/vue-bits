import code from '@/content/Backgrounds/Radar/Radar.vue?raw';
import { createCodeObject } from '@/types/code';

export const radar = createCodeObject(code, 'Backgrounds/Radar', {
  installation: `npm install ogl`,
  usage: `<template>
  <Radar
    :speed="1.0"
    :scale="0.5"
    :ring-count="10"
    :spoke-count="10"
    :ring-thickness="0.05"
    :spoke-thickness="0.01"
    :sweep-speed="1.0"
    :sweep-width="2.0"
    :sweep-lobes="1"
    color="#9f29ff"
    background-color="#000000"
    :falloff="2.0"
    :brightness="1.0"
    :enable-mouse-interaction="true"
    :mouse-influence="0.1"
  />
</template>

<script setup lang="ts">
import Radar from './Radar.vue'
</script>`
});
