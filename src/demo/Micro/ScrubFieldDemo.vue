<template>
  <h1 class="sub-category">Scrub Field</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="scrubField.usage"
    :source="scrubFieldSource"
    component-name="ScrubField"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <ScrubField
          :key="`${min}-${max}-${step}-${key}`"
          :label="label"
          :suffix="suffix"
          :default-value="defaultValue"
          :min="min"
          :max="max"
          :step="step"
          :size="size"
          :sensitivity="sensitivity"
          :rubber-reach="rubberReach"
          :return-duration="returnDuration"
          :coarse-multiplier="coarseMultiplier"
          :fine-multiplier="fineMultiplier"
          :show-delta="showDelta"
          :show-dirty="showDirty"
          :show-fill="showFill"
          :accent="accent"
          :chip-color="chipColor"
          :disabled="disabled"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Accent" v-model="accent" />
        <PreviewColorPicker title="Chip" v-model="chipColor" />
        <PreviewInput title="Label" :maxlength="14" v-model="label" />
        <PreviewInput title="Suffix" :maxlength="4" v-model="suffix" />
        <PreviewSlider title="Default" :min="0" :max="100" :step="1" v-model="defaultValue" />
        <PreviewSlider title="Min" :min="-100" :max="0" :step="10" v-model="min" />
        <PreviewSlider title="Max" :min="10" :max="500" :step="10" v-model="max" />
        <PreviewSelect
          title="Step"
          :options="STEP_OPTIONS"
          :width="100"
          :model-value="step"
          @update:model-value="step = Number($event)"
        />
        <PreviewSelect title="Size" :options="SIZE_OPTIONS" :width="120" v-model="size" />
        <PreviewSlider title="Sensitivity" :min="1" :max="8" :step="1" valueUnit="px" v-model="sensitivity" />
        <PreviewSlider title="Rubber Reach" :min="0" :max="25" :step="1" valueUnit="%" v-model="rubberReach" />
        <PreviewSlider title="Return" :min="150" :max="600" :step="10" valueUnit="ms" v-model="returnDuration" />
        <PreviewSlider title="Coarse" :min="2" :max="20" :step="1" valueUnit="x" v-model="coarseMultiplier" />
        <PreviewSlider title="Fine" :min="0.05" :max="0.5" :step="0.05" valueUnit="x" v-model="fineMultiplier" />
        <PreviewSwitch title="Ghost Delta" v-model="showDelta" />
        <PreviewSwitch title="Dirty Ring" v-model="showDirty" />
        <PreviewSwitch title="Fill" v-model="showFill" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="scrub-field" :usage="scrubField.usage!" :source="scrubFieldSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { scrubField } from '@/constants/code/Micro/scrubFieldCode';
import ScrubField, { type ScrubFieldSize } from '@/content/Micro/ScrubField/ScrubField.vue';
import scrubFieldSource from '@/content/Micro/ScrubField/ScrubField.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  accent: '#f5f5f5',
  chipColor: '#27272a',
  label: 'Radius',
  suffix: 'px',
  defaultValue: 24,
  min: 0,
  max: 100,
  step: 1,
  size: 'lg' as ScrubFieldSize,
  sensitivity: 2,
  rubberReach: 8,
  returnDuration: 300,
  coarseMultiplier: 10,
  fineMultiplier: 0.1,
  showDelta: true,
  showDirty: false,
  showFill: true,
  disabled: false
};

const STEP_OPTIONS = [
  { value: 0.1, label: '0.1' },
  { value: 0.5, label: '0.5' },
  { value: 1, label: '1' },
  { value: 5, label: '5' },
  { value: 10, label: '10' }
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const accent = ref(DEFAULTS.accent);
const chipColor = ref(DEFAULTS.chipColor);
const label = ref(DEFAULTS.label);
const suffix = ref(DEFAULTS.suffix);
const defaultValue = ref(DEFAULTS.defaultValue);
const min = ref(DEFAULTS.min);
const max = ref(DEFAULTS.max);
const step = ref(DEFAULTS.step);
const size = ref(DEFAULTS.size);
const sensitivity = ref(DEFAULTS.sensitivity);
const rubberReach = ref(DEFAULTS.rubberReach);
const returnDuration = ref(DEFAULTS.returnDuration);
const coarseMultiplier = ref(DEFAULTS.coarseMultiplier);
const fineMultiplier = ref(DEFAULTS.fineMultiplier);
const showDelta = ref(DEFAULTS.showDelta);
const showDirty = ref(DEFAULTS.showDirty);
const showFill = ref(DEFAULTS.showFill);
const disabled = ref(DEFAULTS.disabled);

const hasChanges = computed(
  () =>
    accent.value !== DEFAULTS.accent ||
    chipColor.value !== DEFAULTS.chipColor ||
    label.value !== DEFAULTS.label ||
    suffix.value !== DEFAULTS.suffix ||
    defaultValue.value !== DEFAULTS.defaultValue ||
    min.value !== DEFAULTS.min ||
    max.value !== DEFAULTS.max ||
    step.value !== DEFAULTS.step ||
    size.value !== DEFAULTS.size ||
    sensitivity.value !== DEFAULTS.sensitivity ||
    rubberReach.value !== DEFAULTS.rubberReach ||
    returnDuration.value !== DEFAULTS.returnDuration ||
    coarseMultiplier.value !== DEFAULTS.coarseMultiplier ||
    fineMultiplier.value !== DEFAULTS.fineMultiplier ||
    showDelta.value !== DEFAULTS.showDelta ||
    showDirty.value !== DEFAULTS.showDirty ||
    showFill.value !== DEFAULTS.showFill ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  accent.value = DEFAULTS.accent;
  chipColor.value = DEFAULTS.chipColor;
  label.value = DEFAULTS.label;
  suffix.value = DEFAULTS.suffix;
  defaultValue.value = DEFAULTS.defaultValue;
  min.value = DEFAULTS.min;
  max.value = DEFAULTS.max;
  step.value = DEFAULTS.step;
  size.value = DEFAULTS.size;
  sensitivity.value = DEFAULTS.sensitivity;
  rubberReach.value = DEFAULTS.rubberReach;
  returnDuration.value = DEFAULTS.returnDuration;
  coarseMultiplier.value = DEFAULTS.coarseMultiplier;
  fineMultiplier.value = DEFAULTS.fineMultiplier;
  showDelta.value = DEFAULTS.showDelta;
  showDirty.value = DEFAULTS.showDirty;
  showFill.value = DEFAULTS.showFill;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'label',
    type: 'string',
    default: '"Radius"',
    description: 'The field name. Drag anywhere on the chip to scrub; click without moving to type.'
  },
  {
    name: 'suffix',
    type: 'string',
    default: '"px"',
    description: 'Unit after the number, also read by screen readers.'
  },
  {
    name: 'value',
    type: 'number',
    default: 'undefined',
    description: 'Controlled value; changes from outside land without motion.'
  },
  {
    name: 'defaultValue',
    type: 'number',
    default: '24',
    description: 'Initial value and the dirty baseline: the ring turns off exactly here.'
  },
  { name: 'min', type: 'number', default: '0', description: 'Lower bound; the rubber band starts here.' },
  { name: 'max', type: 'number', default: '100', description: 'Upper bound; the rubber band starts here.' },
  {
    name: 'step',
    type: 'number',
    default: '1',
    description: 'Granularity of drag and arrows; sets the decimals shown.'
  },
  { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Chip height 28, 34 or 44 pixels.' },
  {
    name: 'sensitivity',
    type: 'number',
    default: '2',
    description: 'Pixels of travel per step. 1 is twitchy, 6 is precise.'
  },
  {
    name: 'rubberReach',
    type: 'number',
    default: '8',
    description: 'How far past a bound the number can be pushed, as a percent of the range. 0 is a hard stop.'
  },
  {
    name: 'returnDuration',
    type: 'number',
    default: '300',
    description: 'Duration in milliseconds of the critically damped snap back to the bound.'
  },
  {
    name: 'coarseMultiplier',
    type: 'number',
    default: '10',
    description: 'Step multiplier while Shift is held, and for Page Up and Page Down.'
  },
  {
    name: 'fineMultiplier',
    type: 'number',
    default: '0.1',
    description: 'Step multiplier while Alt or Option is held; adds a decimal.'
  },
  {
    name: 'showDelta',
    type: 'boolean',
    default: 'true',
    description: 'Shows the signed change in a pill riding the pointer.'
  },
  {
    name: 'showDirty',
    type: 'boolean',
    default: 'false',
    description: 'Rings the chip while the value differs from the default.'
  },
  {
    name: 'showFill',
    type: 'boolean',
    default: 'true',
    description: 'Fills the chip from the left in proportion to where the value sits in the range.'
  },
  {
    name: 'accent',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'Fill band, dirty ring and delta pill.'
  },
  {
    name: 'chipColor',
    type: 'string',
    default: '"#27272a"',
    description: 'Chip surface. Text inherits from the page.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the chip and ignores input.' },
  {
    name: '@change',
    type: '(value: number) => void',
    default: '-',
    description: 'Emitted on every step, key and typed commit.'
  },
  {
    name: '@commit',
    type: '(value: number) => void',
    default: '-',
    description: 'Emitted on release, on a key step and on blur or Enter.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the chip.' }
];
</script>
