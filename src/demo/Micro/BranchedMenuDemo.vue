<template>
  <h1 class="sub-category">Branched Menu</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="branchedMenu.usage"
    :source="branchedMenuSource"
    component-name="BranchedMenu"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-125 overflow-hidden demo-container">
        <BranchedMenu :key="key" v-bind="branchedMenuProps" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Ink" v-model="color" />
        <PreviewColorPicker title="Accent" v-model="accentColor" />
        <PreviewColorPicker title="Lines" v-model="lineColor" />
        <PreviewSlider title="Width" :min="180" :max="360" :step="4" valueUnit="px" v-model="width" />
        <PreviewSlider title="Row Height" :min="28" :max="52" :step="1" valueUnit="px" v-model="rowHeight" />
        <PreviewSlider title="Indent" :min="28" :max="72" :step="1" valueUnit="px" v-model="indent" />
        <PreviewSlider title="Trunk" :min="2" :max="30" :step="1" valueUnit="px" v-model="trunk" />
        <PreviewSlider title="Radius" :min="0" :max="18" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Line Width" :min="1" :max="3" :step="0.25" v-model="lineWidth" />
        <PreviewSlider title="Font Size" :min="12" :max="18" :step="1" valueUnit="px" v-model="fontSize" />
        <PreviewSlider title="Draw" :min="150" :max="900" :step="10" valueUnit="ms" v-model="drawDuration" />
        <PreviewSlider title="Fold" :min="150" :max="600" :step="10" valueUnit="ms" v-model="foldDuration" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="branched-menu" :usage="branchedMenu.usage!" :source="branchedMenuSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { branchedMenu } from '@/constants/code/Micro/branchedMenuCode';
import BranchedMenu from '@/content/Micro/BranchedMenu/BranchedMenu.vue';
import branchedMenuSource from '@/content/Micro/BranchedMenu/BranchedMenu.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  color: '#f5f5f5',
  accentColor: '#f5f5f5',
  lineColor: '#3f3f46',
  width: 240,
  rowHeight: 32,
  indent: 40,
  trunk: 14,
  radius: 10,
  lineWidth: 1.5,
  fontSize: 14,
  drawDuration: 400,
  foldDuration: 300
};

const color = ref(DEFAULTS.color);
const accentColor = ref(DEFAULTS.accentColor);
const lineColor = ref(DEFAULTS.lineColor);
const width = ref(DEFAULTS.width);
const rowHeight = ref(DEFAULTS.rowHeight);
const indent = ref(DEFAULTS.indent);
const trunk = ref(DEFAULTS.trunk);
const radius = ref(DEFAULTS.radius);
const lineWidth = ref(DEFAULTS.lineWidth);
const fontSize = ref(DEFAULTS.fontSize);
const drawDuration = ref(DEFAULTS.drawDuration);
const foldDuration = ref(DEFAULTS.foldDuration);

const branchedMenuProps = computed(() => ({
  color: color.value,
  accentColor: accentColor.value,
  lineColor: lineColor.value,
  width: width.value,
  rowHeight: rowHeight.value,
  indent: indent.value,
  trunk: trunk.value,
  radius: radius.value,
  lineWidth: lineWidth.value,
  fontSize: fontSize.value,
  drawDuration: drawDuration.value,
  foldDuration: foldDuration.value
}));

const hasChanges = computed(
  () =>
    color.value !== DEFAULTS.color ||
    accentColor.value !== DEFAULTS.accentColor ||
    lineColor.value !== DEFAULTS.lineColor ||
    width.value !== DEFAULTS.width ||
    rowHeight.value !== DEFAULTS.rowHeight ||
    indent.value !== DEFAULTS.indent ||
    trunk.value !== DEFAULTS.trunk ||
    radius.value !== DEFAULTS.radius ||
    lineWidth.value !== DEFAULTS.lineWidth ||
    fontSize.value !== DEFAULTS.fontSize ||
    drawDuration.value !== DEFAULTS.drawDuration ||
    foldDuration.value !== DEFAULTS.foldDuration
);

function reset() {
  color.value = DEFAULTS.color;
  accentColor.value = DEFAULTS.accentColor;
  lineColor.value = DEFAULTS.lineColor;
  width.value = DEFAULTS.width;
  rowHeight.value = DEFAULTS.rowHeight;
  indent.value = DEFAULTS.indent;
  trunk.value = DEFAULTS.trunk;
  radius.value = DEFAULTS.radius;
  lineWidth.value = DEFAULTS.lineWidth;
  fontSize.value = DEFAULTS.fontSize;
  drawDuration.value = DEFAULTS.drawDuration;
  foldDuration.value = DEFAULTS.foldDuration;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'BranchedMenuItem[]',
    default: 'DEFAULT_ITEMS',
    description:
      'Sections: label plus children (value, label, icon), or a leaf with a value. A section with children folds; a leaf selects.'
  },
  {
    name: 'defaultOpen',
    type: 'number | number[]',
    default: '0',
    description: 'The section, or sections, open at first. -1 for none.'
  },
  {
    name: 'defaultActive',
    type: 'string',
    default: '""',
    description: "Value selected at first. Empty picks the open section's first child."
  },
  { name: 'onSelect', type: '(value, item) => void', default: '-', description: 'A child or a leaf was picked.' },
  { name: 'onToggle', type: '(index, open) => void', default: '-', description: 'A section folded or unfolded.' },
  {
    name: 'color',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The ink. Lines and idle text are mixes of it.'
  },
  {
    name: 'accentColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The active line, the active label and the marker.'
  },
  {
    name: 'lineColor',
    type: 'string',
    default: '"#3f3f46"',
    description: 'The rail, trunk and branches. A solid colour, so joints never darken.'
  },
  {
    name: 'width',
    type: 'number',
    default: '240',
    description: 'The widest the menu may be, in px. It shrinks to its content.'
  },
  { name: 'rowHeight', type: 'number', default: '36', description: 'Height of a child row in px.' },
  {
    name: 'indent',
    type: 'number',
    default: '40',
    description: 'Where child rows start, in px. Branches end just before it.'
  },
  { name: 'trunk', type: 'number', default: '14', description: "The trunk line's x position, in px." },
  { name: 'radius', type: 'number', default: '10', description: 'The curve of each branch, in px.' },
  { name: 'lineWidth', type: 'number', default: '1.5', description: 'Stroke width of the lines.' },
  {
    name: 'fontSize',
    type: 'number',
    default: '14',
    description: 'Child text size in px. Headers are 1px larger.'
  },
  { name: 'drawDuration', type: 'number', default: '400', description: "The accent line's travel, in ms." },
  { name: 'foldDuration', type: 'number', default: '300', description: "A section's fold and unfold, in ms." },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the nav.' }
];
</script>
