<template>
  <h1 class="sub-category">Pixel Trail</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="pixelTrail.usage"
    :source="pixelTrailSource"
    component-name="PixelTrail"
    :props-table="props"
  >
    <template #preview>
      <div class="relative flex justify-center items-center h-[400px] overflow-hidden demo-container">
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
          class="absolute inset-0 flex justify-center items-center font-[900] text-[#222] text-[4.5rem] pointer-events-none select-none"
        >
          Move Cursor.
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Grid Size" v-model="gridSize" :min="10" :max="100" :step="1" />
        <PreviewSlider title="Trail Size" v-model="trailSize" :min="0.05" :max="0.5" :step="0.01" />
        <PreviewSlider title="Max Age" v-model="maxAge" :min="100" :max="1000" :step="50" />
        <PreviewSlider title="Interpolate" v-model="interpolate" :min="0" :max="10" :step="0.1" />
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewSwitch title="Gooey Filter" v-model="gooeyEnabled" />
        <PreviewSlider v-if="gooeyEnabled" title="Gooey Strength" v-model="gooStrength" :min="1" :max="20" :step="1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="pixel-trail" :usage="pixelTrail.usage!" :source="pixelTrailSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { pixelTrail } from '@/constants/code/Animations/pixelTrailCode';
import PixelTrail from '@/content/Animations/PixelTrail/PixelTrail.vue';
import pixelTrailSource from '@/content/Animations/PixelTrail/PixelTrail.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  gridSize: 50,
  trailSize: 0.1,
  maxAge: 250,
  interpolate: 5,
  color: '#27FF64',
  gooeyEnabled: true,
  gooStrength: 2
};

const gridSize = ref(DEFAULTS.gridSize);
const trailSize = ref(DEFAULTS.trailSize);
const maxAge = ref(DEFAULTS.maxAge);
const interpolate = ref(DEFAULTS.interpolate);
const color = ref(DEFAULTS.color);
const gooeyEnabled = ref(DEFAULTS.gooeyEnabled);
const gooStrength = ref(DEFAULTS.gooStrength);

const hasChanges = computed(
  () =>
    gridSize.value !== DEFAULTS.gridSize ||
    trailSize.value !== DEFAULTS.trailSize ||
    maxAge.value !== DEFAULTS.maxAge ||
    interpolate.value !== DEFAULTS.interpolate ||
    color.value !== DEFAULTS.color ||
    gooeyEnabled.value !== DEFAULTS.gooeyEnabled ||
    gooStrength.value !== DEFAULTS.gooStrength
);

function reset() {
  gridSize.value = DEFAULTS.gridSize;
  trailSize.value = DEFAULTS.trailSize;
  maxAge.value = DEFAULTS.maxAge;
  interpolate.value = DEFAULTS.interpolate;
  color.value = DEFAULTS.color;
  gooeyEnabled.value = DEFAULTS.gooeyEnabled;
  gooStrength.value = DEFAULTS.gooStrength;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'gridSize', type: 'number', default: '40', description: 'Number of pixels in grid.' },
  { name: 'trailSize', type: 'number', default: '0.1', description: 'Size of each trail dot.' },
  { name: 'maxAge', type: 'number', default: '250', description: 'Duration of the trail effect.' },
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
