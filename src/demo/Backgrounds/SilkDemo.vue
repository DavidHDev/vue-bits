<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative h-[600px] overflow-hidden demo-container">
        <Silk
          :speed="speed"
          :scale="scale"
          :color="color"
          :noise-intensity="noiseIntensity"
          :rotation="rotation"
          class="w-full h-full"
        />
        <BackgroundContent pillText="New Background" headline="Silk touch is a good enhancement, Steve!" />
      </div>

      <Customize>
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="10" :step="0.1" />

        <PreviewSlider title="Scale" v-model="scale" :min="0.1" :max="3" :step="0.1" />

        <PreviewSlider title="Noise Intensity" v-model="noiseIntensity" :min="0" :max="3" :step="0.1" />

        <PreviewSlider title="Rotation" v-model="rotation" :min="0" :max="6.28" :step="0.1" />

        <PreviewColor title="Color" v-model="color" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="silk" />
    </template>

    <template #cli>
      <CliInstallation :command="silk.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import { silk } from '@/constants/code/Backgrounds/silkCode';
import Silk from '@/content/Backgrounds/Silk/Silk.vue';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';

const speed = ref(5);
const scale = ref(1);
const color = ref('#7B7481');
const noiseIntensity = ref(1.5);
const rotation = ref(0);

const propData = [
  { name: 'speed', type: 'number', default: '5', description: 'Animation speed multiplier' },
  { name: 'scale', type: 'number', default: '1', description: 'Scale factor for the pattern' },
  { name: 'color', type: 'string', default: "'#7B7481'", description: 'Base color of the silk pattern' },
  { name: 'noiseIntensity', type: 'number', default: '1.5', description: 'Intensity of the noise effect' },
  { name: 'rotation', type: 'number', default: '0', description: 'Rotation angle in radians' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS class names for styling.' },
  { name: 'style', type: 'CSSProperties', default: '{}', description: 'Inline styles for the component.' }
];
</script>
