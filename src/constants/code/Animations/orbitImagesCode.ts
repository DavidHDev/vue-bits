import code from '@/content/Animations/OrbitImages/OrbitImages.vue?raw';
import { createCodeObject } from '@/types/code';

export const orbitImages = createCodeObject(code, 'Animations/OrbitImages', {
  usage: `<template>
  <OrbitImages
    :images="images"
    shape="ellipse"
    :radius-x="340"
    :radius-y="80"
    :rotation="-8"
    :duration="30"
    :item-size="80"
    :responsive="true"
  />
</template>

<script setup lang="ts">
import OrbitImages from './OrbitImages.vue';

const images = [
  'https://picsum.photos/300/300?grayscale&random=1',
  'https://picsum.photos/300/300?grayscale&random=2',
  'https://picsum.photos/300/300?grayscale&random=3',
  'https://picsum.photos/300/300?grayscale&random=4',
  'https://picsum.photos/300/300?grayscale&random=5',
  'https://picsum.photos/300/300?grayscale&random=6'
];
</script>`
});
