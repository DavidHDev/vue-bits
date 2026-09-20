<template>
  <h1 class="sub-category">Code Slots</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="codeSlots.usage"
    :source="codeSlotsSource"
    component-name="CodeSlots"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-125 overflow-hidden demo-container">
        <CodeSlots
          :key="`${key}-${length}`"
          v-bind="codeSlotsProps"
          :value="value"
          :status="status"
          @change="handleChange"
          @complete="handleComplete"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Accent" v-model="accentColor" />
        <PreviewColorPicker title="Ink" v-model="inkColor" />
        <PreviewColorPicker title="Slot" v-model="slotColor" />
        <PreviewColorPicker title="Digit" v-model="digitColor" />
        <PreviewColorPicker title="Danger" v-model="dangerColor" />
        <PreviewSlider title="Length" :min="4" :max="8" :step="1" v-model="length" />
        <PreviewSwitch title="Mask" v-model="mask" />
        <PreviewSwitch title="Caret" v-model="caret" />
        <PreviewSelect title="Outcome" :options="OUTCOME_OPTIONS" :width="120" v-model="outcome" />
        <PreviewSlider title="Slot Size" :min="36" :max="64" :step="2" valueUnit="px" v-model="slotSize" />
        <PreviewSlider title="Gap" :min="4" :max="16" :step="1" valueUnit="px" v-model="gap" />
        <PreviewSlider title="Radius" :min="0" :max="32" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Bounce" :min="0" :max="0.3" :step="0.05" v-model="bounce" />
        <PreviewSlider title="Settle" :min="0.2" :max="0.5" :step="0.05" valueUnit="s" v-model="settle" />
        <PreviewSlider title="Rise" :min="0" :max="16" :step="1" valueUnit="px" v-model="rise" />
        <PreviewSlider title="Cascade" :min="0" :max="60" :step="5" valueUnit="ms" v-model="cascade" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="code-slots" :usage="codeSlots.usage!" :source="codeSlotsSource" />
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
import { useForceRerender } from '@/composables/useForceRerender';
import { codeSlots } from '@/constants/code/Micro/codeSlotsCode';
import CodeSlots, { type CodeSlotsStatus } from '@/content/Micro/CodeSlots/CodeSlots.vue';
import codeSlotsSource from '@/content/Micro/CodeSlots/CodeSlots.vue?raw';
import { computed, onUnmounted, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  accentColor: '#f5f5f5',
  inkColor: '#f5f5f5',
  slotColor: '#27272a',
  digitColor: '#18181b',
  dangerColor: '#ff3b30',
  length: 6,
  mask: false,
  caret: true,
  outcome: 'accept',
  slotSize: 44,
  gap: 8,
  radius: 12,
  bounce: 0.2,
  settle: 0.3,
  rise: 8,
  cascade: 20,
  disabled: false
};

const OUTCOME_OPTIONS = [
  { value: 'accept', label: 'Accept' },
  { value: 'reject', label: 'Reject' }
];

const accentColor = ref(DEFAULTS.accentColor);
const inkColor = ref(DEFAULTS.inkColor);
const slotColor = ref(DEFAULTS.slotColor);
const digitColor = ref(DEFAULTS.digitColor);
const dangerColor = ref(DEFAULTS.dangerColor);
const length = ref(DEFAULTS.length);
const mask = ref(DEFAULTS.mask);
const caret = ref(DEFAULTS.caret);
const outcome = ref(DEFAULTS.outcome);
const slotSize = ref(DEFAULTS.slotSize);
const gap = ref(DEFAULTS.gap);
const radius = ref(DEFAULTS.radius);
const bounce = ref(DEFAULTS.bounce);
const settle = ref(DEFAULTS.settle);
const rise = ref(DEFAULTS.rise);
const cascade = ref(DEFAULTS.cascade);
const disabled = ref(DEFAULTS.disabled);

const value = ref('');
const status = ref<CodeSlotsStatus>('idle');

let timers: ReturnType<typeof setTimeout>[] = [];
const later = (fn: () => void, ms: number) => {
  timers.push(setTimeout(fn, ms));
};
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
onUnmounted(clearTimers);

const handleChange = (code: string) => {
  value.value = code;
  status.value = 'idle';
};

const handleComplete = () => {
  later(() => {
    if (outcome.value === 'reject') {
      status.value = 'error';
      return;
    }
    status.value = 'success';
    later(() => {
      value.value = '';
      status.value = 'idle';
    }, 1800);
  }, 350);
};

const codeSlotsProps = computed(() => ({
  length: length.value,
  mask: mask.value,
  caret: caret.value,
  disabled: disabled.value,
  accentColor: accentColor.value,
  inkColor: inkColor.value,
  slotColor: slotColor.value,
  digitColor: digitColor.value,
  dangerColor: dangerColor.value,
  slotSize: slotSize.value,
  gap: gap.value,
  radius: radius.value,
  bounce: bounce.value,
  settle: settle.value,
  rise: rise.value,
  cascade: cascade.value
}));

const hasChanges = computed(
  () =>
    accentColor.value !== DEFAULTS.accentColor ||
    inkColor.value !== DEFAULTS.inkColor ||
    slotColor.value !== DEFAULTS.slotColor ||
    digitColor.value !== DEFAULTS.digitColor ||
    dangerColor.value !== DEFAULTS.dangerColor ||
    length.value !== DEFAULTS.length ||
    mask.value !== DEFAULTS.mask ||
    caret.value !== DEFAULTS.caret ||
    outcome.value !== DEFAULTS.outcome ||
    slotSize.value !== DEFAULTS.slotSize ||
    gap.value !== DEFAULTS.gap ||
    radius.value !== DEFAULTS.radius ||
    bounce.value !== DEFAULTS.bounce ||
    settle.value !== DEFAULTS.settle ||
    rise.value !== DEFAULTS.rise ||
    cascade.value !== DEFAULTS.cascade ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  accentColor.value = DEFAULTS.accentColor;
  inkColor.value = DEFAULTS.inkColor;
  slotColor.value = DEFAULTS.slotColor;
  digitColor.value = DEFAULTS.digitColor;
  dangerColor.value = DEFAULTS.dangerColor;
  length.value = DEFAULTS.length;
  mask.value = DEFAULTS.mask;
  caret.value = DEFAULTS.caret;
  outcome.value = DEFAULTS.outcome;
  slotSize.value = DEFAULTS.slotSize;
  gap.value = DEFAULTS.gap;
  radius.value = DEFAULTS.radius;
  bounce.value = DEFAULTS.bounce;
  settle.value = DEFAULTS.settle;
  rise.value = DEFAULTS.rise;
  cascade.value = DEFAULTS.cascade;
  disabled.value = DEFAULTS.disabled;
  clearTimers();
  value.value = '';
  status.value = 'idle';
  forceRerender();
}

const props: PropRow[] = [
  { name: 'length', type: 'number', default: '6', description: 'Number of slots.' },
  {
    name: 'value',
    type: 'string',
    default: 'undefined',
    description: 'Controlled code. Digits that arrive from outside land with the cascade; digits removed drain.'
  },
  {
    name: 'defaultValue',
    type: 'string',
    default: '""',
    description: 'Uncontrolled initial code, rendered already landed.'
  },
  {
    name: '@change',
    type: '(code: string) => void',
    default: '-',
    description: 'Emitted on every edit, including the clear at the end of a reject.'
  },
  {
    name: '@complete',
    type: '(code: string) => void',
    default: '-',
    description: 'Emitted once when the last hole is filled.'
  },
  {
    name: 'status',
    type: '"idle" | "error" | "success"',
    default: '"idle"',
    description:
      'error drains the slots last to first under the danger tint and clears the code; success merges the fills into one wash and locks the input.'
  },
  { name: 'mask', type: 'boolean', default: 'false', description: 'Shows a dot instead of each digit.' },
  { name: 'caret', type: 'boolean', default: 'true', description: 'Shows the blinking caret in the active slot.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Fades the row and ignores input.' },
  { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Focuses the input on mount.' },
  {
    name: 'accentColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'Fill of a landed digit, the active ring and the success wash.'
  },
  {
    name: 'inkColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'Caret, and the tint of the active slot.'
  },
  { name: 'slotColor', type: 'string', default: '"#27272a"', description: 'Surface of an empty slot.' },
  { name: 'digitColor', type: 'string', default: '"#18181b"', description: 'Digit colour on the fill.' },
  {
    name: 'dangerColor',
    type: 'string',
    default: '"#ff3b30"',
    description: 'Ring and fill colour while status is error.'
  },
  {
    name: 'slotSize',
    type: 'number',
    default: '44',
    description: 'Slot width in pixels. Height and digit size follow it.'
  },
  { name: 'gap', type: 'number', default: '8', description: 'Space between slots in pixels.' },
  {
    name: 'radius',
    type: 'number',
    default: '12',
    description: 'Corner radius in pixels, capped at half the slot size.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.2',
    description: 'Spring overshoot of the landing fill. 0 is critically damped.'
  },
  { name: 'settle', type: 'number', default: '0.3', description: 'Seconds a digit takes to land or drain.' },
  { name: 'rise', type: 'number', default: '8', description: 'Pixels a digit rises into place. 0 fades only.' },
  {
    name: 'cascade',
    type: 'number',
    default: '20',
    description: 'Milliseconds between slots when several land at once or drain on reject.'
  },
  {
    name: 'ariaLabel',
    type: 'string',
    default: '"One-time code"',
    description: 'Accessible name of the input.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
