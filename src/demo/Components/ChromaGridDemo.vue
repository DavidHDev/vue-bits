<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container overflow-hidden py-[64px]">
        <ChromaGrid :radius="radius" :damping="damping" :fadeOut="fadeOut" :ease="ease" />
      </div>

      <Customize>
        <PreviewSlider title="Radius" v-model="radius" :min="50" :max="600" :step="10" />

        <PreviewSlider title="Damping" v-model="damping" :min="0.1" :max="5" :step="0.5" />

        <PreviewSlider title="Fade Out" v-model="fadeOut" :min="0" :max="2" :step="0.1" />

        <PreviewSelect title="Easing Function" v-model="ease" :options="easeOptions" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="chromaGrid" />
    </template>

    <template #cli>
      <CliInstallation :command="chromaGrid.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import ChromaGrid from '../../content/Components/ChromaGrid/ChromaGrid.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import { chromaGrid } from '../../constants/code/Components/chromaGridCode';

const radius = ref(300);
const damping = ref(0.45);
const fadeOut = ref(0.6);
const ease = ref('power3.out');

const easeOptions = [
  { label: 'Power3 Out', value: 'power3.out' },
  { label: 'Bounce Out', value: 'bounce.out' },
  { label: 'Elastic Out', value: 'elastic.out(1, 0.3)' }
];

const propData = [
  {
    name: 'items',
    type: 'Array',
    default: 'Demo []',
    description: 'Array of ChromaItem objects to display in the grid'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS classes to apply to the grid container'
  },
  {
    name: 'radius',
    type: 'number',
    default: '300',
    description: 'Size of the spotlight effect in pixels'
  },
  {
    name: 'damping',
    type: 'number',
    default: '0.45',
    description: 'Cursor follow animation duration in seconds'
  },
  {
    name: 'fadeOut',
    type: 'number',
    default: '0.6',
    description: 'Fade-out animation duration in seconds when mouse leaves'
  },
  {
    name: 'ease',
    type: 'string',
    default: "'power3.out'",
    description: 'GSAP easing function for animations'
  }
];
</script>
