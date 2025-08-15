<template>
  <TabbedLayout>
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

      <Customize>
        <PreviewSelect title="Example" :options="themeOptions" v-model="theme" />
        <PreviewSwitch title="Initial Load Animation" v-model="initialLoadAnimation" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="pillNav" />
    </template>

    <template #cli>
      <CliInstallation :command="pillNav.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { useForceRerender } from '@/composables/useForceRerender';
import { pillNav } from '@/constants/code/Components/pillNavCode';
import { computed, ref, watch } from 'vue';
import logoDark from '../../assets/logos/vue-bits-logo-small-dark.svg';
import logoLight from '../../assets/logos/vue-bits-logo-small.svg';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PillNav from '../../content/Components/PillNav/PillNav.vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type ThemeKey = 'light' | 'dark' | 'color';

interface ThemeConfig {
  logo: string;
  baseColor: string;
  pillColor: string;
  hoveredPillTextColor: string;
  pillTextColor: string;
  backgroundColor: string;
}

const theme = ref<ThemeKey>('light');
const initialLoadAnimation = ref(false);

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

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'color', label: 'Color' }
];

const currentTheme = computed(() => themeConfigs[theme.value]);

watch(
  [currentTheme, initialLoadAnimation],
  () => {
    forceRerender();
  },
  { immediate: true }
);

const propData = [
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
