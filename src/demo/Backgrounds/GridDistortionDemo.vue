<template>
  <h1 class="sub-category">Grid Distortion</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="gridDistortion.usage"
    :source="gridDistortionSource"
    component-name="GridDistortion"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container" ref="containerRef">
        <GridDistortion
          :key="key"
          imageSrc="https://images.unsplash.com/photo-1681577997228-8c558352ffa7?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          :grid="grid"
          :mouse="mouse"
          :strength="0.15"
          :relaxation="0.9"
          className="grid-distortion"
        />
        <BackgroundContent pillText="New Background" headline="Don't just sit there, move your cursor!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Grid Size" :min="6" :max="200" :step="1" v-model="grid" />
        <PreviewSlider title="Mouse Size" :min="0.1" :max="0.5" :step="0.01" v-model="mouse" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="grid-distortion" :usage="gridDistortion.usage!" :source="gridDistortionSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { gridDistortion } from '@/constants/code/Backgrounds/gridDistortionCode';
import GridDistortion from '@/content/Backgrounds/GridDistortion/GridDistortion.vue';
import gridDistortionSource from '@/content/Backgrounds/GridDistortion/GridDistortion.vue?raw';
import { computed, ref, useTemplateRef } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  grid: 10,
  mouse: 0.25
};

const grid = ref(DEFAULTS.grid);
const mouse = ref(DEFAULTS.mouse);

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

const hasChanges = computed(() => grid.value !== DEFAULTS.grid || mouse.value !== DEFAULTS.mouse);

function reset() {
  grid.value = DEFAULTS.grid;
  mouse.value = DEFAULTS.mouse;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'imgageSrc',
    type: 'string',
    default: '',
    description: 'The image you want to render inside the container.'
  },
  {
    name: 'grid',
    type: 'number',
    default: '15',
    description: 'The number of cells present in the distortion grid'
  },
  {
    name: 'mouse',
    type: 'number',
    default: '0.1',
    description: 'The size of the distortion effect that follows the cursor.'
  },
  {
    name: 'relaxation',
    type: 'number',
    default: '0.9',
    description: 'The speed at which grid cells return to their initial state.'
  },
  {
    name: 'strength',
    type: 'number',
    default: '0.15',
    description: 'The overall strength of the distortion effect.'
  },
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Any custom class(es) you want to apply to the container.'
  }
];
</script>
