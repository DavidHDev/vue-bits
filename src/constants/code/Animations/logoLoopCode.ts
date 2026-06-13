import code from '@/content/Animations/LogoLoop/LogoLoop.vue?raw';
import { createCodeObject } from '@/types/code';

export const logoLoop = createCodeObject(code, 'Animations/LogoLoop', {
  usage: `<template>
  <div
    style="
      height: 200px;
      position: relative;
      overflow: hidden;
    "
  >
    <!-- Basic horizontal loop -->
    <LogoLoop
      :logos="techLogos"
      :speed="120"
      direction="left"
      :logo-height="48"
      :gap="40"
      :hover-speed="0"
      :scale-on-hover="true"
      :fade-out="true"
      fade-out-color="#ffffff"
      aria-label="Technology partners"
    />

    <!-- Vertical loop with deceleration on hover -->
    <LogoLoop
      :logos="techLogos"
      :speed="80"
      direction="up"
      :logo-height="48"
      :gap="40"
      :hover-speed="20"
      :fade-out="true"
    />
  </div>
</template>

<script setup lang="ts">
import LogoLoop from './LogoLoop.vue'

const techLogos = [
  {
    node: '<i class="pi pi-code" style="font-size: 2rem;"></i>',
    title: 'Development',
    href: 'https://vuejs.org',
  },
  {
    node: '<i class="pi pi-desktop" style="font-size: 2rem;"></i>',
    title: 'Frontend',
    href: 'https://vitejs.dev',
  },
  {
    node: '<i class="pi pi-server" style="font-size: 2rem;"></i>',
    title: 'Backend',
    href: 'https://nodejs.org',
  },
  {
    node: '<i class="pi pi-database" style="font-size: 2rem;"></i>',
    title: 'Database',
    href: 'https://www.postgresql.org',
  },
]

const imageLogos = [
  {
    src: '/logos/company1.png',
    alt: 'Company 1',
    href: 'https://company1.com',
  },
  {
    src: '/logos/company2.png',
    alt: 'Company 2',
    href: 'https://company2.com',
  },
  {
    src: '/logos/company3.png',
    alt: 'Company 3',
    href: 'https://company3.com',
  },
]
</script>`
});
