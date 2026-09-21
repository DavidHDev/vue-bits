<template>
  <h1 class="sub-category">Slosh Gauge</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="sloshGauge.usage"
    :source="sloshGaugeSource"
    component-name="SloshGauge"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <div class="mb-9">
          <SloshGauge
            :key="key"
            :value="value"
            :interactive="interactive"
            :show-value="showValue"
            :disabled="disabled"
            :liquid-color="liquidColor"
            :glass-color="glassColor"
            :width="width"
            :height="height"
            :radius="radius"
            :ticks="ticks"
            :viscosity="viscosity"
            :tilt="tilt"
            :splash="splash"
            @change="value = $event"
          />
        </div>
        <div class="bottom-6 left-1/2 absolute flex gap-1.5 -translate-x-1/2">
          <button
            v-for="p in PRESETS"
            :key="p.label"
            type="button"
            class="hover:bg-white/10 px-3 py-1 rounded-full font-medium text-[13px] text-white/80 hover:text-white transition-colors cursor-pointer"
            @click="value = p.value"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Value" :min="0" :max="100" :step="1" v-model="value" />
        <PreviewSwitch title="Interactive" v-model="interactive" />
        <PreviewSwitch title="Show Value" v-model="showValue" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
        <PreviewColorPicker title="Liquid" v-model="liquidColor" />
        <PreviewColorPicker title="Glass" v-model="glassColor" />
        <PreviewSlider title="Width" :min="56" :max="160" :step="4" valueUnit="px" v-model="width" />
        <PreviewSlider title="Height" :min="120" :max="300" :step="4" valueUnit="px" v-model="height" />
        <PreviewSlider title="Radius" :min="0" :max="44" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Ticks" :min="0" :max="10" :step="1" v-model="ticks" />
        <PreviewSlider title="Viscosity" :min="0" :max="1" :step="0.05" v-model="viscosity" />
        <PreviewSlider title="Tilt" :min="0" :max="1" :step="0.05" v-model="tilt" />
        <PreviewSlider title="Splash" :min="0" :max="0.8" :step="0.02" v-model="splash" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="slosh-gauge" :usage="sloshGauge.usage!" :source="sloshGaugeSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { sloshGauge } from '@/constants/code/Micro/sloshGaugeCode';
import SloshGauge from '@/content/Micro/SloshGauge/SloshGauge.vue';
import sloshGaugeSource from '@/content/Micro/SloshGauge/SloshGauge.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  value: 60,
  interactive: true,
  showValue: true,
  disabled: false,
  liquidColor: '#f5f5f5',
  glassColor: '#27272a',
  width: 88,
  height: 180,
  radius: 20,
  ticks: 4,
  viscosity: 0.15,
  tilt: 0.45,
  splash: 0.42
};

const PRESETS = [
  { label: 'Empty', value: 0 },
  { label: '25%', value: 25 },
  { label: '60%', value: 60 },
  { label: 'Full', value: 100 }
];

const value = ref(DEFAULTS.value);
const interactive = ref(DEFAULTS.interactive);
const showValue = ref(DEFAULTS.showValue);
const disabled = ref(DEFAULTS.disabled);
const liquidColor = ref(DEFAULTS.liquidColor);
const glassColor = ref(DEFAULTS.glassColor);
const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const radius = ref(DEFAULTS.radius);
const ticks = ref(DEFAULTS.ticks);
const viscosity = ref(DEFAULTS.viscosity);
const tilt = ref(DEFAULTS.tilt);
const splash = ref(DEFAULTS.splash);

const hasChanges = computed(
  () =>
    value.value !== DEFAULTS.value ||
    interactive.value !== DEFAULTS.interactive ||
    showValue.value !== DEFAULTS.showValue ||
    disabled.value !== DEFAULTS.disabled ||
    liquidColor.value !== DEFAULTS.liquidColor ||
    glassColor.value !== DEFAULTS.glassColor ||
    width.value !== DEFAULTS.width ||
    height.value !== DEFAULTS.height ||
    radius.value !== DEFAULTS.radius ||
    ticks.value !== DEFAULTS.ticks ||
    viscosity.value !== DEFAULTS.viscosity ||
    tilt.value !== DEFAULTS.tilt ||
    splash.value !== DEFAULTS.splash
);

function reset() {
  value.value = DEFAULTS.value;
  interactive.value = DEFAULTS.interactive;
  showValue.value = DEFAULTS.showValue;
  disabled.value = DEFAULTS.disabled;
  liquidColor.value = DEFAULTS.liquidColor;
  glassColor.value = DEFAULTS.glassColor;
  width.value = DEFAULTS.width;
  height.value = DEFAULTS.height;
  radius.value = DEFAULTS.radius;
  ticks.value = DEFAULTS.ticks;
  viscosity.value = DEFAULTS.viscosity;
  tilt.value = DEFAULTS.tilt;
  splash.value = DEFAULTS.splash;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'value',
    type: 'number',
    default: 'undefined',
    description: 'The level, 0 to 100, controlled. Every change launches the liquid toward it.'
  },
  { name: 'defaultValue', type: 'number', default: '60', description: 'The starting level when uncontrolled.' },
  {
    name: '@change',
    type: '(value: number) => void',
    default: '-',
    description: 'The integer level on press, on each change while dragging, and on keys. Interactive only.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'false',
    description: 'Press or drag the tank to set the level, arrows to step. A marker appears at the level.'
  },
  {
    name: 'showValue',
    type: 'boolean',
    default: 'true',
    description: 'A readout whose colour flips at the surface.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Dimmed and inert. Value changes still animate.'
  },
  {
    name: 'liquidColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The liquid. The readout over it picks dark or light by itself.'
  },
  { name: 'glassColor', type: 'string', default: '"#27272a"', description: 'The tank.' },
  { name: 'width', type: 'number', default: '88', description: 'Tank width in px. The readout scales with it.' },
  { name: 'height', type: 'number', default: '180', description: 'Tank height in px.' },
  {
    name: 'radius',
    type: 'number',
    default: '20',
    description: 'Corner radius in px, capped at half the smaller side.'
  },
  {
    name: 'ticks',
    type: 'number',
    default: '4',
    description: 'Lines etched on the right of the glass. 0 hides them.'
  },
  {
    name: 'viscosity',
    type: 'number',
    default: '0.15',
    description: '0 is a rigid gauge. Higher is slower to answer, longer to settle, and overshoots more.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0.45',
    description: 'How far the surface leans per unit of speed. 0 keeps it flat.'
  },
  {
    name: 'splash',
    type: 'number',
    default: '0.42',
    description: 'How much of a slam the top and bottom give back. 0 swallows it, 0.8 nearly bounces.'
  },
  { name: 'unit', type: 'string', default: '"%"', description: 'Readout suffix.' },
  { name: 'ariaLabel', type: 'string', default: '"Level"', description: 'Accessible name of the meter or slider.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the tank.' }
];
</script>
