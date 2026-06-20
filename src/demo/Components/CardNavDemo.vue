<template>
  <h1 class="sub-category">Card Nav</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="cardNav.usage"
    :source="cardNavSource"
    component-name="CardNav"
    :props-table="props"
  >
    <template #preview>
      <div
        class="overflow-hidden demo-container demo-container-dots"
        :style="{
          backgroundColor: currentTheme.backgroundColor,
          minHeight: '550px',
          height: 'auto'
        }"
      >
        <CardNav
          :key="key"
          :logo="currentTheme.logo"
          :items="currentTheme.items"
          :baseColor="currentTheme.baseColor"
          :menuColor="currentTheme.menuColor"
          :buttonBgColor="currentTheme.buttonBgColor"
          :buttonTextColor="currentTheme.buttonTextColor"
          :ease="ease"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Example" :options="themeOptions" v-model="theme" />
        <PreviewSelect title="Animation Ease" :options="easeOptions" v-model="ease" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="card-nav" :usage="cardNav.usage!" :source="cardNavSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import logoLight from '@/assets/logos/vuebits-gh-black.svg';
import logoDark from '@/assets/logos/vuebits-gh-white.svg';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { cardNav } from '@/constants/code/Components/cardNavCode';
import CardNav, { type CardNavItem } from '@/content/Components/CardNav/CardNav.vue';
import cardNavSource from '@/content/Components/CardNav/CardNav.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type ThemeKey = 'light' | 'dark' | 'color';
type EaseKey = 'power3.out' | 'back.out(1.7)' | 'elastic.out(1, 0.8)' | 'circ.out';
const DEFAULTS = {
  theme: 'light' as ThemeKey,
  ease: 'power3.out' as EaseKey
};

interface ThemeConfig {
  logo: string;
  baseColor: string;
  menuColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  items: CardNavItem[];
}

const theme = ref<ThemeKey>('light');
const ease = ref<EaseKey>('power3.out');

const items: CardNavItem[] = [
  {
    label: 'About',
    bgColor: '#070F07',
    textColor: '#fff',
    links: [
      { label: 'Company', ariaLabel: 'About Company' },
      { label: 'Careers', ariaLabel: 'About Careers' }
    ]
  },
  {
    label: 'Projects',
    bgColor: '#0D2710',
    textColor: '#fff',
    links: [
      { label: 'Featured', ariaLabel: 'Featured Projects' },
      { label: 'Case Studies', ariaLabel: 'Project Case Studies' }
    ]
  },
  {
    label: 'Contact',
    bgColor: '#1E3721',
    textColor: '#fff',
    links: [
      { label: 'Email', ariaLabel: 'Email us' },
      { label: 'Twitter', ariaLabel: 'Twitter' },
      { label: 'LinkedIn', ariaLabel: 'LinkedIn' }
    ]
  }
];

const themeConfigs: Record<ThemeKey, ThemeConfig> = {
  light: {
    logo: logoLight,
    baseColor: '#fff',
    menuColor: '#000',
    buttonBgColor: '#111',
    buttonTextColor: '#fff',
    backgroundColor: '#f5f5f5',
    items
  },
  dark: {
    logo: logoDark,
    baseColor: '#0b0b0b',
    menuColor: '#fff',
    buttonBgColor: '#27FF64',
    buttonTextColor: '#fff',
    backgroundColor: '#0b0b0b',
    items
  },
  color: {
    logo: logoLight,
    baseColor: '#27FF64',
    menuColor: '#000',
    buttonBgColor: '#111',
    buttonTextColor: '#27FF64',
    backgroundColor: '#0b0b0b',
    items
  }
};

const themeOptions = [
  { value: 'light', label: 'Light Mode' },
  { value: 'dark', label: 'Dark Mode' },
  { value: 'color', label: 'Colorful' }
];

const easeOptions = [
  { value: 'power3.out', label: 'power3.out' },
  { value: 'back.out(1.7)', label: 'back.out(1.7)' },
  { value: 'elastic.out(1, 0.8)', label: 'elastic.out(1, 0.8)' },
  { value: 'circ.out', label: 'circ.out' }
];

const currentTheme = computed(() => themeConfigs[theme.value]);

const hasChanges = computed(() => theme.value !== DEFAULTS.theme || ease.value !== DEFAULTS.ease);

function reset() {
  theme.value = DEFAULTS.theme;
  ease.value = DEFAULTS.ease;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'logo',
    type: 'string',
    default: '-',
    description: 'URL for the logo image'
  },
  {
    name: 'logoAlt',
    type: 'string',
    default: 'Logo',
    description: 'Alt text for the logo image'
  },
  {
    name: 'items',
    type: 'CardNavItem[]',
    default: '-',
    description: 'Array of navigation items with label, bgColor, textColor, and links'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS classes for the navigation container'
  },
  {
    name: 'ease',
    type: 'string',
    default: 'power3.out',
    description: 'GSAP easing function for animations'
  },
  {
    name: 'baseColor',
    type: 'string',
    default: '#fff',
    description: 'Background color for the navigation container'
  },
  {
    name: 'menuColor',
    type: 'string',
    default: 'undefined',
    description: 'Color for the hamburger menu lines'
  },
  {
    name: 'buttonBgColor',
    type: 'string',
    default: '#111',
    description: 'Background color for the CTA button'
  },
  {
    name: 'buttonTextColor',
    type: 'string',
    default: 'white',
    description: 'Text color for the CTA button'
  }
];
</script>
