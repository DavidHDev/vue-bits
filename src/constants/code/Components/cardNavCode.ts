import code from '@/content/Components/CardNav/CardNav.vue?raw';
import { createCodeObject } from '@/types/code';

export const cardNav = createCodeObject(code, 'Components/CardNav', {
  installation: `npm install gsap`,
  usage: `<template>
  <CardNav
    :logo="logo"
    logo-alt="Company Logo"
    :items="items"
    base-color="#fff"
    menu-color="#000"
    button-bg-color="#111"
    button-text-color="#fff"
    ease="power3.out"
  />
</template>

<script setup>
import CardNav from './CardNav.vue'
import logo from './logo.svg'

const items = [
  {
    label: "About",
    bgColor: "#1B1722",
    textColor: "#fff",
    links: [
      { label: "Company", ariaLabel: "About Company" },
      { label: "Careers", ariaLabel: "About Careers" }
    ]
  },
  {
    label: "Projects", 
    bgColor: "#2F293A",
    textColor: "#fff",
    links: [
      { label: "Featured", ariaLabel: "Featured Projects" },
      { label: "Case Studies", ariaLabel: "Project Case Studies" }
    ]
  },
  {
    label: "Contact",
    bgColor: "#2F293A", 
    textColor: "#fff",
    links: [
      { label: "Email", ariaLabel: "Email us" },
      { label: "Twitter", ariaLabel: "Twitter" },
      { label: "LinkedIn", ariaLabel: "LinkedIn" }
    ]
  }
]
</script>`
});
