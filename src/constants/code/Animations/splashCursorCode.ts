import code from '@/content/Animations/SplashCursor/SplashCursor.vue?raw';
import { createCodeObject } from '@/types/code';

export const splashCursor = createCodeObject(code, 'Animations/SplashCursor', {
  dependencies: '',
  usage: `<template>
  <SplashCursor
    rainbow
    :size="1"
    :force="1"
    :swirl="3"
    :trail="1"
    click-splash
  />
</template>

<script setup lang="ts">
import SplashCursor from './SplashCursor.vue'
</script>`
});
