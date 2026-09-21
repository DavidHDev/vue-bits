<template>
  <h1 class="sub-category">Rubber Segment</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="rubberSegment.usage"
    :source="rubberSegmentSource"
    component-name="RubberSegment"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <RubberSegment
          :key="`${preset}-${key}`"
          :items="items"
          :default-value="items[1]"
          :track-color="trackColor"
          :thumb-color="thumbColor"
          :text-color="textColor"
          :active-text-color="activeTextColor"
          :size="size"
          :radius="radius"
          :inset="inset"
          :equal-slots="equalSlots"
          :stretch="stretch"
          :squash="squash"
          :speed="speed"
          :glide="glide"
          :draggable="draggable"
          :disabled="disabled"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Items" :options="PRESET_OPTIONS" :width="220" v-model="preset" />
        <PreviewSelect title="Size" :options="SIZE_OPTIONS" :width="120" v-model="size" />
        <PreviewColorPicker title="Track" v-model="trackColor" />
        <PreviewColorPicker title="Thumb" v-model="thumbColor" />
        <PreviewColorPicker title="Text" v-model="textColor" />
        <PreviewColorPicker title="Active Text" v-model="activeTextColor" />
        <PreviewSlider title="Radius" :min="0" :max="24" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Inset" :min="1" :max="8" :step="1" valueUnit="px" v-model="inset" />
        <PreviewSwitch title="Equal Slots" v-model="equalSlots" />
        <PreviewSlider title="Stretch" :min="0" :max="100" :step="5" v-model="stretch" />
        <PreviewSlider title="Squash" :min="0" :max="6" :step="0.5" valueUnit="px" v-model="squash" />
        <PreviewSlider title="Speed" :min="0.25" :max="2" :step="0.05" valueUnit="x" v-model="speed" />
        <PreviewSlider title="Glide" :min="0" :max="100" :step="5" v-model="glide" />
        <PreviewSwitch title="Draggable" v-model="draggable" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="rubber-segment" :usage="rubberSegment.usage!" :source="rubberSegmentSource" />
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
import { rubberSegment } from '@/constants/code/Micro/rubberSegmentCode';
import RubberSegment, { type RubberSegmentSize } from '@/content/Micro/RubberSegment/RubberSegment.vue';
import rubberSegmentSource from '@/content/Micro/RubberSegment/RubberSegment.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type PresetKey = 'periods' | 'views' | 'sizes';

const DEFAULTS = {
  preset: 'periods' as PresetKey,
  trackColor: '#27272a',
  thumbColor: '#fafafa',
  textColor: '#fafafa',
  activeTextColor: '#18181b',
  size: 'md' as RubberSegmentSize,
  radius: 10,
  inset: 3,
  equalSlots: true,
  stretch: 100,
  squash: 3,
  speed: 1,
  glide: 75,
  draggable: true,
  disabled: false
};

const PRESETS: Record<PresetKey, string[]> = {
  periods: ['Day', 'Week', 'Month', 'Year'],
  views: ['List', 'Board', 'Calendar'],
  sizes: ['S', 'M', 'L', 'XL', 'XXL']
};

const PRESET_OPTIONS = [
  { value: 'periods', label: 'Day / Week / Month / Year' },
  { value: 'views', label: 'List / Board / Calendar' },
  { value: 'sizes', label: 'S / M / L / XL / XXL' }
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const preset = ref(DEFAULTS.preset);
const trackColor = ref(DEFAULTS.trackColor);
const thumbColor = ref(DEFAULTS.thumbColor);
const textColor = ref(DEFAULTS.textColor);
const activeTextColor = ref(DEFAULTS.activeTextColor);
const size = ref(DEFAULTS.size);
const radius = ref(DEFAULTS.radius);
const inset = ref(DEFAULTS.inset);
const equalSlots = ref(DEFAULTS.equalSlots);
const stretch = ref(DEFAULTS.stretch);
const squash = ref(DEFAULTS.squash);
const speed = ref(DEFAULTS.speed);
const glide = ref(DEFAULTS.glide);
const draggable = ref(DEFAULTS.draggable);
const disabled = ref(DEFAULTS.disabled);

const items = computed(() => PRESETS[preset.value] || PRESETS.periods);

const hasChanges = computed(
  () =>
    preset.value !== DEFAULTS.preset ||
    trackColor.value !== DEFAULTS.trackColor ||
    thumbColor.value !== DEFAULTS.thumbColor ||
    textColor.value !== DEFAULTS.textColor ||
    activeTextColor.value !== DEFAULTS.activeTextColor ||
    size.value !== DEFAULTS.size ||
    radius.value !== DEFAULTS.radius ||
    inset.value !== DEFAULTS.inset ||
    equalSlots.value !== DEFAULTS.equalSlots ||
    stretch.value !== DEFAULTS.stretch ||
    squash.value !== DEFAULTS.squash ||
    speed.value !== DEFAULTS.speed ||
    glide.value !== DEFAULTS.glide ||
    draggable.value !== DEFAULTS.draggable ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  preset.value = DEFAULTS.preset;
  trackColor.value = DEFAULTS.trackColor;
  thumbColor.value = DEFAULTS.thumbColor;
  textColor.value = DEFAULTS.textColor;
  activeTextColor.value = DEFAULTS.activeTextColor;
  size.value = DEFAULTS.size;
  radius.value = DEFAULTS.radius;
  inset.value = DEFAULTS.inset;
  equalSlots.value = DEFAULTS.equalSlots;
  stretch.value = DEFAULTS.stretch;
  squash.value = DEFAULTS.squash;
  speed.value = DEFAULTS.speed;
  glide.value = DEFAULTS.glide;
  draggable.value = DEFAULTS.draggable;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: '(string | { value: string; label: string; icon?: IconArray | Component })[]',
    default: '-',
    description: 'The slots, in order. A string is both value and label.'
  },
  {
    name: 'value',
    type: 'string',
    default: 'undefined',
    description: 'Controlled value. A change from outside jumps the thumb without animation.'
  },
  {
    name: 'defaultValue',
    type: 'string',
    default: 'undefined',
    description: 'Initial value when uncontrolled; the first item if omitted.'
  },
  {
    name: '@change',
    type: '(value: string, index: number) => void',
    default: '-',
    description: 'Emitted on a tap, on a drag release and on every arrow key.'
  },
  { name: 'trackColor', type: 'string', default: '"#27272a"', description: 'The well behind the slots.' },
  {
    name: 'thumbColor',
    type: 'string',
    default: '"#fafafa"',
    description: 'The rubber thumb, and the focus ring.'
  },
  { name: 'textColor', type: 'string', default: '"#fafafa"', description: 'Idle labels, drawn at 70%.' },
  {
    name: 'activeTextColor',
    type: 'string',
    default: '"#18181b"',
    description: 'The label revealed inside the thumb.'
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Track height 28, 36 or 44 pixels; font and padding follow.'
  },
  { name: 'radius', type: 'number', default: '10', description: 'Track corner radius in pixels.' },
  {
    name: 'inset',
    type: 'number',
    default: '3',
    description: 'Gap between the thumb and the track edge; the thumb corner is radius minus inset.'
  },
  {
    name: 'equalSlots',
    type: 'boolean',
    default: 'true',
    description: 'Every slot the same width. Off, slots hug their labels and the thumb changes width per slot.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '100',
    description: 'How far a tap dilates the thumb across old and new slot before it contracts. 0 is a plain slide.'
  },
  {
    name: 'squash',
    type: 'number',
    default: '3',
    description: 'Pixels the trailing edge lands past the slot edge before relaxing. 0 removes the squash.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Scales every phase together; 0.25 is slow motion.'
  },
  {
    name: 'glide',
    type: 'number',
    default: '75',
    description: 'How far a flick carries the thumb before it snaps. 0 always lands on the nearest slot.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Lets the thumb be grabbed, dragged and flicked.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the control and ignores input.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the track.' },
  {
    name: 'ariaLabel',
    type: 'string',
    default: '"Segmented control"',
    description: 'Accessible name of the radio group.'
  }
];
</script>
