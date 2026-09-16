<template>
  <h1 class="sub-category">Scanner</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="scanner.usage"
    :source="scannerSource"
    component-name="Scanner"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Scanner
          :color1="color1"
          :color2="color2"
          :color3="color3"
          :speed="speed"
          :sweep-speed="sweepSpeed"
          :sweep-width="sweepWidth"
          :scan-direction="scanDirection"
          :mouse-interaction="mouseInteraction"
          class="w-full"
        />
        <BackgroundContent pillText="New Background" headline="Retro CRT scanner with mouse interaction" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewColorPicker title="Color 3" v-model="color3" />
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="2" :step="0.1" />
        <PreviewSlider title="Sweep Speed" v-model="sweepSpeed" :min="0" :max="1" :step="0.05" />
        <PreviewSlider title="Sweep Width" v-model="sweepWidth" :min="0.5" :max="3" :step="0.1" />
        <PreviewSelect
          title="Scan Direction"
          v-model="scanDirection"
          :options="['vertical', 'horizontal', 'diagonal']"
        />
        <PreviewSwitch title="Mouse Interaction" v-model="mouseInteraction" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="scanner" :usage="scanner.usage!" :source="scannerSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { scanner } from '@/constants/code/Backgrounds/scannerCode';
import Scanner from '@/content/Backgrounds/Scanner/Scanner.vue';
import scannerSource from '@/content/Backgrounds/Scanner/Scanner.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color1: '#5227FF',
  color2: '#FF9FFC',
  color3: '#FFFFFF',
  speed: 0.5,
  sweepSpeed: 0.25,
  sweepWidth: 1.6,
  scanDirection: 'vertical' as const,
  mouseInteraction: true
};

const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const color3 = ref(DEFAULTS.color3);
const speed = ref(DEFAULTS.speed);
const sweepSpeed = ref(DEFAULTS.sweepSpeed);
const sweepWidth = ref(DEFAULTS.sweepWidth);
const scanDirection = ref(DEFAULTS.scanDirection);
const mouseInteraction = ref(DEFAULTS.mouseInteraction);

const hasChanges = computed(
  () =>
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    color3.value !== DEFAULTS.color3 ||
    speed.value !== DEFAULTS.speed ||
    sweepSpeed.value !== DEFAULTS.sweepSpeed ||
    sweepWidth.value !== DEFAULTS.sweepWidth ||
    scanDirection.value !== DEFAULTS.scanDirection ||
    mouseInteraction.value !== DEFAULTS.mouseInteraction
);

function reset() {
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  color3.value = DEFAULTS.color3;
  speed.value = DEFAULTS.speed;
  sweepSpeed.value = DEFAULTS.sweepSpeed;
  sweepWidth.value = DEFAULTS.sweepWidth;
  scanDirection.value = DEFAULTS.scanDirection;
  mouseInteraction.value = DEFAULTS.mouseInteraction;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'color1',
    type: 'string',
    default: "'#5227FF'",
    description: 'Primary color for the scanner gradient.'
  },
  {
    name: 'color2',
    type: 'string',
    default: "'#FF9FFC'",
    description: 'Secondary color for the scanner gradient.'
  },
  {
    name: 'color3',
    type: 'string',
    default: "'#FFFFFF'",
    description: 'Tertiary color for the scanner gradient.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Overall animation speed.'
  },
  {
    name: 'sweepSpeed',
    type: 'number',
    default: '0.25',
    description: 'Speed of the scan line sweep.'
  },
  {
    name: 'sweepWidth',
    type: 'number',
    default: '1.6',
    description: 'Width of the scan line.'
  },
  {
    name: 'scanDirection',
    type: "'vertical' | 'horizontal' | 'diagonal'",
    default: "'vertical'",
    description: 'Direction of the scan line movement.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enable mouse-following glow effect.'
  },
  {
    name: 'mouseRadius',
    type: 'number',
    default: '0.5',
    description: 'Radius of the mouse interaction glow.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '0.5',
    description: 'Strength of the mouse interaction effect.'
  },
  {
    name: 'scanline',
    type: 'boolean',
    default: 'true',
    description: 'Enable CRT scanline effect.'
  },
  {
    name: 'grain',
    type: 'boolean',
    default: 'true',
    description: 'Enable film grain effect.'
  },
  {
    name: 'vignette',
    type: 'number',
    default: '0.45',
    description: 'Vignette intensity around edges.'
  }
];
</script>
