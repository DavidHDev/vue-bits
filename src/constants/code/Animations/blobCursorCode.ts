import code from '@/content/Animations/BlobCursor/BlobCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const blobCursor = createCodeObject(code, 'Animations/BlobCursor', {
  installation: `npm install gsap`,
  usage: `<template>
  <BlobCursor
    blob-type="circle"
    fill-color="#27FF64"
    :trail-count="3"
    :sizes="[60, 125, 75]"
    :inner-sizes="[20, 35, 25]"
    inner-color="rgba(255,255,255,0.8)"
    :opacities="[0.6, 0.6, 0.6]"
    shadow-color="rgba(0,0,0,0.75)"
    :shadow-blur="5"
    :shadow-offset-x="10"
    :shadow-offset-y="10"
    :filter-std-deviation="30"
    :use-filter="true"
    :fast-duration="0.1"
    :slow-duration="0.5"
    :z-index="100"
  />
</template>

<script setup lang="ts">
import BlobCursor from './BlobCursor.vue'
</script>`
});
