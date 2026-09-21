<template>
  <h1 class="sub-category">Comet Dial</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="cometDial.usage"
    :source="cometDialSource"
    component-name="CometDial"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-125 overflow-hidden demo-container">
        <CometDial :key="key" v-bind="cometDialProps" :value="value" @change="value = $event" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Accent" v-model="accent" />
        <PreviewColorPicker title="Ink" v-model="ink" />
        <PreviewSlider title="Value" :min="0" :max="100" :step="1" v-model="value" />
        <PreviewSelect title="Unit" :options="UNIT_OPTIONS" :width="110" v-model="unit" />
        <PreviewSlider title="Size" :min="160" :max="360" :step="10" valueUnit="px" v-model="size" />
        <PreviewSlider title="Sweep" :min="180" :max="340" :step="5" valueUnit="°" v-model="sweep" />
        <PreviewSlider title="Thickness" :min="2" :max="8" :step="0.5" v-model="thickness" />
        <PreviewSlider title="Speed" :min="0" :max="100" :step="1" v-model="speed" />
        <PreviewSlider title="Tap Bounce" :min="0" :max="0.3" :step="0.02" v-model="tapBounce" />
        <PreviewSlider title="Flick Bounce" :min="0" :max="0.5" :step="0.02" v-model="flickBounce" />
        <PreviewSlider title="Momentum" :min="0" :max="2" :step="0.1" v-model="momentum" />
        <PreviewSlider title="Comet Reach" :min="10" :max="180" :step="5" valueUnit="°" v-model="cometReach" />
        <PreviewSlider title="Comet Width" :min="0" :max="12" :step="0.5" v-model="cometWidth" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="comet-dial" :usage="cometDial.usage!" :source="cometDialSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { cometDial } from '@/constants/code/Micro/cometDialCode';
import CometDial from '@/content/Micro/CometDial/CometDial.vue';
import cometDialSource from '@/content/Micro/CometDial/CometDial.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  accent: '#f5f5f5',
  ink: '#fdfdfd',
  unit: 'percent',
  size: 250,
  sweep: 320,
  thickness: 5,
  speed: 25,
  tapBounce: 0.2,
  flickBounce: 0.1,
  momentum: 1,
  cometReach: 180,
  cometWidth: 12,
  disabled: false
};

const UNIT_OPTIONS = [
  { value: 'percent', label: '%' },
  { value: 'degrees', label: '°' },
  { value: 'decibels', label: 'dB' },
  { value: 'none', label: 'None' }
];
const UNITS: Record<string, string> = { percent: '%', degrees: '°', decibels: 'dB', none: '' };

const value = ref(62);
const accent = ref(DEFAULTS.accent);
const ink = ref(DEFAULTS.ink);
const unit = ref(DEFAULTS.unit);
const size = ref(DEFAULTS.size);
const sweep = ref(DEFAULTS.sweep);
const thickness = ref(DEFAULTS.thickness);
const speed = ref(DEFAULTS.speed);
const tapBounce = ref(DEFAULTS.tapBounce);
const flickBounce = ref(DEFAULTS.flickBounce);
const momentum = ref(DEFAULTS.momentum);
const cometReach = ref(DEFAULTS.cometReach);
const cometWidth = ref(DEFAULTS.cometWidth);
const disabled = ref(DEFAULTS.disabled);

const cometDialProps = computed(() => ({
  accent: accent.value,
  ink: ink.value,
  unit: UNITS[unit.value] ?? '%',
  size: size.value,
  sweep: sweep.value,
  thickness: thickness.value,
  speed: speed.value,
  tapBounce: tapBounce.value,
  flickBounce: flickBounce.value,
  momentum: momentum.value,
  cometReach: cometReach.value,
  cometWidth: cometWidth.value,
  disabled: disabled.value
}));

const hasChanges = computed(
  () =>
    accent.value !== DEFAULTS.accent ||
    ink.value !== DEFAULTS.ink ||
    unit.value !== DEFAULTS.unit ||
    size.value !== DEFAULTS.size ||
    sweep.value !== DEFAULTS.sweep ||
    thickness.value !== DEFAULTS.thickness ||
    speed.value !== DEFAULTS.speed ||
    tapBounce.value !== DEFAULTS.tapBounce ||
    flickBounce.value !== DEFAULTS.flickBounce ||
    momentum.value !== DEFAULTS.momentum ||
    cometReach.value !== DEFAULTS.cometReach ||
    cometWidth.value !== DEFAULTS.cometWidth ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  accent.value = DEFAULTS.accent;
  ink.value = DEFAULTS.ink;
  unit.value = DEFAULTS.unit;
  size.value = DEFAULTS.size;
  sweep.value = DEFAULTS.sweep;
  thickness.value = DEFAULTS.thickness;
  speed.value = DEFAULTS.speed;
  tapBounce.value = DEFAULTS.tapBounce;
  flickBounce.value = DEFAULTS.flickBounce;
  momentum.value = DEFAULTS.momentum;
  cometReach.value = DEFAULTS.cometReach;
  cometWidth.value = DEFAULTS.cometWidth;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'value',
    type: 'number',
    default: 'undefined',
    description: 'Controlled value. A change from outside launches the reading on the tap spring.'
  },
  { name: 'defaultValue', type: 'number', default: '62', description: 'Initial value when uncontrolled.' },
  { name: 'min', type: 'number', default: '0', description: 'Lowest value.' },
  { name: 'max', type: 'number', default: '100', description: 'Highest value.' },
  { name: 'step', type: 'number', default: '1', description: 'Snapping grid, and the keyboard nudge.' },
  { name: 'unit', type: 'string', default: '"%"', description: 'Suffix after the figure. Empty hides it.' },
  { name: 'label', type: 'string', default: '"Level"', description: 'Accessible name of the slider.' },
  { name: 'accent', type: 'string', default: '"#f5f5f5"', description: 'The lit arc, the bead and the comet.' },
  { name: 'ink', type: 'string', default: '"#fdfdfd"', description: 'The track and the readout.' },
  {
    name: 'size',
    type: 'number',
    default: '250',
    description: 'Diameter in pixels. Everything inside scales with it.'
  },
  {
    name: 'sweep',
    type: 'number',
    default: '320',
    description: 'Degrees the arc covers, with the gap centred at the bottom.'
  },
  {
    name: 'thickness',
    type: 'number',
    default: '5',
    description: 'Stroke width of the track and the arc. The bead follows it.'
  },
  { name: 'speed', type: 'number', default: '25', description: 'How quickly the reading arrives, 0 to 100.' },
  { name: 'tapBounce', type: 'number', default: '0.2', description: 'Ring-down after a tap. 0 stops dead.' },
  {
    name: 'flickBounce',
    type: 'number',
    default: '0.1',
    description: 'Ring-down after a full-speed flick. A slower release lands between the two.'
  },
  {
    name: 'momentum',
    type: 'number',
    default: '1',
    description: 'How far a flick carries the reading past where you let go. 0 drops it where released.'
  },
  {
    name: 'cometReach',
    type: 'number',
    default: '180',
    description: 'Degrees of trail behind the bead at full speed.'
  },
  {
    name: 'cometWidth',
    type: 'number',
    default: '12',
    description: 'Extra stroke width at the head of the trail at full speed.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the dial and ignores input.' },
  {
    name: '@change',
    type: '(value: number) => void',
    default: '-',
    description: 'Emitted on every snapped change, including during a drag.'
  },
  {
    name: '@changeEnd',
    type: '(value: number, detail: { velocity: number; bounce: number }) => void',
    default: '-',
    description: 'Emitted on release and on a key, with the release velocity and the bounce it earned.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
