import code from '@/content/Components/ReflectiveCard/ReflectiveCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const reflectiveCard = createCodeObject(code, 'Components/ReflectiveCard', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <ReflectiveCard
    name="Alexander Doe"
    role="Senior Developer"
    video-src="/videos/reflection.mp4"
    :webcam="false"
    tint="#ffffff"
    :metalness="1"
    :roughness="0.3"
    :blur-strength="6"
    :shine="1"
    :glare="0.5"
  />
</template>

<script setup lang="ts">
import ReflectiveCard from './ReflectiveCard.vue';
</script>`
});
