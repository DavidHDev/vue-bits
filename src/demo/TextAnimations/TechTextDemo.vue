<template>
  <h1 class="sub-category">Tech Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="techText.usage"
    :source="techTextSource"
    component-name="TechText"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-120 overflow-hidden demo-container">
        <RefreshButton @click="run++" />
        <TechText
          :key="run"
          :text="text"
          :font-family="fontFamily"
          :color="color"
          :accent-color="accentColor"
          :font-weight="fontWeight"
          :font-size="fontSize"
          :letter-spacing="letterSpacing"
          :reach="reach"
          :softness="softness"
          :dash-length="dashLength"
          :dash-gap="dashGap"
          :stroke-width="strokeWidth"
          :speed="speed"
          :specks="specks"
          :line-style="lineStyle"
          :reveal="reveal"
          :selection="selection"
          :labels="labels"
          :draggable="draggable"
          :sweep="sweep"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Text" :maxlength="24" v-model="text" />
        <PreviewSelect title="Font" :options="FONT_OPTIONS" v-model="fontFamily" />
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewColorPicker title="Accent" v-model="accentColor" />
        <PreviewSlider title="Font Weight" :min="300" :max="900" :step="100" v-model="fontWeight" />
        <PreviewSlider title="Font Size" :min="60" :max="320" :step="5" valueUnit="px" v-model="fontSize" />
        <PreviewSlider
          title="Letter Spacing"
          :min="-0.1"
          :max="0.2"
          :step="0.01"
          valueUnit="em"
          v-model="letterSpacing"
        />
        <PreviewSelect title="Reveal" :options="REVEAL_OPTIONS" v-model="reveal" />
        <PreviewSlider
          title="Reach"
          :isDisabled="reveal !== 'area'"
          :min="80"
          :max="400"
          :step="10"
          valueUnit="px"
          v-model="reach"
        />
        <PreviewSlider
          title="Softness"
          :isDisabled="reveal !== 'area'"
          :min="0"
          :max="1"
          :step="0.05"
          v-model="softness"
        />
        <PreviewSelect title="Line Style" :options="LINE_OPTIONS" v-model="lineStyle" />
        <PreviewSlider
          title="Dash Length"
          :min="2"
          :max="16"
          :step="1"
          :isDisabled="lineStyle === 'solid'"
          valueUnit="px"
          v-model="dashLength"
        />
        <PreviewSlider
          title="Dash Gap"
          :min="2"
          :max="12"
          :step="1"
          :isDisabled="lineStyle === 'solid'"
          valueUnit="px"
          v-model="dashGap"
        />
        <PreviewSlider title="Stroke Width" :min="0.5" :max="4" :step="0.25" valueUnit="px" v-model="strokeWidth" />
        <PreviewSlider title="Speed" :min="0.2" :max="3" :step="0.1" v-model="speed" />
        <PreviewSlider title="Specks" :min="0" :max="48" :step="1" v-model="specks" />
        <PreviewSwitch title="Selection" v-model="selection" />
        <PreviewSwitch title="Labels" v-model="labels" />
        <PreviewSwitch title="Draggable" v-model="draggable" />
        <PreviewSwitch title="Sweep" v-model="sweep" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="tech-text" :usage="techText.usage!" :source="techTextSource" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { techText } from '@/constants/code/TextAnimations/techTextCode';
import TechText from '@/content/TextAnimations/TechText/TechText.vue';
import techTextSource from '@/content/TextAnimations/TechText/TechText.vue?raw';
import { computed, ref } from 'vue';

const DEFAULTS = {
  text: 'Vue Bits',
  fontFamily: '',
  color: '#ffffff',
  accentColor: '#ffffff',
  fontWeight: 600,
  fontSize: 150,
  letterSpacing: -0.05,
  reach: 200,
  softness: 0.7,
  dashLength: 4,
  dashGap: 2,
  strokeWidth: 1.5,
  speed: 1,
  specks: 15,
  lineStyle: 'dashed' as 'dashed' | 'solid',
  reveal: 'letter' as 'area' | 'letter' | 'off',
  selection: true,
  labels: true,
  draggable: true,
  sweep: true
};

const REVEAL_OPTIONS = [
  { label: 'Area', value: 'area' },
  { label: 'Letter', value: 'letter' },
  { label: 'Off', value: 'off' }
];
const LINE_OPTIONS = [
  { label: 'Dashed', value: 'dashed' },
  { label: 'Solid', value: 'solid' }
];
const FONT_OPTIONS = [
  { label: 'Inherit', value: '' },
  { label: 'Geist Mono', value: '"Geist Mono", monospace' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'System', value: 'system-ui, sans-serif' }
];

const text = ref(DEFAULTS.text);
const fontFamily = ref(DEFAULTS.fontFamily);
const color = ref(DEFAULTS.color);
const accentColor = ref(DEFAULTS.accentColor);
const fontWeight = ref(DEFAULTS.fontWeight);
const fontSize = ref(DEFAULTS.fontSize);
const letterSpacing = ref(DEFAULTS.letterSpacing);
const reach = ref(DEFAULTS.reach);
const softness = ref(DEFAULTS.softness);
const dashLength = ref(DEFAULTS.dashLength);
const dashGap = ref(DEFAULTS.dashGap);
const strokeWidth = ref(DEFAULTS.strokeWidth);
const speed = ref(DEFAULTS.speed);
const specks = ref(DEFAULTS.specks);
const lineStyle = ref(DEFAULTS.lineStyle);
const reveal = ref(DEFAULTS.reveal);
const selection = ref(DEFAULTS.selection);
const labels = ref(DEFAULTS.labels);
const draggable = ref(DEFAULTS.draggable);
const sweep = ref(DEFAULTS.sweep);
const run = ref(0);

const state = {
  text,
  fontFamily,
  color,
  accentColor,
  fontWeight,
  fontSize,
  letterSpacing,
  reach,
  softness,
  dashLength,
  dashGap,
  strokeWidth,
  speed,
  specks,
  lineStyle,
  reveal,
  selection,
  labels,
  draggable,
  sweep
};
const keys = Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[];
const hasChanges = computed(() => keys.some(k => state[k].value !== DEFAULTS[k]));
function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
  run.value++;
}

const props: PropRow[] = [
  { name: 'text', type: 'string', default: '"Vue Bits"', description: 'The wordmark to render.' },
  {
    name: 'fontFamily',
    type: 'string',
    default: '""',
    description: 'Any font family loaded on the page. Leave empty to inherit the font of the container.'
  },
  { name: 'fontWeight', type: 'number', default: '600', description: 'Weight of the wordmark.' },
  {
    name: 'fontSize',
    type: 'number',
    default: '150',
    description: 'Largest font size in px. The wordmark shrinks to fit narrower containers.'
  },
  { name: 'letterSpacing', type: 'number', default: '-0.05', description: 'Extra space between letters, in em.' },
  { name: 'color', type: 'string', default: '"#ffffff"', description: 'Colour of the letters and their outlines.' },
  {
    name: 'accentColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'Colour of the selection frame, connector and labels.'
  },
  {
    name: 'reveal',
    type: '"area" | "letter" | "off"',
    default: '"letter"',
    description:
      'Area fades the letters into outlines inside a circle around the pointer. Letter turns only the active letter into its outline. Off keeps every letter solid.'
  },
  {
    name: 'reach',
    type: 'number',
    default: '200',
    description: 'Radius around the pointer where the letters turn into vector outlines, in px.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.7',
    description: 'How gradually the fill hands over to the outlines. 0 is a hard edge.'
  },
  { name: 'dashLength', type: 'number', default: '4', description: 'Length of each outline dash, in px.' },
  { name: 'dashGap', type: 'number', default: '2', description: 'Space between outline dashes, in px.' },
  {
    name: 'lineStyle',
    type: '"dashed" | "solid"',
    default: '"dashed"',
    description: 'How the outlines under the pointer are drawn. Only the outer silhouette is traced either way.'
  },
  { name: 'strokeWidth', type: 'number', default: '1.5', description: 'Thickness of the outline, in px.' },
  {
    name: 'specks',
    type: 'number',
    default: '15',
    description: 'Tiny squares that blink and respawn around the active letter, seeded per letter. 0 turns them off.'
  },
  {
    name: 'selection',
    type: 'boolean',
    default: 'true',
    description: 'Frame the letter under the pointer. The frame glides from letter to letter.'
  },
  {
    name: 'labels',
    type: 'boolean',
    default: 'true',
    description: 'Label the frame with the letter and its size, or with its offset while dragged.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Let letters be dragged off the baseline. They spring back home on release.'
  },
  {
    name: 'sweep',
    type: 'boolean',
    default: 'true',
    description: 'Sweep the reveal across the wordmark on its own while the pointer is away.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Speed of the idle sweep.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes on the container.' }
];
</script>
