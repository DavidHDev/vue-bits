<template>
  <h1 class="sub-category">Jelly Radio</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="jellyRadio.usage"
    :source="jellyRadioSource"
    component-name="JellyRadio"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <JellyRadio
          :key="key"
          :items="set"
          :value="current"
          :chip-color="chipColor"
          :active-color="activeColor"
          :text-color="textColor"
          :active-text-color="activeTextColor"
          :size="size"
          :gap="gap"
          :radius="radius"
          :swell="swell"
          :barge="barge"
          :shrink="shrink"
          :jelly="jelly"
          :bounce="bounce"
          :stagger="stagger"
          :stiffness="stiffness"
          :disabled="disabled"
          @change="value = $event"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Items"
          :options="ITEM_OPTIONS"
          :width="120"
          :model-value="items"
          @update:model-value="setItems($event as ItemSetKey)"
        />
        <PreviewSelect title="Size" :options="SIZE_OPTIONS" :width="120" v-model="size" />
        <PreviewColorPicker title="Chip" v-model="chipColor" />
        <PreviewColorPicker title="Active" v-model="activeColor" />
        <PreviewColorPicker title="Text" v-model="textColor" />
        <PreviewColorPicker title="Active Text" v-model="activeTextColor" />
        <PreviewSlider title="Gap" :min="4" :max="20" :step="1" valueUnit="px" v-model="gap" />
        <PreviewSlider title="Radius" :min="0" :max="22" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Swell" :min="0.05" :max="0.4" :step="0.01" v-model="swell" />
        <PreviewSlider title="Barge" :min="0" :max="20" :step="1" valueUnit="px" v-model="barge" />
        <PreviewSlider title="Shrink" :min="0" :max="0.15" :step="0.01" v-model="shrink" />
        <PreviewSlider title="Jelly" :min="0" :max="1.5" :step="0.1" v-model="jelly" />
        <PreviewSlider title="Bounce" :min="0" :max="0.4" :step="0.05" v-model="bounce" />
        <PreviewSlider title="Stagger" :min="0" :max="60" :step="2" valueUnit="ms" v-model="stagger" />
        <PreviewSlider title="Stiffness" :min="300" :max="900" :step="20" v-model="stiffness" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="jelly-radio" :usage="jellyRadio.usage!" :source="jellyRadioSource" />
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
import { jellyRadio } from '@/constants/code/Micro/jellyRadioCode';
import JellyRadio from '@/content/Micro/JellyRadio/JellyRadio.vue';
import jellyRadioSource from '@/content/Micro/JellyRadio/JellyRadio.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type ItemSetKey = 'levels' | 'heat' | 'days';

const ITEM_SETS: Record<ItemSetKey, string[]> = {
  levels: ['Off', 'Low', 'Medium', 'High', 'Max'],
  heat: ['Mild', 'Medium', 'Hot'],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
};
const middleOf = (list: string[]) => list[Math.floor(list.length / 2)];

const DEFAULTS = {
  items: 'levels' as ItemSetKey,
  size: 'md' as 'sm' | 'md' | 'lg',
  chipColor: '#27272a',
  activeColor: '#f5f5f5',
  textColor: '#f5f5f5',
  activeTextColor: '#18181b',
  gap: 8,
  radius: 18,
  swell: 0.2,
  barge: 6,
  shrink: 0.05,
  jelly: 1,
  bounce: 0.25,
  stagger: 22,
  stiffness: 580,
  disabled: false
};

const ITEM_OPTIONS = [
  { value: 'levels', label: 'Levels' },
  { value: 'heat', label: 'Heat' },
  { value: 'days', label: 'Days' }
];
const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const items = ref(DEFAULTS.items);
const size = ref(DEFAULTS.size);
const chipColor = ref(DEFAULTS.chipColor);
const activeColor = ref(DEFAULTS.activeColor);
const textColor = ref(DEFAULTS.textColor);
const activeTextColor = ref(DEFAULTS.activeTextColor);
const gap = ref(DEFAULTS.gap);
const radius = ref(DEFAULTS.radius);
const swell = ref(DEFAULTS.swell);
const barge = ref(DEFAULTS.barge);
const shrink = ref(DEFAULTS.shrink);
const jelly = ref(DEFAULTS.jelly);
const bounce = ref(DEFAULTS.bounce);
const stagger = ref(DEFAULTS.stagger);
const stiffness = ref(DEFAULTS.stiffness);
const disabled = ref(DEFAULTS.disabled);

const set = computed(() => ITEM_SETS[items.value] ?? ITEM_SETS.levels);
const value = ref(middleOf(set.value));
const current = computed(() => (set.value.includes(value.value) ? value.value : middleOf(set.value)));

const setItems = (next: ItemSetKey) => {
  items.value = next;
  value.value = middleOf(ITEM_SETS[next] ?? ITEM_SETS.levels);
};

const hasChanges = computed(
  () =>
    items.value !== DEFAULTS.items ||
    size.value !== DEFAULTS.size ||
    chipColor.value !== DEFAULTS.chipColor ||
    activeColor.value !== DEFAULTS.activeColor ||
    textColor.value !== DEFAULTS.textColor ||
    activeTextColor.value !== DEFAULTS.activeTextColor ||
    gap.value !== DEFAULTS.gap ||
    radius.value !== DEFAULTS.radius ||
    swell.value !== DEFAULTS.swell ||
    barge.value !== DEFAULTS.barge ||
    shrink.value !== DEFAULTS.shrink ||
    jelly.value !== DEFAULTS.jelly ||
    bounce.value !== DEFAULTS.bounce ||
    stagger.value !== DEFAULTS.stagger ||
    stiffness.value !== DEFAULTS.stiffness ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  setItems(DEFAULTS.items);
  size.value = DEFAULTS.size;
  chipColor.value = DEFAULTS.chipColor;
  activeColor.value = DEFAULTS.activeColor;
  textColor.value = DEFAULTS.textColor;
  activeTextColor.value = DEFAULTS.activeTextColor;
  gap.value = DEFAULTS.gap;
  radius.value = DEFAULTS.radius;
  swell.value = DEFAULTS.swell;
  barge.value = DEFAULTS.barge;
  shrink.value = DEFAULTS.shrink;
  jelly.value = DEFAULTS.jelly;
  bounce.value = DEFAULTS.bounce;
  stagger.value = DEFAULTS.stagger;
  stiffness.value = DEFAULTS.stiffness;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: '(string | { value: string; label: string; icon?: IconArray | Component; disabled?: boolean })[]',
    default: '["Off", "Low", "Medium", "High", "Max"]',
    description: 'The chips. A string is both value and label.'
  },
  { name: 'value', type: 'string', default: 'undefined', description: 'Controlled value. Outside changes jump.' },
  {
    name: 'defaultValue',
    type: 'string',
    default: 'undefined',
    description: 'Initial value when uncontrolled. Falls back to the first item.'
  },
  {
    name: '@change',
    type: '(value: string, index: number) => void',
    default: '-',
    description: 'Emitted on the commit, before the motion ends.'
  },
  { name: 'chipColor', type: 'string', default: '"#27272a"', description: 'Surface of an unchosen chip.' },
  { name: 'activeColor', type: 'string', default: '"#f5f5f5"', description: 'Surface of the chosen chip.' },
  {
    name: 'textColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'Label of an unchosen chip, and the hover tone.'
  },
  { name: 'activeTextColor', type: 'string', default: '"#18181b"', description: 'Label of the chosen chip.' },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Chip height 28, 36 or 44 pixels. Large is the touch-first size.'
  },
  { name: 'gap', type: 'number', default: '8', description: 'Rest spacing between chips in pixels.' },
  {
    name: 'radius',
    type: 'number',
    default: '18',
    description: 'Corner radius in pixels. 18 is a pill at medium.'
  },
  {
    name: 'swell',
    type: 'number',
    default: '0.2',
    description: 'How much the chosen chip grows. It also sets the room the neighbours make.'
  },
  {
    name: 'barge',
    type: 'number',
    default: '6',
    description: 'Extra pixels every neighbour is shoved beyond that room. 0 only makes room.'
  },
  { name: 'shrink', type: 'number', default: '0.05', description: 'How much every unchosen chip gives up.' },
  {
    name: 'jelly',
    type: 'number',
    default: '1',
    description: 'The wide-before-tall split. 0 swells uniformly, 1.5 exaggerates it.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.25',
    description: 'One minus the damping ratio. 0 arrives and stops, 0.4 rings.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '22',
    description: 'Milliseconds per row step before a neighbour moves. 0 moves the row as a slab.'
  },
  {
    name: 'stiffness',
    type: 'number',
    default: '580',
    description: 'Spring stiffness of the chosen chip. Neighbours soften from it with distance.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Fades the group and ignores input.' },
  { name: 'ariaLabel', type: 'string', default: '"Options"', description: 'Accessible name of the group.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the group.' }
];
</script>
