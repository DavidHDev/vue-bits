import code from '@/content/Animations/Ribbons/Ribbons.vue?raw';
import { createCodeObject } from '@/types/code';

export const ribbons = createCodeObject(code, 'Animations/Ribbons', {
  installation: `npm install ogl`,
  usage: `<template>
  <div
    style="
      height: 500px;
      position: relative;
      overflow: hidden;
    "
  >
    <Ribbons
      :base-thickness="30"
      :colors="['#ffffff']"
      :speed-multiplier="0.5"
      :max-age="500"
      :enable-fade="false"
      :enable-shader-effect="true"
    />
  </div>
</template>

<script setup lang="ts">
import Ribbons from './Ribbons.vue'
</script>`
});
