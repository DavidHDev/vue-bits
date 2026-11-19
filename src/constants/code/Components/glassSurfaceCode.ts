import code from '@/content/Components/GlassSurface/GlassSurface.vue?raw';
import { createCodeObject } from '@/types/code';

export const glassSurface = createCodeObject(code, 'Components/GlassSurface', {
  dependencies: '',
  usage: `<template>
  <GlassSurface
    :width="320"
    :height="76"
    :border-radius="38"
    :distortion-scale="-180"
    :displace="0.5"
    :background-opacity="0.1"
  >
    <span>Your content</span>
  </GlassSurface>

  <GlassSurface shape="/logo.svg" :width="280" :height="280" />

  <img ref="photo" src="/photo.jpg" alt="" />
  <GlassSurface :backdrop="photo" :width="320" :height="76" :border-radius="38" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GlassSurface from './GlassSurface.vue';

const photo = ref<HTMLImageElement | null>(null);
</script>`
});
