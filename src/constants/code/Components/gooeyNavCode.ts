import code from '@/content/Components/GooeyNav/GooeyNav.vue?raw';
import { createCodeObject } from '@/types/code';

export const gooeyNav = createCodeObject(code, 'Components/GooeyNav', {
  dependencies: '',
  usage: `<template>
  <GooeyNav
    :items="items"
    :initial-active-index="0"
    theme="dark"
    size="md"
    :frame="true"
    :particle-count="15"
    :spread="56"
    :animation-time="600"
    :time-variance="300"
    :gooeyness="0.5"
    :wobble="0.5"
    :hover-effect="true"
    @change="(index, item) => console.log(index, item.label)"
  />
</template>

<script setup lang="ts">
import GooeyNav from './GooeyNav.vue';

const items = [
  { label: 'Home', href: '#' },
  { label: 'Work', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' }
];
</script>`
});
