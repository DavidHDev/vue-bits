<template>
  <h1 class="sub-category">Silk</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="silk.usage"
    :source="silkSource"
    component-name="Silk"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Silk :speed="speed" :scale="scale" :color="color" :noise-intensity="noiseIntensity" :rotation="rotation" />
        <BackgroundContent pillText="New Background" headline="Silk touch is a good enhancement, Steve!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="10" :step="0.1" />
        <PreviewSlider title="Scale" v-model="scale" :min="0.1" :max="3" :step="0.1" />
        <PreviewSlider title="Noise Intensity" v-model="noiseIntensity" :min="0" :max="3" :step="0.1" />
        <PreviewSlider title="Rotation" v-model="rotation" :min="0" :max="6.28" :step="0.1" />
        <PreviewColorPicker title="Color" v-model="color" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="silk" :usage="silk.usage!" :source="silkSource" />
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
import { silk } from '@/constants/code/Backgrounds/silkCode';
import Silk from '@/content/Backgrounds/Silk/Silk.vue';
import silkSource from '@/content/Backgrounds/Silk/Silk.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 5,
  scale: 1,
  color: '#515b42',
  noiseIntensity: 1.5,
  rotation: 0
};

const speed = ref(DEFAULTS.speed);
const scale = ref(DEFAULTS.scale);
const color = ref(DEFAULTS.color);
const noiseIntensity = ref(DEFAULTS.noiseIntensity);
const rotation = ref(DEFAULTS.rotation);

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    scale.value !== DEFAULTS.scale ||
    color.value !== DEFAULTS.color ||
    noiseIntensity.value !== DEFAULTS.noiseIntensity ||
    rotation.value !== DEFAULTS.rotation
);

function reset() {
  speed.value = DEFAULTS.speed;
  scale.value = DEFAULTS.scale;
  color.value = DEFAULTS.color;
  noiseIntensity.value = DEFAULTS.noiseIntensity;
  rotation.value = DEFAULTS.rotation;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'speed',
    type: 'number',
    default: '5',
    description: 'Controls the animation speed of the silk effect.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Controls the scale of the silk pattern.'
  },
  {
    name: 'color',
    type: 'string',
    default: "'#7B7481'",
    description: 'Hex color code for the silk pattern.'
  },
  {
    name: 'noiseIntensity',
    type: 'number',
    default: '1.5',
    description: 'Controls the intensity of the noise effect.'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '0',
    description: 'Controls the rotation of the silk pattern (in radians).'
  }
];
</script>
