<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <GooeyNav
          :key="rerenderKey"
          :items="navItems"
          :animation-time="500"
          :particle-count="particleCount"
          :particle-distances="[90, 0]"
          :particle-r="particleR"
          :time-variance="timeVariance"
          :initial-active-index="0"
          :colors="[1, 2, 3, 1, 2, 3, 1, 4]"
        />
      </div>

      <Customize>
        <PreviewSlider title="Particle Count" v-model="particleCount" :min="1" :max="50" :step="1" />

        <PreviewSlider title="Animation Variance" v-model="timeVariance" :min="0" :max="2000" :step="100" />

        <PreviewSlider title="Radius Factor" v-model="particleR" :min="0" :max="1000" :step="100" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="gooeyNav" />
    </template>

    <template #cli>
      <CliInstallation :command="gooeyNav.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import GooeyNav from '../../content/Components/GooeyNav/GooeyNav.vue';
import { gooeyNav } from '@/constants/code/Components/gooeyNavCode';
import { useForceRerender } from '@/composables/useForceRerender';

const particleCount = ref(15);
const timeVariance = ref(300);
const particleR = ref(100);
const { rerenderKey } = useForceRerender();

const navItems = [
  { label: 'Home', href: null },
  { label: 'About', href: null },
  { label: 'Contact', href: null }
];

const propData = [
  {
    name: 'items',
    type: 'GooeyNavItem[]',
    default: '[]',
    description: 'Array of navigation items with label and href properties.'
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
