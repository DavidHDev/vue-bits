import code from '@/content/Animations/SplashCursor/SplashCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const splashCursor = createCodeObject(code, 'Animations/SplashCursor', {
  usage: `<template>
  <SplashCursor />
</template>

<script setup lang="ts">
  import SplashCursor from "./SplashCursor.vue";
</script>`
});
