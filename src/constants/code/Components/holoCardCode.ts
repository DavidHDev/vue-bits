import code from '@/content/Components/HoloCard/HoloCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const holoCard = createCodeObject(code, 'Components/HoloCard', {
  dependencies: '',
  usage: `<template>
  <HoloCard :image="card" alt="Pikachu" preset="bursts" />
</template>

<script setup lang="ts">
import HoloCard from './HoloCard.vue';
import card from './pikachu.webp';
</script>`
});
