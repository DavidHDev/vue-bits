<template>
  <h1 class="sub-category">Bubble Menu</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="bubbleMenu.usage"
    :source="bubbleMenuSource"
    component-name="BubbleMenu"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[800px] overflow-hidden demo-container demo-container-dots">
        <BubbleMenu
          :logo="logo"
          :menu-bg="menuBg"
          :menu-content-color="menuContentColor"
          :animation-ease="animationEase"
          :animation-duration="animationDuration"
          :stagger-delay="staggerDelay"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Ease"
          :options="['back.out(1.5)', 'power3.out', 'power2.out', 'elastic.out(1,0.5)', 'bounce.out']"
          v-model="animationEase"
        />
        <PreviewColorPicker title="Menu BG" v-model="menuBg" />
        <PreviewColorPicker title="Content Color" v-model="menuContentColor" />
        <PreviewSlider title="Anim Duration" v-model="animationDuration" :min="0.1" :max="2" :step="0.05" />
        <PreviewSlider title="Stagger" v-model="staggerDelay" :min="0" :max="0.5" :step="0.01" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="bubble-menu" :usage="bubbleMenu.usage!" :source="bubbleMenuSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import logo from '@/assets/logos/vuebits-gh-black.svg';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { bubbleMenu } from '@/constants/code/Components/bubbleMenuCode';
import BubbleMenu from '@/content/Components/BubbleMenu/BubbleMenu.vue';
import bubbleMenuSource from '@/content/Components/BubbleMenu/BubbleMenu.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

type EaseKey = 'back.out(1.5)' | 'power3.out' | 'power2.out' | 'elastic.out(1,0.5)' | 'bounce.out';
const DEFAULTS = {
  animationEase: 'back.out(1.5)' as EaseKey,
  menuBg: '#ffffff',
  menuContentColor: '#111111',
  animationDuration: 0.5,
  staggerDelay: 0.12
};

const animationEase = ref<EaseKey>(DEFAULTS.animationEase);
const menuBg = ref(DEFAULTS.menuBg);
const menuContentColor = ref(DEFAULTS.menuContentColor);
const animationDuration = ref(DEFAULTS.animationDuration);
const staggerDelay = ref(DEFAULTS.staggerDelay);

const hasChanges = computed(
  () =>
    animationEase.value !== DEFAULTS.animationEase ||
    menuBg.value !== DEFAULTS.menuBg ||
    menuContentColor.value !== DEFAULTS.menuContentColor ||
    animationDuration.value !== DEFAULTS.animationDuration ||
    staggerDelay.value !== DEFAULTS.staggerDelay
);

function reset() {
  animationEase.value = DEFAULTS.animationEase;
  menuBg.value = DEFAULTS.menuBg;
  menuContentColor.value = DEFAULTS.menuContentColor;
  animationDuration.value = DEFAULTS.animationDuration;
  staggerDelay.value = DEFAULTS.staggerDelay;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'logo',
    type: 'string',
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
