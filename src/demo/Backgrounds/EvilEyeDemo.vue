<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <EvilEye
          :eye-color="eyeColor"
          :intensity="intensity"
          :pupil-size="pupilSize"
          :iris-width="irisWidth"
          :glow-intensity="glowIntensity"
          :scale="scale"
          :noise-scale="noiseScale"
          :pupil-follow="pupilFollow"
          :flame-speed="flameSpeed"
          :background-color="backgroundColor"
        />
      </div>

      <Customize>
        <div class="flex items-center gap-4 mt-4">
          <PreviewColor title="Eye Color" v-model="eyeColor" />
          <PreviewColor title="Background" v-model="backgroundColor" />
        </div>

        <PreviewSlider title="Intensity" :min="0.5" :max="5" :step="0.1" v-model="intensity" />
        <PreviewSlider title="Pupil Size" :min="0.1" :max="2" :step="0.05" v-model="pupilSize" />
        <PreviewSlider title="Iris Width" :min="0.1" :max="0.8" :step="0.05" v-model="irisWidth" />
        <PreviewSlider title="Glow Intensity" :min="0" :max="1.5" :step="0.05" v-model="glowIntensity" />
        <PreviewSlider title="Scale" :min="0.2" :max="3" :step="0.1" v-model="scale" />
        <PreviewSlider title="Noise Scale" :min="0.1" :max="3" :step="0.1" v-model="noiseScale" />
        <PreviewSlider title="Pupil Follow" :min="0" :max="2" :step="0.1" v-model="pupilFollow" />
        <PreviewSlider title="Flame Speed" :min="0.1" :max="5" :step="0.1" v-model="flameSpeed" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="evilEye" />
    </template>

    <template #cli>
      <CliInstallation :command="evilEye.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { evilEye } from '@/constants/code/Backgrounds/evilEyeCode';
import EvilEye from '@/content/Backgrounds/EvilEye/EvilEye.vue';
import { ref } from 'vue';

const eyeColor = ref('#FF6F37');
const intensity = ref(1.5);
const pupilSize = ref(0.6);
const irisWidth = ref(0.25);
const glowIntensity = ref(0.35);
const scale = ref(0.8);
const noiseScale = ref(1.0);
const pupilFollow = ref(1.0);
const flameSpeed = ref(1.0);
const backgroundColor = ref('#060010');

const propData = [
  {
    name: 'eyeColor',
    type: 'string',
    default: '"#FF6F37"',
    description: 'Primary eye color in HEX format.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '1.5',
    description: 'Brightness / HDR intensity of the eye color.'
  },
  {
    name: 'pupilSize',
    type: 'number',
    default: '0.6',
    description: 'Size and darkness of the pupil slit.'
  },
  {
    name: 'irisWidth',
    type: 'number',
    default: '0.25',
    description: 'Width of the main iris ring.'
  },
  {
    name: 'glowIntensity',
    type: 'number',
    default: '0.35',
    description: 'Strength of the outer eye glow.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '0.8',
    description: 'Zoom level of the eye. Values > 1 zoom in, < 1 zoom out.'
  },
  {
    name: 'noiseScale',
    type: 'number',
    default: '1.0',
    description: 'Scale of the fire/noise texture sampling.'
  },
  {
    name: 'pupilFollow',
    type: 'number',
    default: '1.0',
    description: 'Intensity of pupil cursor tracking. 0 disables it.'
  },
  {
    name: 'flameSpeed',
    type: 'number',
    default: '1.0',
    description: 'Independent flame flicker animation speed.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '"#000000"',
    description: 'Background color in HEX format.'
  }
];
</script>
