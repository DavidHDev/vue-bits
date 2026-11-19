import code from '@/content/Animations/LogoLoop/LogoLoop.vue?raw';
import { createCodeObject } from '@/types/code';

export const logoLoop = createCodeObject(code, 'Animations/LogoLoop', {
  dependencies: '',
  usage: `<template>
  <div style="height: 200px; position: relative; overflow: hidden">
    <LogoLoop
      :logos="techLogos"
      :speed="100"
      direction="left"
      :logo-height="48"
      :gap="56"
      :hover-speed="0"
      scale-on-hover
      aria-label="Technology partners"
    />

    <LogoLoop
      :logos="techLogos"
      layout="orbit"
      :bend="0.6"
      :magnify="0.6"
      labels="hover"
      :muted="0.5"
    />

    <LogoLoop :logos="imageLogos" direction="up" :focus="0.5" step />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { SiVuedotjs, SiNuxtdotjs, SiTypescript, SiTailwindcss } from 'vue-icons-plus/si';
import LogoLoop from './LogoLoop.vue';

const techLogos = [
  { node: h(SiVuedotjs, { size: '1em' }), title: 'Vue', href: 'https://vuejs.org', hoverColor: '#42b883' },
  { node: h(SiNuxtdotjs, { size: '1em' }), title: 'Nuxt', href: 'https://nuxt.com' },
  { node: h(SiTypescript, { size: '1em' }), title: 'TypeScript', href: 'https://www.typescriptlang.org', hoverColor: '#3178c6' },
  { node: h(SiTailwindcss, { size: '1em' }), title: 'Tailwind CSS', href: 'https://tailwindcss.com', hoverColor: '#38bdf8' }
];

const imageLogos = [
  { src: '/logos/company1.png', alt: 'Company 1', href: 'https://company1.com' },
  { src: '/logos/company2.png', alt: 'Company 2', href: 'https://company2.com' },
  { src: '/logos/company3.png', alt: 'Company 3', href: 'https://company3.com' }
];
</script>`
});
