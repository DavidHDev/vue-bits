<template>
  <h1 class="sub-category">Liquid Chrome</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="liquidChrome.usage"
    :source="liquidChromeSource"
    component-name="LiquidChrome"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <LiquidChrome :baseColor="baseColor" :speed="speed" :amplitude="amplitude" :interactive="interactive" />
        <BackgroundContent pill-text="New Background" headline="Swirl around in the deep sea of liquid chrome!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Base Color" v-model="colorHex" />
        <PreviewSlider :min="0" title="Speed" :max="5" :step="0.01" v-model="speed" />
        <PreviewSlider :min="0.1" title="Amplitude" :max="1" :step="0.01" v-model="amplitude" />
        <PreviewSwitch title="Enable Interaction" v-model="interactive" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="liquid-chrome" :usage="liquidChrome.usage!" :source="liquidChromeSource" />
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
import { liquidChrome } from '@/constants/code/Backgrounds/liquidChromeCode';
import LiquidChrome from '@/content/Backgrounds/LiquidChrome/LiquidChrome.vue';
import liquidChromeSource from '@/content/Backgrounds/LiquidChrome/LiquidChrome.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 0.3,
  baseColor: [0.1, 0.1, 0.1] as [number, number, number],
  interactive: true,
  amplitude: 0.3
};

const speed = ref(DEFAULTS.speed);
const baseColor = ref<[number, number, number]>(DEFAULTS.baseColor);
const interactive = ref(DEFAULTS.interactive);
const amplitude = ref(DEFAULTS.amplitude);

function rgbArrayToHex([r, g, b]: [number, number, number]) {
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgbArray(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
}

const colorHex = computed({
  get: () => rgbArrayToHex(baseColor.value),
  set: (hex: string) => {
    baseColor.value = hexToRgbArray(hex);
  }
});

const hasChanges = computed(
  () =>
    JSON.stringify(baseColor.value) !== JSON.stringify(DEFAULTS.baseColor) ||
    speed.value !== DEFAULTS.speed ||
    amplitude.value !== DEFAULTS.amplitude ||
    interactive.value !== DEFAULTS.interactive
);

function reset() {
  baseColor.value = DEFAULTS.baseColor;
  speed.value = DEFAULTS.speed;
  amplitude.value = DEFAULTS.amplitude;
  interactive.value = DEFAULTS.interactive;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'baseColor',
    type: 'RGB array (number[3])',
    default: '[0.1, 0.1, 0.1]',
    description: 'Base color of the component. Specify as an RGB array.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1.0',
    description: 'Animation speed multiplier.'
  },
  {
    name: 'amplitude',
    type: 'number',
    default: '0.6',
    description: 'Amplitude of the distortion.'
  },
  {
    name: 'frequencyX',
    type: 'number',
    default: '2.5',
    description: 'Frequency modifier for the x distortion.'
  },
  {
    name: 'frequencyY',
    type: 'number',
    default: '1.5',
    description: 'Frequency modifier for the y distortion.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Enable mouse/touch interaction.'
  }
];
</script>
