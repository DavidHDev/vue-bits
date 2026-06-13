<template>
  <h1 class="sub-category">Dither</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="dither.usage"
    :source="ditherSource"
    component-name="Dither"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[600px] overflow-hidden demo-container">
        <Dither
          :key="rerenderKey"
          :wave-speed="waveSpeed"
          :wave-frequency="waveFrequency"
          :wave-amplitude="waveAmplitude"
          :wave-color="waveColor"
          :color-num="colorNum"
          :pixel-size="pixelSize"
          :disable-animation="disableAnimation"
          :enable-mouse-interaction="enableMouseInteraction"
          :mouse-radius="mouseRadius"
        />
        <BackgroundContent pillText="Retro Background" headline="Dithered waves with vintage charm" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Wave Speed" :min="0" :max="0.5" :step="0.005" v-model="waveSpeed" />
        <PreviewSlider title="Wave Frequency" :min="0.5" :max="10" :step="0.1" v-model="waveFrequency" />
        <PreviewSlider title="Wave Amplitude" :min="0" :max="1" :step="0.01" v-model="waveAmplitude" />
        <PreviewSlider title="Color Num" :min="2" :max="16" :step="1" v-model="colorNum" />
        <PreviewSlider title="Pixel Size" :min="1" :max="10" :step="1" v-model="pixelSize" />
        <PreviewSlider title="Mouse Radius" :min="0.1" :max="3" :step="0.05" v-model="mouseRadius" />
        <PreviewSwitch title="Disable Animation" v-model="disableAnimation" />
        <PreviewSwitch title="Mouse Interaction" v-model="enableMouseInteraction" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="dither" :usage="dither.usage!" :source="ditherSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { dither } from '@/constants/code/Backgrounds/ditherCode';
import Dither from '@/content/Backgrounds/Dither/Dither.vue';
import ditherSource from '@/content/Backgrounds/Dither/Dither.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  waveColor: [0.1, 0.7, 0.5] as [number, number, number],
  mouseRadius: 0.3,
  colorNum: 4,
  pixelSize: 2,
  waveAmplitude: 0.3,
  waveFrequency: 3,
  waveSpeed: 0.05,
  enableMouseInteraction: true,
  disableAnimation: false
};

const waveSpeed = ref(DEFAULTS.waveSpeed);
const waveFrequency = ref(DEFAULTS.waveFrequency);
const waveAmplitude = ref(DEFAULTS.waveAmplitude);
const waveColor = ref<[number, number, number]>(DEFAULTS.waveColor);
const colorNum = ref(DEFAULTS.colorNum);
const pixelSize = ref(DEFAULTS.pixelSize);
const disableAnimation = ref(DEFAULTS.disableAnimation);
const enableMouseInteraction = ref(DEFAULTS.enableMouseInteraction);
const mouseRadius = ref(DEFAULTS.mouseRadius);

const hasChanges = computed(
  () =>
    waveSpeed.value !== DEFAULTS.waveSpeed ||
    waveFrequency.value !== DEFAULTS.waveFrequency ||
    waveAmplitude.value !== DEFAULTS.waveAmplitude ||
    waveColor.value !== DEFAULTS.waveColor ||
    colorNum.value !== DEFAULTS.colorNum ||
    disableAnimation.value !== DEFAULTS.disableAnimation ||
    enableMouseInteraction.value !== DEFAULTS.enableMouseInteraction ||
    mouseRadius.value !== DEFAULTS.mouseRadius
);

function reset() {
  waveSpeed.value = DEFAULTS.waveSpeed;
  waveFrequency.value = DEFAULTS.waveFrequency;
  waveAmplitude.value = DEFAULTS.waveAmplitude;
  waveColor.value = DEFAULTS.waveColor;
  colorNum.value = DEFAULTS.colorNum;
  disableAnimation.value = DEFAULTS.disableAnimation;
  enableMouseInteraction.value = DEFAULTS.enableMouseInteraction;
  mouseRadius.value = DEFAULTS.mouseRadius;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'waveSpeed',
    type: 'number',
    default: '0.05',
    description: 'Controls the speed of the wave animation.'
  },
  {
    name: 'waveFrequency',
    type: 'number',
    default: '3',
    description: 'Sets the frequency of the wave pattern.'
  },
  {
    name: 'waveAmplitude',
    type: 'number',
    default: '0.3',
    description: 'Controls the amplitude of the wave pattern.'
  },
  {
    name: 'waveColor',
    type: 'array',
    default: '[0.5, 0.5, 0.5]',
    description: 'RGB color values for the wave pattern (0-1 range).'
  },
  {
    name: 'colorNum',
    type: 'number',
    default: '4',
    description: 'Number of colors in the dithering palette.'
  },
  {
    name: 'pixelSize',
    type: 'number',
    default: '2',
    description: 'Size of the dithering pixels for the retro effect.'
  },
  {
    name: 'disableAnimation',
    type: 'boolean',
    default: 'false',
    description: 'Disables the wave animation when set to true.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enables mouse interaction with the wave pattern.'
  },
  {
    name: 'mouseRadius',
    type: 'number',
    default: '1',
    description: 'Radius of the mouse interaction effect.'
  }
];
</script>
