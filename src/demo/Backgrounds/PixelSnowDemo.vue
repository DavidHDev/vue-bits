<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <PixelSnow
          :color="color"
          :flake-size="flakeSize"
          :min-flake-size="minFlakeSize"
          :pixel-resolution="pixelResolution"
          :speed="speed"
          :depth-fade="depthFade"
          :far-plane="farPlane"
          :brightness="brightness"
          :gamma="gamma"
          :density="density"
          :variant="variant"
          :direction="direction"
        />

        <BackgroundContent pill-text="New Background" headline="Oh, the weather outside is frightful!" />
      </div>

      <Customize>
        <PreviewSelect title="Variant" v-model="variant" :options="variantOptions" />
        <PreviewColor title="Color" v-model="color" />
        <PreviewSlider title="Pixel Resolution" v-model="pixelResolution" :min="50" :max="500" :step="10" />
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="5" :step="0.1" />
        <PreviewSlider title="Density" v-model="density" :min="0.1" :max="1" :step="0.05" />
        <PreviewSlider title="Flake Size" v-model="flakeSize" :min="0.001" :max="0.05" :step="0.001" />
        <PreviewSlider title="Brightness" v-model="brightness" :min="0.1" :max="3" :step="0.1" />
        <PreviewSlider title="Depth Fade" v-model="depthFade" :min="1" :max="20" :step="0.5" />
        <PreviewSlider title="Far Plane" v-model="farPlane" :min="5" :max="50" :step="1" />
        <PreviewSlider title="Direction" v-model="direction" :min="0" :max="360" :step="5" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="pixelSnow" />
    </template>

    <template #cli>
      <CliInstallation :command="pixelSnow.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { pixelSnow } from '@/constants/code/Backgrounds/pixelSnowCode';
import PixelSnow from '@/content/Backgrounds/PixelSnow/PixelSnow.vue';
import { ref } from 'vue';
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

const color = ref('#FFFFFF');
const flakeSize = ref(0.01);
const minFlakeSize = ref(1.25);
const pixelResolution = ref(200);
const speed = ref(1.25);
const depthFade = ref(8);
const farPlane = ref(20);
const brightness = ref(1);
const gamma = ref(0.4545);
const density = ref(0.3);
const variant = ref<'square' | 'round'>('square');
const direction = ref(125);

const variantOptions = [
  { label: 'Square', value: 'square' },
  { label: 'Round', value: 'round' },
  { label: 'Snowflake', value: 'snowflake' }
];

const propData = [
  {
    name: 'color',
    type: 'string',
    default: '"#ffffff"',
    description: 'Color of the snowflakes (hex or CSS color)'
  },
  {
    name: 'flakeSize',
    type: 'number',
    default: '0.01',
    description: 'Size of snowflakes in scene units'
  },
  {
    name: 'minFlakeSize',
    type: 'number',
    default: '1.25',
    description: 'Minimum flake size in pixels on screen'
  },
  {
    name: 'pixelResolution',
    type: 'number',
    default: '200',
    description: 'Pixel resolution - lower values create larger pixels for a more retro look'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1.25',
    description: 'Animation speed multiplier'
  },
  {
    name: 'depthFade',
    type: 'number',
    default: '8',
    description: 'Depth fade intensity - higher values make distant flakes fade faster'
  },
  {
    name: 'farPlane',
    type: 'number',
    default: '20',
    description: 'Far plane distance for rendering - higher values show more distant flakes'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '1',
    description: 'Overall brightness multiplier'
  },
  {
    name: 'gamma',
    type: 'number',
    default: '0.4545',
    description: 'Gamma correction value for final color output'
  },
  {
    name: 'density',
    type: 'number',
    default: '0.3',
    description: 'Probability of snowflakes appearing (0-1) - lower values = fewer flakes'
  },
  {
    name: 'variant',
    type: '"square" | "round" | "snowflake"',
    default: '"square"',
    description: 'Shape of the snowflakes - square, round, or snowflake pattern'
  },
  {
    name: 'direction',
    type: 'number',
    default: '125',
    description: 'Wind direction angle in degrees (0-360)'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS class name'
  },
  {
    name: 'style',
    type: 'object',
    default: '{}',
    description: 'Additional inline styles'
  }
];
</script>
