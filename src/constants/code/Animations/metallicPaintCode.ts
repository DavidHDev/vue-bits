import code from '@content/Animations/MetallicPaint/MetallicPaint.vue?raw';
import { createCodeObject } from '@/types/code';

export const metallicPaint = createCodeObject(code, 'Animations/MetallicPaint', {
  usage: `<script setup>
// Effect inspired by Paper's Liquid Metal effect

import MetallicPaint from "./MetallicPaint.vue";

// Replace with your own SVG path
// NOTE: Your SVG should have padding around the shape to prevent cutoff
// It should have a black fill color to allow the metallic effect to show through
import logo from "./logo.svg";
</script>

<template>
  <div style="width: 100%; height: 400px;">
    <MetallicPaint
      :image-src="logo"
      
      :seed="42"
      :scale="4"
      :pattern-sharpness="1"
      :noise-scale="0.5"
      
      :speed="0.3"
      :liquid="0.75"
      :mouse-animation="false"
      
      :brightness="2"
      :contrast="0.5"
      :refraction="0.01"
      :blur="0.015"
      :chromatic-spread="2"
      :fresnel="1"
      :angle="0"
      :wave-amplitude="1"
      :distortion="1"
      :contour="0.2"

      light-color="#ffffff"
      dark-color="#000000"
      tint-color="#27FF64"
    />
  </div>
</template>`
});
