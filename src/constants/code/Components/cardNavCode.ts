import code from '@/content/Components/CardNav/CardNav.vue?raw';
import { createCodeObject } from '@/types/code';

export const cardNav = createCodeObject(code, 'Components/CardNav', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <CardNav
    :logo="logo"
    logo-alt="Company"
    :items="items"
    :cta="{ label: 'Get started', href: '/signup' }"
    card-effect="rise"
    open-on="click"
  />
</template>

<script setup lang="ts">
import CardNav, { type CardNavItem } from './CardNav.vue';
import logo from './logo.svg';

const items: CardNavItem[] = [
  {
    label: 'About',
    description: 'The people and the story behind the studio.',
    links: [
      { label: 'Company', href: '/company' },
      { label: 'Careers', href: '/careers' }
    ]
  },
  {
    label: 'Projects',
    description: 'Selected work from the last few years.',
    links: [
      { label: 'Featured', href: '/featured' },
      { label: 'Case studies', href: '/case-studies' }
    ]
  },
  {
    label: 'Contact',
    description: 'Say hello, we read everything.',
    links: [
      { label: 'Email', href: 'mailto:hello@example.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com' }
    ]
  }
];
</script>`
});
