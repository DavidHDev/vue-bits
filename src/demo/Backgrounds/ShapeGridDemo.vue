<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container relative p-0">
        <ShapeGrid
          :square-size="size"
          :speed="speed"
          :direction="direction"
          :border-color="borderColor"
          :hover-fill-color="hoverColor"
          :shape="shape"
          :hover-trail-amount="hoverTrailAmount"
        />

        <BackgroundContent pill-text="New Background" headline="Customizable shapes moving around smoothly" />
      </div>

      <Customize>
        <div class="flex gap-4">
          <PreviewColor title="Border Color" v-model="borderColor" />
          <PreviewColor title="Hover Color" v-model="hoverColor" />
        </div>

        <PreviewSelect title="Shape" v-model="shape" :options="shapeOptions" />
        <PreviewSelect title="Direction" v-model="direction" :options="directionOptions" />

        <PreviewSlider title="Shape Size" v-model="size" :min="10" :max="100" :step="1" />
        <PreviewSlider title="Animation Speed" v-model="speed" :min="0.1" :max="2" :step="0.01" />
        <PreviewSlider title="Hover Trail" v-model="hoverTrailAmount" :min="0" :max="20" :step="1" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="shapeGrid" />
    </template>

    <template #cli>
      <CliInstallation :command="shapeGrid.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import PropTable from '@/components/common/PropTable.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import ShapeGrid from '../../content/Backgrounds/ShapeGrid/ShapeGrid.vue';
import { shapeGrid } from '@/constants/code/Backgrounds/shapeGridCode';

const direction = ref<'diagonal' | 'up' | 'right' | 'down' | 'left'>('diagonal');
const borderColor = ref('#333');
const hoverColor = ref('#27FF64');
const size = ref(40);
const speed = ref(0.5);
const shape = ref<'square' | 'hexagon' | 'circle' | 'triangle'>('square');
const hoverTrailAmount = ref(0);

const shapeOptions = [
  { value: 'square', label: 'Square' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'circle', label: 'Circle' },
  { value: 'triangle', label: 'Triangle' }
];

const directionOptions = [
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'up', label: 'Up' },
  { value: 'right', label: 'Right' },
  { value: 'down', label: 'Down' },
  { value: 'left', label: 'Left' }
];

const propData = [
  {
    name: 'direction',
    type: 'string',
    default: "'right'",
    description: "Direction of shape animation. Options: 'diagonal', 'up', 'right', 'down', 'left'."
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Animation speed multiplier.'
  },
  {
    name: 'borderColor',
    type: 'string',
    default: "'#999'",
    description: 'Color of the shape borders.'
  },
  {
    name: 'squareSize',
    type: 'number',
    default: '40',
    description: 'Size of individual shapes in pixels.'
  },
  {
    name: 'hoverFillColor',
    type: 'string',
    default: "'#222'",
    description: 'Fill color when hovering over shapes.'
  },
  {
    name: 'shape',
    type: 'string',
    default: "'square'",
    description: "Shape of the grid tiles. Options: 'square', 'hexagon', 'circle', 'triangle'."
  },
  {
    name: 'hoverTrailAmount',
    type: 'number',
    default: '0',
    description: 'Number of previously hovered shapes to keep visible as a fading trail. 0 disables the trail.'
  }
];
</script>
