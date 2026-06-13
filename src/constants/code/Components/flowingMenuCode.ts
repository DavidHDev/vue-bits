import code from '@/content/Components/FlowingMenu/FlowingMenu.vue?raw';
import { createCodeObject } from '@/types/code';

export const flowingMenu = createCodeObject(code, 'Components/FlowingMenu', {
  installation: `npm install gsap`,
  usage: `<template>
  <div style="height: 600px; position: relative;">
    <FlowingMenu :items="demoItems" />
  </div>
</template>

<script setup>
import FlowingMenu from './FlowingMenu.vue'

const demoItems = [
  { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
]
</script>`
});
