<template>
  <h1 class="sub-category">Beams</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="beams.usage"
    :source="beamsSource"
    component-name="Beams"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Beams
          :beam-width="beamWidth"
          :beam-height="beamHeight"
          :beam-number="beamNumber"
          :light-color="lightColor"
          :speed="speed"
          :noise-intensity="noiseIntensity"
          :scale="scale"
          :rotation="rotation"
        />
        <BackgroundContent pillText="New Background" headline="Radiant beams for creative user interfaces" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color" v-model="lightColor" />
        <PreviewSlider title="Beam Width" v-model="beamWidth" :min="0.1" :max="10" :step="0.1" />
        <PreviewSlider title="Beam Height" v-model="beamHeight" :min="1" :max="25" :step="1" />
        <PreviewSlider title="Beam Count" v-model="beamNumber" :min="1" :max="50" :step="1" />
        <PreviewSlider title="Speed" v-model="speed" :min="0.1" :max="10" :step="0.1" />
        <PreviewSlider title="Noise Intensity" v-model="noiseIntensity" :min="0" :max="5" :step="0.05" />
        <PreviewSlider title="Noise Scale" v-model="scale" :min="0.01" :max="1" :step="0.01" />
        <PreviewSlider title="Rotation" v-model="rotation" :min="0" :max="360" :step="1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="beams" :usage="beams.usage!" :source="beamsSource" />
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
import { beams } from '@/constants/code/Backgrounds/beamsCode';
import Beams from '@/content/Backgrounds/Beams/Beams.vue';
import beamsSource from '@/content/Backgrounds/Beams/Beams.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  beamWidth: 3,
  beamHeight: 30,
  beamNumber: 20,
  lightColor: '#ffffff',
  speed: 2,
  noiseIntensity: 1.75,
  scale: 0.2,
  rotation: 30
};

const beamWidth = ref(DEFAULTS.beamWidth);
const beamHeight = ref(DEFAULTS.beamHeight);
const beamNumber = ref(DEFAULTS.beamNumber);
const lightColor = ref(DEFAULTS.lightColor);
const speed = ref(DEFAULTS.speed);
const noiseIntensity = ref(DEFAULTS.noiseIntensity);
const scale = ref(DEFAULTS.scale);
const rotation = ref(DEFAULTS.rotation);

const hasChanges = computed(
  () =>
    beamWidth.value !== DEFAULTS.beamWidth ||
    beamHeight.value !== DEFAULTS.beamHeight ||
    beamNumber.value !== DEFAULTS.beamNumber ||
    lightColor.value !== DEFAULTS.lightColor ||
    speed.value !== DEFAULTS.speed ||
    noiseIntensity.value !== DEFAULTS.noiseIntensity ||
    scale.value !== DEFAULTS.scale ||
    rotation.value !== DEFAULTS.rotation
);

function reset() {
  beamWidth.value = DEFAULTS.beamWidth;
  beamHeight.value = DEFAULTS.beamHeight;
  beamNumber.value = DEFAULTS.beamNumber;
  lightColor.value = DEFAULTS.lightColor;
  speed.value = DEFAULTS.speed;
  noiseIntensity.value = DEFAULTS.noiseIntensity;
  scale.value = DEFAULTS.scale;
  rotation.value = DEFAULTS.rotation;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'beamWidth',
    type: 'number',
    default: '2',
    description: 'Width of each beam.'
  },
  {
    name: 'beamHeight',
    type: 'number',
    default: '15',
    description: 'Height of each beam.'
  },
  {
    name: 'beamNumber',
    type: 'number',
    default: '12',
    description: 'Number of beams to display.'
  },
  {
    name: 'lightColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the directional light.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '2',
    description: 'Speed of the animation.'
  },
  {
    name: 'noiseIntensity',
    type: 'number',
    default: '1.75',
    description: 'Intensity of the noise effect overlay.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '0.2',
    description: 'Scale of the noise pattern.'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '0',
    description: 'Rotation of the entire beams system in degrees.'
  }
];
</script>
