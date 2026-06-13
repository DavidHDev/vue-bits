<template>
  <h1 class="sub-category">Faulty Terminal</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="faultyTerminal.usage"
    :source="faultyTerminalSource"
    component-name="FaultyTerminal"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
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
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Tint Color" v-model="tint" />
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
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="faulty-terminal" :usage="faultyTerminal.usage!" :source="faultyTerminalSource" />
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
import { faultyTerminal } from '@/constants/code/Backgrounds/faultyTerminalCode';
import FaultyTerminal from '@/content/Backgrounds/FaultyTerminal/FaultyTerminal.vue';
import faultyTerminalSource from '@/content/Backgrounds/FaultyTerminal/FaultyTerminal.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  scale: 1.5,
  digitSize: 1.2,
  timeScale: 0.5,
  scanlineIntensity: 0.5,
  curvature: 0.1,
  tint: '#A7EF9E',
  mouseReact: true,
  mouseStrength: 0.5,
  pageLoadAnimation: true,
  noiseAmp: 1,
  brightness: 0.6
};

const scale = ref(DEFAULTS.scale);
const digitSize = ref(DEFAULTS.digitSize);
const timeScale = ref(DEFAULTS.timeScale);
const scanlineIntensity = ref(DEFAULTS.scanlineIntensity);
const curvature = ref(DEFAULTS.curvature);
const tint = ref(DEFAULTS.tint);
const mouseReact = ref(DEFAULTS.mouseReact);
const mouseStrength = ref(DEFAULTS.mouseStrength);
const pageLoadAnimation = ref(DEFAULTS.pageLoadAnimation);
const noiseAmp = ref(DEFAULTS.noiseAmp);
const brightness = ref(DEFAULTS.brightness);

const hasChanges = computed(
  () =>
    scale.value !== DEFAULTS.scale ||
    digitSize.value !== DEFAULTS.digitSize ||
    timeScale.value !== DEFAULTS.timeScale ||
    scanlineIntensity.value !== DEFAULTS.scanlineIntensity ||
    curvature.value !== DEFAULTS.curvature ||
    tint.value !== DEFAULTS.tint ||
    mouseReact.value !== DEFAULTS.mouseReact ||
    mouseStrength.value !== DEFAULTS.mouseStrength ||
    pageLoadAnimation.value !== DEFAULTS.pageLoadAnimation ||
    noiseAmp.value !== DEFAULTS.noiseAmp ||
    brightness.value !== DEFAULTS.brightness
);

function reset() {
  scale.value = DEFAULTS.scale;
  digitSize.value = DEFAULTS.digitSize;
  timeScale.value = DEFAULTS.timeScale;
  scanlineIntensity.value = DEFAULTS.scanlineIntensity;
  curvature.value = DEFAULTS.curvature;
  tint.value = DEFAULTS.tint;
  mouseReact.value = DEFAULTS.mouseReact;
  mouseStrength.value = DEFAULTS.mouseStrength;
  pageLoadAnimation.value = DEFAULTS.pageLoadAnimation;
  noiseAmp.value = DEFAULTS.noiseAmp;
  brightness.value = DEFAULTS.brightness;
  forceRerender();
}

const props: PropRow[] = [
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
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles.'
  }
];
</script>
