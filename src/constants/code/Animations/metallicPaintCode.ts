import code from '@/content/Animations/MetallicPaint/MetallicPaint.vue?raw';
import { createCodeObject } from '@/types/code';

export const metallicPaint = createCodeObject(code, 'Animations/MetallicPaint', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 500px">
    <MetallicPaint :image-src="logo" />
  </div>

  <div style="width: 100%; height: 300px">
    <MetallicPaint text="Liquid" color="#f2c46b" :edge-bend="0.9" />
  </div>
</template>

<script setup lang="ts">
import MetallicPaint from './MetallicPaint.vue'
import logo from './logo.svg'
</script>`
});
