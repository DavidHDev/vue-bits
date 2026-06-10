<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <SideRays
          :speed="speed"
          :ray-color1="rayColor1"
          :ray-color2="rayColor2"
          :intensity="intensity"
          :spread="spread"
          :origin="origin"
          :tilt="tilt"
          :saturation="saturation"
          :blend="blend"
          :falloff="falloff"
          :opacity="opacity"
        />

        <BackgroundContent pill-text="New Background" headline="Light cascading from the corner" />
      </div>

      <Customize>
        <div class="flex items-center gap-4 mt-4">
          <PreviewColor title="Ray Color 1" v-model="rayColor1" />
          <PreviewColor title="Ray Color 2" v-model="rayColor2" />
        </div>

        <PreviewSelect title="Origin" v-model="origin" :options="originOptions" />

        <PreviewSlider title="Speed" :min="0.1" :max="5" :step="0.1" v-model="speed" />
        <PreviewSlider title="Intensity" :min="0.1" :max="3" :step="0.1" v-model="intensity" />
        <PreviewSlider title="Spread" :min="0.1" :max="3" :step="0.1" v-model="spread" />
        <PreviewSlider title="Tilt" :min="-60" :max="60" :step="1" v-model="tilt" />
        <PreviewSlider title="Saturation" :min="0" :max="2" :step="0.05" v-model="saturation" />
        <PreviewSlider title="Blend" :min="0" :max="1" :step="0.01" v-model="blend" />
        <PreviewSlider title="Falloff" :min="0.5" :max="4" :step="0.1" v-model="falloff" />
        <PreviewSlider title="Opacity" :min="0" :max="1" :step="0.05" v-model="opacity" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="sideRays" />
    </template>

    <template #cli>
      <CliInstallation :command="sideRays.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { sideRays } from '@/constants/code/Backgrounds/sideRaysCode';
import SideRays, { type SideRaysOrigin } from '@/content/Backgrounds/SideRays/SideRays.vue';

const speed = ref(2.5);
const rayColor1 = ref('#27FF64');
const rayColor2 = ref('#A8FFB6');
const intensity = ref(2);
const spread = ref(2);
const origin = ref<SideRaysOrigin>('top-right');
const tilt = ref(0);
const saturation = ref(1.5);
const blend = ref(0.75);
const falloff = ref(1.6);
const opacity = ref(1.0);

const originOptions = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' }
];

const propData = [
  { name: 'speed', type: 'number', default: '2.5', description: 'Animation speed of the rays' },
  { name: 'rayColor1', type: 'string', default: '"#27FF64"', description: 'Color of the first ray layer in hex format' },
  { name: 'rayColor2', type: 'string', default: '"#A8FFB6"', description: 'Color of the second ray layer in hex format' },
  { name: 'intensity', type: 'number', default: '2', description: 'Overall brightness of the rays' },
  {
    name: 'spread',
    type: 'number',
    default: '2',
    description: 'Angular width of the ray fan — higher values create a wider spread between the two ray layers'
  },
  {
    name: 'origin',
    type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"',
    default: '"top-right"',
    description: 'Corner of the canvas from which the rays emerge'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Rotation of the ray fan in degrees — positive values tilt clockwise'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1.5',
    description: 'Color saturation of the rays — 0 renders in grayscale, values above 1 boost color'
  },
  {
    name: 'blend',
    type: 'number',
    default: '0.75',
    description: 'Balance between the two ray layers — 0 is all ray 1, 1 is all ray 2'
  },
  {
    name: 'falloff',
    type: 'number',
    default: '2.0',
    description: 'How steeply brightness diminishes with distance from the source — higher = tighter glow'
  },
  { name: 'opacity', type: 'number', default: '1.0', description: 'Overall opacity of the effect' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS classes to apply to the container' }
];
</script>
