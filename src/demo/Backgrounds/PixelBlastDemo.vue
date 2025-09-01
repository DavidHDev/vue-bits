<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <PixelBlast
          :variant="variant"
          :pixel-size="pixelSize"
          :color="color"
          :pattern-scale="patternScale"
          :pattern-density="patternDensity"
          :pixel-size-jitter="pixelSizeJitter"
          :enable-ripples="enableRipples"
          :liquid="liquid"
          :speed="speed"
          :edge-fade="edgeFade"
        />

        <BackgroundContent pill-text="New Background" headline="It's dangerous to go alone! Take this." />
      </div>

      <Customize>
        <PreviewColor title="Color" v-model="color" />
        <PreviewSelect title="Variant" v-model="variant" :options="variantOptions" />
        <PreviewSlider title="Pixel Size" v-model="pixelSize" :min="1" :max="5" :step="1" />
        <PreviewSlider title="Pattern Scale" v-model="patternScale" :min="0.25" :max="8" :step="0.25" />
        <PreviewSlider title="Pattern Density" v-model="patternDensity" :min="0" :max="2" :step="0.05" />
        <PreviewSlider title="Pixel Jitter" v-model="pixelSizeJitter" :min="0" :max="2" :step="0.05" />
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="3" :step="0.05" />
        <PreviewSlider title="Edge Fade" v-model="edgeFade" :min="0" :max="0.5" :step="0.01" />
        <PreviewSwitch title="Ripples" v-model="enableRipples" />
        <PreviewSwitch title="Liquid" v-model="liquid" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three', 'postprocessing']" />
    </template>

    <template #code>
      <CodeExample :code-object="pixelBlast" />
    </template>

    <template #cli>
      <CliInstallation :command="pixelBlast.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { pixelBlast } from '@/constants/code/Backgrounds/pixelBlastCode';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PixelBlast, { type PixelBlastVariant } from '../../content/Backgrounds/PixelBlast/PixelBlast.vue';

const variantOptions = [
  { label: 'Square', value: 'square' },
  { label: 'Circle', value: 'circle' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Diamond', value: 'diamond' }
];

const variant = ref<PixelBlastVariant>('square');
const pixelSize = ref(4);
const patternScale = ref(2);
const patternDensity = ref(1);
const pixelSizeJitter = ref(0);
const enableRipples = ref(true);
const liquid = ref(false);
const speed = ref(0.5);
const edgeFade = ref(0.25);
const color = ref('#A7EF9E');

const propData = [
  {
    name: 'variant',
    type: "'square'|'circle'|'triangle'|'diamond'",
    default: "'square'",
    description: 'Pixel shape variant.'
  },
  {
    name: 'pixelSize',
    type: 'number',
    default: '4',
    description: 'Base pixel size (auto scaled for DPI).'
  },
  {
    name: 'color',
    type: 'string',
    default: "'#A7EF9E'",
    description: 'Pixel color.'
  },
  {
    name: 'patternScale',
    type: 'number',
    default: '2',
    description: 'Noise/pattern scale.'
  },
  {
    name: 'patternDensity',
    type: 'number',
    default: '1',
    description: 'Pattern density adjustment.'
  },
  {
    name: 'pixelSizeJitter',
    type: 'number',
    default: '0',
    description: 'Random jitter applied to coverage.'
  },
  {
    name: 'enableRipples',
    type: 'boolean',
    default: 'true',
    description: 'Enable click ripple waves.'
  },
  {
    name: 'rippleSpeed',
    type: 'number',
    default: '0.3',
    description: 'Ripple propagation speed.'
  },
  {
    name: 'rippleThickness',
    type: 'number',
    default: '0.1',
    description: 'Ripple ring thickness.'
  },
  {
    name: 'rippleIntensityScale',
    type: 'number',
    default: '1',
    description: 'Ripple intensity multiplier.'
  },
  {
    name: 'liquid',
    type: 'boolean',
    default: 'false',
    description: 'Enable liquid distortion effect.'
  },
  {
    name: 'liquidStrength',
    type: 'number',
    default: '0.1',
    description: 'Liquid distortion strength.'
  },
  {
    name: 'liquidRadius',
    type: 'number',
    default: '1',
    description: 'Liquid touch brush radius scale.'
  },
  {
    name: 'liquidWobbleSpeed',
    type: 'number',
    default: '4.5',
    description: 'Liquid wobble frequency.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Animation time scale.'
  },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0.25',
    description: 'Edge fade distance (0-1).'
  },
  {
    name: 'noiseAmount',
    type: 'number',
    default: '0',
    description: 'Post noise amount.'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Transparent background.'
  }
];
</script>

<style scoped>
.demo-container {
  padding: 0;
}
</style>
