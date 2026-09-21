<template>
  <h1 class="sub-category">Dodge Field</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="dodgeField.usage"
    :source="dodgeFieldSource"
    component-name="DodgeField"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <DodgeField :key="key" v-bind="dodgeFieldProps" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Ink" v-model="inkColor" />
        <PreviewColorPicker title="Contrast" v-model="contrastColor" />
        <PreviewSlider title="Field Height" :min="120" :max="360" :step="10" valueUnit="px" v-model="fieldHeight" />
        <PreviewSlider title="Reach" :min="14" :max="120" :step="2" valueUnit="px" v-model="reach" />
        <PreviewSlider title="Radius" :min="60" :max="200" :step="5" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Falloff" :min="1" :max="4" :step="0.5" v-model="falloff" />
        <PreviewSlider title="Flee" :min="60" :max="300" :step="10" valueUnit="ms" v-model="fleeDuration" />
        <PreviewSlider title="Return" :min="200" :max="1000" :step="20" valueUnit="ms" v-model="returnDuration" />
        <PreviewSlider title="Return Bounce" :min="0" :max="0.3" :step="0.05" v-model="returnBounce" />
        <PreviewSlider title="Patience" :min="1" :max="8" :step="1" v-model="patience" />
        <PreviewSelect title="Axis" :options="AXIS_OPTIONS" :width="130" v-model="axis" />
        <PreviewSelect title="Wall" :options="WALL_OPTIONS" :width="120" v-model="wall" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="dodge-field" :usage="dodgeField.usage!" :source="dodgeFieldSource" />
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
import { dodgeField } from '@/constants/code/Micro/dodgeFieldCode';
import DodgeField, { type DodgeAxis, type DodgeWall } from '@/content/Micro/DodgeField/DodgeField.vue';
import dodgeFieldSource from '@/content/Micro/DodgeField/DodgeField.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  inkColor: '#f5f5f5',
  contrastColor: '#18181b',
  fieldHeight: 240,
  reach: 72,
  radius: 120,
  falloff: 2,
  fleeDuration: 130,
  returnDuration: 620,
  returnBounce: 0.1,
  patience: 4,
  axis: 'both' as DodgeAxis,
  wall: 'clamp' as DodgeWall,
  disabled: false
};

const AXIS_OPTIONS = [
  { value: 'both', label: 'Both' },
  { value: 'x', label: 'Horizontal' },
  { value: 'y', label: 'Vertical' }
];

const WALL_OPTIONS = [
  { value: 'clamp', label: 'Clamp' },
  { value: 'bounce', label: 'Bounce' }
];

const inkColor = ref(DEFAULTS.inkColor);
const contrastColor = ref(DEFAULTS.contrastColor);
const fieldHeight = ref(DEFAULTS.fieldHeight);
const reach = ref(DEFAULTS.reach);
const radius = ref(DEFAULTS.radius);
const falloff = ref(DEFAULTS.falloff);
const fleeDuration = ref(DEFAULTS.fleeDuration);
const returnDuration = ref(DEFAULTS.returnDuration);
const returnBounce = ref(DEFAULTS.returnBounce);
const patience = ref(DEFAULTS.patience);
const axis = ref(DEFAULTS.axis);
const wall = ref(DEFAULTS.wall);
const disabled = ref(DEFAULTS.disabled);

const dodgeFieldProps = computed(() => ({
  inkColor: inkColor.value,
  contrastColor: contrastColor.value,
  fieldHeight: fieldHeight.value,
  reach: reach.value,
  radius: radius.value,
  falloff: falloff.value,
  fleeDuration: fleeDuration.value,
  returnDuration: returnDuration.value,
  returnBounce: returnBounce.value,
  patience: patience.value,
  axis: axis.value,
  wall: wall.value,
  disabled: disabled.value
}));

const hasChanges = computed(
  () =>
    inkColor.value !== DEFAULTS.inkColor ||
    contrastColor.value !== DEFAULTS.contrastColor ||
    fieldHeight.value !== DEFAULTS.fieldHeight ||
    reach.value !== DEFAULTS.reach ||
    radius.value !== DEFAULTS.radius ||
    falloff.value !== DEFAULTS.falloff ||
    fleeDuration.value !== DEFAULTS.fleeDuration ||
    returnDuration.value !== DEFAULTS.returnDuration ||
    returnBounce.value !== DEFAULTS.returnBounce ||
    patience.value !== DEFAULTS.patience ||
    axis.value !== DEFAULTS.axis ||
    wall.value !== DEFAULTS.wall ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  inkColor.value = DEFAULTS.inkColor;
  contrastColor.value = DEFAULTS.contrastColor;
  fieldHeight.value = DEFAULTS.fieldHeight;
  reach.value = DEFAULTS.reach;
  radius.value = DEFAULTS.radius;
  falloff.value = DEFAULTS.falloff;
  fleeDuration.value = DEFAULTS.fleeDuration;
  returnDuration.value = DEFAULTS.returnDuration;
  returnBounce.value = DEFAULTS.returnBounce;
  patience.value = DEFAULTS.patience;
  axis.value = DEFAULTS.axis;
  wall.value = DEFAULTS.wall;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'default slot',
    type: '({ dodges, gave, caught, fleeing }) => VNode',
    default: 'built-in pill',
    description:
      'What flees. Omit it for the built-in pill, or slot in any element and read { dodges, gave, caught, fleeing } from the slot props.'
  },
  {
    name: 'taunts',
    type: 'string[]',
    default: '["Catch me", "Nope", "Too slow", "Almost", "Okay, okay"]',
    description: 'Labels for the built-in pill: the first at rest, then one per dodge, the last once it relents.'
  },
  {
    name: 'notice',
    type: 'string',
    default: '""',
    description: 'One line shown under the child on touch devices, where nothing dodges.'
  },
  {
    name: 'inkColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The pill tint and text, the caught fill and the focus ring all derive from it.'
  },
  {
    name: 'contrastColor',
    type: 'string',
    default: '"#18181b"',
    description: 'Text colour while the pill is caught.'
  },
  {
    name: 'fieldHeight',
    type: 'number',
    default: '240',
    description: 'Height of the invisible field in pixels; its width is the container.'
  },
  {
    name: 'reach',
    type: 'number',
    default: '72',
    description: 'How far it bolts, in pixels, with the pointer on its home.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '120',
    description: 'Distance from home at which it starts to react, in pixels.'
  },
  {
    name: 'falloff',
    type: 'number',
    default: '2',
    description: 'Exponent of the reaction curve. 1 drifts away from far off; 4 only flinches at the last moment.'
  },
  {
    name: 'fleeDuration',
    type: 'number',
    default: '130',
    description: 'Settle time of the dart, in milliseconds.'
  },
  {
    name: 'returnDuration',
    type: 'number',
    default: '620',
    description: 'Settle time of the glide home, in milliseconds.'
  },
  {
    name: 'returnBounce',
    type: 'number',
    default: '0.1',
    description: 'Overshoot on the way home. 0.1 is a hair, 0.3 a visible wobble.'
  },
  {
    name: 'axis',
    type: '"both" | "x" | "y"',
    default: '"both"',
    description: 'Which way it may flee.'
  },
  {
    name: 'wall',
    type: '"clamp" | "bounce"',
    default: '"clamp"',
    description: 'At the edge of the field: stop dead, or fold the overflow back so it rebounds.'
  },
  {
    name: 'patience',
    type: 'number',
    default: '4',
    description:
      'Dodges before it gives in and sits still, at least 1. Never wrap a decline or close control in a field that dodges.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Sits still and stops counting; the child stays clickable.'
  },
  { name: '@dodge', type: '(count: number) => void', default: '-', description: 'Emitted on each counted dodge.' },
  { name: '@relent', type: '() => void', default: '-', description: 'Emitted when it gives in.' },
  { name: '@catch', type: '() => void', default: '-', description: 'Emitted when the child is clicked.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the field.' }
];
</script>
