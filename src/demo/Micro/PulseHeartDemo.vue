<template>
  <h1 class="sub-category">Pulse Heart</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="pulseHeart.usage"
    :source="pulseHeartSource"
    component-name="PulseHeart"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <PulseHeart
          :key="key"
          :count="count"
          :show-count="showCount"
          :icon="icon"
          :idle-outline="idleOutline"
          :liked-color="likedColor"
          :idle-color="idleColor"
          :pill-color="pillColor"
          :text-color="textColor"
          :size="size"
          :corner="corner"
          :duration="duration"
          :dot-size="dotSize"
          :overshoot="overshoot"
          :beat="beat"
          :roll-duration="rollDuration"
          :disabled="disabled"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Count" :min="0" :max="2000" :step="1" v-model="count" />
        <PreviewSwitch title="Show Count" v-model="showCount" />
        <PreviewSelect title="Icon" :options="ICON_OPTIONS" :width="120" v-model="icon" />
        <PreviewSwitch title="Idle Outline" v-model="idleOutline" />
        <PreviewColorPicker title="Liked" v-model="likedColor" />
        <PreviewColorPicker title="Idle" v-model="idleColor" />
        <PreviewColorPicker title="Pill" v-model="pillColor" />
        <PreviewColorPicker title="Text" v-model="textColor" />
        <PreviewSlider title="Size" :min="24" :max="64" :step="2" valueUnit="px" v-model="size" />
        <PreviewSlider title="Corner" :min="6" :max="40" :step="1" valueUnit="px" v-model="corner" />
        <PreviewSlider title="Duration" :min="300" :max="900" :step="20" valueUnit="ms" v-model="duration" />
        <PreviewSlider title="Dot Size" :min="0.15" :max="0.6" :step="0.05" v-model="dotSize" />
        <PreviewSlider title="Overshoot" :min="0" :max="3" :step="0.1" v-model="overshoot" />
        <PreviewSlider title="Beat" :min="2" :max="4" :step="0.25" valueUnit="%" v-model="beat" />
        <PreviewSlider title="Roll" :min="150" :max="600" :step="10" valueUnit="ms" v-model="rollDuration" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="pulse-heart" :usage="pulseHeart.usage!" :source="pulseHeartSource" />
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
import { pulseHeart } from '@/constants/code/Micro/pulseHeartCode';
import PulseHeart, { type PulseHeartIcon } from '@/content/Micro/PulseHeart/PulseHeart.vue';
import pulseHeartSource from '@/content/Micro/PulseHeart/PulseHeart.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  count: 1204,
  showCount: true,
  icon: 'heart' as PulseHeartIcon,
  idleOutline: true,
  likedColor: '#ff4d6d',
  idleColor: '#8b8b93',
  pillColor: '#232326',
  textColor: '#f5f5f5',
  size: 40,
  corner: 32,
  duration: 560,
  dotSize: 0.3,
  overshoot: 1.7,
  beat: 3,
  rollDuration: 350,
  disabled: false
};

const ICON_OPTIONS = [
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
  { value: 'thumb', label: 'Thumb' }
];

const count = ref(DEFAULTS.count);
const showCount = ref(DEFAULTS.showCount);
const icon = ref(DEFAULTS.icon);
const idleOutline = ref(DEFAULTS.idleOutline);
const likedColor = ref(DEFAULTS.likedColor);
const idleColor = ref(DEFAULTS.idleColor);
const pillColor = ref(DEFAULTS.pillColor);
const textColor = ref(DEFAULTS.textColor);
const size = ref(DEFAULTS.size);
const corner = ref(DEFAULTS.corner);
const duration = ref(DEFAULTS.duration);
const dotSize = ref(DEFAULTS.dotSize);
const overshoot = ref(DEFAULTS.overshoot);
const beat = ref(DEFAULTS.beat);
const rollDuration = ref(DEFAULTS.rollDuration);
const disabled = ref(DEFAULTS.disabled);

const hasChanges = computed(
  () =>
    count.value !== DEFAULTS.count ||
    showCount.value !== DEFAULTS.showCount ||
    icon.value !== DEFAULTS.icon ||
    idleOutline.value !== DEFAULTS.idleOutline ||
    likedColor.value !== DEFAULTS.likedColor ||
    idleColor.value !== DEFAULTS.idleColor ||
    pillColor.value !== DEFAULTS.pillColor ||
    textColor.value !== DEFAULTS.textColor ||
    size.value !== DEFAULTS.size ||
    corner.value !== DEFAULTS.corner ||
    duration.value !== DEFAULTS.duration ||
    dotSize.value !== DEFAULTS.dotSize ||
    overshoot.value !== DEFAULTS.overshoot ||
    beat.value !== DEFAULTS.beat ||
    rollDuration.value !== DEFAULTS.rollDuration ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  count.value = DEFAULTS.count;
  showCount.value = DEFAULTS.showCount;
  icon.value = DEFAULTS.icon;
  idleOutline.value = DEFAULTS.idleOutline;
  likedColor.value = DEFAULTS.likedColor;
  idleColor.value = DEFAULTS.idleColor;
  pillColor.value = DEFAULTS.pillColor;
  textColor.value = DEFAULTS.textColor;
  size.value = DEFAULTS.size;
  corner.value = DEFAULTS.corner;
  duration.value = DEFAULTS.duration;
  dotSize.value = DEFAULTS.dotSize;
  overshoot.value = DEFAULTS.overshoot;
  beat.value = DEFAULTS.beat;
  rollDuration.value = DEFAULTS.rollDuration;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'liked',
    type: 'boolean',
    default: 'undefined',
    description: 'Controlled state. Changes from outside land without a run.'
  },
  { name: 'defaultLiked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
  {
    name: 'count',
    type: 'number',
    default: '0',
    description:
      'The number shown; a press adds or removes one. Rolls one glyph per press. For a multi-digit odometer with places and decimals, use Counter.'
  },
  {
    name: '@change',
    type: '(liked: boolean, count: number) => void',
    default: '-',
    description: 'Emitted on every press with the new state and count.'
  },
  {
    name: 'showCount',
    type: 'boolean',
    default: 'true',
    description: 'Shows the count; off collapses the pill to a circle.'
  },
  {
    name: 'icon',
    type: '"heart" | "star" | "thumb"',
    default: '"heart"',
    description: 'Built-in glyph. Pass your own element through the icon slot.'
  },
  {
    name: 'idleOutline',
    type: 'boolean',
    default: 'true',
    description: 'Draws the idle glyph as an outline. Off draws it as a muted solid.'
  },
  {
    name: 'size',
    type: 'number',
    default: '40',
    description: 'Glyph size in pixels; padding, gap and count size derive from it.'
  },
  { name: 'corner', type: 'number', default: '32', description: 'Pill corner radius in pixels.' },
  {
    name: 'likedColor',
    type: 'string',
    default: '"#ff4d6d"',
    description: 'Colour after the flip, and of the hover tint and focus ring.'
  },
  { name: 'idleColor', type: 'string', default: '"#8b8b93"', description: 'Colour before the flip.' },
  {
    name: 'pillColor',
    type: 'string',
    default: '"#232326"',
    description: 'Background of the pill that beats under the glyph.'
  },
  { name: 'textColor', type: 'string', default: '"#f5f5f5"', description: 'Colour of the count.' },
  {
    name: 'duration',
    type: 'number',
    default: '560',
    description: 'Length of the whole run in milliseconds; the flip is always at 40% of it.'
  },
  {
    name: 'dotSize',
    type: 'number',
    default: '0.3',
    description: 'How small the glyph gets at the flip, as a fraction of its size.'
  },
  {
    name: 'overshoot',
    type: 'number',
    default: '1.7',
    description: 'How far the glyph rebounds past rest on the way back. 0 lands without a rebound.'
  },
  { name: 'beat', type: 'number', default: '3', description: 'Percent the pill dips at the flip.' },
  {
    name: 'rollDuration',
    type: 'number',
    default: '350',
    description: 'How long the changed glyph of the count takes to roll, in milliseconds.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the button and ignores input.' },
  {
    name: 'label',
    type: 'string',
    default: '"Like"',
    description: 'Accessible name; the count is appended to it.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the button.' }
];
</script>
