<template>
  <h1 class="sub-category">Shape Grid</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="shapeGrid.usage"
    :source="shapeGridSource"
    componentName="ShapeGrid"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <ShapeGrid
          :key="key"
          :shape="shape"
          :direction="direction"
          :speed="speed"
          :square-size="squareSize"
          :hover-trail-amount="hoverTrailAmount"
          :border-color="borderColor"
          :hover-fill-color="hoverFillColor"
        />
        <BackgroundContent pillText="New Background" headline="Customizable squares moving around smoothly" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Shape" v-model="shape" :options="['square', 'hexagon', 'circle', 'triangle']" />
        <PreviewSelect title="Direction" v-model="direction" :options="['right', 'left', 'up', 'down', 'diagonal']" />
        <PreviewSlider title="Speed" :min="0.1" :max="3" :step="0.1" v-model="speed" valueUnit="x" />
        <PreviewSlider title="Square Size" :min="10" :max="100" :step="1" v-model="squareSize" />
        <PreviewSlider title="Hover Trail" :min="0" :max="20" :step="1" v-model="hoverTrailAmount" />
        <PreviewColorPicker title="Border Color" v-model="borderColor" />
        <PreviewColorPicker title="Hover Fill" v-model="hoverFillColor" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="shape-grid" :usage="shapeGrid.usage!" :source="shapeGridSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { shapeGrid } from '@/constants/code/Backgrounds/shapeGridCode';
import ShapeGrid from '@/content/Backgrounds/ShapeGrid/ShapeGrid.vue';
import shapeGridSource from '@/content/Backgrounds/ShapeGrid/ShapeGrid.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  shape: 'square' as 'square' | 'hexagon' | 'circle' | 'triangle',
  direction: 'diagonal' as 'diagonal' | 'up' | 'right' | 'down' | 'left',
  speed: 0.5,
  squareSize: 40,
  hoverTrailAmount: 0,
  borderColor: '#10B981',
  hoverFillColor: '#84CC16'
};

const shape = ref<'square' | 'hexagon' | 'circle' | 'triangle'>(DEFAULTS.shape);
const direction = ref<'diagonal' | 'up' | 'right' | 'down' | 'left'>(DEFAULTS.direction);
const speed = ref(DEFAULTS.speed);
const squareSize = ref(DEFAULTS.squareSize);
const hoverTrailAmount = ref(DEFAULTS.hoverTrailAmount);
const borderColor = ref(DEFAULTS.borderColor);
const hoverFillColor = ref(DEFAULTS.hoverFillColor);
const showContent = ref(true);

const hasChanges = computed(
  () =>
    shape.value !== DEFAULTS.shape ||
    direction.value !== DEFAULTS.direction ||
    speed.value !== DEFAULTS.speed ||
    squareSize.value !== DEFAULTS.squareSize ||
    hoverTrailAmount.value !== DEFAULTS.hoverTrailAmount ||
    borderColor.value !== DEFAULTS.borderColor ||
    hoverFillColor.value !== DEFAULTS.hoverFillColor
);

function reset() {
  shape.value = DEFAULTS.shape;
  direction.value = DEFAULTS.direction;
  speed.value = DEFAULTS.speed;
  squareSize.value = DEFAULTS.squareSize;
  hoverTrailAmount.value = DEFAULTS.hoverTrailAmount;
  borderColor.value = DEFAULTS.borderColor;
  hoverFillColor.value = DEFAULTS.hoverFillColor;
  showContent.value = true;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'shape',
    type: '"square" | "hexagon" | "circle" | "triangle"',
    default: '"square"',
    description: 'Cell shape rendered across the grid.'
  },
  {
    name: 'direction',
    type: '"diagonal" | "up" | "right" | "down" | "left"',
    default: '"right"',
    description: 'Direction the grid scrolls.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Animation speed multiplier.' },
  { name: 'squareSize', type: 'number', default: '40', description: 'Cell size in pixels.' },
  { name: 'borderColor', type: 'string', default: '"#999"', description: 'Stroke color of grid cells.' },
  { name: 'hoverFillColor', type: 'string', default: '"#222"', description: 'Fill color of hovered cells.' },
  {
    name: 'hoverTrailAmount',
    type: 'number',
    default: '0',
    description: 'Number of trailing cells highlighted behind the cursor.'
  }
];
</script>
