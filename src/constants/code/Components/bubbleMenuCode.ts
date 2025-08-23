import code from '@content/Components/BubbleMenu/BubbleMenu.vue?raw';
import { createCodeObject } from '../../../types/code';

export const bubbleMenu = createCodeObject(code, 'Components/BubbleMenu', {
  installation: `npm install gsap`,
  usage: `<template>
  <BubbleMenu
    :logo="() => h('span', { style: { fontWeight: 700 } }, 'VB')"
    :items="items"
    menu-aria-label="Toggle navigation"
    menu-bg="#ffffff"
    menu-content-color="#111111"
    :use-fixed-position="false"
    animation-ease="back.out(1.5)"
    :animation-duration="0.5"
    :stagger-delay="0.12"
  />
</template>

<script setup>
import BubbleMenu from './BubbleMenu.vue'
import { h } from 'vue'

const items = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Projects',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
]
</script>`
});
