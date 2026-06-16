<template>
  <h1 class="sub-category">Flowing Menu</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="flowingMenu.usage"
    :source="flowingMenuSource"
    component-name="FlowingMenu"
    :props-table="props"
  >
    <template #preview>
      <div class="py-[100px] h-[500px] overflow-hidden demo-container">
        <FlowingMenu
          :items="demoItems"
          :speed="speed"
          :text-color="textColor"
          :bg-color="bgColor"
          :marquee-bg-color="marqueeBgColor"
          :marquee-text-color="marqueeTextColor"
          :border-color="borderColor"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Speed" :min="1" :max="60" :step="1" v-model="speed" />
        <PreviewColorPicker title="Text Color" v-model="textColor" />
        <PreviewColorPicker title="Background Color" v-model="bgColor" />
        <PreviewColorPicker title="Marquee BG Color" v-model="marqueeBgColor" />
        <PreviewColorPicker title="Marquee Text Color" v-model="marqueeTextColor" />
        <PreviewColorPicker title="Border Color" v-model="borderColor" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="flowing-menu" :usage="flowingMenu.usage!" :source="flowingMenuSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { flowingMenu } from '@/constants/code/Components/flowingMenuCode';
import FlowingMenu from '@/content/Components/FlowingMenu/FlowingMenu.vue';
import flowingMenuSource from '@/content/Components/FlowingMenu/FlowingMenu.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 15,
  textColor: '#ffffff',
  bgColor: '#111111',
  marqueeBgColor: '#ffffff',
  marqueeTextColor: '#111111',
  borderColor: '#ffffff'
};

const demoItems = [
  { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
];

const speed = ref(DEFAULTS.speed);
const textColor = ref(DEFAULTS.textColor);
const bgColor = ref(DEFAULTS.bgColor);
const marqueeBgColor = ref(DEFAULTS.marqueeBgColor);
const marqueeTextColor = ref(DEFAULTS.marqueeTextColor);
const borderColor = ref(DEFAULTS.borderColor);

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    textColor.value !== DEFAULTS.textColor ||
    bgColor.value !== DEFAULTS.bgColor ||
    marqueeBgColor.value !== DEFAULTS.marqueeBgColor ||
    marqueeTextColor.value !== DEFAULTS.marqueeTextColor ||
    borderColor.value !== DEFAULTS.borderColor
);

function reset() {
  speed.value = DEFAULTS.speed;
  textColor.value = DEFAULTS.textColor;
  bgColor.value = DEFAULTS.bgColor;
  marqueeBgColor.value = DEFAULTS.marqueeBgColor;
  marqueeTextColor.value = DEFAULTS.marqueeTextColor;
  borderColor.value = DEFAULTS.borderColor;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'object[]',
    default: '[]',
    description: 'An array of objects containing: link, text, image.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '15',
    description: 'Duration of the marquee animation in seconds (lower = faster).'
  },
  {
    name: 'textColor',
    type: 'string',
    default: '#ffffff',
    description: 'Color of the static menu text.'
  },
  {
    name: 'bgColor',
    type: 'string',
    default: '#111',
    description: 'Background color of the menu container.'
  },
  {
    name: 'marqueeBgColor',
    type: 'string',
    default: '#ffffff',
    description: 'Background color of the marquee overlay.'
  },
  {
    name: 'marqueeTextColor',
    type: 'string',
    default: '#111',
    description: 'Text color inside the marquee.'
  },
  {
    name: 'borderColor',
    type: 'string',
    default: '#ffffff',
    description: 'Color of the dividing lines between menu items.'
  }
];
</script>
