import code from '@/content/Components/Masonry/Masonry.vue?raw';
import { createCodeObject } from '@/types/code';

export const masonry = createCodeObject(code, 'Components/Masonry', {
  installation: `npm install gsap`,
  usage: `<template>
  <Masonry
    :items="items"
    ease="power3.out"
    :duration="0.6"
    :stagger="0.05"
    animate-from="bottom"
    :scale-on-hover="true"
    :hover-scale="0.95"
    :blur-to-focus="true"
    :color-shift-on-hover="false"
  />
</template>

<script setup>
import Masonry from './Masonry.vue'

const items = [
  {
    id: "1",
    img: "https://picsum.photos/id/1015/600/900?grayscale",
    url: "https://example.com/one",
    height: 400,
  },
  {
    id: "2",
    img: "https://picsum.photos/id/1011/600/750?grayscale",
    url: "https://example.com/two",
    height: 250,
  },
  {
    id: "3",
    img: "https://picsum.photos/id/1020/600/800?grayscale",
    url: "https://example.com/three",
    height: 600,
  }
]
</script>`
});
