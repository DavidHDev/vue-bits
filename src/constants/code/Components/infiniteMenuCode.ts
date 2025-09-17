import code from '@/content/Components/InfiniteMenu/InfiniteMenu.vue?raw';
import { createCodeObject } from '@/types/code';

export const infiniteMenu = createCodeObject(code, 'Components/InfiniteMenu', {
  usage: `<template>
  <InfiniteMenu :items="menuItems" />
</template>

<script setup lang="ts">
import InfiniteMenu from "./InfiniteMenu.vue";

const menuItems = [
  {
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=800&fit=crop',
    title: 'Sarah Chen',
    description: 'UI/UX Designer',
    link: 'https://dribbble.com/'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
    title: 'Mike Johnson',
    description: 'Frontend Developer',
    link: 'https://github.com/'
  },
  {
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b793?w=800&h=800&fit=crop',
    title: 'Emma Wilson',
    description: 'Product Designer',
    link: 'https://behance.net/'
  }
];
</script>`
});