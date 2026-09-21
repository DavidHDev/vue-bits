<template>
  <h1 class="sub-category">Call Chip</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="callChip.usage"
    :source="callChipSource"
    component-name="CallChip"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-125 overflow-hidden demo-container">
        <RefreshButton @click="replay" />
        <CallChip :key="key" v-bind="callChipProps" @retry="replay" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Status" :options="STATUS_OPTIONS" v-model="status" />
        <PreviewSelect title="Icon" :options="ICON_OPTIONS" v-model="icon" />
        <PreviewColorPicker title="Ink" v-model="color" />
        <PreviewColorPicker title="Surface" v-model="surfaceColor" />
        <PreviewColorPicker title="Progress" v-model="progressColor" />
        <PreviewColorPicker title="Done" v-model="doneColor" />
        <PreviewColorPicker title="Error" v-model="errorColor" />
        <PreviewSlider title="Size" :min="24" :max="48" :step="1" valueUnit="px" v-model="size" />
        <PreviewSlider title="Radius" :min="0" :max="24" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Progress Opacity" :min="0.04" :max="0.3" :step="0.01" v-model="progressOpacity" />
        <PreviewSlider title="Expected Time" :min="500" :max="8000" :step="100" valueUnit="ms" v-model="expectedMs" />
        <PreviewSlider title="Wash" :min="0" :max="0.4" :step="0.02" v-model="washOpacity" />
        <PreviewSlider title="Shake" :min="0" :max="12" :step="1" valueUnit="px" v-model="shake" />
        <PreviewSwitch title="Show Timer" v-model="showTimer" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="call-chip" :usage="callChip.usage!" :source="callChipSource" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { callChip } from '@/constants/code/Micro/callChipCode';
import CallChip, { type CallChipIcon, type CallChipStatus } from '@/content/Micro/CallChip/CallChip.vue';
import callChipSource from '@/content/Micro/CallChip/CallChip.vue?raw';
import { computed, onUnmounted, ref, watch } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  status: 'running' as CallChipStatus,
  icon: 'terminal' as CallChipIcon,
  color: '#f5f5f5',
  surfaceColor: '#27272a',
  progressColor: '#f5f5f5',
  progressOpacity: 0.08,
  doneColor: '#22c55e',
  errorColor: '#ef4444',
  size: 34,
  radius: 10,
  expectedMs: 2500,
  washOpacity: 0.14,
  shake: 6,
  showTimer: true
};

const STATUS_OPTIONS = [
  { value: 'running', label: 'Running' },
  { value: 'done', label: 'Done' },
  { value: 'error', label: 'Error' }
];

const ICON_OPTIONS = [
  { value: 'terminal', label: 'Terminal' },
  { value: 'file', label: 'File' },
  { value: 'search', label: 'Search' },
  { value: 'edit', label: 'Edit' }
];

const icon = ref(DEFAULTS.icon);
const color = ref(DEFAULTS.color);
const surfaceColor = ref(DEFAULTS.surfaceColor);
const progressColor = ref(DEFAULTS.progressColor);
const progressOpacity = ref(DEFAULTS.progressOpacity);
const doneColor = ref(DEFAULTS.doneColor);
const errorColor = ref(DEFAULTS.errorColor);
const size = ref(DEFAULTS.size);
const radius = ref(DEFAULTS.radius);
const washOpacity = ref(DEFAULTS.washOpacity);
const shake = ref(DEFAULTS.shake);
const showTimer = ref(DEFAULTS.showTimer);

const status = ref(DEFAULTS.status);
const expectedMs = ref(DEFAULTS.expectedMs);

let timer: ReturnType<typeof setTimeout> | undefined;

const replay = () => {
  clearTimeout(timer);
  const fail = status.value === 'error';
  status.value = 'running';
  timer = setTimeout(
    () => (status.value = fail ? 'error' : 'done'),
    fail ? Math.round(expectedMs.value * 0.62) : expectedMs.value + 300
  );
};

watch(expectedMs, replay, { immediate: true });

onUnmounted(() => clearTimeout(timer));

const callChipProps = computed(() => ({
  status: status.value,
  icon: icon.value,
  color: color.value,
  surfaceColor: surfaceColor.value,
  progressColor: progressColor.value,
  progressOpacity: progressOpacity.value,
  doneColor: doneColor.value,
  errorColor: errorColor.value,
  size: size.value,
  radius: radius.value,
  expectedMs: expectedMs.value,
  washOpacity: washOpacity.value,
  shake: shake.value,
  showTimer: showTimer.value
}));

const hasChanges = computed(
  () =>
    icon.value !== DEFAULTS.icon ||
    color.value !== DEFAULTS.color ||
    surfaceColor.value !== DEFAULTS.surfaceColor ||
    progressColor.value !== DEFAULTS.progressColor ||
    progressOpacity.value !== DEFAULTS.progressOpacity ||
    doneColor.value !== DEFAULTS.doneColor ||
    errorColor.value !== DEFAULTS.errorColor ||
    size.value !== DEFAULTS.size ||
    radius.value !== DEFAULTS.radius ||
    expectedMs.value !== DEFAULTS.expectedMs ||
    washOpacity.value !== DEFAULTS.washOpacity ||
    shake.value !== DEFAULTS.shake ||
    showTimer.value !== DEFAULTS.showTimer
);

function reset() {
  status.value = DEFAULTS.status;
  icon.value = DEFAULTS.icon;
  color.value = DEFAULTS.color;
  surfaceColor.value = DEFAULTS.surfaceColor;
  progressColor.value = DEFAULTS.progressColor;
  progressOpacity.value = DEFAULTS.progressOpacity;
  doneColor.value = DEFAULTS.doneColor;
  errorColor.value = DEFAULTS.errorColor;
  size.value = DEFAULTS.size;
  radius.value = DEFAULTS.radius;
  expectedMs.value = DEFAULTS.expectedMs;
  washOpacity.value = DEFAULTS.washOpacity;
  shake.value = DEFAULTS.shake;
  showTimer.value = DEFAULTS.showTimer;
  forceRerender();
  replay();
}

const props: PropRow[] = [
  {
    name: 'icon',
    type: '"terminal" | "file" | "search" | "edit"',
    default: '"terminal"',
    description: 'The tool glyph. Pass your own through the icon slot. It rolls out when the call resolves.'
  },
  { name: 'name', type: 'string', default: '"bash"', description: 'The tool name.' },
  { name: 'argument', type: 'string', default: '"npm test"', description: 'The argument.' },
  {
    name: 'status',
    type: '"idle" | "running" | "done" | "error"',
    default: '"running"',
    description:
      'Running wipes the fill across and ticks the counter. Done completes it with a wash. Error stops it, tints and shakes.'
  },
  {
    name: 'expectedMs',
    type: 'number',
    default: '2500',
    description: 'Milliseconds the fill takes to reach its 90% park, the time you expect the call to take.'
  },
  {
    name: 'size',
    type: 'number',
    default: '34',
    description: 'Chip height in pixels. Font, padding and glyph follow.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '10',
    description: 'Corner radius in pixels. Half the height is a pill.'
  },
  { name: 'color', type: 'string', default: '"currentColor"', description: 'Ink for the text and the tool glyph.' },
  { name: 'surfaceColor', type: 'string', default: '"#27272a"', description: 'The chip surface.' },
  {
    name: 'progressColor',
    type: 'string',
    default: '"currentColor"',
    description: 'The fill that wipes across while running.'
  },
  { name: 'progressOpacity', type: 'number', default: '0.08', description: 'How strong that fill is.' },
  { name: 'doneColor', type: 'string', default: '"#22c55e"', description: 'The success wash and the check.' },
  {
    name: 'errorColor',
    type: 'string',
    default: '"#ef4444"',
    description: 'The stopped fill and the retry glyph on error.'
  },
  {
    name: 'washOpacity',
    type: 'number',
    default: '0.14',
    description: 'Strength of the success wash and of the error tint.'
  },
  { name: 'shake', type: 'number', default: '6', description: 'Error shake amplitude in pixels. 0 tints only.' },
  { name: 'showTimer', type: 'boolean', default: 'true', description: 'Shows the millisecond counter.' },
  {
    name: '@retry',
    type: '() => void',
    default: '-',
    description: 'Emitted when the failed chip is clicked.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
