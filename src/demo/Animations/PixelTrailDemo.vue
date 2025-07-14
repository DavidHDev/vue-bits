<template>
  <div class="truefocus-demo">
    <TabbedLayout>
      <template #preview>
        <div class="relative py-6 overflow-hidden demo-container h-[500px]">
          <div class="absolute z-0 text-[clamp(2rem,6vw,6rem)] text-[#c3f6d1] opacity-10 font-black pointer-none:">
            Move Cursor.
          </div>
          <PixelTrail
            :grid-size="gridSize"
            :trail-size="trailSize"
            :max-age="maxAge"
            :interpolate="interpolate"
            :color="color"
            v-bind="gooeyEnabled ? { 'gooey-filter': { id: 'custom-goo-filter', strength: gooStrength } } : {}"
          />
        </div>

        <Customize>
          <PreviewSlider title="Grid Size" v-model="gridSize" :min="10" :max="100" :step="1" />

          <PreviewSlider title="Trail Size" v-model="trailSize" :min="0.05" :max="0.5" :step="0.01" />

          <PreviewSlider title="Max Age" v-model="maxAge" :min="100" :max="1000" :step="50" />

          <PreviewSlider title="Interpolate" v-model="interpolate" :min="0" :max="10" :step="0.1" />

          <PreviewColor title="Color" v-model="color" />

          <PreviewSwitch title="Gooey Filter" v-model="gooeyEnabled" />

          <PreviewSlider v-if="gooStrength" title="Gooey Strength" v-model="gooStrength" :min="1" :max="20" :step="1" />
        </Customize>

        <PropTable :data="propData" />

        <Dependencies :dependency-list="['three']" />
      </template>

      <template #code>
        <CodeExample :code-object="pixelTrail" />
      </template>

      <template #cli>
        <CliInstallation :command="pixelTrail.cli" />
      </template>
    </TabbedLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PixelTrail from '../../content/Animations/PixelTrail/PixelTrail.vue';
import { pixelTrail } from '@/constants/code/Animations/pixelTrailCode';

const gridSize = ref<number>(80);
const trailSize = ref<number>(0.1);
const maxAge = ref<number>(250);
const interpolate = ref<number>(5);
const color = ref<string>('#27FF64');
const gooeyEnabled = ref<boolean>(true);
const gooStrength = ref<number>(2);

const propData = [
  { name: 'gridSize', type: 'number', default: '40', description: 'Number of pixels in grid.' },
  { name: 'trailSize', type: 'number', default: '0.1', description: 'Size of each trail dot.' },
  { name: 'maxAge', type: 'number', default: '500', description: 'Duration of the trail effect.' },
  { name: 'interpolate', type: 'number', default: '5', description: 'Interpolation factor for pointer movement.' },
  { name: 'color', type: 'string', default: '#ffffff', description: 'Pixel color.' },
  {
    name: 'gooeyFilter',
    type: 'object',
    default: "{ id: 'custom-goo-filter', strength: 5 }",
    description: 'Configuration for gooey filter.'
  }
];
</script>
