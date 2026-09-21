<template>
  <h1 class="sub-category">Voice Pill</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="voicePill.usage"
    :source="voicePillSource"
    component-name="VoicePill"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <VoicePill
          :accent-color="accentColor"
          :icon-color="iconColor"
          :background="background"
          :size="size"
          :shape="shape"
          :reach="reach"
          :show-time="showTime"
          :waveform="waveform"
          :slide-to-cancel="slideToCancel"
          :cancel-distance="cancelDistance"
          :attack="attack"
          :release="release"
          :sensitivity="sensitivity"
          :floor="floor"
          :open-duration="openDuration"
          :press-scale="pressScale"
          :mode="mode"
          :hold-after="holdAfter"
          :reactive="reactive"
          :disabled="disabled"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Accent" v-model="accentColor" />
        <PreviewColorPicker title="Icon" v-model="iconColor" />
        <PreviewColorPicker title="Background" v-model="background" />
        <PreviewSlider title="Size" :min="24" :max="64" :step="2" valueUnit="px" v-model="size" />
        <PreviewSelect title="Shape" :options="SHAPE_OPTIONS" :width="130" v-model="shape" />
        <PreviewSlider title="Reach" :min="0" :max="20" :step="1" valueUnit="px" v-model="reach" />
        <PreviewSwitch title="Show Time" v-model="showTime" />
        <PreviewSwitch title="Waveform" v-model="waveform" />
        <PreviewSwitch title="Slide To Cancel" v-model="slideToCancel" />
        <PreviewSlider
          title="Cancel Distance"
          :min="32"
          :max="160"
          :step="4"
          valueUnit="px"
          :isDisabled="!slideToCancel"
          v-model="cancelDistance"
        />
        <PreviewSlider title="Attack" :min="5" :max="200" :step="5" valueUnit="ms" v-model="attack" />
        <PreviewSlider title="Release" :min="60" :max="900" :step="10" valueUnit="ms" v-model="release" />
        <PreviewSlider title="Sensitivity" :min="0.25" :max="3" :step="0.05" v-model="sensitivity" />
        <PreviewSlider title="Quiet Height" :min="0" :max="0.5" :step="0.05" v-model="floor" />
        <PreviewSlider title="Open" :min="120" :max="320" :step="10" valueUnit="ms" v-model="openDuration" />
        <PreviewSlider title="Press Scale" :min="0.88" :max="1" :step="0.01" v-model="pressScale" />
        <PreviewSelect title="Mode" :options="MODE_OPTIONS" :width="150" v-model="mode" />
        <PreviewSlider
          title="Hold After"
          :min="100"
          :max="800"
          :step="50"
          valueUnit="ms"
          :isDisabled="mode !== 'auto'"
          v-model="holdAfter"
        />
        <PreviewSelect title="Signal" :options="SIGNAL_OPTIONS" :width="150" v-model="reactive" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="voice-pill" :usage="voicePill.usage!" :source="voicePillSource" />
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
import { voicePill } from '@/constants/code/Micro/voicePillCode';
import VoicePill, {
  type VoicePillMode,
  type VoicePillShape,
  type VoicePillSource
} from '@/content/Micro/VoicePill/VoicePill.vue';
import voicePillSource from '@/content/Micro/VoicePill/VoicePill.vue?raw';
import { computed, ref } from 'vue';

const DEFAULTS = {
  accentColor: '#f5f5f5',
  iconColor: '#a1a1aa',
  background: '#27272a',
  size: 40,
  shape: 'pill' as VoicePillShape,
  reach: 12,
  showTime: true,
  waveform: true,
  slideToCancel: true,
  cancelDistance: 64,
  attack: 40,
  release: 240,
  sensitivity: 1,
  floor: 0.1,
  openDuration: 200,
  pressScale: 0.95,
  mode: 'auto' as VoicePillMode,
  holdAfter: 300,
  reactive: 'simulated' as VoicePillSource,
  disabled: false
};

const SHAPE_OPTIONS = [
  { value: 'pill', label: 'Pill' },
  { value: 'rounded', label: 'Rounded' }
];
const MODE_OPTIONS = [
  { value: 'auto', label: 'Tap or hold' },
  { value: 'hold', label: 'Hold only' },
  { value: 'toggle', label: 'Toggle' }
];
const SIGNAL_OPTIONS = [
  { value: 'simulated', label: 'Simulated' },
  { value: 'mic', label: 'Microphone' }
];

const accentColor = ref(DEFAULTS.accentColor);
const iconColor = ref(DEFAULTS.iconColor);
const background = ref(DEFAULTS.background);
const size = ref(DEFAULTS.size);
const shape = ref(DEFAULTS.shape);
const reach = ref(DEFAULTS.reach);
const showTime = ref(DEFAULTS.showTime);
const waveform = ref(DEFAULTS.waveform);
const slideToCancel = ref(DEFAULTS.slideToCancel);
const cancelDistance = ref(DEFAULTS.cancelDistance);
const attack = ref(DEFAULTS.attack);
const release = ref(DEFAULTS.release);
const sensitivity = ref(DEFAULTS.sensitivity);
const floor = ref(DEFAULTS.floor);
const openDuration = ref(DEFAULTS.openDuration);
const pressScale = ref(DEFAULTS.pressScale);
const mode = ref(DEFAULTS.mode);
const holdAfter = ref(DEFAULTS.holdAfter);
const reactive = ref(DEFAULTS.reactive);
const disabled = ref(DEFAULTS.disabled);

const state = {
  accentColor,
  iconColor,
  background,
  size,
  shape,
  reach,
  showTime,
  waveform,
  slideToCancel,
  cancelDistance,
  attack,
  release,
  sensitivity,
  floor,
  openDuration,
  pressScale,
  mode,
  holdAfter,
  reactive,
  disabled
};
const keys = Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[];

const hasChanges = computed(() => keys.some(k => state[k].value !== DEFAULTS[k]));

function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
}

const props: PropRow[] = [
  {
    name: 'accentColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The waveform, the clock and the stop mark.'
  },
  { name: 'iconColor', type: 'string', default: '"#a1a1aa"', description: 'The mic at rest, and the hover wash.' },
  { name: 'background', type: 'string', default: '"#27272a"', description: 'The capsule surface.' },
  {
    name: 'size',
    type: 'number',
    default: '28',
    description: 'Footprint in px. The icon, the stop mark and the clock scale with it.'
  },
  {
    name: 'shape',
    type: '"pill" | "rounded"',
    default: '"pill"',
    description: 'A circle that opens into a capsule, or a rounded square.'
  },
  {
    name: 'reach',
    type: 'number',
    default: '8',
    description: 'The room the capsule leaves before the waveform, in px.'
  },
  {
    name: 'showTime',
    type: 'boolean',
    default: 'true',
    description: 'An elapsed clock in the capsule, which grows to the left to hold it.'
  },
  {
    name: 'waveform',
    type: 'boolean',
    default: 'true',
    description: 'A history of the level scrolling through the capsule, past the clock.'
  },
  {
    name: 'slideToCancel',
    type: 'boolean',
    default: 'true',
    description:
      'While held, sliding left drags the capsule contents along and reveals Cancel. Crossing the distance stops without a result.'
  },
  {
    name: 'cancelDistance',
    type: 'number',
    default: '64',
    description: 'How far left a held pointer slides before it cancels, in px.'
  },
  { name: 'attack', type: 'number', default: '40', description: 'How fast the level rises to a louder signal, in ms.' },
  {
    name: 'release',
    type: 'number',
    default: '240',
    description: 'How long the level hangs after the sound drops, in ms.'
  },
  { name: 'sensitivity', type: 'number', default: '1', description: 'Gain on the signal before the envelope.' },
  {
    name: 'floor',
    type: 'number',
    default: '0.1',
    description: 'Waveform bar height when silent, as a fraction of its box.'
  },
  { name: 'openDuration', type: 'number', default: '200', description: 'The capsule open and close, in ms.' },
  { name: 'pressScale', type: 'number', default: '0.95', description: 'Scale of the button while a pointer is down.' },
  {
    name: 'mode',
    type: '"auto" | "hold" | "toggle"',
    default: '"auto"',
    description:
      'Auto: a tap latches, a hold stops on release. Hold: release always stops. Toggle: release never stops.'
  },
  {
    name: 'holdAfter',
    type: 'number',
    default: '300',
    description: 'In auto, the press length after which a release stops instead of latching, in ms.'
  },
  {
    name: 'reactive',
    type: '"simulated" | "mic"',
    default: '"simulated"',
    description:
      'What drives the level. Mic asks for microphone permission on the first press and stops if it is refused.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dimmed and inert. A listening pill stops.' },
  {
    name: 'ariaLabel',
    type: 'string',
    default: '"Dictate"',
    description: 'Accessible name. The state is carried by aria-pressed.'
  },
  {
    name: '@start',
    type: '({ source }) => void',
    default: '-',
    description: 'Listening began, with the requested source.'
  },
  {
    name: '@stop',
    type: '({ reason, duration }) => void',
    default: '-',
    description:
      'Listening ended. Reason is release, tap, key, escape, blur, cancel, disabled, mic-denied or unmount; duration in ms.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the button.' }
];
</script>
