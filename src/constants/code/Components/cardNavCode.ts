import code from '@content/Components/CardNav/CardNav.vue?raw';
import { createCodeObject } from '../../../types/code';

export const cardNav = createCodeObject(code, 'Components/CardNav', {
  installation: `npm install gsap`,
  usage: `<template>
  <CardNav
    :logo="logo"
    logoAlt="Company Logo"
    :items="items"
    baseColor="#fff"
    menuColor="#000"
    buttonBgColor="#111"
    buttonTextColor="#fff"
    ease="power3.out"
  />
</template>

<script setup lang='ts'>
import CardNav from './CardNav.vue'
import logo from './logo.svg'

const items = [
  {
    label: "About",
    bgColor: "#0D0716",
    textColor: "#fff",
    links: [
      { label: "Company", ariaLabel: "About Company" },
      { label: "Careers", ariaLabel: "About Careers" }
    ]
  },
  {
    label: "Projects",
    bgColor: "#170D27",
    textColor: "#fff",
    links: [
      { label: "Featured", ariaLabel: "Featured Projects" },
      { label: "Case Studies", ariaLabel: "Project Case Studies" }
    ]
  },
  {
    label: "Contact",
    bgColor: "#271E37",
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
