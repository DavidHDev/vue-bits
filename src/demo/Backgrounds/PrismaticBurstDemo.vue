<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <PrismaticBurst
          :animation-type="animationType"
          :intensity="intensity"
          :speed="speed"
          :distort="distort"
          :hover-dampness="hoverDampness"
          :ray-count="rayCount || undefined"
          v-bind="userColors.length ? { colors: userColors } : {}"
        />
        <BackgroundContent pill-text="New Background" headline="A burst of dancing colors, beautifully unleashed" />
      </div>

      <Customize>
        <div class="flex gap-4">
          <PreviewColor title="Color 1" v-model="color0" />
          <PreviewColor title="Color 2" v-model="color1" />
          <PreviewColor title="Color 3" v-model="color2" />
        </div>

        <PreviewSelect title="Animation Type" v-model="animationType" :options="animationOptions" />
        <PreviewSlider :min="0.1" :max="5" :step="0.1" v-model="intensity" title="Intensity" />
        <PreviewSlider :min="0" :max="2" :step="0.5" v-model="speed" title="Speed" />
        <PreviewSlider :min="0" :max="10" :step="0.1" v-model="distort" title="Distort" />
        <PreviewSlider :min="0" :max="64" :step="1" v-model="rayCount" title="Ray Count" />
        <PreviewSlider
          v-if="animationType === 'hover'"
          :min="0"
          :max="1"
          :step="0.01"
          v-model="hoverDampness"
          title="Hover Dampness"
        />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="prismaticBurst" />
    </template>

    <template #cli>
      <CliInstallation :command="prismaticBurst.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { prismaticBurst } from '@/constants/code/Backgrounds/prismaticBurstCode';
import { computed, ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PrismaticBurst from '../../content/Backgrounds/PrismaticBurst/PrismaticBurst.vue';

const animationOptions = [
  { value: 'rotate', label: 'Rotate' },
  { value: 'rotate3d', label: 'Rotate 3D' },
  { value: 'hover', label: 'Hover' }
];

const animationType = ref<'rotate' | 'rotate3d' | 'hover'>('rotate3d');
const intensity = ref(2);
const speed = ref(0.5);
const distort = ref(0);
const hoverDampness = ref(0.25);
const rayCount = ref(0);
const color0 = ref('');
const color1 = ref('');
const color2 = ref('');

const userColors = computed(() => [color0.value, color1.value, color2.value].filter(Boolean) as string[]);

const propData = [
  {
    name: 'intensity',
    type: 'number',
    default: '2',
    description: 'Overall brightness multiplier applied after accumulation.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Global time multiplier controlling ray motion & distortion.'
  },
  {
    name: 'animationType',
    type: '"rotate" | "rotate3d" | "hover"',
    default: '"rotate3d"',
    description: 'Core motion style: planar rotation, full 3D rotation, or pointer hover orbit'
  },
  {
    name: 'colors',
    type: 'string[]',
    default: '[]',
    description: 'Optional array of hex colors used as a gradient (otherwise spectral)'
  },
  {
    name: 'distort',
    type: 'number',
    default: '0',
    description: 'Amount of bend/distortion applied to marching space (adds organic wobble)'
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freeze time progression when true (animation stops)'
  },
  {
    name: 'offset',
    type: '{ x?: number|string; y?: number|string }',
    default: '{ x: 0, y: 0 }',
    description: 'Pixel (or CSS length) offset of focal origin from center'
  },
  {
    name: 'hoverDampness',
    type: 'number',
    default: '0',
    description: "Smoothing factor (0-1) for pointer tracking when animationType='hover'"
  },
  {
    name: 'rayCount',
    type: 'number',
    default: 'undefined',
    description: 'If > 0 applies an angular comb filter to produce discrete ray spokes'
  },
  {
    name: 'mixBlendMode',
    type: "CSSProperties['mixBlendMode'] | 'none'",
    default: '"lighten"',
    description: "Canvas CSS mix-blend-mode (e.g. lighten, screen) or 'none' for normal"
  }
];
</script>

<style scoped>
.demo-container {
  padding: 0;
}
</style>
