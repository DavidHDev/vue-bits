<template>
  <h1 class="sub-category">Wake Slider</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="wakeSlider.usage"
    :source="wakeSliderSource"
    component-name="WakeSlider"
    :props-table="props"
  >
    <template #preview>
      <div class="relative flex justify-center items-center p-0 h-100 overflow-hidden demo-container">
        <div class="w-[min(320px,calc(100%-48px))]">
          <WakeSlider
            :key="`${glide}-${smoothing}`"
            :value="value"
            :step="step"
            :bars="bars"
            :height="height"
            :rest-height="restHeight"
            :gap="gap"
            :fill-color="fillColor"
            :track-color="trackColor"
            :sensitivity="sensitivity"
            :reach="reach"
            :skew="skew"
            :glide="glide"
            :smoothing="smoothing"
            :show-value="showValue"
            :disabled="disabled"
            @change="value = $event"
          />
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Fill" v-model="fillColor" />
        <PreviewColorPicker title="Track" v-model="trackColor" />
        <PreviewSlider title="Value" :min="0" :max="100" :step="1" v-model="value" />
        <PreviewSlider title="Step" :min="1" :max="25" :step="1" v-model="step" />
        <PreviewSwitch title="Show Value" v-model="showValue" />
        <PreviewSlider title="Bars" :min="12" :max="64" :step="1" v-model="bars" />
        <PreviewSlider title="Height" :min="24" :max="96" :step="2" valueUnit="px" v-model="height" />
        <PreviewSlider title="Rest Height" :min="4" :max="24" :step="1" valueUnit="px" v-model="restHeight" />
        <PreviewSlider title="Gap" :min="1" :max="8" :step="1" valueUnit="px" v-model="gap" />
        <PreviewSlider title="Sensitivity" :min="0.25" :max="3" :step="0.05" v-model="sensitivity" />
        <PreviewSlider title="Reach" :min="2" :max="12" :step="0.5" v-model="reach" />
        <PreviewSlider title="Skew" :min="0" :max="1" :step="0.05" v-model="skew" />
        <PreviewSlider title="Glide" :min="0.15" :max="0.6" :step="0.05" valueUnit="s" v-model="glide" />
        <PreviewSlider title="Smoothing" :min="40" :max="250" :step="10" valueUnit="ms" v-model="smoothing" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="wake-slider" :usage="wakeSlider.usage!" :source="wakeSliderSource" />
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
import { wakeSlider } from '@/constants/code/Micro/wakeSliderCode';
import WakeSlider from '@/content/Micro/WakeSlider/WakeSlider.vue';
import wakeSliderSource from '@/content/Micro/WakeSlider/WakeSlider.vue?raw';
import { computed, ref } from 'vue';

const DEFAULTS = {
  fillColor: '#f5f5f5',
  trackColor: '#27272a',
  step: 1,
  showValue: true,
  bars: 32,
  height: 56,
  restHeight: 12,
  gap: 4,
  sensitivity: 1,
  reach: 6,
  skew: 0.6,
  glide: 0.3,
  smoothing: 100,
  disabled: false
};

const value = ref(50);
const fillColor = ref(DEFAULTS.fillColor);
const trackColor = ref(DEFAULTS.trackColor);
const step = ref(DEFAULTS.step);
const showValue = ref(DEFAULTS.showValue);
const bars = ref(DEFAULTS.bars);
const height = ref(DEFAULTS.height);
const restHeight = ref(DEFAULTS.restHeight);
const gap = ref(DEFAULTS.gap);
const sensitivity = ref(DEFAULTS.sensitivity);
const reach = ref(DEFAULTS.reach);
const skew = ref(DEFAULTS.skew);
const glide = ref(DEFAULTS.glide);
const smoothing = ref(DEFAULTS.smoothing);
const disabled = ref(DEFAULTS.disabled);

const hasChanges = computed(
  () =>
    fillColor.value !== DEFAULTS.fillColor ||
    trackColor.value !== DEFAULTS.trackColor ||
    step.value !== DEFAULTS.step ||
    showValue.value !== DEFAULTS.showValue ||
    bars.value !== DEFAULTS.bars ||
    height.value !== DEFAULTS.height ||
    restHeight.value !== DEFAULTS.restHeight ||
    gap.value !== DEFAULTS.gap ||
    sensitivity.value !== DEFAULTS.sensitivity ||
    reach.value !== DEFAULTS.reach ||
    skew.value !== DEFAULTS.skew ||
    glide.value !== DEFAULTS.glide ||
    smoothing.value !== DEFAULTS.smoothing ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  fillColor.value = DEFAULTS.fillColor;
  trackColor.value = DEFAULTS.trackColor;
  step.value = DEFAULTS.step;
  showValue.value = DEFAULTS.showValue;
  bars.value = DEFAULTS.bars;
  height.value = DEFAULTS.height;
  restHeight.value = DEFAULTS.restHeight;
  gap.value = DEFAULTS.gap;
  sensitivity.value = DEFAULTS.sensitivity;
  reach.value = DEFAULTS.reach;
  skew.value = DEFAULTS.skew;
  glide.value = DEFAULTS.glide;
  smoothing.value = DEFAULTS.smoothing;
  disabled.value = DEFAULTS.disabled;
}

const props: PropRow[] = [
  { name: 'value', type: 'number', default: 'undefined', description: 'Controlled value.' },
  { name: 'defaultValue', type: 'number', default: '50', description: 'Initial value when uncontrolled.' },
  {
    name: '@change',
    type: '(value: number) => void',
    default: '-',
    description: 'Called on every committed change, from the pointer or the keyboard.'
  },
  { name: 'min', type: 'number', default: '0', description: 'Lowest value.' },
  { name: 'max', type: 'number', default: '100', description: 'Highest value.' },
  {
    name: 'step',
    type: 'number',
    default: '1',
    description: 'Snapping grid. Large steps move the handle in notches, and the wake pulses per notch.'
  },
  { name: 'bars', type: 'number', default: '32', description: 'How many bars draw the track.' },
  {
    name: 'height',
    type: 'number',
    default: '56',
    description: 'Full bar height in pixels, the ceiling of the wake.'
  },
  { name: 'restHeight', type: 'number', default: '12', description: 'Bar height at rest in pixels.' },
  { name: 'gap', type: 'number', default: '4', description: 'Space between bars in pixels.' },
  { name: 'fillColor', type: 'string', default: '"#f5f5f5"', description: 'Lit bars, up to the value.' },
  { name: 'trackColor', type: 'string', default: '"#27272a"', description: 'Unlit bars.' },
  {
    name: 'crestColor',
    type: 'string',
    default: '""',
    description: 'Optional tint the raised bars take on by their lift. Empty renders no tint layer.'
  },
  {
    name: 'sensitivity',
    type: 'number',
    default: '1',
    description: 'How easily speed raises the wake. Low needs a flick; high lifts it on a stroll.'
  },
  { name: 'reach', type: 'number', default: '6', description: 'Half-width of the wake at full speed, in bars.' },
  {
    name: 'skew',
    type: 'number',
    default: '0.6',
    description: 'How much wider the wake is behind the handle than ahead. 0 is symmetric.'
  },
  {
    name: 'glide',
    type: 'number',
    default: '0.3',
    description: 'Seconds the handle takes to settle. Short hugs the finger; long floats behind it.'
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '100',
    description: 'Milliseconds of velocity lag. Low twitches with every change of speed; high lingers.'
  },
  { name: 'showValue', type: 'boolean', default: 'false', description: 'Shows the value beside the track.' },
  {
    name: 'formatValue',
    type: '(value: number) => string',
    default: '-',
    description: 'Formats the readout and the announced value.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Fades the slider and ignores input.' },
  { name: 'ariaLabel', type: 'string', default: '"Value"', description: 'Accessible name of the slider.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
