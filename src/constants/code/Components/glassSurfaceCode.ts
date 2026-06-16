import code from '@/content/Components/GlassSurface/GlassSurface.vue?raw';
import { createCodeObject } from '@/types/code';

export const glassSurface = createCodeObject(code, 'Components/GlassSurface', {
  usage: `<template>
  <GlassSurface 
    :width="300" 
    :height="200"
    :border-radius="24"
    class="my-custom-class"
  >
    <h2>Glass Surface Content</h2>
  </GlassSurface>

  <GlassSurface
    :displace="15"
    :distortion-scale="-150"
    :red-offset="5"
    :green-offset="15"
    :blue-offset="25"
    :brightness="60"
    :opacity="0.8"
    mix-blend-mode="screen"
  >
    <span>Advanced Glass Distortion</span>
  </GlassSurface>
</template>

<script setup>
import GlassSurface from './GlassSurface.vue'
</script>`
});
