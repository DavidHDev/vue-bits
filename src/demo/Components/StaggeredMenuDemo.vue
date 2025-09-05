<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[800px] overflow-hidden demo-container demo-container-dots">
        <StaggeredMenu
          :key="key"
          :logo-url="logo"
          :items="items"
          :social-items="socialItems"
          :open-menu-button-color="position === 'left' ? '#fff' : '#000'"
          :display-socials="displaySocials"
          :accent-color="accentColor"
          :menu-button-color="menuButtonColor"
          :position="position"
        />
      </div>

      <Customize>
        <PreviewSelect title="Position" :options="positionOptions" v-model="position" />
        <PreviewColor title="Accent Color" v-model="accentColor" class="mb-4" />
        <PreviewColor title="Menu Button Color" v-model="menuButtonColor" />
        <PreviewSwitch title="Display Socials" v-model="displaySocials" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="staggeredMenu" />
    </template>

    <template #cli>
      <CliInstallation :command="staggeredMenu.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { useForceRerender } from '@/composables/useForceRerender';
import { staggeredMenu } from '@/constants/code/Components/staggeredMenuCode';
import { ref } from 'vue';
import logo from '../../assets/logos/vuebits-gh-white.svg';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import StaggeredMenu from '../../content/Components/StaggeredMenu/StaggeredMenu.vue';

const { rerenderKey: key } = useForceRerender();

type PositionKey = 'left' | 'right';

const displaySocials = ref(true);
const accentColor = ref('#27FF64');
const menuButtonColor = ref('#ffffff');
const position = ref<PositionKey>('right');

const positionOptions = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' }
];

const items = [
  { label: 'Home', ariaLabel: 'Go to Home section', link: '#home' },
  { label: 'About', ariaLabel: 'Go to About section', link: '#about' },
  { label: 'Projects', ariaLabel: 'Go to Projects section', link: '#projects' },
  { label: 'Contact', ariaLabel: 'Go to Contact section', link: '#contact' }
];

const socialItems = [
  { label: 'GitHub', link: 'https://github.com/your-handle' },
  { label: 'Twitter', link: 'https://twitter.com/your-handle' },
  { label: 'LinkedIn', link: 'https://linkedin.com/in/your-handle' }
];

const propData = [
  {
    name: 'position',
    type: '"left" | "right"',
    default: '"right"',
    description: 'Anchor position for the menu panel (left or right side).'
  },
  {
    name: 'colors',
    type: 'string[]',
    default: '["#9EF2B2", "#27FF64"]',
    description: 'Colors used for staggered underlay layers.'
  },
  {
    name: 'items',
    type: 'StaggeredMenuItem[]',
    default: '[]',
    description: 'Menu items rendered inside the panel.'
  },
  {
    name: 'socialItems',
    type: 'StaggeredMenuSocialItem[]',
    default: '[]',
    description: 'Social links displayed in the menu panel.'
  },
  {
    name: 'displaySocials',
    type: 'boolean',
    default: 'false',
    description: 'Whether to display the social links section.'
  },
  {
    name: 'displayItemNumbering',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show numbering for menu items.'
  },
  {
    name: 'className',
    type: 'string',
    default: 'undefined',
    description: 'Optional extra class names.'
  },
  {
    name: 'logoUrl',
    type: 'string',
    default: '',
    description: 'Path to the logo image.'
  },
  {
    name: 'menuButtonColor',
    type: 'string',
    default: '"#fff"',
    description: 'Color of the menu toggle button when closed.'
  },
  {
    name: 'openMenuButtonColor',
    type: 'string',
    default: '"#fff"',
    description: 'Color of the menu toggle button when open.'
  },
  {
    name: 'accentColor',
    type: 'string',
    default: 'undefined',
    description: 'Hover accent color for menu items.'
  },
  {
    name: 'changeMenuColorOnOpen',
    type: 'boolean',
    default: 'true',
    description: 'Whether to animate the button color when opening/closing.'
  },
  {
    name: 'onMenuOpen',
    type: '() => void',
    default: 'undefined',
    description: 'Callback function called when menu opens.'
  },
  {
    name: 'onMenuClose',
    type: '() => void',
    default: 'undefined',
    description: 'Callback function called when menu closes.'
  }
];
</script>
