import code from '@/content/Backgrounds/Hyperspeed/Hyperspeed.vue?raw';
import { createCodeObject } from '@/types/code';

export const hyperspeed = createCodeObject(code, 'Backgrounds/Hyperspeed', {
  installation: `npm install three`,
  usage: `<template>
  <div style="position: relative; width: 100%; height: 600px">
    <Hyperspeed
      curve="winding"
      :curvature="1"
      :speed="1"
      :boost="3"
      :fov="90"
      :boost-fov="130"
      :lanes="3"
      :road-width="10"
      :median-width="2"
      :density="40"
      :trail-length="1"
      :light-size="1"
      :poles="20"
      :dust="100"
      :glow="0.6"
      :reflections="0.5"
      :road-opacity="0.1"
      :steer="0.35"
      :tail-colors="['#7cff67', '#2f8f5b', '#42b883']"
      :head-colors="['#03b3c3', '#0e5ea5', '#324555']"
      :pole-colors="['#03b3c3']"
      :interactive="true"
    />
  </div>
</template>

<script setup lang="ts">
import Hyperspeed from './Hyperspeed.vue';
</script>`
});
