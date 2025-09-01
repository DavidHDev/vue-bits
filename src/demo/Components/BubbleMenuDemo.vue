<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container demo-container-dots h-[800px] overflow-hidden">
        <BubbleMenu
          :logo="logo"
          :menu-bg="menuBg"
          :menu-content-color="menuContentColor"
          :animation-ease="animationEase"
          :animation-duration="animationDuration"
          :stagger-delay="staggerDelay"
        />
      </div>

      <Customize>
        <PreviewSelect title="Ease" :options="easeOptions" v-model="animationEase" />
        <PreviewColor title="Menu BG" v-model="menuBg" />
        <PreviewColor title="Content Color" v-model="menuContentColor" />
        <PreviewSlider title="Anim Duration" v-model="animationDuration" :min="0.1" :max="2" :step="0.05" />
        <PreviewSlider title="Stagger" v-model="staggerDelay" :min="0" :max="0.5" :step="0.01" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="bubbleMenu" />
    </template>

    <template #cli>
      <CliInstallation :command="bubbleMenu.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { bubbleMenu } from '@/constants/code/Components/bubbleMenuCode';
import { ref } from 'vue';
import logo from '../../assets/logos/vuebits-gh-black.svg';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import BubbleMenu from '../../content/Components/BubbleMenu/BubbleMenu.vue';

type EaseKey = 'back.out(1.5)' | 'power3.out' | 'power2.out' | 'elastic.out(1,0.5)' | 'bounce.out';

const animationEase = ref<EaseKey>('back.out(1.5)');
const menuBg = ref('#ffffff');
const menuContentColor = ref('#111111');
const animationDuration = ref(0.5);
const staggerDelay = ref(0.12);

const easeOptions = [
  { value: 'back.out(1.5)', label: 'back.out(1.5)' },
  { value: 'power3.out', label: 'power3.out' },
  { value: 'power2.out', label: 'power2.out' },
  { value: 'elastic.out(1,0.5)', label: 'elastic.out(1,0.5)' },
  { value: 'bounce.out', label: 'bounce.out' }
];

const propData = [
  {
    name: 'logo',
    type: 'ReactNode | string',
    default: '—',
    description: 'Logo content shown in the central bubble (string src or JSX).'
  },
  {
    name: 'onMenuClick',
    type: '(open: boolean) => void',
    default: '—',
    description: 'Callback fired whenever the menu toggle changes; receives open state.'
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Additional class names for the root nav wrapper.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '—',
    description: 'Inline styles applied to the root nav wrapper.'
  },
  {
    name: 'menuAriaLabel',
    type: 'string',
    default: '"Toggle menu"',
    description: 'Accessible aria-label for the toggle button.'
  },
  {
    name: 'menuBg',
    type: 'string',
    default: '"#fff"',
    description: 'Background color for the logo & toggle bubbles and base pill background.'
  },
  {
    name: 'menuContentColor',
    type: 'string',
    default: '"#111"',
    description: 'Color for the menu icon lines and default pill text.'
  },
  {
    name: 'useFixedPosition',
    type: 'boolean',
    default: 'false',
    description: 'If true positions the menu with fixed instead of absolute (follows viewport).'
  },
  {
    name: 'items',
    type: 'MenuItem[]',
    default: 'DEFAULT_ITEMS',
    description:
      'Custom menu items; each = { label, href, ariaLabel?, rotation?, hoverStyles?: { bgColor?, textColor? } }.'
  },
  {
    name: 'animationEase',
    type: 'string',
    default: '"back.out(1.5)"',
    description: 'GSAP ease string used for bubble scale-in animation.'
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '0.5',
    description: 'Duration (s) for each bubble & label animation.'
  },
  {
    name: 'staggerDelay',
    type: 'number',
    default: '0.12',
    description: 'Base stagger (s) between bubble animations (with slight random variance).'
  }
];
</script>
