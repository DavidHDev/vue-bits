import code from '@/content/Components/PillNav/PillNav.vue?raw';
import { createCodeObject } from '@/types/code';

export const pillNav = createCodeObject(code, 'Components/PillNav', {
  dependencies: '',
  usage: `<template>
  <PillNav
    :logo="logo"
    logo-alt="Company"
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Journal', href: '/journal' },
      { label: 'Photos', href: '/photos' },
      { label: 'About', href: '/about' }
    ]"
    active-href="/"
    item-style="pill"
    hover-effect="fill"
    indicator="dot"
  />
</template>

<script setup lang="ts">
import PillNav from './PillNav.vue'
import logo from './logo.svg'
</script>`
});
