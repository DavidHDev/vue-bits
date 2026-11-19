import code from '@/content/Components/Lanyard/Lanyard.vue?raw';
import { createCodeObject } from '@/types/code';

export const lanyard = createCodeObject(code, 'Components/Lanyard', {
  installation: `npm install three`,
  usage: `<template>
  <div style="width: 100%; height: 600px">
    <Lanyard front-image="/card-front.png" back-image="/card-back.png" strap-image="/band.png" />
  </div>
</template>

<script setup lang="ts">
import Lanyard from './Lanyard.vue'
</script>`
});
