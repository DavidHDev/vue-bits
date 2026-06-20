import code from '@/content/Components/DomeGallery/DomeGallery.vue?raw';
import { createCodeObject } from '@/types/code';

export const domeGallery = createCodeObject(code, 'Components/DomeGallery', {
  usage: `<template>
  <div style="width: 100vw; height: 100vh;">
    <DomeGallery />
  </div>
</template>

<script setup>
import DomeGallery from './DomeGallery.vue'
</script>`
});
