<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container relative">
        <GridScan
          :line-thickness="lineThickness"
          :grid-scale="gridScale"
          :line-jitter="lineJitter"
          :lines-color="linesColor"
          :scan-color="scanColor"
          :enable-post="enablePost"
          :chromatic-aberration="chromaticAberration"
          :noise-intensity="noiseIntensity"
          :scan-glow="scanGlow"
          :scan-softness="scanSoftness"
          :enable-webcam="enableWebcam"
          :show-preview="showPreview"
        />

        <BackgroundContent pill-text="New Background" headline="Hold on, scanning for Angular users." />
      </div>

      <Customize>
        <PreviewColor title="Lines Color" v-model="linesColor" class="mb-4" />
        <PreviewColor title="Scan Color" v-model="scanColor" />

        <PreviewSlider title="Line Thickness" v-model="lineThickness" :min="1" :max="4" :step="0.1" />

        <PreviewSlider title="Grid Scale" v-model="gridScale" :min="0.02" :max="0.5" :step="0.01" />

        <PreviewSlider title="Line Jitter" v-model="lineJitter" :min="0" :max="1" :step="0.01" />

        <PreviewSlider title="Scan Glow" v-model="scanGlow" :min="0.1" :max="3" :step="0.1" />

        <PreviewSlider title="Scan Softness" v-model="scanSoftness" :min="0.1" :max="4" :step="0.1" />

        <PreviewSwitch title="Enable Post" v-model="enablePost" />

        <PreviewSlider title="Chromatic Aberration" v-model="chromaticAberration" :min="0" :max="0.01" :step="0.0005" />

        <PreviewSlider title="Noise Intensity" v-model="noiseIntensity" :min="0" :max="0.1" :step="0.005" />

        <PreviewSwitch title="Enable Webcam" v-model="enableWebcam" />
        <PreviewSwitch title="Show Preview HUD" v-model="showPreview" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three', 'postprocessing', 'face-api.js']" />
    </template>

    <template #code>
      <CodeExample :code-object="gridScan" />
    </template>

    <template #cli>
      <CliInstallation :command="gridScan.cli" />
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
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import GridScan from '../../content/Backgrounds/GridScan/GridScan.vue';
import { gridScan } from '@/constants/code/Backgrounds/gridScanCode';

const lineThickness = ref(1);
const gridScale = ref(0.1);
const lineJitter = ref(0.1);
const linesColor = ref('#392e4e');
const scanColor = ref('#FF9FFC');
const enablePost = ref(true);
const chromaticAberration = ref(0.002);
const noiseIntensity = ref(0.01);
const scanGlow = ref(0.5);
const scanSoftness = ref(2);
const enableWebcam = ref(false);
const showPreview = ref(false);

const propData = [
  { name: 'enableWebcam', type: 'boolean', default: 'false', description: 'Enable face tracking via webcam.' },
  { name: 'showPreview', type: 'boolean', default: 'false', description: 'Show webcam preview/debug HUD.' },
  {
    name: 'modelsPath',
    type: 'string',
    default: 'CDN URL',
    description: 'Path/URL to face-api.js models.'
  },
  { name: 'sensitivity', type: 'number', default: '0.55', description: 'Overall responsiveness to input.' },
  { name: 'lineThickness', type: 'number', default: '1', description: 'Grid line thickness.' },
  { name: 'linesColor', type: 'string', default: "'#392e4e'", description: 'Color of the grid lines.' },
  { name: 'gridScale', type: 'number', default: '0.1', description: 'Grid spacing scale (smaller = denser).' },
  { name: 'lineStyle', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", description: 'Grid line style.' },
  { name: 'lineJitter', type: 'number', default: '0.1', description: 'Animated jitter along the grid lines.' },
  { name: 'enablePost', type: 'boolean', default: 'true', description: 'Enable post-processing effects.' },
  { name: 'bloomIntensity', type: 'number', default: '0', description: 'Bloom strength.' },
  { name: 'bloomThreshold', type: 'number', default: '0', description: 'Bloom luminance threshold.' },
  { name: 'bloomSmoothing', type: 'number', default: '0', description: 'Bloom threshold smoothing.' },
  {
    name: 'chromaticAberration',
    type: 'number',
    default: '0.002',
    description: 'Chromatic aberration offset (post).'
  },
  { name: 'noiseIntensity', type: 'number', default: '0.01', description: 'Additive film grain intensity.' },
  { name: 'scanColor', type: 'string', default: "'#FF9FFC'", description: 'Color of the scan beam/aura.' },
  { name: 'scanOpacity', type: 'number', default: '0.4', description: 'Opacity of the scan effect.' },
  {
    name: 'scanDirection',
    type: "'forward' | 'backward' | 'pingpong'",
    default: "'pingpong'",
    description: 'Scan motion.'
  },
  { name: 'scanSoftness', type: 'number', default: '2', description: 'Softness of scan band edges.' },
  { name: 'scanGlow', type: 'number', default: '0.5', description: 'Relative width/intensity of glow.' },
  { name: 'scanPhaseTaper', type: 'number', default: '0.9', description: 'Fade-in/out window for the phase.' },
  { name: 'scanDuration', type: 'number', default: '2.0', description: 'Duration of a scan cycle (seconds).' },
  { name: 'scanDelay', type: 'number', default: '2.0', description: 'Delay between scan cycles (seconds).' },
  { name: 'enableGyro', type: 'boolean', default: 'false', description: 'Use device orientation for input.' },
  { name: 'scanOnClick', type: 'boolean', default: 'false', description: 'Trigger a scan when clicking.' },
  { name: 'snapBackDelay', type: 'number', default: '250', description: 'Delay (ms) before input recenters.' },
  { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes.' },
  { name: 'style', type: 'CSSProperties', default: '{}', description: 'Inline style overrides.' }
];
</script>
