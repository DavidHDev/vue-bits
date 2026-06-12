<template>
  <TabbedLayout>
    <template #preview>
      <div
        class="relative p-0 h-[600px] overflow-hidden demo-container"
        style="background: linear-gradient(to bottom right, #04130A, #0A2A14, #04130A)"
      >
        <Ferrofluid
          :colors="colors"
          :speed="speed"
          :scale="scale"
          :turbulence="turbulence"
          :fluidity="fluidity"
          :rim-width="rimWidth"
          :sharpness="sharpness"
          :shimmer="shimmer"
          :glow="glow"
          :flow-direction="flowDirection"
          :mouse-interaction="mouseInteraction"
          :mouse-strength="mouseStrength"
          :mouse-radius="mouseRadius"
        />

        <BackgroundContent pill-text="New Background" headline="Bend the magnetic fluid" />
      </div>

      <Customize>
        <div class="flex items-center gap-4 mt-4">
          <PreviewColor title="Color 1" v-model="color1" />
          <PreviewColor title="Color 2" v-model="color2" />
          <PreviewColor title="Color 3" v-model="color3" />
        </div>

        <PreviewSwitch title="Cursor Magnet" v-model="mouseInteraction" />

        <PreviewSelect title="Flow Direction" v-model="flowDirection" :options="flowOptions" />

        <PreviewSlider title="Speed" :min="0" :max="3" :step="0.1" v-model="speed" />
        <PreviewSlider title="Scale" :min="0.3" :max="3" :step="0.1" v-model="scale" />
        <PreviewSlider title="Turbulence" :min="0" :max="2" :step="0.05" v-model="turbulence" />
        <PreviewSlider title="Fluidity" :min="0.02" :max="0.5" :step="0.01" v-model="fluidity" />
        <PreviewSlider title="Rim Width" :min="0.05" :max="0.5" :step="0.01" v-model="rimWidth" />
        <PreviewSlider title="Sharpness" :min="1" :max="6" :step="0.1" v-model="sharpness" />
        <PreviewSlider title="Shimmer" :min="0" :max="2" :step="0.05" v-model="shimmer" />
        <PreviewSlider title="Glow" :min="0.5" :max="5" :step="0.1" v-model="glow" />
        <PreviewSlider title="Cursor Strength" :min="0" :max="3" :step="0.1" v-model="mouseStrength" />
        <PreviewSlider title="Cursor Radius" :min="0.05" :max="1" :step="0.05" v-model="mouseRadius" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="ferrofluid" />
    </template>

    <template #cli>
      <CliInstallation :command="ferrofluid.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { ferrofluid } from '@/constants/code/Backgrounds/ferrofluidCode';
import Ferrofluid, { type FerrofluidFlowDirection } from '@/content/Backgrounds/Ferrofluid/Ferrofluid.vue';

const color1 = ref('#27FF64');
const color2 = ref('#7CFF67');
const color3 = ref('#A8FFB6');
const speed = ref(0.5);
const scale = ref(1.6);
const turbulence = ref(1);
const fluidity = ref(0.1);
const rimWidth = ref(0.2);
const sharpness = ref(2.5);
const shimmer = ref(1.5);
const glow = ref(2);
const flowDirection = ref<FerrofluidFlowDirection>('down');
const mouseInteraction = ref(true);
const mouseStrength = ref(1);
const mouseRadius = ref(0.35);

const colors = computed(() => [color1.value, color2.value, color3.value]);

const flowOptions = [
  { value: 'down', label: 'Down' },
  { value: 'up', label: 'Up' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const propData = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#27FF64', '#7CFF67', '#A8FFB6']",
    description:
      'Array of hex colors (up to 8) used to tint the fluid rim. Colors are spread across the surface by height; a single color makes the whole effect uniform.'
  },
  { name: 'speed', type: 'number', default: '0.5', description: 'Multiplier for how fast the fluid churns and flows.' },
  {
    name: 'scale',
    type: 'number',
    default: '1.6',
    description: 'Overall feature size. Higher values zoom in for larger, fewer blobs.'
  },
  {
    name: 'turbulence',
    type: 'number',
    default: '1',
    description: 'Amount of domain distortion. Higher values create more chaotic, swirling motion.'
  },
  {
    name: 'fluidity',
    type: 'number',
    default: '0.1',
    description: 'Smoothness of the merge between the two fluid layers. Higher = softer, more liquid blending.'
  },
  {
    name: 'rimWidth',
    type: 'number',
    default: '0.2',
    description: 'Thickness of the glowing contour lines tracing the fluid surface.'
  },
  {
    name: 'sharpness',
    type: 'number',
    default: '2.5',
    description: 'Contrast of the rim highlights. Higher values give crisper, thinner edges.'
  },
  {
    name: 'shimmer',
    type: 'number',
    default: '1.5',
    description: 'Amount of fine grainy break-up applied to the rim. 0 = smooth lines.'
  },
  { name: 'glow', type: 'number', default: '2', description: 'Overall brightness multiplier of the rim highlights.' },
  {
    name: 'flowDirection',
    type: "'up' | 'down' | 'left' | 'right'",
    default: "'down'",
    description: 'Primary direction the fluid surface drifts.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall alpha of the rendered canvas.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enables a magnetic spike that rises and glows under the cursor.'
  },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'Intensity of the magnetic cursor spike.' },
  { name: 'mouseRadius', type: 'number', default: '0.35', description: 'Falloff radius of the magnetic cursor spike.' },
  {
    name: 'mouseDampening',
    type: 'number',
    default: '0.15',
    description: 'Easing time constant (seconds) for the cursor to follow the pointer. 0 = immediate.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: 'undefined',
    description: "CSS mix-blend-mode applied to the canvas (e.g. 'screen', 'lighten')."
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'If true, stops rendering updates (freezing the current frame).'
  },
  {
    name: 'dpr',
    type: 'number',
    default: 'window.devicePixelRatio',
    description: 'Overrides device pixel ratio; lower for performance, higher for sharpness.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Additional class names for the root container.' }
];
</script>
