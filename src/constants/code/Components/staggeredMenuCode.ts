import code from '@/content/Components/StaggeredMenu/StaggeredMenu.vue?raw';
import { createCodeObject } from '@/types/code';

export const staggeredMenu = createCodeObject(code, 'Components/StaggeredMenu', {
  installation: `npm install gsap`,
  usage: `<template>
  <div style="height: 100vh; background: #1a1a1a">
    <StaggeredMenu
      position="right"
      :items="menuItems"
      :social-items="socialItems"
      :display-socials="true"
      :display-item-numbering="true"
      menu-button-color="#fff"
      open-menu-button-color="#fff"
      :change-menu-color-on-open="true"
      :colors="['#9EF2B2', '#27FF64']"
      logo-url="/path-to-your-logo.svg"
      accent-color="#27FF64"
      :on-menu-open="() => console.log('Menu opened')"
      :on-menu-close="() => console.log('Menu closed')"
    />
  </div>
</template>

<script setup lang="ts">
import StaggeredMenu from './StaggeredMenu.vue'

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];
</script>`
});
