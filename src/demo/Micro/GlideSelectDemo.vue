<template>
  <h1 class="sub-category">Glide Select</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="glideSelect.usage"
    :source="glideSelectSource"
    component-name="GlideSelect"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-120 overflow-visible! demo-container">
        <GlideSelect
          :key="`${options}-${key}`"
          :options="set"
          :value="current"
          aria-label="Export format"
          :show-tags="showTags"
          :accent-color="accentColor"
          :surface-color="surfaceColor"
          :highlight-color="highlightColor"
          :text-color="textColor"
          :size="size"
          :radius="radius"
          :menu-width="menuWidth"
          :placement="placement"
          :align="align"
          :pop-duration="popDuration"
          :glide-duration="glideDuration"
          :remember-position="rememberPosition"
          :disabled="disabled"
          @change="value = $event"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Options"
          :options="OPTION_OPTIONS"
          :width="120"
          :model-value="options"
          @update:model-value="setOptions($event as OptionSetKey)"
        />
        <PreviewSelect title="Size" :options="SIZE_OPTIONS" :width="120" v-model="size" />
        <PreviewColorPicker title="Accent" v-model="accentColor" />
        <PreviewColorPicker title="Surface" v-model="surfaceColor" />
        <PreviewColorPicker title="Highlight" v-model="highlightColor" />
        <PreviewColorPicker title="Text" v-model="textColor" />
        <PreviewSlider title="Radius" :min="6" :max="20" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Menu Width" :min="140" :max="280" :step="4" valueUnit="px" v-model="menuWidth" />
        <PreviewSelect title="Placement" :options="PLACEMENT_OPTIONS" :width="120" v-model="placement" />
        <PreviewSelect title="Align" :options="ALIGN_OPTIONS" :width="110" v-model="align" />
        <PreviewSlider title="Pop" :min="0" :max="400" :step="10" valueUnit="ms" v-model="popDuration" />
        <PreviewSlider title="Glide" :min="0" :max="400" :step="10" valueUnit="ms" v-model="glideDuration" />
        <PreviewSwitch title="Remember Position" v-model="rememberPosition" />
        <PreviewSwitch title="Show Tags" v-model="showTags" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="glide-select" :usage="glideSelect.usage!" :source="glideSelectSource" />
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
import { glideSelect } from '@/constants/code/Micro/glideSelectCode';
import GlideSelect, { type GlideSelectOption } from '@/content/Micro/GlideSelect/GlideSelect.vue';
import glideSelectSource from '@/content/Micro/GlideSelect/GlideSelect.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type OptionSetKey = 'formats' | 'regions' | 'sizes';
type OptionSet = (string | GlideSelectOption)[];

const OPTION_SETS: Record<OptionSetKey, OptionSet> = {
  formats: [
    { value: 'png', label: 'PNG', tag: 'Lossless' },
    { value: 'jpg', label: 'JPG', tag: 'Smallest' },
    { value: 'webp', label: 'WebP', tag: 'Modern' },
    { value: 'svg', label: 'SVG', tag: 'Vector' },
    { value: 'pdf', label: 'PDF', tag: 'Print' }
  ],
  regions: [
    { value: 'us-east', label: 'US East', tag: 'Virginia' },
    { value: 'us-west', label: 'US West', tag: 'Oregon' },
    { value: 'eu', label: 'EU', tag: 'Frankfurt' },
    { value: 'asia', label: 'Asia', tag: 'Singapore' }
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
};
const firstOf = (list: OptionSet) => (typeof list[0] === 'string' ? list[0] : list[0].value);
const valueOf = (o: string | GlideSelectOption) => (typeof o === 'string' ? o : o.value);

const DEFAULTS = {
  options: 'formats' as OptionSetKey,
  size: 'md' as 'sm' | 'md' | 'lg',
  accentColor: '#f5f5f5',
  surfaceColor: '#27272a',
  highlightColor: '#3f3f46',
  textColor: '#f5f5f5',
  radius: 10,
  menuWidth: 176,
  placement: 'bottom' as 'top' | 'bottom',
  align: 'left' as 'left' | 'right',
  popDuration: 180,
  glideDuration: 220,
  rememberPosition: true,
  showTags: true,
  disabled: false
};

const OPTION_OPTIONS = [
  { value: 'formats', label: 'Formats' },
  { value: 'regions', label: 'Regions' },
  { value: 'sizes', label: 'Sizes' }
];
const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];
const PLACEMENT_OPTIONS = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' }
];
const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const options = ref(DEFAULTS.options);
const size = ref(DEFAULTS.size);
const accentColor = ref(DEFAULTS.accentColor);
const surfaceColor = ref(DEFAULTS.surfaceColor);
const highlightColor = ref(DEFAULTS.highlightColor);
const textColor = ref(DEFAULTS.textColor);
const radius = ref(DEFAULTS.radius);
const menuWidth = ref(DEFAULTS.menuWidth);
const placement = ref(DEFAULTS.placement);
const align = ref(DEFAULTS.align);
const popDuration = ref(DEFAULTS.popDuration);
const glideDuration = ref(DEFAULTS.glideDuration);
const rememberPosition = ref(DEFAULTS.rememberPosition);
const showTags = ref(DEFAULTS.showTags);
const disabled = ref(DEFAULTS.disabled);

const set = computed(() => OPTION_SETS[options.value] ?? OPTION_SETS.formats);
const value = ref(firstOf(set.value));
const current = computed(() => (set.value.some(o => valueOf(o) === value.value) ? value.value : firstOf(set.value)));

const setOptions = (next: OptionSetKey) => {
  options.value = next;
  value.value = firstOf(OPTION_SETS[next] ?? OPTION_SETS.formats);
};

const hasChanges = computed(
  () =>
    options.value !== DEFAULTS.options ||
    size.value !== DEFAULTS.size ||
    accentColor.value !== DEFAULTS.accentColor ||
    surfaceColor.value !== DEFAULTS.surfaceColor ||
    highlightColor.value !== DEFAULTS.highlightColor ||
    textColor.value !== DEFAULTS.textColor ||
    radius.value !== DEFAULTS.radius ||
    menuWidth.value !== DEFAULTS.menuWidth ||
    placement.value !== DEFAULTS.placement ||
    align.value !== DEFAULTS.align ||
    popDuration.value !== DEFAULTS.popDuration ||
    glideDuration.value !== DEFAULTS.glideDuration ||
    rememberPosition.value !== DEFAULTS.rememberPosition ||
    showTags.value !== DEFAULTS.showTags ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  setOptions(DEFAULTS.options);
  size.value = DEFAULTS.size;
  accentColor.value = DEFAULTS.accentColor;
  surfaceColor.value = DEFAULTS.surfaceColor;
  highlightColor.value = DEFAULTS.highlightColor;
  textColor.value = DEFAULTS.textColor;
  radius.value = DEFAULTS.radius;
  menuWidth.value = DEFAULTS.menuWidth;
  placement.value = DEFAULTS.placement;
  align.value = DEFAULTS.align;
  popDuration.value = DEFAULTS.popDuration;
  glideDuration.value = DEFAULTS.glideDuration;
  rememberPosition.value = DEFAULTS.rememberPosition;
  showTags.value = DEFAULTS.showTags;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'options',
    type: '(string | { value: string; label: string; tag?: string })[]',
    default: '["One", "Two", "Three"]',
    description: 'The rows. A string is both value and label; a tag shows muted at the right.'
  },
  {
    name: 'value',
    type: 'string',
    default: 'undefined',
    description: 'Controlled value. Outside changes never animate.'
  },
  { name: 'defaultValue', type: 'string', default: 'undefined', description: 'Initial value when uncontrolled.' },
  {
    name: '@change',
    type: '(value: string, option) => void',
    default: '-',
    description: 'Emitted on a pick that changes the value.'
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '"Select…"',
    description: 'Chip text while nothing is selected.'
  },
  { name: 'showTags', type: 'boolean', default: 'true', description: "Shows each row's tag." },
  { name: 'accentColor', type: 'string', default: '"#f5f5f5"', description: 'The check on the selected row.' },
  { name: 'surfaceColor', type: 'string', default: '"#27272a"', description: 'Chip and menu background.' },
  {
    name: 'highlightColor',
    type: 'string',
    default: '"#3f3f46"',
    description: 'The gliding pill. The selected row rests on it at 60%, and the chip tint derives from it.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'Labels. Tags and the chevron derive from it.'
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Chip 28, 32 or 44 pixels with matching rows. Large is the touch-first size.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '10',
    description: 'Menu corner in pixels. Chip, rows and pill use 4 less so they stay concentric.'
  },
  {
    name: 'menuWidth',
    type: 'number',
    default: '176',
    description: 'Menu width in pixels, never narrower than the chip.'
  },
  {
    name: 'placement',
    type: '"top" | "bottom"',
    default: '"bottom"',
    description: 'Which side the menu grows on. It flips when the chosen side would leave the viewport.'
  },
  { name: 'align', type: '"left" | "right"', default: '"left"', description: 'Which chip edge the menu shares.' },
  {
    name: 'popDuration',
    type: 'number',
    default: '180',
    description: 'Milliseconds the menu takes to grow out of its corner. It leaves in two thirds of that.'
  },
  {
    name: 'glideDuration',
    type: 'number',
    default: '220',
    description: 'Milliseconds the pill takes to travel between rows. 0 is a conventional hover.'
  },
  {
    name: 'rememberPosition',
    type: 'boolean',
    default: 'true',
    description:
      'The highlight stays on the row the pointer left, so re-entry glides from there. Off, it clears on leave and the selected row shows again.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the chip and ignores input.' },
  { name: 'ariaLabel', type: 'string', default: '"Select"', description: 'Accessible name of the chip and list.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
