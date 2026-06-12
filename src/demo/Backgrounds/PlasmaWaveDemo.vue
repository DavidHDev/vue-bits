<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container relative p-0">
        <PlasmaWave
          :colors="[color1, color2]"
          :speed1="speed1"
          :speed2="speed2"
          :focal-length="focalLength"
          :bend1="bend1"
          :bend2="bend2"
          :dir2="dir2"
          :rotation-deg="rotationDeg"
        />

        <BackgroundContent pill-text="New Background" headline="Raymarched plasma waves powered by OGL" />
      </div>

      <Customize>
        <div class="flex gap-4">
          <PreviewColor title="Color 1" v-model="color1" />
          <PreviewColor title="Color 2" v-model="color2" />
        </div>

        <PreviewSlider title="Speed 1" v-model="speed1" :min="0" :max="0.2" :step="0.005" />
        <PreviewSlider title="Speed 2" v-model="speed2" :min="0" :max="0.2" :step="0.005" />
        <PreviewSlider title="Focal Length" v-model="focalLength" :min="0.1" :max="2" :step="0.05" />
        <PreviewSlider title="Bend 1" v-model="bend1" :min="0" :max="3" :step="0.1" />
        <PreviewSlider title="Bend 2" v-model="bend2" :min="0" :max="3" :step="0.1" />
        <PreviewSlider title="Direction 2" v-model="dir2" :min="-1" :max="1" :step="0.1" />
        <PreviewSlider title="Rotation" v-model="rotationDeg" :min="0" :max="360" :step="1" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="plasmaWave" />
    </template>

    <template #cli>
      <CliInstallation :command="plasmaWave.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import PropTable from '@/components/common/PropTable.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import PlasmaWave from '../../content/Backgrounds/PlasmaWave/PlasmaWave.vue';
import { plasmaWave } from '@/constants/code/Backgrounds/plasmaWaveCode';

const color1 = ref('#27FF64');
const color2 = ref('#7CFF67');
const speed1 = ref(0.05);
const speed2 = ref(0.05);
const focalLength = ref(0.8);
const bend1 = ref(1);
const bend2 = ref(0.5);
const dir2 = ref(1.0);
const rotationDeg = ref(0);

const propData = [
  {
    name: 'colors',
    type: '[string, string]',
    default: '["#A855F7", "#06B6D4"]',
    description: 'Array of two hex colors — one for each plasma wave band.'
  },
  {
    name: 'speed1',
    type: 'number',
    default: '0.05',
    description: 'Speed of the first plasma wave.'
  },
  {
    name: 'speed2',
    type: 'number',
    default: '0.05',
    description: 'Speed of the second plasma wave.'
  },
  {
    name: 'dir2',
    type: 'number',
    default: '1.0',
    description: 'Direction multiplier for the second wave. Use -1 to reverse.'
  },
  {
    name: 'focalLength',
    type: 'number',
    default: '0.8',
    description: 'Focal length of the camera projection.'
  },
  {
    name: 'bend1',
    type: 'number',
    default: '1',
    description: 'Bend intensity of the first wave.'
  },
  {
    name: 'bend2',
    type: 'number',
    default: '0.5',
    description: 'Bend intensity of the second wave.'
  },
  {
    name: 'rotationDeg',
    type: 'number',
    default: '0',
    description: 'Rotation angle of the scene in degrees.'
  },
  {
    name: 'xOffset',
    type: 'number',
    default: '0',
    description: 'Horizontal offset of the viewport.'
  },
  {
    name: 'yOffset',
    type: 'number',
    default: '0',
    description: 'Vertical offset of the viewport.'
  }
];
</script>
