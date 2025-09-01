<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <Prism
          :animation-type="animationType"
          :time-scale="timeScale"
          :scale="scale"
          :noise="noise"
          :glow="glow"
          :height="height"
          :base-width="baseWidth"
          :hue-shift="hueShift"
          :color-frequency="colorFrequency"
        />

        <BackgroundContent pill-text="New Background" headline="A spectrum of colors that spark creativity" />
      </div>

      <Customize>
        <PreviewSelect title="Animation Type" v-model="animationType" :options="animationOptions" />
        <PreviewSlider title="Time Scale" :min="0.1" :max="2" :step="0.1" v-model="timeScale" />
        <PreviewSlider title="Scale" :min="1" :max="5" :step="0.1" v-model="scale" />
        <PreviewSlider title="Height" :min="1" :max="5" :step="0.1" v-model="height" />
        <PreviewSlider title="Base Width" :min="1" :max="10" :step="0.1" v-model="baseWidth" />
        <PreviewSlider title="Noise" :min="0" :max="1" :step="0.05" v-model="noise" />
        <PreviewSlider title="Glow" :min="0" :max="3" :step="0.1" v-model="glow" />
        <PreviewSlider title="Hue Shift" :min="-3.1416" :max="3.1416" :step="0.1" v-model="hueShift" />
        <PreviewSlider title="Color Frequency" :min="0.25" :max="4" :step="0.05" v-model="colorFrequency" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="prism" />
    </template>

    <template #cli>
      <CliInstallation :command="prism.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { prism } from '@/constants/code/Backgrounds/prismCode';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import Prism from '../../content/Backgrounds/Prism/Prism.vue';

const animationOptions = [
  { value: 'rotate', label: 'Rotate' },
  { value: 'hover', label: 'Hover' },
  { value: '3drotate', label: '3D Rotate' }
];

const animationType = ref<'rotate' | 'hover' | '3drotate'>('rotate');
const timeScale = ref(0.5);
const scale = ref(3.6);
const noise = ref(0);
const glow = ref(1);
const height = ref(3.5);
const baseWidth = ref(5.5);
const hueShift = ref(0);
const colorFrequency = ref(1);

const propData = [
  {
    name: 'height',
    type: 'number',
    default: '3.5',
    description: 'Apex height of the prism (world units).'
  },
  {
    name: 'baseWidth',
    type: 'number',
    default: '5.5',
    description: 'Total base width across X/Z (world units).'
  },
  {
    name: 'animationType',
    type: '"rotate" | "hover" | "3drotate"',
    default: '"rotate"',
    description: 'Animation mode: shader wobble, pointer hover tilt, or full 3D rotation.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '1',
    description: 'Glow/bleed intensity multiplier.'
  },
  {
    name: 'offset',
    type: '{ x?: number; y?: number }',
    default: '{ x: 0, y: 0 }',
    description: 'Pixel offset within the canvas (x→right, y→down).'
  },
  {
    name: 'noise',
    type: 'number',
    default: '0.5',
    description: 'Film-grain noise amount added to final color (0 disables).'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Whether the canvas has an alpha channel (transparent background).'
  },
  {
    name: 'scale',
    type: 'number',
    default: '3.6',
    description: 'Overall screen-space scale of the prism (bigger = larger).'
  },
  {
    name: 'hueShift',
    type: 'number',
    default: '0',
    description: 'Hue rotation (radians) applied to final color.'
  },
  {
    name: 'colorFrequency',
    type: 'number',
    default: '1',
    description: 'Frequency of internal sine bands controlling color variation.'
  },
  {
    name: 'hoverStrength',
    type: 'number',
    default: '2',
    description: 'Sensitivity of hover tilt (pitch/yaw amplitude).'
  },
  {
    name: 'inertia',
    type: 'number',
    default: '0.05',
    description: 'Easing factor for hover (0..1, higher = snappier).'
  },
  {
    name: 'bloom',
    type: 'number',
    default: '1',
    description: 'Extra bloom factor layered on top of glow.'
  },
  {
    name: 'suspendWhenOffscreen',
    type: 'boolean',
    default: 'false',
    description: 'Pause rendering when the element is not in the viewport.'
  },
  {
    name: 'timeScale',
    type: 'number',
    default: '0.5',
    description: 'Global time multiplier for animations (0=frozen, 1=normal).'
  }
];
</script>
