<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px]">
        <TextTrail
          :key="`${key}-${animateColor}`"
          :noise-factor="noiseFactor"
          :noise-scale="noiseScale / 10000"
          :font-weight="fontWeight"
          :alpha-persist-factor="alphaPersistFactor"
          :animate-color="animateColor"
          :text-color="animateColor ? undefined : '#ffffff'"
        />
      </div>

      <Customize>
        <PreviewSlider title="Noise Factor" v-model="noiseFactor" :min="1" :max="25" :step="1" />

        <PreviewSlider title="Noise Scale" v-model="noiseScale" :min="0" :max="100" :step="1" />

        <PreviewSlider title="Font Weight" v-model="fontWeight" :min="100" :max="900" :step="100" />

        <PreviewSlider title="Alpha Persist Factor" v-model="alphaPersistFactor" :min="0.5" :max="0.95" :step="0.01" />

        <PreviewSwitch title="Animate Color" v-model="animateColor" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="textTrail" />
    </template>

    <template #cli>
      <CliInstallation :command="textTrail.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import TextTrail from '../../content/TextAnimations/TextTrail/TextTrail.vue';
import { textTrail } from '@/constants/code/TextAnimations/textTrailCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey: key } = useForceRerender();

const noiseFactor = ref(1);
const noiseScale = ref(5);
const fontWeight = ref(900);
const alphaPersistFactor = ref(0.95);
const animateColor = ref(false);

const propData = [
  {
    name: 'text',
    type: 'string',
    default: '"Vibe"',
    description: 'The text to display with the trail effect'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: '"Figtree"',
    description: 'Font family for the text'
  },
  {
    name: 'fontWeight',
    type: 'string | number',
    default: '"900"',
    description: 'Font weight for the text'
  },
  {
    name: 'noiseFactor',
    type: 'number',
    default: '1',
    description: 'Controls the intensity of the noise effect'
  },
  {
    name: 'noiseScale',
    type: 'number',
    default: '0.0005',
    description: 'Scale factor for the noise distortion (very small values like 0.0005)'
  },
  {
    name: 'rgbPersistFactor',
    type: 'number',
    default: '0.98',
    description: 'RGB persistence factor for the trail effect (0-1)'
  },
  {
    name: 'alphaPersistFactor',
    type: 'number',
    default: '0.95',
    description: 'Alpha persistence factor for the trail effect (0-1)'
  },
  {
    name: 'animateColor',
    type: 'boolean',
    default: 'false',
    description: 'Whether to animate color changes over time'
  },
  {
    name: 'startColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'Starting color for the text (hex format)'
  },
  {
    name: 'textColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'Static color for the text (hex format)'
  },
  {
    name: 'backgroundColor',
    type: 'number | string',
    default: '0x151515',
    description: 'Background color (hex number or string)'
  },
  {
    name: 'colorCycleInterval',
    type: 'number',
    default: '3000',
    description: 'Interval in milliseconds for color cycling when animateColor is true'
  },
  {
    name: 'supersample',
    type: 'number',
    default: '2',
    description: 'Supersampling factor for text quality (higher = better quality)'
  }
];
</script>
