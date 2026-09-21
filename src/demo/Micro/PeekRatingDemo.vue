<template>
  <h1 class="sub-category">Peek Rating</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="peekRating.usage"
    :source="peekRatingSource"
    component-name="PeekRating"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <PeekRating
          :key="`${count}-${readOnly}-${key}`"
          :value="value"
          :count="count"
          :shape="shape"
          :labels="showLabels ? LABELS.slice(0, count) : []"
          :active-color="activeColor"
          :idle-color="idleColor"
          :tip-color="tipColor"
          :tip-text-color="tipTextColor"
          :size="size"
          :lift="lift"
          :magnify="magnify"
          :rise-duration="riseDuration"
          :pop-scale="popScale"
          :show-tip="showTip"
          :allow-clear="allowClear"
          :read-only="readOnly"
          @change="value = $event"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider
          title="Value"
          :min="0"
          :max="count"
          :step="1"
          :model-value="Math.min(value, count)"
          @update:model-value="value = $event"
        />
        <PreviewSlider
          title="Count"
          :min="3"
          :max="10"
          :step="1"
          :model-value="count"
          @update:model-value="setCount($event)"
        />
        <PreviewSelect title="Shape" :options="SHAPE_OPTIONS" :width="120" v-model="shape" />
        <PreviewSwitch title="Labels" v-model="showLabels" />
        <PreviewSwitch title="Tip" v-model="showTip" />
        <PreviewColorPicker title="Active" v-model="activeColor" />
        <PreviewColorPicker title="Idle" v-model="idleColor" />
        <PreviewColorPicker title="Tip" v-model="tipColor" />
        <PreviewColorPicker title="Tip Text" v-model="tipTextColor" />
        <PreviewSlider title="Size" :min="16" :max="48" :step="1" valueUnit="px" v-model="size" />
        <PreviewSlider title="Lift" :min="0" :max="16" :step="1" valueUnit="px" v-model="lift" />
        <PreviewSlider title="Magnify" :min="1" :max="1.5" :step="0.01" v-model="magnify" />
        <PreviewSlider title="Rise" :min="120" :max="600" :step="10" valueUnit="ms" v-model="riseDuration" />
        <PreviewSlider title="Pop" :min="1" :max="1.6" :step="0.05" v-model="popScale" />
        <PreviewSwitch title="Allow Clear" v-model="allowClear" />
        <PreviewSwitch title="Read Only" v-model="readOnly" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="peek-rating" :usage="peekRating.usage!" :source="peekRatingSource" />
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
import { peekRating } from '@/constants/code/Micro/peekRatingCode';
import PeekRating, { type PeekRatingShape } from '@/content/Micro/PeekRating/PeekRating.vue';
import peekRatingSource from '@/content/Micro/PeekRating/PeekRating.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  count: 5,
  shape: 'star' as PeekRatingShape,
  showLabels: true,
  activeColor: '#f5b400',
  idleColor: '#52525b',
  tipColor: '#27272a',
  tipTextColor: '#f5f5f5',
  size: 40,
  lift: 8,
  magnify: 1.15,
  riseDuration: 320,
  popScale: 1.3,
  showTip: true,
  allowClear: true,
  readOnly: false
};

const LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Superb', 'Stellar', 'Epic', 'Legendary', 'Mythic', 'Perfect'];

const SHAPE_OPTIONS = [
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' },
  { value: 'bolt', label: 'Bolt' }
];

const count = ref(DEFAULTS.count);
const shape = ref(DEFAULTS.shape);
const showLabels = ref(DEFAULTS.showLabels);
const activeColor = ref(DEFAULTS.activeColor);
const idleColor = ref(DEFAULTS.idleColor);
const tipColor = ref(DEFAULTS.tipColor);
const tipTextColor = ref(DEFAULTS.tipTextColor);
const size = ref(DEFAULTS.size);
const lift = ref(DEFAULTS.lift);
const magnify = ref(DEFAULTS.magnify);
const riseDuration = ref(DEFAULTS.riseDuration);
const popScale = ref(DEFAULTS.popScale);
const showTip = ref(DEFAULTS.showTip);
const allowClear = ref(DEFAULTS.allowClear);
const readOnly = ref(DEFAULTS.readOnly);
const value = ref(3);

const setCount = (next: number) => {
  count.value = next;
  value.value = Math.min(value.value, next);
};

const hasChanges = computed(
  () =>
    count.value !== DEFAULTS.count ||
    shape.value !== DEFAULTS.shape ||
    showLabels.value !== DEFAULTS.showLabels ||
    activeColor.value !== DEFAULTS.activeColor ||
    idleColor.value !== DEFAULTS.idleColor ||
    tipColor.value !== DEFAULTS.tipColor ||
    tipTextColor.value !== DEFAULTS.tipTextColor ||
    size.value !== DEFAULTS.size ||
    lift.value !== DEFAULTS.lift ||
    magnify.value !== DEFAULTS.magnify ||
    riseDuration.value !== DEFAULTS.riseDuration ||
    popScale.value !== DEFAULTS.popScale ||
    showTip.value !== DEFAULTS.showTip ||
    allowClear.value !== DEFAULTS.allowClear ||
    readOnly.value !== DEFAULTS.readOnly
);

function reset() {
  count.value = DEFAULTS.count;
  shape.value = DEFAULTS.shape;
  showLabels.value = DEFAULTS.showLabels;
  activeColor.value = DEFAULTS.activeColor;
  idleColor.value = DEFAULTS.idleColor;
  tipColor.value = DEFAULTS.tipColor;
  tipTextColor.value = DEFAULTS.tipTextColor;
  size.value = DEFAULTS.size;
  lift.value = DEFAULTS.lift;
  magnify.value = DEFAULTS.magnify;
  riseDuration.value = DEFAULTS.riseDuration;
  popScale.value = DEFAULTS.popScale;
  showTip.value = DEFAULTS.showTip;
  allowClear.value = DEFAULTS.allowClear;
  readOnly.value = DEFAULTS.readOnly;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'value', type: 'number', default: 'undefined', description: 'Controlled rating, from 0 to count.' },
  { name: 'defaultValue', type: 'number', default: '0', description: 'Initial rating when uncontrolled.' },
  {
    name: '@change',
    type: '(value: number) => void',
    default: '-',
    description: 'Emitted when a rating is committed by click, release or keyboard.'
  },
  {
    name: '@preview',
    type: '(value: number | null) => void',
    default: '-',
    description: 'Emitted on every slot crossing while previewing, and with null when the preview clears.'
  },
  { name: 'count', type: 'number', default: '5', description: 'Number of glyphs.' },
  { name: 'shape', type: '"star" | "heart" | "bolt"', default: '"star"', description: 'Built-in glyph shape.' },
  {
    name: 'icon (slot)',
    type: 'slot',
    default: 'built-in shape',
    description: 'Custom glyph that replaces the built-in shape.'
  },
  {
    name: 'labels',
    type: 'string[]',
    default: '[]',
    description: 'One label per glyph, shown in the tip while previewing. Without labels the tip shows the number.'
  },
  {
    name: 'activeColor',
    type: 'string',
    default: '"#f5b400"',
    description: 'Colour of lit glyphs and of the focus ring.'
  },
  { name: 'idleColor', type: 'string', default: '"#52525b"', description: 'Colour of unlit glyphs.' },
  {
    name: 'tipColor',
    type: 'string',
    default: '"#27272a"',
    description: 'Background of the tip that follows the pointer.'
  },
  { name: 'tipTextColor', type: 'string', default: '"#f5f5f5"', description: 'Text colour of the tip.' },
  {
    name: 'size',
    type: 'number',
    default: '28',
    description: 'Glyph size in pixels; spacing and the tip scale with it.'
  },
  {
    name: 'lift',
    type: 'number',
    default: '6',
    description: 'How far previewed glyphs rise, in pixels. 0 makes the preview colour-only.'
  },
  { name: 'magnify', type: 'number', default: '1.15', description: 'Scale of the glyph under the pointer.' },
  {
    name: 'riseDuration',
    type: 'number',
    default: '320',
    description: 'Duration in milliseconds of each glyph’s rise and fall, and of the tip’s hop.'
  },
  {
    name: 'popScale',
    type: 'number',
    default: '1.3',
    description: 'Peak scale of the pop on the committed glyph. 1 disables it.'
  },
  {
    name: 'showTip',
    type: 'boolean',
    default: 'true',
    description: 'Shows the tip above the pointer glyph while previewing.'
  },
  {
    name: 'allowClear',
    type: 'boolean',
    default: 'true',
    description: 'Clicking the current rating again, or Backspace, clears it to 0.'
  },
  {
    name: 'readOnly',
    type: 'boolean',
    default: 'false',
    description: 'Display only: no preview, no pop, announced as an image.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the control and ignores input.' },
  { name: 'ariaLabel', type: 'string', default: '"Rating"', description: 'Accessible name of the radio group.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root element.' }
];
</script>
