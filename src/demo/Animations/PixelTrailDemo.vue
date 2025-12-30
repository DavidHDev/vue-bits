<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container relative h-[400px] overflow-hidden flex items-center justify-center">
        <PixelTrail
          :key="key"
          :grid-size="gridSize"
          :trail-size="trailSize"
          :max-age="maxAge"
          :interpolate="interpolate"
          :color="color"
          :gooey-filter="gooeyEnabled ? { id: 'custom-goo-filter', strength: gooStrength } : undefined"
        />
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none text-[4.5rem] font-[900] text-[#222] select-none"
        >
          Move Cursor.
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Grid Size" v-model="gridSize" :min="10" :max="100" :step="1" @update:model-value="forceRerender" />

        <PreviewSlider title="Trail Size" v-model="trailSize" :min="0.05" :max="0.5" :step="0.01" @update:model-value="forceRerender" />

        <PreviewSlider title="Max Age" v-model="maxAge" :min="100" :max="1000" :step="50" @update:model-value="forceRerender" />

        <PreviewSlider title="Interpolate" v-model="interpolate" :min="0" :max="10" :step="0.1" @update:model-value="forceRerender" />

        <PreviewColor title="Color" v-model="color" @update:model-value="forceRerender" />

        <PreviewSwitch title="Gooey Filter" v-model="gooeyEnabled" @update:model-value="forceRerender" />

        <PreviewSlider
          v-if="gooeyEnabled"
          title="Gooey Strength"
          v-model="gooStrength"
          :min="1"
          :max="20"
          :step="1"
          @update:model-value="forceRerender"
        />
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PixelTrail from '../../content/Animations/PixelTrail/PixelTrail.vue';
import { pixelTrail } from '@/constants/code/Animations/pixelTrailCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey: key, forceRerender } = useForceRerender();

const gridSize = ref(50);
const trailSize = ref(0.1);
const maxAge = ref(250);
const interpolate = ref(5);
const color = ref('#27FF64');
const gooeyEnabled = ref(true);
const gooStrength = ref(2);

const propData = [
  { name: 'gridSize', type: 'number', default: '40', description: 'Number of pixels in grid.' },
  { name: 'trailSize', type: 'number', default: '0.1', description: 'Size of each trail dot.' },
  { name: 'maxAge', type: 'number', default: '250', description: 'Duration of the trail effect.' },
  { name: 'interpolate', type: 'number', default: '5', description: 'Interpolation factor for pointer movement.' },
  { name: 'color', type: 'string', default: '#ffffff', description: 'Pixel color.' },
  { name: 'gooeyFilter', type: 'object', default: "{ id: 'custom-goo-filter', strength: 5 }", description: 'Configuration for gooey filter.' }
];
</script>
