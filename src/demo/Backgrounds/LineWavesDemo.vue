<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <LineWaves
          :speed="speed"
          :inner-line-count="innerLineCount"
          :outer-line-count="outerLineCount"
          :warp-intensity="warpIntensity"
          :rotation="rotation"
          :edge-fade-width="edgeFadeWidth"
          :color-cycle-speed="colorCycleSpeed"
          :brightness="brightness"
          :color1="color1"
          :color2="color2"
          :color3="color3"
          :enable-mouse-interaction="enableMouseInteraction"
          :mouse-influence="mouseInfluence"
        />

        <BackgroundContent pill-text="New Background" headline="Ride the waves of your creativity!" />
      </div>

      <Customize>
        <div class="flex items-center gap-4 mt-4">
          <PreviewColor title="Color 1" v-model="color1" />
          <PreviewColor title="Color 2" v-model="color2" />
          <PreviewColor title="Color 3" v-model="color3" />
        </div>

        <PreviewSlider title="Speed" :min="0.1" :max="3" :step="0.1" v-model="speed" />
        <PreviewSlider title="Inner Line Count" :min="2" :max="40" :step="1" v-model="innerLineCount" />
        <PreviewSlider title="Outer Line Count" :min="2" :max="40" :step="1" v-model="outerLineCount" />
        <PreviewSlider title="Warp Intensity" :min="0.1" :max="3" :step="0.1" v-model="warpIntensity" />
        <PreviewSlider title="Rotation" :min="-180" :max="180" :step="1" v-model="rotation" />
        <PreviewSlider title="Edge Fade Width" :min="0.0" :max="1.0" :step="0.05" v-model="edgeFadeWidth" />
        <PreviewSlider title="Color Cycle Speed" :min="0.1" :max="5" :step="0.1" v-model="colorCycleSpeed" />
        <PreviewSlider title="Brightness" :min="0.1" :max="3" :step="0.1" v-model="brightness" />
        <PreviewSwitch title="Mouse Interaction" v-model="enableMouseInteraction" />
        <PreviewSlider
          v-if="enableMouseInteraction"
          title="Mouse Influence"
          :min="0.1"
          :max="2"
          :step="0.1"
          v-model="mouseInfluence"
        />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="lineWaves" />
    </template>

    <template #cli>
      <CliInstallation :command="lineWaves.cli" />
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
import { lineWaves } from '@/constants/code/Backgrounds/lineWavesCode';
import LineWaves from '@/content/Backgrounds/LineWaves/LineWaves.vue';
import { ref } from 'vue';

const speed = ref(0.3);
const innerLineCount = ref(32.0);
const outerLineCount = ref(36.0);
const warpIntensity = ref(1.0);
const rotation = ref(-45);
const edgeFadeWidth = ref(0.0);
const colorCycleSpeed = ref(1.0);
const brightness = ref(0.2);
const color1 = ref('#ffffff');
const color2 = ref('#ffffff');
const color3 = ref('#ffffff');
const enableMouseInteraction = ref(true);
const mouseInfluence = ref(2.0);

const propData = [
  {
    name: 'speed',
    type: 'number',
    default: '0.3',
    description: 'Overall animation speed multiplier.'
  },
  {
    name: 'innerLineCount',
    type: 'number',
    default: '32.0',
    description: 'Number of lines in the inner (center) wave region.'
  },
  {
    name: 'outerLineCount',
    type: 'number',
    default: '36.0',
    description: 'Number of lines in the outer (edge) wave region.'
  },
  {
    name: 'warpIntensity',
    type: 'number',
    default: '1.0',
    description: 'Intensity of the wave distortion effect.'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '-45',
    description: 'Rotation of the wave pattern in degrees.'
  },
  {
    name: 'edgeFadeWidth',
    type: 'number',
    default: '0.0',
    description: 'Width of the edge fade between inner and outer regions.'
  },
  {
    name: 'colorCycleSpeed',
    type: 'number',
    default: '1.0',
    description: 'Speed of color cycling animation.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '0.2',
    description: 'Overall brightness multiplier.'
  },
  {
    name: 'color1',
    type: 'string',
    default: '"#ffffff"',
    description: 'First color channel in HEX format.'
  },
  {
    name: 'color2',
    type: 'string',
    default: '"#ffffff"',
    description: 'Second color channel in HEX format.'
  },
  {
    name: 'color3',
    type: 'string',
    default: '"#ffffff"',
    description: 'Third color channel in HEX format.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enable cursor-reactive wave distortion.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '2.0',
    description: 'Strength of mouse influence on the wave pattern.'
  }
];
</script>
