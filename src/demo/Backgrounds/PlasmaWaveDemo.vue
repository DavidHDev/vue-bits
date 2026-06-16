<template>
  <h1 class="sub-category">Plasma Wave</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="plasmaWave.usage"
    :source="plasmaWaveSource"
    component-name="PlasmaWave"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <PlasmaWave
          :colors="[color1, color2]"
          :speed1="speed1"
          :speed2="speed2"
          :focal-length="focalLength"
          :bend1="bend1"
          :bend2="bend2"
          :dir2="dir2"
          :rotation-deg="rotationDeg"
        />
        <BackgroundContent pill-text="New Background" headline="Raymarched plasma waves powered by OGL" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewSlider title="Speed 1" v-model="speed1" :min="0" :max="0.2" :step="0.005" />
        <PreviewSlider title="Speed 2" v-model="speed2" :min="0" :max="0.2" :step="0.005" />
        <PreviewSlider title="Focal Length" v-model="focalLength" :min="0.1" :max="2" :step="0.05" />
        <PreviewSlider title="Bend 1" v-model="bend1" :min="0" :max="3" :step="0.1" />
        <PreviewSlider title="Bend 2" v-model="bend2" :min="0" :max="3" :step="0.1" />
        <PreviewSlider title="Direction 2" v-model="dir2" :min="-1" :max="1" :step="0.1" />
        <PreviewSlider title="Rotation" v-model="rotationDeg" :min="0" :max="360" :step="1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="plasma-wave" :usage="plasmaWave.usage!" :source="plasmaWaveSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { plasmaWave } from '@/constants/code/Backgrounds/plasmaWaveCode';
import PlasmaWave from '@/content/Backgrounds/PlasmaWave/PlasmaWave.vue';
import plasmaWaveSource from '@/content/Backgrounds/PlasmaWave/PlasmaWave.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color1: '#27FF64',
  color2: '#7CFF67',
  speed1: 0.05,
  speed2: 0.05,
  focalLength: 0.8,
  bend1: 1,
  bend2: 0.5,
  dir2: 1.0,
  rotationDeg: 0
};

const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const speed1 = ref(DEFAULTS.speed1);
const speed2 = ref(DEFAULTS.speed2);
const focalLength = ref(DEFAULTS.focalLength);
const bend1 = ref(DEFAULTS.bend1);
const bend2 = ref(DEFAULTS.bend2);
const dir2 = ref(DEFAULTS.dir2);
const rotationDeg = ref(DEFAULTS.rotationDeg);

const hasChanges = computed(
  () =>
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    speed1.value !== DEFAULTS.speed1 ||
    speed2.value !== DEFAULTS.speed2 ||
    focalLength.value !== DEFAULTS.focalLength ||
    bend1.value !== DEFAULTS.bend1 ||
    bend2.value !== DEFAULTS.bend2 ||
    dir2.value !== DEFAULTS.dir2 ||
    rotationDeg.value !== DEFAULTS.rotationDeg
);

function reset() {
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  speed1.value = DEFAULTS.speed1;
  speed2.value = DEFAULTS.speed2;
  focalLength.value = DEFAULTS.focalLength;
  bend1.value = DEFAULTS.bend1;
  bend2.value = DEFAULTS.bend2;
  dir2.value = DEFAULTS.dir2;
  rotationDeg.value = DEFAULTS.rotationDeg;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'colors',
    type: '[string, string]',
    default: '["#A855F7", "#06B6D4"]',
    description: 'Array of two hex colors — one for each plasma wave band.'
  },
  {
    name: 'speed1',
    type: 'number',
    default: '0.05',
    description: 'Speed of the first plasma wave.'
  },
  {
    name: 'speed2',
    type: 'number',
    default: '0.05',
    description: 'Speed of the second plasma wave.'
  },
  {
    name: 'dir2',
    type: 'number',
    default: '1.0',
    description: 'Direction multiplier for the second wave. Use -1 to reverse.'
  },
  {
    name: 'focalLength',
    type: 'number',
    default: '0.8',
    description: 'Focal length of the camera projection.'
  },
  {
    name: 'bend1',
    type: 'number',
    default: '1',
    description: 'Bend intensity of the first wave.'
  },
  {
    name: 'bend2',
    type: 'number',
    default: '0.5',
    description: 'Bend intensity of the second wave.'
  },
  {
    name: 'rotationDeg',
    type: 'number',
    default: '0',
    description: 'Rotation angle of the scene in degrees.'
  },
  {
    name: 'xOffset',
    type: 'number',
    default: '0',
    description: 'Horizontal offset of the viewport.'
  },
  {
    name: 'yOffset',
    type: 'number',
    default: '0',
    description: 'Vertical offset of the viewport.'
  }
];
</script>
