import code from '@content/Backgrounds/LiquidEther/LiquidEther.vue?raw';
import { createCodeObject } from '../../../types/code';

export const liquidEther = createCodeObject(code, 'Backgrounds/LiquidEther', {
  installation: `npm install three`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative">
    <LiquidEther
      :colors="['#48FF28', '#A2FFC6', '#9EF19E']"
      :mouseForce="20"
      :cursorSize="100"
      :isViscous="false"
      :viscous="30"
      :iterationsViscous="32"
      :iterationsPoisson="32"
      :resolution="0.5"
      :isBounce="false"
      :autoDemo="true"
      :autoSpeed="0.5"
      :autoIntensity="2.2"
      :takeoverDuration="0.25"
      :autoResumeDelay="3000"
      :autoRampDuration="0.6"
    />
  </div>
</template>

<script setup lang="ts">
import LiquidEther from './LiquidEther.vue'
</script>`
});
