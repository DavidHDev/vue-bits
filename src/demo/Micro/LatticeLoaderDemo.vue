<template>
  <h1 class="sub-category">Lattice Loader</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="latticeLoader.usage"
    :source="latticeLoaderSource"
    component-name="LatticeLoader"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <LatticeLoader
          :key="key"
          :status="status"
          :pattern="pattern"
          :grid="grid"
          :shape="shape"
          :color="color"
          :done-color="doneColor"
          :error-color="errorColor"
          :cell-size="cellSize"
          :gap="gap"
          :font-size="fontSize"
          :step="step"
          :idle-opacity="idleOpacity"
          :glow="glow"
          :glow-color="glowColor"
          :show-timer="showTimer"
          :label="label"
          :done-label="doneLabel"
          :error-label="errorLabel"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Status" :options="STATUS_OPTIONS" :width="120" v-model="status" />
        <PreviewSelect
          title="Pattern"
          :options="patternOptions"
          :width="120"
          :model-value="pattern"
          @update:model-value="pattern = $event as LatticePatternName"
        />
        <PreviewSelect
          title="Grid"
          :options="GRID_OPTIONS"
          :width="120"
          :model-value="grid"
          @update:model-value="changeGrid(Number($event))"
        />
        <PreviewSelect title="Shape" :options="SHAPE_OPTIONS" :width="120" v-model="shape" />
        <PreviewColorPicker title="Ink" v-model="color" />
        <PreviewColorPicker title="Done" v-model="doneColor" />
        <PreviewColorPicker title="Error" v-model="errorColor" />
        <PreviewSlider title="Cell Size" :min="4" :max="14" :step="1" valueUnit="px" v-model="cellSize" />
        <PreviewSlider title="Gap" :min="0" :max="8" :step="1" valueUnit="px" v-model="gap" />
        <PreviewSlider title="Font Size" :min="12" :max="24" :step="1" valueUnit="px" v-model="fontSize" />
        <PreviewSlider title="Step" :min="40" :max="160" :step="5" valueUnit="ms" v-model="step" />
        <PreviewSlider title="Idle Opacity" :min="0.05" :max="0.4" :step="0.01" v-model="idleOpacity" />
        <PreviewSwitch title="Glow" v-model="glow" />
        <PreviewColorPicker
          title="Glow Color"
          :model-value="glowColor || color"
          @update:model-value="glowColor = $event"
        />
        <PreviewSwitch title="Show Timer" v-model="showTimer" />
        <PreviewInput title="Label" :maxlength="16" v-model="label" />
        <PreviewInput title="Done Label" :maxlength="16" v-model="doneLabel" />
        <PreviewInput title="Error Label" :maxlength="16" v-model="errorLabel" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="lattice-loader" :usage="latticeLoader.usage!" :source="latticeLoaderSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { latticeLoader } from '@/constants/code/Micro/latticeLoaderCode';
import LatticeLoader, {
  type LatticeGrid,
  type LatticePatternName,
  type LatticeStatus
} from '@/content/Micro/LatticeLoader/LatticeLoader.vue';
import latticeLoaderSource from '@/content/Micro/LatticeLoader/LatticeLoader.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  status: 'working' as LatticeStatus,
  pattern: 'orbit' as LatticePatternName,
  grid: 3 as LatticeGrid,
  shape: 'round' as 'square' | 'round',
  color: '#f5f5f5',
  doneColor: '#22c55e',
  errorColor: '#ef4444',
  cellSize: 6,
  gap: 2,
  fontSize: 14,
  step: 90,
  idleOpacity: 0.15,
  glow: false,
  glowColor: '',
  showTimer: true,
  label: 'Thinking',
  doneLabel: 'Done in',
  errorLabel: 'Failed after'
};

const STATUS_OPTIONS = [
  { value: 'working', label: 'Working' },
  { value: 'done', label: 'Done' },
  { value: 'error', label: 'Error' }
];

const PATTERN_OPTIONS: Record<LatticeGrid, { value: string; label: string }[]> = {
  3: [
    { value: 'arrow', label: 'Arrow' },
    { value: 'dots', label: 'Dots' },
    { value: 'orbit', label: 'Orbit' },
    { value: 'ripple', label: 'Ripple' },
    { value: 'snake', label: 'Snake' },
    { value: 'spiral', label: 'Spiral' }
  ],
  4: [
    { value: 'sweep', label: 'Sweep' },
    { value: 'spin', label: 'Spin' },
    { value: 'rain', label: 'Rain' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'orbit', label: 'Orbit' },
    { value: 'snake', label: 'Snake' }
  ]
};

const GRID_OPTIONS = [
  { value: 3, label: '3 x 3' },
  { value: 4, label: '4 x 4' }
];

const SHAPE_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'round', label: 'Round' }
];

const status = ref(DEFAULTS.status);
const pattern = ref(DEFAULTS.pattern);
const grid = ref(DEFAULTS.grid);
const shape = ref(DEFAULTS.shape);
const color = ref(DEFAULTS.color);
const doneColor = ref(DEFAULTS.doneColor);
const errorColor = ref(DEFAULTS.errorColor);
const cellSize = ref(DEFAULTS.cellSize);
const gap = ref(DEFAULTS.gap);
const fontSize = ref(DEFAULTS.fontSize);
const step = ref(DEFAULTS.step);
const idleOpacity = ref(DEFAULTS.idleOpacity);
const glow = ref(DEFAULTS.glow);
const glowColor = ref(DEFAULTS.glowColor);
const showTimer = ref(DEFAULTS.showTimer);
const label = ref(DEFAULTS.label);
const doneLabel = ref(DEFAULTS.doneLabel);
const errorLabel = ref(DEFAULTS.errorLabel);

const patternOptions = computed(() => PATTERN_OPTIONS[grid.value] || PATTERN_OPTIONS[3]);

const changeGrid = (next: number) => {
  const g = (next === 4 ? 4 : 3) as LatticeGrid;
  grid.value = g;
  if (!PATTERN_OPTIONS[g].some(opt => opt.value === pattern.value)) pattern.value = g === 4 ? 'sweep' : 'orbit';
};

const hasChanges = computed(
  () =>
    status.value !== DEFAULTS.status ||
    pattern.value !== DEFAULTS.pattern ||
    grid.value !== DEFAULTS.grid ||
    shape.value !== DEFAULTS.shape ||
    color.value !== DEFAULTS.color ||
    doneColor.value !== DEFAULTS.doneColor ||
    errorColor.value !== DEFAULTS.errorColor ||
    cellSize.value !== DEFAULTS.cellSize ||
    gap.value !== DEFAULTS.gap ||
    fontSize.value !== DEFAULTS.fontSize ||
    step.value !== DEFAULTS.step ||
    idleOpacity.value !== DEFAULTS.idleOpacity ||
    glow.value !== DEFAULTS.glow ||
    glowColor.value !== DEFAULTS.glowColor ||
    showTimer.value !== DEFAULTS.showTimer ||
    label.value !== DEFAULTS.label ||
    doneLabel.value !== DEFAULTS.doneLabel ||
    errorLabel.value !== DEFAULTS.errorLabel
);

function reset() {
  status.value = DEFAULTS.status;
  pattern.value = DEFAULTS.pattern;
  grid.value = DEFAULTS.grid;
  shape.value = DEFAULTS.shape;
  color.value = DEFAULTS.color;
  doneColor.value = DEFAULTS.doneColor;
  errorColor.value = DEFAULTS.errorColor;
  cellSize.value = DEFAULTS.cellSize;
  gap.value = DEFAULTS.gap;
  fontSize.value = DEFAULTS.fontSize;
  step.value = DEFAULTS.step;
  idleOpacity.value = DEFAULTS.idleOpacity;
  glow.value = DEFAULTS.glow;
  glowColor.value = DEFAULTS.glowColor;
  showTimer.value = DEFAULTS.showTimer;
  label.value = DEFAULTS.label;
  doneLabel.value = DEFAULTS.doneLabel;
  errorLabel.value = DEFAULTS.errorLabel;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'label', type: 'string', default: '"Thinking"', description: 'The verb while working.' },
  {
    name: 'doneLabel',
    type: 'string',
    default: '"Done in"',
    description: 'The verb after status turns to done; the frozen time follows it.'
  },
  {
    name: 'errorLabel',
    type: 'string',
    default: '"Failed after"',
    description: 'The verb after status turns to error.'
  },
  {
    name: 'status',
    type: '"working" | "done" | "error"',
    default: '"working"',
    description:
      'Drives everything: the wave runs, or freezes and dissolves into a check or a cross while the stopwatch stops.'
  },
  {
    name: 'pattern',
    type: 'string | { cells, loop?, scale? }',
    default: '"orbit"',
    description:
      'The wave geometry. At 3 x 3: arrow, dots, orbit, ripple, snake, spiral. At 4 x 4: sweep, spin, rain, pulse, orbit, snake. A custom object gives one delay per cell in step units (null for a hole), an optional loop and scale, and lit: the share of the cycle a cell stays bright, 0.25, 0.35, 0.45 or 0.62.'
  },
  {
    name: 'grid',
    type: '3 | 4',
    default: '3',
    description: 'Cells per side. Each size has its own set of patterns and its own check and cross.'
  },
  { name: 'shape', type: '"square" | "round"', default: '"round"', description: 'Rounded tiles or dots.' },
  {
    name: 'color',
    type: 'string',
    default: '"currentColor"',
    description: 'Ink for the cells, the verb and the stopwatch. Inherits the page colour by default.'
  },
  { name: 'doneColor', type: 'string', default: '"#22c55e"', description: 'Colour of the check.' },
  { name: 'errorColor', type: 'string', default: '"#ef4444"', description: 'Colour of the cross.' },
  {
    name: 'cellSize',
    type: 'number',
    default: '6',
    description: 'Cell side in pixels; the lattice is three cells and two gaps.'
  },
  { name: 'gap', type: 'number', default: '2', description: 'Seam between cells in pixels.' },
  {
    name: 'fontSize',
    type: 'number',
    default: '14',
    description: 'Verb size in pixels; the stopwatch and row gap scale with it.'
  },
  {
    name: 'step',
    type: 'number',
    default: '90',
    description: 'Milliseconds between neighbouring cells lighting; the whole loop scales with it.'
  },
  { name: 'idleOpacity', type: 'number', default: '0.15', description: 'How visible the dark silhouette is.' },
  { name: 'glow', type: 'boolean', default: 'false', description: 'A halo on the lit cells and the mark.' },
  {
    name: 'glowColor',
    type: 'string',
    default: '""',
    description: 'The halo colour. Empty follows the ink, and the mark colour for the mark.'
  },
  { name: 'showTimer', type: 'boolean', default: 'true', description: 'Shows the live stopwatch.' },
  {
    name: 'elapsed',
    type: 'number',
    default: 'undefined',
    description: 'Controlled elapsed seconds. When set, the internal clock never runs.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the row.' }
];
</script>
