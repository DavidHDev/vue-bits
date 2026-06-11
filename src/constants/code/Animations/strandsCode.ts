import code from '@content/Animations/Strands/Strands.vue?raw';
import { createCodeObject } from '@/types/code';

export const strands = createCodeObject(code, 'Animations/Strands', {
  installation: `npm install ogl`,
  usage: `<template>
  <div class="w-full h-[600px] relative">
    <Strands
      :colors="['#FF4242', '#7C3AED', '#06B6D4', '#EAB308']"
      :count="3"
      :speed="0.5"
      :amplitude="1"
      :waviness="1"
      :thickness="0.7"
      :glow="2.6"
      :taper="3"
      :spread="1"
      :intensity="0.6"
      :saturation="1.5"
      :opacity="1"
      :scale="1.5"
      :glass="false"
      :refraction="1"
      :dispersion="1"
      :glass-size="1"
    />
  </div>
</template>

<script setup lang="ts">
import Strands from "./Strands.vue";
</script>`
});
