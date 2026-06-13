import code from '@/content/Animations/FadeContent/FadeContent.vue?raw';
import { createCodeObject } from '@/types/code';

export const fadeContent = createCodeObject(code, 'Animations/FadeContent', {
  usage: `<template>
  <FadeContent
    :blur="true"
    :duration="1000"
    easing="ease-out"
    :initial-opacity="0"
  >
    <!-- Anything placed inside this container will fade into view -->
    <div>
      Anything placed inside this container will fade into view
    </div>
  </FadeContent>
</template>

<script setup lang="ts">
import FadeContent from './FadeContent.vue'
</script>`
});
