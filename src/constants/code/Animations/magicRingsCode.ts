import code from '@/content/Animations/MagicRings/MagicRings.vue?raw';
import { createCodeObject } from '@/types/code';

export const magicRings = createCodeObject(code, 'Animations/MagicRings', {
  usage: `<template>
  <div style="width: 600px; height: 400px; position: relative;">
    <MagicRings
      color="#7cff67"
      colorTwo="#42fcff"
      :ringCount="6"
      :speed="1"
      :attenuation="10"
      :lineThickness="2"
      :baseRadius="0.35"
      :radiusStep="0.1"
      :scaleRate="0.1"
      :opacity="1"
      :blur="0"
      :noiseAmount="0.1"
      :rotation="0"
      :ringGap="1.5"
      :fadeIn="0.7"
      :fadeOut="0.5"
      :followMouse="false"
      :mouseInfluence="0.2"
      :hoverScale="1.2"
      :parallax="0.05"
      :clickBurst="false"
    />
  </div>
</template>

<script setup>
import MagicRings from './MagicRings.vue'
</script>`
});
