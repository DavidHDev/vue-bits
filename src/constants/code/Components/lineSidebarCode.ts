import code from '@/content/Components/LineSidebar/LineSidebar.vue?raw';
import { createCodeObject } from '@/types/code';

export const lineSidebar = createCodeObject(code, 'Components/LineSidebar', {
  usage: `<template>
  <LineSidebar v-bind="props" />
</template>

<script setup lang="ts">
import LineSidebar from './LineSidebar.vue';

const props = {
  items: [
    'Overview',
    'Components',
    'Animations',
    'Backgrounds',
    'Showcase',
  ],
  accentColor: '#27FF64',
  textColor: '#c4c4c4',
  markerColor: '#6c6c6c',
  showIndex: true,
  showMarker: true,
  proximityRadius: 100,
  maxShift: 30,
  falloff: 'smooth' as const,
  markerLength: 60,
  markerGap: 0,
  tickScale: 0.5,
  scaleTick: true,
  itemGap: 20,
  fontSize: 1.1,
  smoothing: 100,
  defaultActive: 0,
  onItemClick: (index: number, label: string) => {
    console.log(index, label);
  },
};
</script>`
});
