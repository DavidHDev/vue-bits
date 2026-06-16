<template>
  <h1 class="sub-category">Grid Motion</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="gridMotion.usage"
    :source="gridMotionSource"
    component-name="GridMotion"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <GridMotion :items="images" :gradient-color="gradientColor" />
      </div>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="grid-motion" :usage="gridMotion.usage!" :source="gridMotionSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { gridMotion } from '@/constants/code/Backgrounds/gridMotionCode';
import GridMotion from '@/content/Backgrounds/GridMotion/GridMotion.vue';
import gridMotionSource from '@/content/Backgrounds/GridMotion/GridMotion.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const images = Array.from(
  { length: 30 },
  () =>
    'https://images.unsplash.com/photo-1748370987492-eb390a61dcda?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
);

const DEFAULTS = {
  items: images,
  gradientColor: 'black'
};

const items = ref([...DEFAULTS.items]);
const gradientColor = ref(DEFAULTS.gradientColor);

const hasChanges = computed(
  () => JSON.stringify(items.value) !== JSON.stringify(DEFAULTS.items) || gradientColor.value !== DEFAULTS.gradientColor
);

function reset() {
  items.value = [...DEFAULTS.items];
  gradientColor.value = DEFAULTS.gradientColor;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'array',
    default: '[]',
    description: 'An array of items to display in the grid. Each item can be a string, JSX element, or an image URL.'
  },
  {
    name: 'gradientColor',
    type: 'string',
    default: 'black',
    description: 'Controls the color of the radial gradient used as the background.'
  }
];
</script>
