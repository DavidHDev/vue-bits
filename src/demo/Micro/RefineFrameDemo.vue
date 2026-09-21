<template>
  <h1 class="sub-category">Refine Frame</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="refineFrame.usage"
    :source="refineFrameSource"
    component-name="RefineFrame"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <RefreshButton @click="walk" />
        <RefineFrame
          :status="status"
          :aspect-ratio="aspectRatio"
          :width="width"
          :radius="radius"
          :background="background"
          :color="color"
          :stage-duration="stageDuration"
          :sweep="sweep"
          :show-status="showStatus"
          :hide-after="hideAfter"
          @retry="walk"
        >
          <img :src="IMAGE" alt="" crossorigin="anonymous" draggable="false" />
        </RefineFrame>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Status"
          :options="STATUS_OPTIONS"
          :width="140"
          :model-value="status"
          @update:model-value="setStatus($event as RefineFrameStatus)"
        />
        <PreviewSelect title="Aspect" :options="ASPECT_OPTIONS" :width="110" v-model="aspectRatio" />
        <PreviewSlider title="Width" :min="200" :max="480" :step="8" valueUnit="px" v-model="width" />
        <PreviewSlider title="Radius" :min="0" :max="32" :step="1" valueUnit="px" v-model="radius" />
        <PreviewColorPicker title="Background" v-model="background" />
        <PreviewColorPicker title="Ink" v-model="color" />
        <PreviewSlider title="Stage" :min="150" :max="900" :step="10" valueUnit="ms" v-model="stageDuration" />
        <PreviewSwitch title="Sweep" v-model="sweep" />
        <PreviewSwitch title="Show Status" v-model="showStatus" />
        <PreviewSlider
          title="Hide After"
          :min="0"
          :max="4000"
          :step="100"
          valueUnit="ms"
          :isDisabled="!showStatus"
          v-model="hideAfter"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="refine-frame" :usage="refineFrame.usage!" :source="refineFrameSource" />
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
import { refineFrame } from '@/constants/code/Micro/refineFrameCode';
import RefineFrame, { type RefineFrameStatus } from '@/content/Micro/RefineFrame/RefineFrame.vue';
import refineFrameSource from '@/content/Micro/RefineFrame/RefineFrame.vue?raw';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const DEFAULTS = {
  status: 'queued' as RefineFrameStatus,
  aspectRatio: '4 / 3',
  width: 320,
  radius: 16,
  background: '#27272a',
  color: '#f5f5f5',
  stageDuration: 400,
  sweep: true,
  showStatus: true,
  hideAfter: 1200
};

const IMAGE =
  'https://images.unsplash.com/photo-1721407964262-f9864b562453?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const STATUS_OPTIONS = [
  { value: 'queued', label: 'Queued' },
  { value: 'generating', label: 'Generating' },
  { value: 'refining', label: 'Refining' },
  { value: 'complete', label: 'Complete' },
  { value: 'error', label: 'Error' }
];
const ASPECT_OPTIONS = [
  { value: '4 / 3', label: '4 : 3' },
  { value: '1 / 1', label: '1 : 1' },
  { value: '16 / 9', label: '16 : 9' },
  { value: '3 / 4', label: '3 : 4' }
];
const WALK: [RefineFrameStatus, number][] = [
  ['queued', 0],
  ['generating', 700],
  ['refining', 2300],
  ['complete', 3500]
];

const status = ref(DEFAULTS.status);
const aspectRatio = ref(DEFAULTS.aspectRatio);
const width = ref(DEFAULTS.width);
const radius = ref(DEFAULTS.radius);
const background = ref(DEFAULTS.background);
const color = ref(DEFAULTS.color);
const stageDuration = ref(DEFAULTS.stageDuration);
const sweep = ref(DEFAULTS.sweep);
const showStatus = ref(DEFAULTS.showStatus);
const hideAfter = ref(DEFAULTS.hideAfter);

let timers: ReturnType<typeof setTimeout>[] = [];
const stop = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const walk = () => {
  stop();
  WALK.forEach(([next, at]) => timers.push(setTimeout(() => (status.value = next), at)));
};
const setStatus = (next: RefineFrameStatus) => {
  stop();
  status.value = next;
};
onMounted(walk);
onUnmounted(stop);

const hasChanges = computed(
  () =>
    status.value !== DEFAULTS.status ||
    aspectRatio.value !== DEFAULTS.aspectRatio ||
    width.value !== DEFAULTS.width ||
    radius.value !== DEFAULTS.radius ||
    background.value !== DEFAULTS.background ||
    color.value !== DEFAULTS.color ||
    stageDuration.value !== DEFAULTS.stageDuration ||
    sweep.value !== DEFAULTS.sweep ||
    showStatus.value !== DEFAULTS.showStatus ||
    hideAfter.value !== DEFAULTS.hideAfter
);

function reset() {
  aspectRatio.value = DEFAULTS.aspectRatio;
  width.value = DEFAULTS.width;
  radius.value = DEFAULTS.radius;
  background.value = DEFAULTS.background;
  color.value = DEFAULTS.color;
  stageDuration.value = DEFAULTS.stageDuration;
  sweep.value = DEFAULTS.sweep;
  showStatus.value = DEFAULTS.showStatus;
  hideAfter.value = DEFAULTS.hideAfter;
  setStatus(DEFAULTS.status);
}

const props: PropRow[] = [
  {
    name: 'status',
    type: "'queued' | 'generating' | 'refining' | 'complete' | 'error'",
    default: "'generating'",
    description: 'The stage. Each change tweens the media to that stage.'
  },
  {
    name: 'default slot',
    type: 'slot',
    default: '-',
    description: 'The media: an img, video or canvas. It fills the frame.'
  },
  {
    name: 'aspectRatio',
    type: 'string',
    default: '"4 / 3"',
    description: 'The box reserved before and during generation, so nothing shifts.'
  },
  { name: 'width', type: 'number', default: '320', description: 'Frame width in px, capped at the parent.' },
  { name: 'radius', type: 'number', default: '16', description: 'Corner radius in px.' },
  {
    name: 'background',
    type: 'string',
    default: '"#27272a"',
    description: 'The paper behind the media, and the chip surface.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The ink: chip text, the sweep and the retry pill.'
  },
  { name: 'stageDuration', type: 'number', default: '400', description: 'Each stage tween, in ms.' },
  { name: 'sweep', type: 'boolean', default: 'true', description: 'A soft band crosses the frame while it works.' },
  {
    name: 'showStatus',
    type: 'boolean',
    default: 'true',
    description: 'The chip with the mark and the stage label.'
  },
  {
    name: 'hideAfter',
    type: 'number',
    default: '1200',
    description: 'Ms after completion before the chip fades. 0 keeps it.'
  },
  {
    name: 'labels',
    type: 'Partial<Record<status, string>>',
    default: 'DEFAULT_LABELS',
    description: 'Chip text per stage: Queued, Generating, Refining, Ready, Failed.'
  },
  { name: 'retryLabel', type: 'string', default: '"Retry"', description: 'The pill on an error.' },
  {
    name: '@retry',
    type: '() => void',
    default: '-',
    description: 'The retry pill was pressed. Without a listener, no pill.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the frame.' }
];
</script>
