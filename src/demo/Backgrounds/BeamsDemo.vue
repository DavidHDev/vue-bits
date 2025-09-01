<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container">
        <Beams
          :beam-width="beamWidth"
          :beam-height="beamHeight"
          :beam-number="beamNumber"
          :light-color="lightColor"
          :speed="speed"
          :noise-intensity="noiseIntensity"
          :scale="scale"
          :rotation="rotation"
        />
        <BackgroundContent pillText="New Background" headline="Radiant beams for creative user interfaces" />
      </div>

      <Customize>
        <PreviewColor title="Color" v-model="lightColor" />

        <PreviewSlider title="Beam Width" v-model="beamWidth" :min="0.1" :max="10" :step="0.1" />

        <PreviewSlider title="Beam Height" v-model="beamHeight" :min="1" :max="25" :step="1" />

        <PreviewSlider title="Beam Count" v-model="beamNumber" :min="1" :max="50" :step="1" />

        <PreviewSlider title="Speed" v-model="speed" :min="0.1" :max="10" :step="0.1" />

        <PreviewSlider title="Noise Intensity" v-model="noiseIntensity" :min="0" :max="5" :step="0.05" />

        <PreviewSlider title="Noise Scale" v-model="scale" :min="0.01" :max="1" :step="0.01" />

        <PreviewSlider title="Rotation" v-model="rotation" :min="0" :max="360" :step="1" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="beams" />
    </template>

    <template #cli>
      <CliInstallation :command="beams.cli" />
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
import { beams } from '@/constants/code/Backgrounds/beamsCode';
import Beams from '@/content/Backgrounds/Beams/Beams.vue';
import { ref } from 'vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';

const beamWidth = ref(3);
const beamHeight = ref(30);
const beamNumber = ref(20);
const lightColor = ref('#ffffff');
const speed = ref(2);
const noiseIntensity = ref(1.75);
const scale = ref(0.2);
const rotation = ref(30);

const propData = [
  {
    name: 'beamWidth',
    type: 'number',
    default: '2',
    description: 'Width of each beam.'
  },
  {
    name: 'beamHeight',
    type: 'number',
    default: '15',
    description: 'Height of each beam.'
  },
  {
    name: 'beamNumber',
    type: 'number',
    default: '12',
    description: 'Number of beams to display.'
  },
  {
    name: 'lightColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the directional light.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '2',
    description: 'Speed of the animation.'
  },
  {
    name: 'noiseIntensity',
    type: 'number',
    default: '1.75',
    description: 'Intensity of the noise effect overlay.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '0.2',
    description: 'Scale of the noise pattern.'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '0',
    description: 'Rotation of the entire beams system in degrees.'
  }
];
</script>
