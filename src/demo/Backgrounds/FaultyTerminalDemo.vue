<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <FaultyTerminal
          :key="key"
          :scale="scale"
          :digit-size="digitSize"
          :time-scale="timeScale"
          :scanline-intensity="scanlineIntensity"
          :curvature="curvature"
          :tint="tint"
          :mouse-react="mouseReact"
          :mouse-strength="mouseStrength"
          :page-load-animation="pageLoadAnimation"
          :noise-amp="noiseAmp"
          :brightness="brightness"
        />
        <BackgroundContent pill-text="New Background" headline="It works on my machine, please check again" />
      </div>

      <Customize>
        <PreviewColor title="Tint Color" v-model="tint" />
        <PreviewSlider :min="1" :max="3" :step="0.1" v-model="scale" title="Scale" />
        <PreviewSlider :min="0.5" :max="3" :step="0.1" v-model="digitSize" title="Digit Size" />
        <PreviewSlider :min="0" :max="3" :step="0.1" v-model="timeScale" title="Speed" />
        <PreviewSlider :min="0.5" :max="1" :step="0.1" v-model="noiseAmp" title="Noise Amplitude" />
        <PreviewSlider :min="0.1" :max="1" :step="0.1" v-model="brightness" title="Brightness" />
        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="scanlineIntensity" title="Scanline Intensity" />
        <PreviewSlider :min="0" :max="0.5" :step="0.01" v-model="curvature" title="Curvature" />
        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="mouseStrength" title="Mouse Strength" />
        <PreviewSwitch title="Mouse React" v-model="mouseReact" />
        <PreviewSwitch title="Page Load Animation" v-model="pageLoadAnimation" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="faultyTerminal" />
    </template>

    <template #cli>
      <CliInstallation :command="faultyTerminal.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { useForceRerender } from '@/composables/useForceRerender';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { faultyTerminal } from '../../constants/code/Backgrounds/faultyTerminalCode';
import FaultyTerminal from '../../content/Backgrounds/FaultyTerminal/FaultyTerminal.vue';

const { rerenderKey: key } = useForceRerender();

const scale = ref(1.5);
const digitSize = ref(1.2);
const timeScale = ref(0.5);
const scanlineIntensity = ref(0.5);
const curvature = ref(0.1);
const tint = ref('#A7EF9E');
const mouseReact = ref(true);
const mouseStrength = ref(0.5);
const pageLoadAnimation = ref(true);
const noiseAmp = ref(1);
const brightness = ref(0.6);

const propData = [
  {
    name: 'scale',
    type: 'number',
    default: '1.5',
    description: 'Controls the zoom/scale of the pattern.'
  },
  {
    name: 'gridMul',
    type: 'Vec2',
    default: '[2, 1]',
    description: 'Grid multiplier for glyph density [x, y].'
  },
  {
    name: 'digitSize',
    type: 'number',
    default: '1.2',
    description: 'Size of individual glyphs.'
  },
  {
    name: 'timeScale',
    type: 'number',
    default: '1',
    description: 'Animation speed multiplier.'
  },
  {
    name: 'pause',
    type: 'boolean',
    default: 'false',
    description: 'Pause/resume animation.'
  },
  {
    name: 'scanlineIntensity',
    type: 'number',
    default: '1',
    description: 'Strength of scanline effects.'
  },
  {
    name: 'glitchAmount',
    type: 'number',
    default: '1',
    description: 'Glitch displacement intensity.'
  },
  {
    name: 'flickerAmount',
    type: 'number',
    default: '1',
    description: 'Flicker effect strength.'
  },
  {
    name: 'noiseAmp',
    type: 'number',
    default: '1',
    description: 'Noise pattern amplitude.'
  },
  {
    name: 'chromaticAberration',
    type: 'number',
    default: '0',
    description: 'RGB channel separation in pixels.'
  },
  {
    name: 'dither',
    type: 'number | boolean',
    default: '0',
    description: 'Dithering effect intensity.'
  },
  {
    name: 'curvature',
    type: 'number',
    default: '0',
    description: 'Barrel distortion amount.'
  },
  {
    name: 'tint',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color tint (hex).'
  },
  {
    name: 'mouseReact',
    type: 'boolean',
    default: 'true',
    description: 'Enable/disable mouse interaction.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '0.5',
    description: 'Mouse interaction intensity.'
  },
  {
    name: 'pageLoadAnimation',
    type: 'boolean',
    default: 'false',
    description: 'Enable fade-in animation on load.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '1',
    description: 'Overall opacity/brightness control.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS classes.'
  },
  {
    name: 'style',
    type: 'React.CSSProperties',
    default: '{}',
    description: 'Inline styles.'
  }
];
</script>

<style scoped>
.demo-container {
  padding: 0;
}
</style>
