<template>
  <h1 class="sub-category">Grid Scan</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="gridScan.usage"
    :source="gridScanSource"
    component-name="GridScan"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
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
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Lines Color" v-model="linesColor" class="mb-4" />
        <PreviewColorPicker title="Scan Color" v-model="scanColor" />
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
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="grid-scan" :usage="gridScan.usage!" :source="gridScanSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { gridScan } from '@/constants/code/Backgrounds/gridScanCode';
import GridScan from '@/content/Backgrounds/GridScan/GridScan.vue';
import gridScanSource from '@/content/Backgrounds/GridScan/GridScan.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  lineThickness: 1,
  gridScale: 0.1,
  lineJitter: 0.1,
  linesColor: '#2c3d32',
  scanColor: '#48FF28',
  enablePost: true,
  chromaticAberration: 0.002,
  noiseIntensity: 0.01,
  scanGlow: 0.5,
  scanSoftness: 2,
  enableWebcam: false,
  showPreview: false
};

const lineThickness = ref(DEFAULTS.lineThickness);
const gridScale = ref(DEFAULTS.gridScale);
const lineJitter = ref(DEFAULTS.lineJitter);
const linesColor = ref(DEFAULTS.linesColor);
const scanColor = ref(DEFAULTS.scanColor);
const enablePost = ref(DEFAULTS.enablePost);
const chromaticAberration = ref(DEFAULTS.chromaticAberration);
const noiseIntensity = ref(DEFAULTS.noiseIntensity);
const scanGlow = ref(DEFAULTS.scanGlow);
const scanSoftness = ref(DEFAULTS.scanSoftness);
const enableWebcam = ref(DEFAULTS.enableWebcam);
const showPreview = ref(DEFAULTS.showPreview);

const hasChanges = computed(
  () =>
    lineThickness.value !== DEFAULTS.lineThickness ||
    gridScale.value !== DEFAULTS.gridScale ||
    lineJitter.value !== DEFAULTS.lineJitter ||
    linesColor.value !== DEFAULTS.linesColor ||
    scanColor.value !== DEFAULTS.scanColor ||
    enablePost.value !== DEFAULTS.enablePost ||
    chromaticAberration.value !== DEFAULTS.chromaticAberration ||
    noiseIntensity.value !== DEFAULTS.noiseIntensity ||
    scanGlow.value !== DEFAULTS.scanGlow ||
    scanSoftness.value !== DEFAULTS.scanSoftness ||
    enableWebcam.value !== DEFAULTS.enableWebcam ||
    showPreview.value !== DEFAULTS.showPreview
);

function reset() {
  lineThickness.value = DEFAULTS.lineThickness;
  gridScale.value = DEFAULTS.gridScale;
  lineJitter.value = DEFAULTS.lineJitter;
  linesColor.value = DEFAULTS.linesColor;
  scanColor.value = DEFAULTS.scanColor;
  enablePost.value = DEFAULTS.enablePost;
  chromaticAberration.value = DEFAULTS.chromaticAberration;
  noiseIntensity.value = DEFAULTS.noiseIntensity;
  scanGlow.value = DEFAULTS.scanGlow;
  scanSoftness.value = DEFAULTS.scanSoftness;
  enableWebcam.value = DEFAULTS.enableWebcam;
  showPreview.value = DEFAULTS.showPreview;
  forceRerender();
}

const props: PropRow[] = [
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
  { name: 'linesColor', type: 'string', default: "'#2c3d32'", description: 'Color of the grid lines.' },
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
  { name: 'scanColor', type: 'string', default: "'#48FF28'", description: 'Color of the scan beam/aura.' },
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
