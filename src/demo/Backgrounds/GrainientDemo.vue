<template>
  <h1 class="sub-category">Grainient</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="grainient.usage"
    :source="grainientSource"
    component-name="Grainient"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <Grainient
          :key="rerenderKey"
          :color1="color1"
          :color2="color2"
          :color3="color3"
          :time-speed="timeSpeed"
          :color-balance="colorBalance"
          :warp-strength="warpStrength"
          :warp-frequency="warpFrequency"
          :warp-speed="warpSpeed"
          :warp-amplitude="warpAmplitude"
          :blend-angle="blendAngle"
          :blend-softness="blendSoftness"
          :rotation-amount="rotationAmount"
          :noise-scale="noiseScale"
          :grain-amount="grainAmount"
          :grain-scale="grainScale"
          :grain-animated="grainAnimated"
          :contrast="contrast"
          :gamma="gamma"
          :saturation="saturation"
          :centerX="centerX"
          :centerY="centerY"
          :zoom="zoom"
        />
        <BackgroundContent pill-text="New Background" headline="Grainy gradient colors with soft motion." />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewColorPicker title="Color 3" v-model="color3" />
        <PreviewSlider title="Time Speed" :min="0" :max="5" :step="0.05" v-model="timeSpeed" />
        <PreviewSlider title="Color Balance" :min="-1" :max="1" :step="0.01" v-model="colorBalance" />
        <PreviewSlider title="Warp Strength" :min="0" :max="4" :step="0.05" v-model="warpStrength" />
        <PreviewSlider title="Warp Frequency" :min="0" :max="12" :step="0.1" v-model="warpFrequency" />
        <PreviewSlider title="Warp Speed" :min="0" :max="6" :step="0.1" v-model="warpSpeed" />
        <PreviewSlider title="Warp Amplitude" :min="5" :max="80" :step="1" v-model="warpAmplitude" />
        <PreviewSlider title="Blend Angle" :min="-180" :max="180" :step="1" v-model="blendAngle" />
        <PreviewSlider title="Blend Softness" :min="0" :max="1" :step="0.01" v-model="blendSoftness" />
        <PreviewSlider title="Rotation Amount" :min="0" :max="1440" :step="10" v-model="rotationAmount" />
        <PreviewSlider title="Noise Scale" :min="0" :max="4" :step="0.05" v-model="noiseScale" />
        <PreviewSlider title="Grain Amount" :min="0" :max="0.4" :step="0.01" v-model="grainAmount" />
        <PreviewSlider title="Grain Scale" :min="0.2" :max="8" :step="0.1" v-model="grainScale" />
        <PreviewSwitch title="Grain Animated" v-model="grainAnimated" />
        <PreviewSlider title="Contrast" :min="0" :max="2.5" :step="0.05" v-model="contrast" />
        <PreviewSlider title="Gamma" :min="0.4" :max="2.5" :step="0.05" v-model="gamma" />
        <PreviewSlider title="Saturation" :min="0" :max="2.5" :step="0.05" v-model="saturation" />
        <PreviewSlider title="Center Offset X" :min="-1" :max="1" :step="0.01" v-model="centerX" />
        <PreviewSlider title="Center Offset Y" :min="-1" :max="1" :step="0.01" v-model="centerY" />
        <PreviewSlider title="Zoom" :min="0.3" :max="3" :step="0.05" v-model="zoom" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="grainient" :usage="grainient.usage!" :source="grainientSource" />
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
import { grainient } from '@/constants/code/Backgrounds/grainientCode';
import Grainient from '@/content/Backgrounds/Grainient/Grainient.vue';
import grainientSource from '@/content/Backgrounds/Grainient/Grainient.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  color1: '#48FF28',
  color2: '#2c3d32',
  color3: '#65a865',
  timeSpeed: 0.25,
  colorBalance: 0.0,
  warpStrength: 1.0,
  warpFrequency: 5.0,
  warpSpeed: 2.0,
  warpAmplitude: 50.0,
  blendAngle: 0.0,
  blendSoftness: 0.05,
  rotationAmount: 500.0,
  noiseScale: 2.0,
  grainAmount: 0.1,
  grainScale: 2.0,
  grainAnimated: false,
  contrast: 1.5,
  gamma: 1.0,
  saturation: 1.0,
  centerX: 0.0,
  centerY: 0.0,
  zoom: 0.9
};

const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const color3 = ref(DEFAULTS.color3);
const timeSpeed = ref(DEFAULTS.timeSpeed);
const colorBalance = ref(DEFAULTS.colorBalance);
const warpStrength = ref(DEFAULTS.warpStrength);
const warpFrequency = ref(DEFAULTS.warpFrequency);
const warpSpeed = ref(DEFAULTS.warpSpeed);
const warpAmplitude = ref(DEFAULTS.warpAmplitude);
const blendAngle = ref(DEFAULTS.blendAngle);
const blendSoftness = ref(DEFAULTS.blendSoftness);
const rotationAmount = ref(DEFAULTS.rotationAmount);
const noiseScale = ref(DEFAULTS.noiseScale);
const grainAmount = ref(DEFAULTS.grainAmount);
const grainScale = ref(DEFAULTS.grainScale);
const grainAnimated = ref(DEFAULTS.grainAnimated);
const contrast = ref(DEFAULTS.contrast);
const gamma = ref(DEFAULTS.gamma);
const saturation = ref(DEFAULTS.saturation);
const centerX = ref(DEFAULTS.centerX);
const centerY = ref(DEFAULTS.centerY);
const zoom = ref(DEFAULTS.zoom);

const hasChanges = computed(
  () =>
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    color3.value !== DEFAULTS.color3 ||
    timeSpeed.value !== DEFAULTS.timeSpeed ||
    colorBalance.value !== DEFAULTS.colorBalance ||
    warpStrength.value !== DEFAULTS.warpStrength ||
    warpFrequency.value !== DEFAULTS.warpFrequency ||
    warpSpeed.value !== DEFAULTS.warpSpeed ||
    warpAmplitude.value !== DEFAULTS.warpAmplitude ||
    blendAngle.value !== DEFAULTS.blendAngle ||
    blendSoftness.value !== DEFAULTS.blendSoftness ||
    rotationAmount.value !== DEFAULTS.rotationAmount ||
    noiseScale.value !== DEFAULTS.noiseScale ||
    grainAmount.value !== DEFAULTS.grainAmount ||
    grainScale.value !== DEFAULTS.grainScale ||
    grainAnimated.value !== DEFAULTS.grainAnimated ||
    contrast.value !== DEFAULTS.contrast ||
    gamma.value !== DEFAULTS.gamma ||
    saturation.value !== DEFAULTS.saturation ||
    centerX.value !== DEFAULTS.centerX ||
    centerY.value !== DEFAULTS.centerY ||
    zoom.value !== DEFAULTS.zoom
);

function reset() {
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  color3.value = DEFAULTS.color3;
  timeSpeed.value = DEFAULTS.timeSpeed;
  colorBalance.value = DEFAULTS.colorBalance;
  warpStrength.value = DEFAULTS.warpStrength;
  warpFrequency.value = DEFAULTS.warpFrequency;
  warpSpeed.value = DEFAULTS.warpSpeed;
  warpAmplitude.value = DEFAULTS.warpAmplitude;
  blendAngle.value = DEFAULTS.blendAngle;
  blendSoftness.value = DEFAULTS.blendSoftness;
  rotationAmount.value = DEFAULTS.rotationAmount;
  noiseScale.value = DEFAULTS.noiseScale;
  grainAmount.value = DEFAULTS.grainAmount;
  grainScale.value = DEFAULTS.grainScale;
  grainAnimated.value = DEFAULTS.grainAnimated;
  contrast.value = DEFAULTS.contrast;
  gamma.value = DEFAULTS.gamma;
  saturation.value = DEFAULTS.saturation;
  centerX.value = DEFAULTS.centerX;
  centerY.value = DEFAULTS.centerY;
  zoom.value = DEFAULTS.zoom;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'color1',
    type: 'string',
    default: "'#48FF28'",
    description: 'Primary light color used in the gradient blend.'
  },
  {
    name: 'color2',
    type: 'string',
    default: "'#2c3d32'",
    description: 'Secondary accent color used in the gradient blend.'
  },
  {
    name: 'color3',
    type: 'string',
    default: "'#65a865'",
    description: 'Deep base color used in the gradient blend.'
  },
  {
    name: 'timeSpeed',
    type: 'number',
    default: '0.25',
    description: 'Animation speed multiplier for the gradient motion.'
  },
  {
    name: 'colorBalance',
    type: 'number',
    default: '0.0',
    description: 'Shifts the palette balance toward dark or lighter tones.'
  },
  {
    name: 'warpStrength',
    type: 'number',
    default: '1.0',
    description: 'Strength of the wave warp distortion (0 = none).'
  },
  {
    name: 'warpFrequency',
    type: 'number',
    default: '5.0',
    description: 'Frequency of the wave warp.'
  },
  {
    name: 'warpSpeed',
    type: 'number',
    default: '2.0',
    description: 'Speed multiplier for the warp animation.'
  },
  {
    name: 'warpAmplitude',
    type: 'number',
    default: '50.0',
    description: 'Base amplitude for the warp distortion.'
  },
  {
    name: 'blendAngle',
    type: 'number',
    default: '0.0',
    description: 'Rotation angle for the color blend axis (degrees).'
  },
  {
    name: 'blendSoftness',
    type: 'number',
    default: '0.05',
    description: 'Softens the blend edges between color layers.'
  },
  {
    name: 'rotationAmount',
    type: 'number',
    default: '500.0',
    description: 'Rotation amount driven by noise.'
  },
  {
    name: 'noiseScale',
    type: 'number',
    default: '2.0',
    description: 'Scales the noise frequency that drives rotation.'
  },
  {
    name: 'grainAmount',
    type: 'number',
    default: '0.1',
    description: 'Amount of film grain applied to the gradient.'
  },
  {
    name: 'grainScale',
    type: 'number',
    default: '2.0',
    description: 'Scale of the grain pattern.'
  },
  {
    name: 'grainAnimated',
    type: 'boolean',
    default: 'false',
    description: 'Animate grain over time.'
  },
  {
    name: 'contrast',
    type: 'number',
    default: '1.5',
    description: 'Overall contrast applied to the final color.'
  },
  {
    name: 'gamma',
    type: 'number',
    default: '1.0',
    description: 'Gamma correction for the final color.'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1.0',
    description: 'Saturation amount for the final color.'
  },
  {
    name: 'centerX',
    type: 'number',
    default: '0.0',
    description: 'Horizontal offset of the gradient center.'
  },
  {
    name: 'centerY',
    type: 'number',
    default: '0.0',
    description: 'Vertical offset of the gradient center.'
  },
  {
    name: 'zoom',
    type: 'number',
    default: '0.9',
    description: 'Zoom level for the gradient field.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS classes applied to the container.'
  }
];
</script>
