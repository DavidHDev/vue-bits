import code from '@/content/Backgrounds/Ballpit/Ballpit.vue?raw';
import { createCodeObject } from '@/types/code';

export const ballpit = createCodeObject(code, 'Backgrounds/Ballpit', {
  installation: `npm install three @types/three gsap`,
  usage: `//Component inspired by Kevin Levron:
//https://x.com/soju22/status/1858925191671271801

<template>
  <div
    style="
      position: relative;
      overflow: hidden;
      min-height: 500px;
      max-height: 500px;
      width: 100%;
    "
  >
    <Ballpit
      :count="200"
      :gravity="0.7"
      :friction="0.8"
      :wall-bounce="0.95"
      :follow-cursor="true"
    />
  </div>
</template>

<script setup lang="ts">
import Ballpit from './Ballpit.vue'
</script>`
});
