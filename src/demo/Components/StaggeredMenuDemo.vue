<template>
  <h1 class="sub-category">Staggered Menu</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="staggeredMenu.usage"
    :source="staggeredMenuSource"
    component-name="StaggeredMenu"
    :props-table="props"
  >
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
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Position" :options="['left', 'right']" v-model="position" />
        <PreviewColorPicker title="Accent Color" v-model="accentColor" />
        <PreviewColorPicker title="Menu Button Color" v-model="menuButtonColor" />
        <PreviewSwitch title="Display Socials" v-model="displaySocials" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="staggered-menu" :usage="staggeredMenu.usage!" :source="staggeredMenuSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import logo from '@/assets/logos/vuebits-gh-white.svg';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { staggeredMenu } from '@/constants/code/Components/staggeredMenuCode';
import StaggeredMenu from '@/content/Components/StaggeredMenu/StaggeredMenu.vue';
import staggeredMenuSource from '@/content/Components/StaggeredMenu/StaggeredMenu.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type PositionKey = 'left' | 'right';

const DEFAULTS = {
  displaySocials: true,
  accentColor: '#27FF64',
  menuButtonColor: '#ffffff',
  position: 'right' as PositionKey
};

const displaySocials = ref(DEFAULTS.displaySocials);
const accentColor = ref(DEFAULTS.accentColor);
const menuButtonColor = ref(DEFAULTS.menuButtonColor);
const position = ref<PositionKey>(DEFAULTS.position);

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

const hasChanges = computed(
  () =>
    displaySocials.value !== DEFAULTS.displaySocials ||
    accentColor.value !== DEFAULTS.accentColor ||
    menuButtonColor.value !== DEFAULTS.menuButtonColor ||
    position.value !== DEFAULTS.position
);

function reset() {
  displaySocials.value = DEFAULTS.displaySocials;
  accentColor.value = DEFAULTS.accentColor;
  menuButtonColor.value = DEFAULTS.menuButtonColor;
  position.value = DEFAULTS.position;
  forceRerender();
}

const props: PropRow[] = [
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
  },
  {
    name: 'closeOnClickAway',
    type: 'boolean',
    default: 'true',
    description: 'Whether to close the menu when clicking outside.'
  }
];
</script>
