import code from '@/content/Animations/StarBorder/StarBorder.vue?raw';
import { createCodeObject } from '@/types/code';

export const starBorder = createCodeObject(code, 'Animations/StarBorder', {
  usage: `<template>
  <StarBorder
    as="button"
    class-name="custom-class"
    color="cyan"
    speed="5s"
  >
    <!-- content -->
  </StarBorder>
</template>

<script setup lang="ts">
import StarBorder from './StarBorder.vue'
</script>`
});
