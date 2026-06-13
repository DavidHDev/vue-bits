<template>
  <h1 class="sub-category">Light Rays</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="lightRays.usage"
    :source="lightRaysSource"
    component-name="LightRays"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <LightRays
          :rays-origin="raysOrigin"
          :rays-color="raysColor"
          :rays-speed="raysSpeed"
          :light-spread="lightSpread"
          :ray-length="rayLength"
          :pulsating="pulsating"
          :fade-distance="fadeDistance"
          :saturation="saturation"
          :follow-mouse="true"
          :mouse-influence="mouseInfluence"
          :noise-amount="noiseAmount"
          :distortion="distortion"
        />
        <BackgroundContent pill-text="New Background" headline="May these lights guide you on your path" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Rays Color" v-model="raysColor" />
        <PreviewSelect title="Rays Origin" v-model="raysOrigin" :options="raysOriginOptions" />
        <PreviewSlider title="Rays Speed" v-model="raysSpeed" :min="0.1" :max="3" :step="0.1" />
        <PreviewSlider title="Light Spread" v-model="lightSpread" :min="0.1" :max="2" :step="0.1" />
        <PreviewSlider title="Ray Length" v-model="rayLength" :min="0.5" :max="3" :step="0.1" />
        <PreviewSlider title="Fade Distance" v-model="fadeDistance" :min="0.5" :max="2" :step="0.1" />
        <PreviewSlider title="Saturation" v-model="saturation" :min="0" :max="2" :step="0.1" />
        <PreviewSlider title="Mouse Influence" v-model="mouseInfluence" :min="0" :max="1" :step="0.1" />
        <PreviewSlider title="Noise Amount" v-model="noiseAmount" :min="0" :max="0.5" :step="0.01" />
        <PreviewSlider title="Distortion" v-model="distortion" :min="0" :max="1" :step="0.1" />
        <PreviewSwitch title="Pulsating" v-model="pulsating" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="light-rays" :usage="lightRays.usage!" :source="lightRaysSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { lightRays } from '@/constants/code/Backgrounds/lightRaysCode';
import LightRays, { type RaysOrigin } from '@/content/Backgrounds/LightRays/LightRays.vue';
import lightRaysSource from '@/content/Backgrounds/LightRays/LightRays.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  raysOrigin: 'top-center' as RaysOrigin,
  raysColor: '#ffffff',
  raysSpeed: 1,
  lightSpread: 0.5,
  rayLength: 3.0,
  pulsating: false,
  fadeDistance: 1.0,
  saturation: 1.0,
  mouseInfluence: 0.1,
  noiseAmount: 0.0,
  distortion: 0.0
};

const raysOrigin = ref<RaysOrigin>(DEFAULTS.raysOrigin);
const raysColor = ref(DEFAULTS.raysColor);
const raysSpeed = ref(DEFAULTS.raysSpeed);
const lightSpread = ref(DEFAULTS.lightSpread);
const rayLength = ref(DEFAULTS.rayLength);
const pulsating = ref(DEFAULTS.pulsating);
const fadeDistance = ref(DEFAULTS.fadeDistance);
const saturation = ref(DEFAULTS.saturation);
const mouseInfluence = ref(DEFAULTS.mouseInfluence);
const noiseAmount = ref(DEFAULTS.noiseAmount);
const distortion = ref(DEFAULTS.distortion);

const raysOriginOptions = [
  { value: 'top-center', label: 'Top' },
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'bottom-center', label: 'Bottom' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' }
];

const hasChanges = computed(
  () =>
    raysOrigin.value !== DEFAULTS.raysOrigin ||
    raysColor.value !== DEFAULTS.raysColor ||
    raysSpeed.value !== DEFAULTS.raysSpeed ||
    lightSpread.value !== DEFAULTS.lightSpread ||
    rayLength.value !== DEFAULTS.rayLength ||
    pulsating.value !== DEFAULTS.pulsating ||
    fadeDistance.value !== DEFAULTS.fadeDistance ||
    saturation.value !== DEFAULTS.saturation ||
    mouseInfluence.value !== DEFAULTS.mouseInfluence ||
    noiseAmount.value !== DEFAULTS.noiseAmount ||
    distortion.value !== DEFAULTS.distortion
);

function reset() {
  raysOrigin.value = DEFAULTS.raysOrigin;
  raysColor.value = DEFAULTS.raysColor;
  raysSpeed.value = DEFAULTS.raysSpeed;
  lightSpread.value = DEFAULTS.lightSpread;
  rayLength.value = DEFAULTS.rayLength;
  pulsating.value = DEFAULTS.pulsating;
  fadeDistance.value = DEFAULTS.fadeDistance;
  saturation.value = DEFAULTS.saturation;
  mouseInfluence.value = DEFAULTS.mouseInfluence;
  noiseAmount.value = DEFAULTS.noiseAmount;
  distortion.value = DEFAULTS.distortion;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'raysOrigin',
    type: 'RaysOrigin',
    default: '"top-center"',
    description:
      "Origin position of the light rays. Options: 'top-center', 'top-left', 'top-right', 'right', 'left', 'bottom-center', 'bottom-right', 'bottom-left'"
  },
  {
    name: 'raysColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'Color of the light rays in hex format'
  },
  {
    name: 'raysSpeed',
    type: 'number',
    default: '1',
    description: 'Animation speed of the rays'
  },
  {
    name: 'lightSpread',
    type: 'number',
    default: '0.5',
    description: 'How wide the light rays spread. Lower values = tighter rays, higher values = wider spread'
  },
  {
    name: 'rayLength',
    type: 'number',
    default: '1.0',
    description: 'Maximum length/reach of the rays'
  },
  {
    name: 'pulsating',
    type: 'boolean',
    default: 'false',
    description: 'Enable pulsing animation effect'
  },
  {
    name: 'fadeDistance',
    type: 'number',
    default: '1.0',
    description: 'How far rays fade out from origin'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1.0',
    description: 'Color saturation level (0-1)'
  },
  {
    name: 'followMouse',
    type: 'boolean',
    default: 'false',
    description: 'Make rays rotate towards the mouse cursor'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '0.5',
    description: 'How much mouse affects rays (0-1)'
  },
  {
    name: 'noiseAmount',
    type: 'number',
    default: '0.0',
    description: 'Add noise/grain to rays (0-1)'
  },
  {
    name: 'distortion',
    type: 'number',
    default: '0.0',
    description: 'Apply wave distortion to rays'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes to apply to the container'
  }
];
</script>
