<template>
  <h1 class="sub-category">Prompt Bar</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="promptBar.usage"
    :source="promptBarSource"
    component-name="PromptBar"
    :props-table="props"
  >
    <template #preview>
      <div class="relative items-end! px-4 pb-8 h-100 overflow-hidden demo-container">
        <PromptBar
          :key="key"
          :placeholder="placeholder"
          :models="models ? undefined : []"
          :efforts="efforts ? undefined : []"
          :busy="busy || flowBusy"
          :on-attach="attach"
          :on-dictate="dictation ? dictate : undefined"
          :background="background"
          :color="color"
          :menu-background="menuBackground"
          :spark-color="sparkColor"
          :spark-boost="sparkBoost"
          :width="width"
          :radius="radius"
          :max-rows="maxRows"
          :morph-duration="morphDuration"
          :squash="squash"
          :tilt="tilt"
          :press-scale="pressScale"
          @send="send"
          @stop="stop"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Placeholder" :maxlength="32" v-model="placeholder" />
        <PreviewColorPicker title="Background" v-model="background" />
        <PreviewColorPicker title="Ink" v-model="color" />
        <PreviewColorPicker title="Menu" v-model="menuBackground" />
        <PreviewColorPicker title="Spark" v-model="sparkColor" />
        <PreviewSlider title="Spark Boost" :min="0" :max="2" :step="0.1" v-model="sparkBoost" />
        <PreviewSlider title="Width" :min="300" :max="520" :step="4" valueUnit="px" v-model="width" />
        <PreviewSlider title="Radius" :min="0" :max="28" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Max Rows" :min="1" :max="10" :step="1" v-model="maxRows" />
        <PreviewSlider title="Morph" :min="120" :max="400" :step="20" valueUnit="ms" v-model="morphDuration" />
        <PreviewSlider title="Squash" :min="0" :max="0.3" :step="0.01" v-model="squash" />
        <PreviewSlider title="Tilt" :min="0" :max="20" :step="1" valueUnit="°" v-model="tilt" />
        <PreviewSlider title="Press Scale" :min="0.85" :max="1" :step="0.01" v-model="pressScale" />
        <PreviewSwitch title="Busy" v-model="busy" />
        <PreviewSwitch title="Model Picker" v-model="models" />
        <PreviewSwitch title="Effort Picker" v-model="efforts" />
        <PreviewSwitch title="Dictation" v-model="dictation" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="prompt-bar" :usage="promptBar.usage!" :source="promptBarSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { promptBar } from '@/constants/code/Micro/promptBarCode';
import PromptBar from '@/content/Micro/PromptBar/PromptBar.vue';
import promptBarSource from '@/content/Micro/PromptBar/PromptBar.vue?raw';
import { computed, onUnmounted, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  placeholder: 'Ask anything',
  background: '#27272a',
  color: '#f5f5f5',
  menuBackground: '#323236',
  sparkColor: '#9dffa4',
  sparkBoost: 1,
  width: 400,
  radius: 16,
  maxRows: 5,
  morphDuration: 240,
  squash: 0.12,
  tilt: 8,
  pressScale: 0.96,
  busy: false,
  models: true,
  efforts: true,
  dictation: true
};

const FILES = ['brief.pdf', 'screenshot.png', 'metrics.csv'];
const TRANSCRIPT = 'Compare the last two quarters of sales';
const RESPONSE_MS = 2400;
const DICTATION_MS = 2200;

const placeholder = ref(DEFAULTS.placeholder);
const background = ref(DEFAULTS.background);
const color = ref(DEFAULTS.color);
const menuBackground = ref(DEFAULTS.menuBackground);
const sparkColor = ref(DEFAULTS.sparkColor);
const sparkBoost = ref(DEFAULTS.sparkBoost);
const width = ref(DEFAULTS.width);
const radius = ref(DEFAULTS.radius);
const maxRows = ref(DEFAULTS.maxRows);
const morphDuration = ref(DEFAULTS.morphDuration);
const squash = ref(DEFAULTS.squash);
const tilt = ref(DEFAULTS.tilt);
const pressScale = ref(DEFAULTS.pressScale);
const busy = ref(DEFAULTS.busy);
const models = ref(DEFAULTS.models);
const efforts = ref(DEFAULTS.efforts);
const dictation = ref(DEFAULTS.dictation);

const flowBusy = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let fileIndex = 0;

const send = () => {
  flowBusy.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (flowBusy.value = false), RESPONSE_MS);
};
const stop = () => {
  clearTimeout(timer);
  flowBusy.value = false;
  if (busy.value) busy.value = false;
};
const attach = () => FILES[fileIndex++ % FILES.length];
const dictate = () => new Promise<string>(resolve => setTimeout(() => resolve(TRANSCRIPT), DICTATION_MS));
onUnmounted(() => clearTimeout(timer));

const hasChanges = computed(
  () =>
    placeholder.value !== DEFAULTS.placeholder ||
    background.value !== DEFAULTS.background ||
    color.value !== DEFAULTS.color ||
    menuBackground.value !== DEFAULTS.menuBackground ||
    sparkColor.value !== DEFAULTS.sparkColor ||
    sparkBoost.value !== DEFAULTS.sparkBoost ||
    width.value !== DEFAULTS.width ||
    radius.value !== DEFAULTS.radius ||
    maxRows.value !== DEFAULTS.maxRows ||
    morphDuration.value !== DEFAULTS.morphDuration ||
    squash.value !== DEFAULTS.squash ||
    tilt.value !== DEFAULTS.tilt ||
    pressScale.value !== DEFAULTS.pressScale ||
    busy.value !== DEFAULTS.busy ||
    models.value !== DEFAULTS.models ||
    efforts.value !== DEFAULTS.efforts ||
    dictation.value !== DEFAULTS.dictation
);

function reset() {
  placeholder.value = DEFAULTS.placeholder;
  background.value = DEFAULTS.background;
  color.value = DEFAULTS.color;
  menuBackground.value = DEFAULTS.menuBackground;
  sparkColor.value = DEFAULTS.sparkColor;
  sparkBoost.value = DEFAULTS.sparkBoost;
  width.value = DEFAULTS.width;
  radius.value = DEFAULTS.radius;
  maxRows.value = DEFAULTS.maxRows;
  morphDuration.value = DEFAULTS.morphDuration;
  squash.value = DEFAULTS.squash;
  tilt.value = DEFAULTS.tilt;
  pressScale.value = DEFAULTS.pressScale;
  busy.value = DEFAULTS.busy;
  models.value = DEFAULTS.models;
  efforts.value = DEFAULTS.efforts;
  dictation.value = DEFAULTS.dictation;
  stop();
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'placeholder',
    type: 'string',
    default: '"Ask anything"',
    description: 'Shown while the field is empty.'
  },
  {
    name: 'sources',
    type: 'PromptBarSource[]',
    default: 'DEFAULT_SOURCES',
    description:
      'Rows of the @ menu and the plus button: key, name, description, icon (Hugeicons data or a Vue component), and attach: true for the row that adds files.'
  },
  {
    name: 'commands',
    type: 'PromptBarCommand[]',
    default: 'DEFAULT_COMMANDS',
    description: 'Rows of the / menu: key, name (with the slash), description.'
  },
  {
    name: 'models',
    type: 'PromptBarModel[]',
    default: 'DEFAULT_MODELS',
    description: 'Rows of the model picker: key, name, tag. An empty list hides the picker.'
  },
  {
    name: 'efforts',
    type: 'string[]',
    default: 'DEFAULT_EFFORTS',
    description:
      'Steps of the effort slider, low to high. The last step turns the field to the spark colour with drifting sparks. An empty list hides the control.'
  },
  {
    name: 'defaultEffort',
    type: 'string',
    default: '""',
    description: 'The step selected at first. Empty picks the middle.'
  },
  { name: '@effortChange', type: '(effort) => void', default: '-', description: 'The slider moved.' },
  {
    name: 'defaultModel',
    type: 'string',
    default: '""',
    description: 'Key of the model selected at first. Empty picks the first.'
  },
  {
    name: 'busy',
    type: 'boolean',
    default: 'false',
    description: 'A response is in flight. The send tile stays ink and its arrow morphs into a stop square.'
  },
  {
    name: '@send',
    type: '(text, { attachments, model, effort }) => void',
    default: '-',
    description: 'Enter or the tile, with a non-empty draft or an attachment. The draft and attachments clear.'
  },
  { name: '@stop', type: '() => void', default: '-', description: 'The tile while busy.' },
  {
    name: 'onAttach',
    type: '() => string | string[] | Promise<string | string[]>',
    default: '-',
    description:
      'Function prop, called when the attach row is picked. Return file names, or a promise of them, and they appear as chips.'
  },
  {
    name: 'onDictate',
    type: '() => string | Promise<string>',
    default: '-',
    description:
      'Function prop for the mic. Return the transcript, or a promise of it, and it lands in the draft. Omit to hide the mic.'
  },
  {
    name: 'background',
    type: 'string',
    default: '"#27272a"',
    description: 'The field surface, and the glyph on an armed tile.'
  },
  { name: 'color', type: 'string', default: '"#f5f5f5"', description: 'The ink: text, icons, and the armed tile.' },
  {
    name: 'menuBackground',
    type: 'string',
    default: '"#323236"',
    description: 'The surface of the menus and the effort popover.'
  },
  {
    name: 'sparkColor',
    type: 'string',
    default: '"#9dffa4"',
    description: 'The wash, the sparks and the slider at the top effort.'
  },
  {
    name: 'sparkBoost',
    type: 'number',
    default: '1',
    description:
      'How strongly typing drives the sparks at the top effort: they rise faster, grow and glow brighter with typing speed, and flash on each keystroke. No sparks are added. 0 keeps them calm.'
  },
  { name: 'width', type: 'number', default: '400', description: 'Field width in px, capped at the parent.' },
  { name: 'radius', type: 'number', default: '16', description: 'Field corner radius in px.' },
  { name: 'maxRows', type: 'number', default: '5', description: 'Rows the field grows to before it scrolls.' },
  { name: 'morphDuration', type: 'number', default: '240', description: 'Arrow to square and back, in ms.' },
  {
    name: 'squash',
    type: 'number',
    default: '0.12',
    description: 'Mid-morph pinch. The glyph narrows by this and grows taller to keep its area.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '8',
    description: 'Mid-morph lean in degrees, mirrored on the way back.'
  },
  {
    name: 'pressScale',
    type: 'number',
    default: '0.96',
    description: 'Scale of the send tile while a pointer is down.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
