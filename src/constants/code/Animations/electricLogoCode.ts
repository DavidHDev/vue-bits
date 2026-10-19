import code from '@/content/Animations/ElectricLogo/ElectricLogo.vue?raw';
import { createCodeObject } from '@/types/code';

export const electricLogo = createCodeObject(code, 'Animations/ElectricLogo', {
  usage: `<script setup>
import ElectricLogo from './ElectricLogo.vue'
import logo from './logo.svg'
</script>

<template>
<div style="width: 100%; height: 500px; position: relative">
  <ElectricLogo
    :src="logo"
    color="#ecc7ff"
    glowColor="#ad6dff"
    :scale="0.7"
    :intensity="1"
    :glow="1"
    :thickness="1.5"
    :strands="4"
    :bend="0.6"
    :crackle="1.5"
    :arcs="1"
    :flicker="0.6"
    :fill="0"
    :speed="2.5"
    interactive
    :cursorIntensity="0.75"
    :cursorRadius="100"
    theme="dark"
  />
</div>
</template>`
});
