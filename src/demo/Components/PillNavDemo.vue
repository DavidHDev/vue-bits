<template>
  <h1 class="sub-category">Pill Nav</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="pillNav.usage"
    :source="pillNavSource"
    component-name="PillNav"
    :props-table="props"
  >
    <template #preview>
      <div
        class="relative overflow-hidden demo-container demo-container-dots"
        :style="{
          backgroundColor: currentTheme.backgroundColor,
          minHeight: '300px',
          height: 'auto'
        }"
      >
        <PillNav
          :key="key"
          :logo="currentTheme.logo"
          :baseColor="currentTheme.baseColor"
          :pillColor="currentTheme.pillColor"
          :hoveredPillTextColor="currentTheme.hoveredPillTextColor"
          :pillTextColor="currentTheme.pillTextColor"
          :initialLoadAnimation="initialLoadAnimation"
          :items="[{ label: 'Home' }, { label: 'About' }, { label: 'Contact' }]"
          activeHref="/"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Example" :options="themeOptions" v-model="theme" />
        <PreviewSwitch title="Initial Load Animation" v-model="initialLoadAnimation" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="pill-nav" :usage="pillNav.usage!" :source="pillNavSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import logoDark from '@/assets/logos/vue-bits-logo-small-dark.svg';
import logoLight from '@/assets/logos/vue-bits-logo-small.svg';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { pillNav } from '@/constants/code/Components/pillNavCode';
import PillNav from '@/content/Components/PillNav/PillNav.vue';
import pillNavSource from '@/content/Components/PillNav/PillNav.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type ThemeKey = 'light' | 'dark' | 'color';
const DEFAULT = {
  theme: 'light' as ThemeKey,
  initialLoadAnimation: true
};

interface ThemeConfig {
  logo: string;
  baseColor: string;
  pillColor: string;
  hoveredPillTextColor: string;
  pillTextColor: string;
  backgroundColor: string;
}

const theme = ref<ThemeKey>(DEFAULT.theme);
const initialLoadAnimation = ref(DEFAULT.initialLoadAnimation);

const themeOptions = [
  { value: 'light', label: 'Light Mode' },
  { value: 'dark', label: 'Dark Mode' },
  { value: 'color', label: 'Colorful' }
];

const themeConfigs: Record<ThemeKey, ThemeConfig> = {
  light: {
    logo: logoLight,
    baseColor: '#000',
    pillColor: '#f0f0f0',
    hoveredPillTextColor: '#fff',
    pillTextColor: '#000',
    backgroundColor: '#f0f0f0'
  },
  dark: {
    logo: logoDark,
    baseColor: '#fff',
    pillColor: '#0b0b0b',
    hoveredPillTextColor: '#000',
    pillTextColor: '#fff',
    backgroundColor: '#0b0b0b'
  },
  color: {
    logo: logoDark,
    baseColor: '#27FF64',
    pillColor: '#0b0b0b',
    hoveredPillTextColor: '#0b0b0b',
    pillTextColor: '#fff',
    backgroundColor: '#0b0b0b'
  }
};

const currentTheme = computed(() => themeConfigs[theme.value]);

const hasChanges = computed(
  () => theme.value !== DEFAULT.theme || initialLoadAnimation.value !== DEFAULT.initialLoadAnimation
);

function reset() {
  theme.value = DEFAULT.theme;
  initialLoadAnimation.value = DEFAULT.initialLoadAnimation;
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
    type: 'PillNavItem[]',
    default: '-',
    description: 'Array of navigation items with label, href, and optional ariaLabel'
  },
  {
    name: 'activeHref',
    type: 'string',
    default: 'undefined',
    description: 'The href of the currently active navigation item'
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
    default: 'power3.easeOut',
    description: 'GSAP easing function for animations'
  },
  {
    name: 'baseColor',
    type: 'string',
    default: '#fff',
    description: 'Base background color for the navigation'
  },
  {
    name: 'pillColor',
    type: 'string',
    default: '#060010',
    description: 'Background color for navigation pills'
  },
  {
    name: 'hoveredPillTextColor',
    type: 'string',
    default: '#060010',
    description: 'Text color when hovering over pills'
  },
  {
    name: 'pillTextColor',
    type: 'string',
    default: 'baseColor',
    description: 'Text color for navigation pills'
  },
  {
    name: 'onMobileMenuClick',
    type: '() => void',
    default: 'undefined',
    description: 'Callback function triggered when mobile menu button is clicked'
  },
  {
    name: 'initialLoadAnimation',
    type: 'boolean',
    default: 'false',
    description: 'Enable initial load animation for logo scale and nav items reveal'
  }
];
</script>
