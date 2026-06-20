import code from '@/content/Animations/ImageTrail/ImageTrail.vue?raw';
import { createCodeObject } from '@/types/code';

export const imageTrail = createCodeObject(code, 'Animations/ImageTrail', {
  installation: `npm install gsap`,
  usage: `<template>
  <div
    style="
      height: 500px;
      position: relative;
      overflow: hidden;
    "
  >
    <ImageTrail
      :items="[
        'https://picsum.photos/id/287/300/300',
        'https://picsum.photos/id/1001/300/300',
        'https://picsum.photos/id/1025/300/300',
        'https://picsum.photos/id/1026/300/300',
        'https://picsum.photos/id/1027/300/300',
        'https://picsum.photos/id/1028/300/300',
        'https://picsum.photos/id/1029/300/300',
        'https://picsum.photos/id/1030/300/300'
      ]"
      :variant="1"
    />
  </div>
</template>

<script setup lang="ts">
import ImageTrail from './ImageTrail.vue'
</script>`
});
