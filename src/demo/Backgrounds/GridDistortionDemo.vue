<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container" ref="containerRef">
        <GridDistortion
          :key="key"
          imageSrc="https://picsum.photos/1920/1080"
          :grid="grid"
          :mouse="mouse"
          :strength="0.15"
          :relaxation="0.9"
          className="grid-distortion"
        />
        <BackgroundContent pillText="New Background" headline="Don't just sit there, move your cursor!" />
      </div>

      <Customize>
        <PreviewSlider title="Grid Size" :min="6" :max="200" :step="1" v-model="grid" />

        <PreviewSlider title="Mouse Size" :min="0.1" :max="0.5" :step="0.01" v-model="mouse" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="gridDistortion" />
    </template>

    <template #cli>
      <CliInstallation :command="gridDistortion.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { useForceRerender } from '@/composables/useForceRerender';
import { ref, watch, useTemplateRef } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { gridDistortion } from '../../constants/code/Backgrounds/gridDistortionCode';
import GridDistortion from '../../content/Backgrounds/GridDistortion/GridDistortion.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const grid = ref(10);
const mouse = ref(0.25);

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

watch(
  () => [grid, mouse],
  () => {
    forceRerender();
  },
  { deep: true }
);

const propData = [
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
