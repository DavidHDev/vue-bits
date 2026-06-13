<template>
  <h1 class="sub-category">Magnet Lines</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="magnetLines.usage"
    :source="magnetLinesSource"
    component-name="MagnetLines"
    :props-table="props"
  >
    <template #preview>
      <div class="justify-center items-center h-[600px] overflow-hidden demo-container">
        <MagnetLines
          :rows="rows"
          :columns="columns"
          :container-size="containerSize"
          :line-width="lineWidth"
          :line-height="lineHeight"
          :line-color="lineColor"
          :base-angle="baseAngle"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Line Color" v-model="lineColor" />
        <PreviewSlider title="Rows" v-model="rows" :min="3" :max="20" :step="1" />
        <PreviewSlider title="Columns" v-model="columns" :min="3" :max="20" :step="1" />
        <PreviewSlider title="Base Angle (°)" v-model="baseAngle" :min="-180" :max="180" :step="5" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="magnet-lines" :usage="magnetLines.usage!" :source="magnetLinesSource" />
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
import { magnetLines } from '@/constants/code/Animations/magnetLinesCode';
import MagnetLines from '@/content/Animations/MagnetLines/MagnetLines.vue';
import magnetLinesSource from '@/content/Animations/MagnetLines/MagnetLines.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  rows: 10,
  columns: 12,
  containerSize: '40vmin',
  lineWidth: '2px',
  lineHeight: '30px',
  baseAngle: -10,
  lineColor: '#efefef'
};

const rows = ref(DEFAULTS.rows);
const columns = ref(DEFAULTS.columns);
const containerSize = ref(DEFAULTS.containerSize);
const lineHeight = ref(DEFAULTS.lineHeight);
const lineWidth = ref(DEFAULTS.lineWidth);
const lineColor = ref(DEFAULTS.lineColor);
const baseAngle = ref(DEFAULTS.baseAngle);

const hasChanges = computed(
  () =>
    rows.value !== DEFAULTS.rows ||
    columns.value !== DEFAULTS.columns ||
    containerSize.value !== DEFAULTS.containerSize ||
    lineWidth.value !== DEFAULTS.lineWidth ||
    lineHeight.value !== DEFAULTS.lineHeight ||
    lineColor.value !== DEFAULTS.lineColor ||
    baseAngle.value !== DEFAULTS.baseAngle
);

function reset() {
  rows.value = DEFAULTS.rows;
  columns.value = DEFAULTS.columns;
  containerSize.value = DEFAULTS.containerSize;
  lineWidth.value = DEFAULTS.lineWidth;
  lineHeight.value = DEFAULTS.lineHeight;
  lineColor.value = DEFAULTS.lineColor;
  baseAngle.value = DEFAULTS.baseAngle;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'rows',
    type: 'number',
    default: '9',
    description: 'Number of grid rows.'
  },
  {
    name: 'columns',
    type: 'number',
    default: '9',
    description: 'Number of grid columns.'
  },
  {
    name: 'containerSize',
    type: 'string',
    default: '80vmin',
    description: 'Specifies the width and height of the entire grid container.'
  },
  {
    name: 'lineColor',
    type: 'string',
    default: '#efefef',
    description: 'Color for each line (the <span> elements).'
  },
  {
    name: 'lineWidth',
    type: 'string',
    default: '1vmin',
    description: "Specifies each line's thickness."
  },
  {
    name: 'lineHeight',
    type: 'string',
    default: '6vmin',
    description: "Specifies each line's length."
  },
  {
    name: 'baseAngle',
    type: 'number',
    default: '-10',
    description: 'Initial rotation angle (in degrees) before pointer movement.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional class name(s) applied to the container.'
  },
  {
    name: 'style',
    type: 'object',
    default: '{}',
    description: 'Inline styles for the container.'
  }
];
</script>
