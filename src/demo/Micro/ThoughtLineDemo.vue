<template>
  <h1 class="sub-category">Thought Line</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="thoughtLine.usage"
    :source="thoughtLineSource"
    component-name="ThoughtLine"
    :props-table="props"
  >
    <template #preview>
      <div class="relative items-start! p-0 pt-47 h-100 overflow-hidden demo-container">
        <RefreshButton @click="run++" />
        <ThoughtLine
          :label="label"
          :done-label="doneLabel"
          :glyph="glyph"
          :steps="trace ? steps : []"
          :collapsible="collapsible"
          :color="color"
          :glyph-color="glyphColor || color"
          :font-size="fontSize"
          :breath-period="breathPeriod"
          :breath-depth="breathDepth"
          :shimmer="shimmer"
          :shimmer-duration="shimmerDuration"
          :settle-duration="settleDuration"
          :settle-blur="settleBlur"
          :working="shownWorking"
          :show-timer="showTimer"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Loop" v-model="loop" />
        <PreviewSwitch
          title="Working"
          :is-disabled="loop"
          :model-value="shownWorking"
          @update:model-value="working = $event"
        />
        <PreviewInput title="Label" :maxlength="24" v-model="label" />
        <PreviewInput title="Done Label" :maxlength="24" v-model="doneLabel" />
        <PreviewSelect title="Glyph" :options="GLYPH_OPTIONS" :width="120" v-model="glyph" />
        <PreviewColorPicker title="Ink" v-model="color" />
        <PreviewColorPicker
          title="Glyph Color"
          :model-value="glyphColor || color"
          @update:model-value="glyphColor = $event"
        />
        <PreviewSlider title="Font Size" :min="12" :max="28" :step="1" valueUnit="px" v-model="fontSize" />
        <PreviewSlider title="Breath Period" :min="0.8" :max="3" :step="0.1" valueUnit="s" v-model="breathPeriod" />
        <PreviewSlider title="Breath Depth" :min="0" :max="0.6" :step="0.05" v-model="breathDepth" />
        <PreviewSwitch title="Shimmer" v-model="shimmer" />
        <PreviewSlider
          title="Shimmer Speed"
          :min="0.8"
          :max="4"
          :step="0.1"
          valueUnit="s"
          :isDisabled="!shimmer"
          v-model="shimmerDuration"
        />
        <PreviewSlider title="Settle" :min="150" :max="600" :step="10" valueUnit="ms" v-model="settleDuration" />
        <PreviewSlider title="Settle Blur" :min="0" :max="6" :step="0.5" valueUnit="px" v-model="settleBlur" />
        <PreviewSwitch title="Show Timer" v-model="showTimer" />
        <PreviewSwitch title="Trace" v-model="trace" />
        <PreviewSwitch title="Collapsible" v-model="collapsible" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="thought-line" :usage="thoughtLine.usage!" :source="thoughtLineSource" />
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
import { thoughtLine } from '@/constants/code/Micro/thoughtLineCode';
import ThoughtLine, { type ThoughtLineGlyph } from '@/content/Micro/ThoughtLine/ThoughtLine.vue';
import thoughtLineSource from '@/content/Micro/ThoughtLine/ThoughtLine.vue?raw';
import { computed, ref, watch } from 'vue';

const DEFAULTS = {
  label: 'Thinking…',
  doneLabel: '',
  glyph: 'sparkle' as ThoughtLineGlyph,
  color: '#f5f5f5',
  glyphColor: '',
  fontSize: 18,
  breathPeriod: 1.6,
  breathDepth: 0.45,
  shimmer: true,
  shimmerDuration: 1.8,
  settleDuration: 350,
  settleBlur: 2,
  showTimer: true,
  trace: true,
  collapsible: true,
  loop: true,
  working: true
};

const GLYPH_OPTIONS = [
  { value: 'sparkle', label: 'Sparkle' },
  { value: 'dot', label: 'Dot' },
  { value: 'none', label: 'None' }
];

const STEPS = ['Reading the question', 'Searching your notes', 'Comparing two approaches', 'Drafting an answer'];
const STEP_MS = 900;
const FIRST_MS = 500;
const REST_MS = 2600;

const label = ref(DEFAULTS.label);
const doneLabel = ref(DEFAULTS.doneLabel);
const glyph = ref(DEFAULTS.glyph);
const color = ref(DEFAULTS.color);
const glyphColor = ref(DEFAULTS.glyphColor);
const fontSize = ref(DEFAULTS.fontSize);
const breathPeriod = ref(DEFAULTS.breathPeriod);
const breathDepth = ref(DEFAULTS.breathDepth);
const shimmer = ref(DEFAULTS.shimmer);
const shimmerDuration = ref(DEFAULTS.shimmerDuration);
const settleDuration = ref(DEFAULTS.settleDuration);
const settleBlur = ref(DEFAULTS.settleBlur);
const showTimer = ref(DEFAULTS.showTimer);
const trace = ref(DEFAULTS.trace);
const collapsible = ref(DEFAULTS.collapsible);
const loop = ref(DEFAULTS.loop);
const working = ref(DEFAULTS.working);

const run = ref(0);
const loopWorking = ref(true);
const steps = ref<string[]>([]);
const shownWorking = computed(() => (loop.value ? loopWorking.value : working.value));

watch(
  [loop, run],
  (_v, _o, onCleanup) => {
    if (!loop.value) {
      steps.value = STEPS;
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    steps.value = [];
    loopWorking.value = true;
    STEPS.forEach((step, i) => at(FIRST_MS + i * STEP_MS, () => (steps.value = [...steps.value, step])));
    at(FIRST_MS + STEPS.length * STEP_MS, () => (loopWorking.value = false));
    at(FIRST_MS + STEPS.length * STEP_MS + REST_MS, () => run.value++);
    onCleanup(() => timers.forEach(clearTimeout));
  },
  { immediate: true }
);

const hasChanges = computed(
  () =>
    label.value !== DEFAULTS.label ||
    doneLabel.value !== DEFAULTS.doneLabel ||
    glyph.value !== DEFAULTS.glyph ||
    color.value !== DEFAULTS.color ||
    glyphColor.value !== DEFAULTS.glyphColor ||
    fontSize.value !== DEFAULTS.fontSize ||
    breathPeriod.value !== DEFAULTS.breathPeriod ||
    breathDepth.value !== DEFAULTS.breathDepth ||
    shimmer.value !== DEFAULTS.shimmer ||
    shimmerDuration.value !== DEFAULTS.shimmerDuration ||
    settleDuration.value !== DEFAULTS.settleDuration ||
    settleBlur.value !== DEFAULTS.settleBlur ||
    showTimer.value !== DEFAULTS.showTimer ||
    trace.value !== DEFAULTS.trace ||
    collapsible.value !== DEFAULTS.collapsible ||
    loop.value !== DEFAULTS.loop ||
    working.value !== DEFAULTS.working
);

function reset() {
  label.value = DEFAULTS.label;
  doneLabel.value = DEFAULTS.doneLabel;
  glyph.value = DEFAULTS.glyph;
  color.value = DEFAULTS.color;
  glyphColor.value = DEFAULTS.glyphColor;
  fontSize.value = DEFAULTS.fontSize;
  breathPeriod.value = DEFAULTS.breathPeriod;
  breathDepth.value = DEFAULTS.breathDepth;
  shimmer.value = DEFAULTS.shimmer;
  shimmerDuration.value = DEFAULTS.shimmerDuration;
  settleDuration.value = DEFAULTS.settleDuration;
  settleBlur.value = DEFAULTS.settleBlur;
  showTimer.value = DEFAULTS.showTimer;
  trace.value = DEFAULTS.trace;
  collapsible.value = DEFAULTS.collapsible;
  loop.value = DEFAULTS.loop;
  working.value = DEFAULTS.working;
  run.value++;
}

const props: PropRow[] = [
  {
    name: 'label',
    type: 'string',
    default: '"Thinking…"',
    description: 'The working line. It breathes, and it is the spoken text.'
  },
  {
    name: 'doneLabel',
    type: 'string',
    default: '""',
    description: 'The settled line. Empty gives "Thought for", or "Done thinking" without the timer.'
  },
  {
    name: 'renderLabel',
    type: '(text, working) => VNodeChild',
    default: '-',
    description: 'Wraps either string, for a sheen or a link. Inline content only.'
  },
  {
    name: 'glyph',
    type: '"sparkle" | "dot" | "none"',
    default: '"sparkle"',
    description: 'The mark that breathes and dims. The #glyph slot replaces it.'
  },
  {
    name: 'steps',
    type: 'string[]',
    default: '[]',
    description:
      'The trace beneath the line. Append as the agent progresses; the last step is current, earlier ones tick.'
  },
  {
    name: 'collapsible',
    type: 'boolean',
    default: 'true',
    description: 'The line becomes a toggle for the trace, with a chevron.'
  },
  {
    name: 'collapseOnSettle',
    type: 'boolean',
    default: 'true',
    description: 'Fold the trace into the line when it settles.'
  },
  { name: 'color', type: 'string', default: '"currentColor"', description: 'The ink of the line and the trace.' },
  { name: 'glyphColor', type: 'string', default: '""', description: 'The glyph alone. Empty follows the ink.' },
  { name: 'fontSize', type: 'number', default: '16', description: 'Type size in px. Everything scales in em.' },
  { name: 'breathPeriod', type: 'number', default: '1.6', description: 'One breath, up and down, in seconds.' },
  {
    name: 'breathDepth',
    type: 'number',
    default: '0.45',
    description: 'How far the glyph and label dim at the trough. 0 is no breath.'
  },
  {
    name: 'shimmer',
    type: 'boolean',
    default: 'true',
    description: 'A band of ink sweeps the working label. The label then leaves the breath to the glyph.'
  },
  { name: 'shimmerDuration', type: 'number', default: '1.8', description: 'One sweep, in seconds.' },
  {
    name: 'settleDuration',
    type: 'number',
    default: '350',
    description: 'The settle chord, in ms: crossfade, dim, glide, fold.'
  },
  { name: 'settleBlur', type: 'number', default: '2', description: 'Blur through the crossfade seam, in px.' },
  {
    name: 'working',
    type: 'boolean',
    default: 'true',
    description: 'Working or settled. True again starts a new clock.'
  },
  {
    name: 'settleAfter',
    type: 'number',
    default: '0',
    description: 'Seconds after which the line settles by itself. 0 waits for working.'
  },
  {
    name: 'elapsed',
    type: 'number',
    default: 'undefined',
    description: 'Controlled seconds. The internal clock never runs.'
  },
  {
    name: 'showTimer',
    type: 'boolean',
    default: 'true',
    description: 'The live clock that freezes into the sentence.'
  },
  { name: '@settle', type: '(seconds) => void', default: '-', description: 'Once per settle, with the frozen time.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
