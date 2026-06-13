import code from '@/content/Components/PillNav/PillNav.vue?raw';
import { createCodeObject } from '@/types/code';

export const pillNav = createCodeObject(code, 'Components/PillNav', {
  installation: `npm install gsap`,
  usage: `<template>
  <PillNav
    :logo="logo"
    logo-alt="Company Logo"
    :items="[
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/contact' }
    ]"
    active-href="/"
    class="custom-nav"
    ease="power2.easeOut"
    base-color="#000000"
    pill-color="#ffffff"
    hovered-pill-text-color="#ffffff"
    pill-text-color="#000000"
  />
</template>

<script setup>
import PillNav from './PillNav.vue'
import logo from '/path/to/logo.svg'
</script>`
});
