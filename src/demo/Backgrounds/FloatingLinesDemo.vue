<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <FloatingLines
          :enabled-waves="enabledWaves"
          :line-count="lineCount"
          :line-distance="lineDistance"
          :bend-radius="bendRadius"
          :bend-strength="bendStrength"
        />

        <BackgroundContent pill-text="New Background" headline="Waves are cool! Even cooler with lines!" />
      </div>

      <Customize>
        <PreviewSwitch
          title="Top Wave"
          :model-value="enabledWaves.includes('top')"
          @update:model-value="_ => toggleWave('top')"
        />
        <PreviewSwitch
          title="Middle Wave"
          :model-value="enabledWaves.includes('middle')"
          @update:model-value="_ => toggleWave('middle')"
        />
        <PreviewSwitch
          title="Bottom Wave"
          :model-value="enabledWaves.includes('bottom')"
          @update:model-value="_ => toggleWave('bottom')"
        />
        <PreviewSlider :min="1" :max="20" :step="1" v-model="lineCount" title="Line Count" />
        <PreviewSlider :min="1" :max="100" :step="0.5" v-model="lineDistance" title="Line Distance" />
        <PreviewSlider :min="1" :max="30" :step="0.5" v-model="bendRadius" title="Bend Radius" />
        <PreviewSlider :min="-15" :max="15" :step="0.5" v-model="bendStrength" title="Bend Strength" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="floatingLines" />
    </template>

    <template #cli>
      <CliInstallation :command="floatingLines.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { floatingLines } from '@/constants/code/Backgrounds/floatingLinesCode';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import FloatingLines from '../../content/Backgrounds/FloatingLines/FloatingLines.vue';

type WaveLayer = 'top' | 'middle' | 'bottom';

const enabledWaves = ref<Array<WaveLayer>>(['top', 'middle', 'bottom']);
const lineCount = ref<number>(5);
const lineDistance = ref<number>(5);
const bendRadius = ref<number>(5);
const bendStrength = ref<number>(-0.5);

const toggleWave = (wave: WaveLayer) => {
  enabledWaves.value = enabledWaves.value.includes(wave)
    ? enabledWaves.value.filter(w => w !== wave)
    : [...enabledWaves.value, wave];
};

const propData = [
  {
    name: 'linesGradient',
    type: 'string[]',
    default: 'undefined',
    description: 'Array of hex color strings for gradient coloring of lines (max 8 colors).'
  },
  {
    name: 'enabledWaves',
    type: "Array<'top' | 'middle' | 'bottom'>",
    default: "['top', 'middle', 'bottom']",
    description: 'Which wave layers to display. Can toggle individual waves on/off.'
  },
  {
    name: 'lineCount',
    type: 'number | number[]',
    default: '[6]',
    description: 'Number of lines per wave. Single number applies to all waves, or array for per-wave control.'
  },
  {
    name: 'lineDistance',
    type: 'number | number[]',
    default: '[5]',
    description: 'Spacing between lines. Single number applies to all waves, or array for per-wave control.'
  },
  {
    name: 'topWavePosition',
    type: '{ x: number; y: number; rotate: number }',
    default: 'undefined',
    description: 'Position and rotation settings for the top wave layer.'
  },
  {
    name: 'middleWavePosition',
    type: '{ x: number; y: number; rotate: number }',
    default: 'undefined',
    description: 'Position and rotation settings for the middle wave layer.'
  },
  {
    name: 'bottomWavePosition',
    type: '{ x: number; y: number; rotate: number }',
    default: '{ x: 2.0, y: -0.7, rotate: -1 }',
    description: 'Position and rotation settings for the bottom wave layer.'
  },
  {
    name: 'animationSpeed',
    type: 'number',
    default: '1',
    description: 'Speed multiplier for the wave animation.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Whether the lines react to mouse/pointer movement.'
  },
  {
    name: 'bendRadius',
    type: 'number',
    default: '10.0',
    description: 'Radius of the area affected by mouse interaction.'
  },
  {
    name: 'bendStrength',
    type: 'number',
    default: '-5.0',
    description: 'Intensity of the bend effect when interacting with mouse.'
  },
  {
    name: 'mouseDamping',
    type: 'number',
    default: '0.05',
    description: 'Smoothing factor for mouse movement tracking (0-1).'
  },
  {
    name: 'parallax',
    type: 'boolean',
    default: 'true',
    description: 'Enable parallax effect with mouse movement.'
  },
  {
    name: 'parallaxStrength',
    type: 'number',
    default: '0.2',
    description: 'Strength of the parallax effect.'
  },
  {
    name: 'mixBlendMode',
    type: "CSSProperties['mixBlendMode']",
    default: "'screen'",
    description: 'CSS mix-blend-mode applied to the canvas element.'
  }
];
</script>
