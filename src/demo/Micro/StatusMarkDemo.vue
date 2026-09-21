<template>
  <h1 class="sub-category">Status Mark</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="statusMark.usage"
    :source="statusMarkSource"
    component-name="StatusMark"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <StatusMark
          :status="shownStatus"
          :progress="shownProgress"
          :label="label || undefined"
          :color="color"
          :done-color="doneColor"
          :error-color="errorColor"
          :size="size"
          :stroke-width="strokeWidth"
          :dashes="dashes"
          :font-size="fontSize"
          :spin-duration="spinDuration"
          :arc-length="arcLength"
          :draw-duration="drawDuration"
          :fill-opacity="fillOpacity"
          :strike="strike"
          :strike-delay="strikeDelay"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Play Lifecycle" v-model="play" />
        <PreviewSelect
          title="Status"
          :options="STATUS_OPTIONS"
          :width="130"
          :model-value="shownStatus"
          @update:model-value="manualStatus($event as StatusMarkStatus)"
        />
        <PreviewSwitch
          title="Indeterminate"
          :model-value="indeterminate"
          @update:model-value="
            play = false;
            indeterminate = $event;
          "
        />
        <PreviewSlider
          title="Progress"
          :min="0"
          :max="1"
          :step="0.01"
          :isDisabled="indeterminate"
          :model-value="progress"
          @update:model-value="
            play = false;
            progress = $event;
          "
        />
        <PreviewInput title="Label" :maxlength="32" v-model="label" />
        <PreviewColorPicker title="Ink" v-model="color" />
        <PreviewColorPicker title="Done" v-model="doneColor" />
        <PreviewColorPicker title="Error" v-model="errorColor" />
        <PreviewSlider title="Size" :min="16" :max="40" :step="1" valueUnit="px" v-model="size" />
        <PreviewSlider title="Stroke" :min="1.5" :max="3" :step="0.25" v-model="strokeWidth" />
        <PreviewSlider title="Dashes" :min="4" :max="16" :step="1" v-model="dashes" />
        <PreviewSlider title="Font Size" :min="12" :max="22" :step="1" valueUnit="px" v-model="fontSize" />
        <PreviewSlider title="Spin" :min="600" :max="2000" :step="50" valueUnit="ms" v-model="spinDuration" />
        <PreviewSlider title="Arc Length" :min="0.2" :max="0.9" :step="0.01" v-model="arcLength" />
        <PreviewSlider title="Draw" :min="120" :max="600" :step="10" valueUnit="ms" v-model="drawDuration" />
        <PreviewSlider title="Fill" :min="0" :max="0.25" :step="0.01" v-model="fillOpacity" />
        <PreviewSwitch title="Strike Label" v-model="strike" />
        <PreviewSlider title="Strike Delay" :min="0" :max="300" :step="10" valueUnit="ms" v-model="strikeDelay" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="status-mark" :usage="statusMark.usage!" :source="statusMarkSource" />
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
import { statusMark } from '@/constants/code/Micro/statusMarkCode';
import StatusMark, { type StatusMarkStatus } from '@/content/Micro/StatusMark/StatusMark.vue';
import statusMarkSource from '@/content/Micro/StatusMark/StatusMark.vue?raw';
import { computed, onUnmounted, ref, watch } from 'vue';

const DEFAULTS = {
  status: 'running' as StatusMarkStatus,
  indeterminate: true,
  progress: 0.62,
  label: 'Draft supplier emails',
  color: '#f5f5f5',
  doneColor: '#22c55e',
  errorColor: '#ef4444',
  size: 28,
  strokeWidth: 2,
  dashes: 8,
  fontSize: 16,
  spinDuration: 1100,
  arcLength: 0.68,
  drawDuration: 240,
  fillOpacity: 0.06,
  strike: true,
  strikeDelay: 60
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'running', label: 'Running' },
  { value: 'done', label: 'Done' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const LIFECYCLE: [StatusMarkStatus, number | undefined, number][] = [
  ['pending', undefined, 900],
  ['running', undefined, 1600],
  ['running', 0.35, 700],
  ['running', 0.72, 700],
  ['running', 1, 400],
  ['done', undefined, 1800],
  ['pending', undefined, 700],
  ['running', undefined, 1200],
  ['cancelled', undefined, 1400],
  ['pending', undefined, 700],
  ['running', 0.4, 900],
  ['failed', undefined, 1600]
];

const status = ref(DEFAULTS.status);
const indeterminate = ref(DEFAULTS.indeterminate);
const progress = ref(DEFAULTS.progress);
const label = ref(DEFAULTS.label);
const color = ref(DEFAULTS.color);
const doneColor = ref(DEFAULTS.doneColor);
const errorColor = ref(DEFAULTS.errorColor);
const size = ref(DEFAULTS.size);
const strokeWidth = ref(DEFAULTS.strokeWidth);
const dashes = ref(DEFAULTS.dashes);
const fontSize = ref(DEFAULTS.fontSize);
const spinDuration = ref(DEFAULTS.spinDuration);
const arcLength = ref(DEFAULTS.arcLength);
const drawDuration = ref(DEFAULTS.drawDuration);
const fillOpacity = ref(DEFAULTS.fillOpacity);
const strike = ref(DEFAULTS.strike);
const strikeDelay = ref(DEFAULTS.strikeDelay);

const play = ref(true);
const auto = ref<{ status: StatusMarkStatus; progress: number | undefined }>({
  status: 'pending',
  progress: undefined
});
let timer: ReturnType<typeof setTimeout> | undefined;

watch(
  play,
  (on, _prev, onCleanup) => {
    if (!on) return;
    let step = 0;
    const next = () => {
      const [s, p, hold] = LIFECYCLE[step];
      auto.value = { status: s, progress: p };
      step = (step + 1) % LIFECYCLE.length;
      timer = setTimeout(next, hold);
    };
    next();
    onCleanup(() => clearTimeout(timer));
  },
  { immediate: true }
);
onUnmounted(() => clearTimeout(timer));

const manualStatus = (next: StatusMarkStatus) => {
  play.value = false;
  status.value = next;
};

const shownStatus = computed(() => (play.value ? auto.value.status : status.value));
const shownProgress = computed(() =>
  play.value ? auto.value.progress : indeterminate.value ? undefined : progress.value
);

const hasChanges = computed(
  () =>
    status.value !== DEFAULTS.status ||
    indeterminate.value !== DEFAULTS.indeterminate ||
    progress.value !== DEFAULTS.progress ||
    label.value !== DEFAULTS.label ||
    color.value !== DEFAULTS.color ||
    doneColor.value !== DEFAULTS.doneColor ||
    errorColor.value !== DEFAULTS.errorColor ||
    size.value !== DEFAULTS.size ||
    strokeWidth.value !== DEFAULTS.strokeWidth ||
    dashes.value !== DEFAULTS.dashes ||
    fontSize.value !== DEFAULTS.fontSize ||
    spinDuration.value !== DEFAULTS.spinDuration ||
    arcLength.value !== DEFAULTS.arcLength ||
    drawDuration.value !== DEFAULTS.drawDuration ||
    fillOpacity.value !== DEFAULTS.fillOpacity ||
    strike.value !== DEFAULTS.strike ||
    strikeDelay.value !== DEFAULTS.strikeDelay
);

function reset() {
  status.value = DEFAULTS.status;
  indeterminate.value = DEFAULTS.indeterminate;
  progress.value = DEFAULTS.progress;
  label.value = DEFAULTS.label;
  color.value = DEFAULTS.color;
  doneColor.value = DEFAULTS.doneColor;
  errorColor.value = DEFAULTS.errorColor;
  size.value = DEFAULTS.size;
  strokeWidth.value = DEFAULTS.strokeWidth;
  dashes.value = DEFAULTS.dashes;
  fontSize.value = DEFAULTS.fontSize;
  spinDuration.value = DEFAULTS.spinDuration;
  arcLength.value = DEFAULTS.arcLength;
  drawDuration.value = DEFAULTS.drawDuration;
  fillOpacity.value = DEFAULTS.fillOpacity;
  strike.value = DEFAULTS.strike;
  strikeDelay.value = DEFAULTS.strikeDelay;
  play.value = true;
}

const props: PropRow[] = [
  {
    name: 'status',
    type: '"pending" | "running" | "done" | "failed" | "cancelled"',
    default: '"pending"',
    description: 'The lifecycle state. Every change morphs the glyph in place.'
  },
  {
    name: 'progress',
    type: 'number',
    default: 'undefined',
    description: '0 to 1 while running. Leave it out for an indeterminate spinning arc.'
  },
  {
    name: 'label',
    type: 'string',
    default: 'undefined',
    description: 'Text beside the glyph (or the default slot). It dims and gets struck.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"currentColor"',
    description: 'Ring, arc, cancelled cross and label.'
  },
  { name: 'doneColor', type: 'string', default: '"#22c55e"', description: 'Ring, wash and check when done.' },
  { name: 'errorColor', type: 'string', default: '"#ef4444"', description: 'Ring, wash and cross when failed.' },
  {
    name: 'size',
    type: 'number',
    default: '20',
    description: 'Glyph size in pixels. The label gap is half of it.'
  },
  {
    name: 'strokeWidth',
    type: 'number',
    default: '2',
    description: 'Stroke width in the 24-unit box. The ring shrinks to keep its margin.'
  },
  {
    name: 'dashes',
    type: 'number',
    default: '8',
    description: 'Dashes in the idle ring, the ones that fuse into the arc.'
  },
  {
    name: 'fontSize',
    type: 'number',
    default: '14',
    description: 'Label size in pixels. The strike scales with it.'
  },
  {
    name: 'spinDuration',
    type: 'number',
    default: '1100',
    description: 'Milliseconds per turn of the indeterminate arc.'
  },
  {
    name: 'arcLength',
    type: 'number',
    default: '0.68',
    description: 'Share of the ring the indeterminate arc covers.'
  },
  {
    name: 'drawDuration',
    type: 'number',
    default: '240',
    description: 'Milliseconds the check or cross takes to draw.'
  },
  { name: 'fillOpacity', type: 'number', default: '0.06', description: 'The wash inside a finished ring.' },
  { name: 'strike', type: 'boolean', default: 'true', description: 'Strikes the label through when done.' },
  {
    name: 'strikeDelay',
    type: 'number',
    default: '60',
    description: 'Milliseconds after the check starts before the strike wipes in.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
