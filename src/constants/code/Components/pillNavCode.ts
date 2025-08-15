import code from '@content/Components/PillNav/PillNav.vue?raw';
import { createCodeObject } from '../../../types/code';

export const pillNav = createCodeObject(code, 'Components/PillNav', {
  installation: `npm install gsap`,
  usage: `<template>
  <PillNav
    :logo="logo"
    logoAlt="Company Logo"
    :items="[
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/contact' }
    ]"
    activeHref="/"
    class="custom-nav"
    ease="power2.easeOut"
    baseColor="#000000"
    pillColor="#ffffff"
    hoveredPillTextColor="#ffffff"
    pillTextColor="#000000"
  />
</template>

<script setup lang="ts">
  import PillNav from "./PillNav.vue";
  import logo from '/path/to/logo.svg';
</script>`
});
