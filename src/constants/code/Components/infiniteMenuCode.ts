import code from '@/content/Components/InfiniteMenu/InfiniteMenu.vue?raw';
import { createCodeObject } from '@/types/code';

export const infiniteMenu = createCodeObject(code, 'Components/InfiniteMenu', {
  dependencies: '',
  usage: `<template>
  <div style="height: 600px; position: relative">
    <InfiniteMenu
      :items="items"
      :count="160"
      :tile-size="0.63"
      :roundness="0.2"
      :zoom="1.65"
      :pull-back="1"
      :stretch="0.6"
      :inertia="0.6"
      :autoplay="3"
      :grayscale="true"
      :dim="0.5"
      :intro="true"
      :show-info="true"
      theme="dark"
    />
  </div>
</template>

<script setup lang="ts">
import InfiniteMenu from './InfiniteMenu.vue'

const items = [
  {
    image: '/assets/demo/day-portrait.webp',
    link: 'https://vue-bits.dev',
    title: 'The Pier',
    description: 'Concrete and open water under a bright morning sky.'
  },
  {
    image: '/assets/demo/night-landscape.webp',
    link: 'https://vue-bits.dev',
    title: 'Moonlit Field',
    description: 'A single pole in a field of rapeseed under the full moon.'
  },
  {
    image: '/assets/demo/day-landscape.webp',
    link: 'https://vue-bits.dev',
    title: 'Rapeseed',
    description: 'The same field at noon, yellow all the way to the horizon.'
  }
]
</script>`
});
