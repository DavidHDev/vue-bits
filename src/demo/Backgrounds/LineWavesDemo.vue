<template>
  <h1 class="sub-category">Line Waves</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="lineWaves.usage"
    :source="lineWavesSource"
    component-name="LineWaves"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <LineWaves
          :speed="speed"
          :inner-line-count="innerLineCount"
          :outer-line-count="outerLineCount"
          :warp-intensity="warpIntensity"
          :rotation="rotation"
          :edge-fade-width="edgeFadeWidth"
          :color-cycle-speed="colorCycleSpeed"
          :brightness="brightness"
          :color1="color1"
          :color2="color2"
          :color3="color3"
          :enable-mouse-interaction="enableMouseInteraction"
          :mouse-influence="mouseInfluence"
        />
        <BackgroundContent pill-text="New Background" headline="Ride the waves of your creativity!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewColorPicker title="Color 3" v-model="color3" />
        <PreviewSlider title="Speed" :min="0.1" :max="3" :step="0.1" v-model="speed" />
        <PreviewSlider title="Inner Line Count" :min="2" :max="40" :step="1" v-model="innerLineCount" />
        <PreviewSlider title="Outer Line Count" :min="2" :max="40" :step="1" v-model="outerLineCount" />
        <PreviewSlider title="Warp Intensity" :min="0.1" :max="3" :step="0.1" v-model="warpIntensity" />
        <PreviewSlider title="Rotation" :min="-180" :max="180" :step="1" v-model="rotation" />
        <PreviewSlider title="Edge Fade Width" :min="0.0" :max="1.0" :step="0.05" v-model="edgeFadeWidth" />
        <PreviewSlider title="Color Cycle Speed" :min="0.1" :max="5" :step="0.1" v-model="colorCycleSpeed" />
        <PreviewSlider title="Brightness" :min="0.1" :max="3" :step="0.1" v-model="brightness" />
        <PreviewSwitch title="Mouse Interaction" v-model="enableMouseInteraction" />
        <PreviewSlider
          v-if="enableMouseInteraction"
          title="Mouse Influence"
          :min="0.1"
          :max="2"
          :step="0.1"
          v-model="mouseInfluence"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="line-waves" :usage="lineWaves.usage!" :source="lineWavesSource" />
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
import { lineWaves } from '@/constants/code/Backgrounds/lineWavesCode';
import LineWaves from '@/content/Backgrounds/LineWaves/LineWaves.vue';
import lineWavesSource from '@/content/Backgrounds/LineWaves/LineWaves.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 0.3,
  innerLineCount: 32.0,
  outerLineCount: 36.0,
  warpIntensity: 1.0,
  rotation: -45,
  edgeFadeWidth: 0.0,
  colorCycleSpeed: 1.0,
  brightness: 0.2,
  color1: '#ffffff',
  color2: '#ffffff',
  color3: '#ffffff',
  enableMouseInteraction: true,
  mouseInfluence: 2.0
};

const speed = ref(DEFAULTS.speed);
const innerLineCount = ref(DEFAULTS.innerLineCount);
const outerLineCount = ref(DEFAULTS.outerLineCount);
const warpIntensity = ref(DEFAULTS.warpIntensity);
const rotation = ref(DEFAULTS.rotation);
const edgeFadeWidth = ref(DEFAULTS.edgeFadeWidth);
const colorCycleSpeed = ref(DEFAULTS.colorCycleSpeed);
const brightness = ref(DEFAULTS.brightness);
const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const color3 = ref(DEFAULTS.color3);
const enableMouseInteraction = ref(DEFAULTS.enableMouseInteraction);
const mouseInfluence = ref(DEFAULTS.mouseInfluence);

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    innerLineCount.value !== DEFAULTS.innerLineCount ||
    outerLineCount.value !== DEFAULTS.outerLineCount ||
    warpIntensity.value !== DEFAULTS.warpIntensity ||
    rotation.value !== DEFAULTS.rotation ||
    edgeFadeWidth.value !== DEFAULTS.edgeFadeWidth ||
    colorCycleSpeed.value !== DEFAULTS.colorCycleSpeed ||
    brightness.value !== DEFAULTS.brightness ||
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    color3.value !== DEFAULTS.color3 ||
    enableMouseInteraction.value !== DEFAULTS.enableMouseInteraction ||
    mouseInfluence.value !== DEFAULTS.mouseInfluence
);

function reset() {
  speed.value = DEFAULTS.speed;
  innerLineCount.value = DEFAULTS.innerLineCount;
  outerLineCount.value = DEFAULTS.outerLineCount;
  warpIntensity.value = DEFAULTS.warpIntensity;
  rotation.value = DEFAULTS.rotation;
  edgeFadeWidth.value = DEFAULTS.edgeFadeWidth;
  colorCycleSpeed.value = DEFAULTS.colorCycleSpeed;
  brightness.value = DEFAULTS.brightness;
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  color3.value = DEFAULTS.color3;
  enableMouseInteraction.value = DEFAULTS.enableMouseInteraction;
  mouseInfluence.value = DEFAULTS.mouseInfluence;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'speed',
    type: 'number',
    default: '0.3',
    description: 'Overall animation speed multiplier.'
  },
  {
    name: 'innerLineCount',
    type: 'number',
    default: '32.0',
    description: 'Number of lines in the inner (center) wave region.'
  },
  {
    name: 'outerLineCount',
    type: 'number',
    default: '36.0',
    description: 'Number of lines in the outer (edge) wave region.'
  },
  {
    name: 'warpIntensity',
    type: 'number',
    default: '1.0',
    description: 'Intensity of the wave distortion effect.'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '-45',
    description: 'Rotation of the wave pattern in degrees.'
  },
  {
    name: 'edgeFadeWidth',
    type: 'number',
    default: '0.0',
    description: 'Width of the edge fade between inner and outer regions.'
  },
  {
    name: 'colorCycleSpeed',
    type: 'number',
    default: '1.0',
    description: 'Speed of color cycling animation.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '0.2',
    description: 'Overall brightness multiplier.'
  },
  {
    name: 'color1',
    type: 'string',
    default: '"#ffffff"',
    description: 'First color channel in HEX format.'
  },
  {
    name: 'color2',
    type: 'string',
    default: '"#ffffff"',
    description: 'Second color channel in HEX format.'
  },
  {
    name: 'color3',
    type: 'string',
    default: '"#ffffff"',
    description: 'Third color channel in HEX format.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enable cursor-reactive wave distortion.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '2.0',
    description: 'Strength of mouse influence on the wave pattern.'
  }
];
</script>
