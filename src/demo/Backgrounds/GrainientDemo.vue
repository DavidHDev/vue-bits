<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
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

      <Customize>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
          <PreviewColor title="Color 1" v-model="color1" />
          <PreviewColor title="Color 2" v-model="color2" />
          <PreviewColor title="Color 3" v-model="color3" />
        </div>

        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="grainient" />
    </template>

    <template #cli>
      <CliInstallation :command="grainient.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { grainient } from '@/constants/code/Backgrounds/grainientCode';
import Grainient from '@/content/Backgrounds/Grainient/Grainient.vue';
import { ref } from 'vue';

const { rerenderKey } = useForceRerender();

const color1 = ref('#5227FF');
const color2 = ref('#FF9FFC');
const color3 = ref('#B19EEF');
const timeSpeed = ref(0.25);
const colorBalance = ref(0.0);
const warpStrength = ref(1.0);
const warpFrequency = ref(5.0);
const warpSpeed = ref(2.0);
const warpAmplitude = ref(50.0);
const blendAngle = ref(0.0);
const blendSoftness = ref(0.05);
const rotationAmount = ref(500.0);
const noiseScale = ref(2.0);
const grainAmount = ref(0.1);
const grainScale = ref(2.0);
const grainAnimated = ref(false);
const contrast = ref(1.5);
const gamma = ref(1.0);
const saturation = ref(1.0);
const centerX = ref(0.0);
const centerY = ref(0.0);
const zoom = ref(0.9);

const propData = [
  {
    name: 'color1',
    type: 'string',
    default: "'#48FF28'",
    description: 'Primary light color used in the gradient blend.'
  },
  {
    name: 'color2',
    type: 'string',
    default: "'#A2FFC6'",
    description: 'Secondary accent color used in the gradient blend.'
  },
  {
    name: 'color3',
    type: 'string',
    default: "'#9EF19E'",
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
