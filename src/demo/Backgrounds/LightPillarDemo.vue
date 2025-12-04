<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <LightPillar
          :top-color="topColor"
          :bottom-color="bottomColor"
          :intensity="intensity"
          :rotation-speed="rotationSpeed"
          :interactive="interactive"
          :glow-amount="glowAmount"
          :pillar-width="pillarWidth"
          :pillar-height="pillarHeight"
          :noise-intensity="noiseIntensity"
          :pillar-rotation="pillarRotation"
          :mix-blend-mode="mixBlendMode"
        />

        <BackgroundContent pill-text="New Background" headline="Ethereal light pillar for your hero sections." />
      </div>

      <Customize>
        <PreviewColor v-model="topColor" title="Top Color" />
        <PreviewColor v-model="bottomColor" title="Bottom Color" class="mt-4" />
        <PreviewSlider :min="0.1" :max="3" :step="0.1" v-model="intensity" title="Intensity" />
        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="rotationSpeed" title="Rotation Speed" />
        <PreviewSlider :min="0.001" :max="0.02" :step="0.001" v-model="glowAmount" title="Glow Amount" />
        <PreviewSlider :min="1" :max="10" :step="0.1" v-model="pillarWidth" title="Pillar Width" />
        <PreviewSlider :min="0.1" :max="2" :step="0.1" v-model="pillarHeight" title="Pillar Height" />
        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="noiseIntensity" title="Noise Intensity" />
        <PreviewSlider :min="0" :max="360" :step="1" v-model="pillarRotation" title="Pillar Rotation" />
        <PreviewSwitch title="Interactive Rotation" v-model="interactive" />
        <PreviewSelect :options="blendModeOptions" v-model="mixBlendMode" title="Mix Blend Mode" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="lightPillar" />
    </template>

    <template #cli>
      <CliInstallation :command="lightPillar.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { lightPillar } from '@/constants/code/Backgrounds/lightPillarCode';
import { ref, type CSSProperties } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import LightPillar from '../../content/Backgrounds/LightPillar/LightPillar.vue';

const topColor = ref('#48FF28');
const bottomColor = ref('#9EF19E');
const intensity = ref(1.0);
const rotationSpeed = ref(0.3);
const interactive = ref(false);
const glowAmount = ref(0.002);
const pillarWidth = ref(3.0);
const pillarHeight = ref(0.4);
const noiseIntensity = ref(0.5);
const pillarRotation = ref(25);
const mixBlendMode = ref<CSSProperties['mixBlendMode']>('screen');

const blendModeOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'screen', label: 'Screen' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'luminosity', label: 'Luminosity' }
];

const propData = [
  {
    name: 'topColor',
    type: 'string',
    default: "'#48FF28'",
    description: 'Hex color string for the top gradient color of the light pillar.'
  },
  {
    name: 'bottomColor',
    type: 'string',
    default: "'#9EF19E'",
    description: 'Hex color string for the bottom gradient color of the light pillar.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '1.0',
    description: 'Controls the overall brightness and intensity of the effect.'
  },
  {
    name: 'rotationSpeed',
    type: 'number',
    default: '0.3',
    description: 'Speed multiplier for the pillar rotation animation.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'false',
    description: 'Enable mouse interaction to control the pillar rotation.'
  },
  {
    name: 'glowAmount',
    type: 'number',
    default: '0.005',
    description: 'Controls the glow intensity and spread of the light effect.'
  },
  {
    name: 'pillarWidth',
    type: 'number',
    default: '3.0',
    description: 'Width/radius of the light pillar.'
  },
  {
    name: 'pillarHeight',
    type: 'number',
    default: '0.4',
    description: 'Height scaling factor for the pillar distortion.'
  },
  {
    name: 'noiseIntensity',
    type: 'number',
    default: '0.5',
    description: 'Intensity of the film grain noise postprocessing effect.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS class names to apply to the container element.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: "'screen'",
    description: 'CSS mix-blend-mode property to control how the component blends with its background.'
  },
  {
    name: 'pillarRotation',
    type: 'number',
    default: '0',
    description: 'Rotation angle of the pillar in degrees (0-360).'
  }
];
</script>
