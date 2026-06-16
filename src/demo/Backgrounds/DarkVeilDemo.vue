<template>
  <h1 class="sub-category">Dark Veil</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="darkVeil.usage"
    :source="darkVeilSource"
    component-name="DarkVeil"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[600px] overflow-hidden demo-container">
        <DarkVeil
          :hue-shift="hueShift"
          :noise-intensity="noiseIntensity"
          :scanline-intensity="scanlineIntensity"
          :speed="speed"
          :scanline-frequency="scanlineFrequency"
          :warp-amount="warpAmount"
        />
        <BackgroundContent pill-text="New Background" headline="Become emboldened by the flame of ambition" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Speed" :min="0" :max="3" :step="0.1" v-model="speed" />
        <PreviewSlider title="Hue Shift" :min="0" :max="360" :step="1" v-model="hueShift" />
        <PreviewSlider title="Noise Intensity" :min="0" :max="0.2" :step="0.01" v-model="noiseIntensity" />
        <PreviewSlider title="Scanline Frequency" :min="0.5" :max="5" :step="0.1" v-model="scanlineFrequency" />
        <PreviewSlider title="Scanline Intensity" :min="0" :max="1" :step="0.01" v-model="scanlineIntensity" />
        <PreviewSlider title="Warp Amount" :min="0" :max="5" :step="0.1" v-model="warpAmount" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="dark-veil" :usage="darkVeil.usage!" :source="darkVeilSource" />
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
import { darkVeil } from '@/constants/code/Backgrounds/darkVeilCode';
import DarkVeil from '@/content/Backgrounds/DarkVeil/DarkVeil.vue';
import darkVeilSource from '@/content/Backgrounds/DarkVeil/DarkVeil.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  hueShift: 150,
  noiseIntensity: 0,
  scanlineIntensity: 0,
  speed: 0.5,
  scanlineFrequency: 0,
  warpAmount: 0
};

const hueShift = ref(DEFAULTS.hueShift);
const noiseIntensity = ref(DEFAULTS.noiseIntensity);
const scanlineIntensity = ref(DEFAULTS.scanlineIntensity);
const speed = ref(DEFAULTS.speed);
const scanlineFrequency = ref(DEFAULTS.scanlineFrequency);
const warpAmount = ref(DEFAULTS.warpAmount);

const hasChanges = computed(
  () =>
    hueShift.value !== DEFAULTS.hueShift ||
    noiseIntensity.value !== DEFAULTS.noiseIntensity ||
    scanlineIntensity.value !== DEFAULTS.scanlineIntensity ||
    speed.value !== DEFAULTS.speed ||
    scanlineFrequency.value !== DEFAULTS.scanlineFrequency ||
    warpAmount.value !== DEFAULTS.warpAmount
);

function reset() {
  hueShift.value = DEFAULTS.hueShift;
  noiseIntensity.value = DEFAULTS.noiseIntensity;
  scanlineIntensity.value = DEFAULTS.scanlineIntensity;
  speed.value = DEFAULTS.speed;
  scanlineFrequency.value = DEFAULTS.scanlineFrequency;
  warpAmount.value = DEFAULTS.warpAmount;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'hueShift',
    type: 'number',
    default: '0',
    description: 'Shifts the hue of the entire animation.'
  },
  {
    name: 'noiseIntensity',
    type: 'number',
    default: '0',
    description: 'Intensity of the noise/grain effect.'
  },
  {
    name: 'scanlineIntensity',
    type: 'number',
    default: '0',
    description: 'Intensity of the scanline effect.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Speed of the animation.'
  },
  {
    name: 'scanlineFrequency',
    type: 'number',
    default: '0',
    description: 'Frequency of the scanlines.'
  },
  {
    name: 'warpAmount',
    type: 'number',
    default: '0',
    description: 'Amount of warp distortion applied to the effect.'
  },
  {
    name: 'resolutionScale',
    type: 'number',
    default: '1',
    description: 'Scale factor for the resolution.'
  }
];
</script>
