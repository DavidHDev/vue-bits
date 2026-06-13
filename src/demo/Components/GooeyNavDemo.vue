<template>
  <h1 class="sub-category">Gooey Nav</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="gooeyNav.usage"
    :source="gooeyNavSource"
    component-name="GooeyNav"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <GooeyNav
          :key="rerenderKey"
          :items="navItems"
          :animation-time="500"
          :particle-count="particleCount"
          :particle-distances="[90, 0]"
          :particle-r="particleR"
          :time-variance="timeVariance"
          :initial-active-index="0"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Particle Count" v-model="particleCount" :min="1" :max="50" :step="1" />
        <PreviewSlider title="Animation Variance" v-model="timeVariance" :min="0" :max="2000" :step="100" />
        <PreviewSlider title="Radius Factor" v-model="particleR" :min="0" :max="1000" :step="100" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="gooey-nav" :usage="gooeyNav.usage!" :source="gooeyNavSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { gooeyNav } from '@/constants/code/Components/gooeyNavCode';
import GooeyNav from '@/content/Components/GooeyNav/GooeyNav.vue';
import gooeyNavSource from '@/content/Components/GooeyNav/GooeyNav.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  particleCount: 15,
  timeVariance: 300,
  particleR: 100
};

const particleCount = ref(DEFAULTS.particleCount);
const timeVariance = ref(DEFAULTS.timeVariance);
const particleR = ref(DEFAULTS.particleR);

const navItems = [
  { label: 'Home', href: null },
  { label: 'About', href: null },
  { label: 'Contact', href: null }
];

const hasChanges = computed(
  () =>
    particleCount.value !== DEFAULTS.particleCount ||
    timeVariance.value !== DEFAULTS.timeVariance ||
    particleR.value !== DEFAULTS.particleR
);

function reset() {
  particleCount.value = DEFAULTS.particleCount;
  timeVariance.value = DEFAULTS.timeVariance;
  particleR.value = DEFAULTS.particleR;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'GooeyNavItem[]',
    default: '[]',
    description: 'Array of navigation items.'
  },
  {
    name: 'animationTime',
    type: 'number',
    default: '600',
    description: 'Duration (ms) of the main animation.'
  },
  {
    name: 'particleCount',
    type: 'number',
    default: '15',
    description: 'Number of bubble particles per transition.'
  },
  {
    name: 'particleDistances',
    type: '[number, number]',
    default: '[90, 10]',
    description: 'Outer and inner distances of bubble spread.'
  },
  {
    name: 'particleR',
    type: 'number',
    default: '100',
    description: 'Radius factor influencing random particle rotation.'
  },
  {
    name: 'timeVariance',
    type: 'number',
    default: '300',
    description: 'Random time variance (ms) for particle animations.'
  },
  {
    name: 'colors',
    type: 'number[]',
    default: '[1, 2, 3, 1, 2, 3, 1, 4]',
    description: 'Color indices used when creating bubble particles.'
  },
  {
    name: 'initialActiveIndex',
    type: 'number',
    default: '0',
    description: 'Which item is selected on mount.'
  }
];
</script>

<style>
/* Add color variables for the particles */
:root {
  --color-1: #ff6b6b;
  --color-2: #4ecdc4;
  --color-3: #45b7d1;
  --color-4: #f9ca24;
}
</style>
