import code from '@/content/Animations/PixelTrail/PixelTrail.vue?raw';
import type { CodeObject } from '../../../types/code';

export const pixelTrail: CodeObject = {
  cli: `npx jsrepo add https://vue-bits.dev/ui/Animations/PixelTrail`,
  usage: `<template>
    <PixelTrail
      :grid-size="50"
      :trail-size="0.1"
      :max-age="250"
      :interpolate="5"
      color="#27FF64"
      :gooey-filter="{ id: 'custom-goo-filter', strength: 2 }"
    />
</template>

<script setup lang="ts">
  import PixelTrail from "./PixelTrail.vue";
</script>`,
  code
};
