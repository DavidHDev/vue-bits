<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[600px] overflow-hidden">
        <MagnetLines
          :rows="rows"
          :columns="columns"
          container-size="500px"
          :line-width="lineWidthPx"
          :line-height="lineHeightPx"
          :line-color="lineColor"
          :base-angle="baseAngle"
        />
      </div>

      <Customize>
        <PreviewColor title="Line Color" v-model="lineColor" />

        <PreviewSlider title="Rows" v-model="rows" :min="5" :max="maxRows" :step="1" />

        <PreviewSlider title="Columns" v-model="columns" :min="5" :max="15" :step="1" />

        <PreviewSlider title="Line Height (px)" v-model="lineHeight" :min="10" :max="50" :step="5" />

        <PreviewSlider title="Line Width (px)" v-model="lineWidth" :min="1" :max="5" :step="1" />

        <PreviewSlider title="Base Angle (°)" v-model="baseAngle" :min="-45" :max="45" :step="1" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="magnetLines" />
    </template>

    <template #cli>
      <CliInstallation :command="magnetLines.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import MagnetLines from '../../content/Animations/MagnetLines/MagnetLines.vue';
import { magnetLines } from '@/constants/code/Animations/magnetLinesCode';

const lineHeight = ref(30);
const lineWidth = ref(2);
const lineColor = ref('#efefef');
const baseAngle = ref(-10);
const columns = ref(12);

const lineWidthPx = computed(() => `${lineWidth.value}px`);
const lineHeightPx = computed(() => `${lineHeight.value}px`);

const maxRows = computed(() => {
  const containerHeight = 500;
  return Math.floor(containerHeight / lineHeight.value);
});

const rows = ref(Math.min(10, maxRows.value));

watch(lineHeight, () => {
  nextTick(() => {
    rows.value = Math.min(rows.value, maxRows.value);
  });
});

const propData = [
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
