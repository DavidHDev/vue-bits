import code from '@content/Components/DomeGallery/DomeGallery.vue?raw';
import { createCodeObject } from '../../../types/code';

export const domeGallery = createCodeObject(code, 'Components/DomeGallery', {
  installation: `# No external dependencies required`,
  usage: `<template>
  <DomeGallery
    :images="[
      'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop'
    ]"
    :fit="0.8"
    fit-basis="auto"
    :min-radius="600"
    :segments="34"
    :drag-sensitivity="20"
    :enlarge-transition-ms="300"
    :grayscale="true"
    overlay-blur-color="#060010"
    image-border-radius="30px"
    opened-image-width="250px"
    opened-image-height="350px"
  />
</template>

<script setup lang="ts">
  import DomeGallery from "./DomeGallery.vue";
</script>`
});