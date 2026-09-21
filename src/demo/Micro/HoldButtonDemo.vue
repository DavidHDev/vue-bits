<template>
  <h1 class="sub-category">Hold Button</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="holdButton.usage"
    :source="holdButtonSource"
    component-name="HoldButton"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <HoldButton
          :key="`${action}-${fillDirection}-${key}`"
          :done-label="current.done"
          :background-color="backgroundColor"
          :fill-color="fillColor"
          :text-color="textColor"
          :fill-text-color="fillTextColor"
          :size="size"
          :radius="radius"
          :fill-direction="fillDirection"
          :hold-time="holdTime"
          :release-time="releaseTime"
          :press-scale="pressScale"
          :wave="wave"
          :wave-amplitude="waveAmplitude"
          :glow="glow"
          :reset-after="resetAfter"
          :disabled="disabled"
        >
          <template #icon>
            <HugeiconsIcon :icon="current.icon" :size="18" :stroke-width="2" />
          </template>
          <template #doneIcon>
            <HugeiconsIcon :icon="Tick02Icon as IconArray" :size="18" :stroke-width="2.5" />
          </template>
          {{ current.label }}
        </HoldButton>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Action" :options="ACTION_OPTIONS" :width="150" v-model="action" />
        <PreviewColorPicker title="Fill" v-model="fillColor" />
        <PreviewColorPicker title="Background" v-model="backgroundColor" />
        <PreviewColorPicker title="Text" v-model="textColor" />
        <PreviewColorPicker title="Text On Fill" v-model="fillTextColor" />
        <PreviewSelect title="Size" :options="SIZE_OPTIONS" :width="140" v-model="size" />
        <PreviewSlider title="Radius" :min="0" :max="30" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSelect title="Fill Direction" :options="DIRECTION_OPTIONS" :width="120" v-model="fillDirection" />
        <PreviewSlider title="Hold Time" :min="600" :max="4000" :step="100" valueUnit="ms" v-model="holdTime" />
        <PreviewSlider title="Release" :min="100" :max="400" :step="10" valueUnit="ms" v-model="releaseTime" />
        <PreviewSlider title="Press Scale" :min="0.9" :max="1" :step="0.005" v-model="pressScale" />
        <PreviewSwitch title="Wave" v-model="wave" />
        <PreviewSlider
          title="Wave Size"
          :min="2"
          :max="14"
          :step="1"
          valueUnit="px"
          :isDisabled="!wave"
          v-model="waveAmplitude"
        />
        <PreviewSwitch title="Glow" v-model="glow" />
        <PreviewSlider title="Reset After" :min="0" :max="3000" :step="100" valueUnit="ms" v-model="resetAfter" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="hold-button" :usage="holdButton.usage!" :source="holdButtonSource" />
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
import { holdButton } from '@/constants/code/Micro/holdButtonCode';
import HoldButton, { type HoldButtonDirection, type HoldButtonSize } from '@/content/Micro/HoldButton/HoldButton.vue';
import holdButtonSource from '@/content/Micro/HoldButton/HoldButton.vue?raw';
import { CreditCardIcon, Delete02Icon, Logout01Icon, SentIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type ActionKey = 'delete' | 'send' | 'pay' | 'signout';

const DEFAULTS = {
  action: 'delete' as ActionKey,
  fillColor: '#29ff27',
  backgroundColor: '#27272a',
  textColor: '#f5f5f5',
  fillTextColor: '#000000',
  size: 'md' as HoldButtonSize,
  radius: 14,
  fillDirection: 'right' as HoldButtonDirection,
  holdTime: 2000,
  releaseTime: 200,
  pressScale: 0.97,
  wave: true,
  waveAmplitude: 6,
  glow: true,
  resetAfter: 1200,
  disabled: false
};

const ACTIONS: Record<ActionKey, { label: string; done: string; icon: IconArray }> = {
  delete: { label: 'Hold to delete', done: 'Deleted', icon: Delete02Icon as IconArray },
  send: { label: 'Hold to send', done: 'Sent', icon: SentIcon as IconArray },
  pay: { label: 'Hold to pay', done: 'Paid', icon: CreditCardIcon as IconArray },
  signout: { label: 'Hold to sign out', done: 'Signed out', icon: Logout01Icon as IconArray }
};

const ACTION_OPTIONS = [
  { value: 'delete', label: 'Delete' },
  { value: 'send', label: 'Send' },
  { value: 'pay', label: 'Pay' },
  { value: 'signout', label: 'Sign out' }
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const DIRECTION_OPTIONS = [
  { value: 'right', label: 'Right' },
  { value: 'up', label: 'Up' }
];

const action = ref(DEFAULTS.action);
const fillColor = ref(DEFAULTS.fillColor);
const backgroundColor = ref(DEFAULTS.backgroundColor);
const textColor = ref(DEFAULTS.textColor);
const fillTextColor = ref(DEFAULTS.fillTextColor);
const size = ref(DEFAULTS.size);
const radius = ref(DEFAULTS.radius);
const fillDirection = ref(DEFAULTS.fillDirection);
const holdTime = ref(DEFAULTS.holdTime);
const releaseTime = ref(DEFAULTS.releaseTime);
const pressScale = ref(DEFAULTS.pressScale);
const wave = ref(DEFAULTS.wave);
const waveAmplitude = ref(DEFAULTS.waveAmplitude);
const glow = ref(DEFAULTS.glow);
const resetAfter = ref(DEFAULTS.resetAfter);
const disabled = ref(DEFAULTS.disabled);

const current = computed(() => ACTIONS[action.value] || ACTIONS.delete);

const hasChanges = computed(
  () =>
    action.value !== DEFAULTS.action ||
    fillColor.value !== DEFAULTS.fillColor ||
    backgroundColor.value !== DEFAULTS.backgroundColor ||
    textColor.value !== DEFAULTS.textColor ||
    fillTextColor.value !== DEFAULTS.fillTextColor ||
    size.value !== DEFAULTS.size ||
    radius.value !== DEFAULTS.radius ||
    fillDirection.value !== DEFAULTS.fillDirection ||
    holdTime.value !== DEFAULTS.holdTime ||
    releaseTime.value !== DEFAULTS.releaseTime ||
    pressScale.value !== DEFAULTS.pressScale ||
    wave.value !== DEFAULTS.wave ||
    waveAmplitude.value !== DEFAULTS.waveAmplitude ||
    glow.value !== DEFAULTS.glow ||
    resetAfter.value !== DEFAULTS.resetAfter ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  action.value = DEFAULTS.action;
  fillColor.value = DEFAULTS.fillColor;
  backgroundColor.value = DEFAULTS.backgroundColor;
  textColor.value = DEFAULTS.textColor;
  fillTextColor.value = DEFAULTS.fillTextColor;
  size.value = DEFAULTS.size;
  radius.value = DEFAULTS.radius;
  fillDirection.value = DEFAULTS.fillDirection;
  holdTime.value = DEFAULTS.holdTime;
  releaseTime.value = DEFAULTS.releaseTime;
  pressScale.value = DEFAULTS.pressScale;
  wave.value = DEFAULTS.wave;
  waveAmplitude.value = DEFAULTS.waveAmplitude;
  glow.value = DEFAULTS.glow;
  resetAfter.value = DEFAULTS.resetAfter;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'default slot',
    type: 'slot',
    default: '"Hold to delete"',
    description: 'Label shown while idle and holding.'
  },
  {
    name: 'doneLabel',
    type: 'string',
    default: '"Deleted"',
    description: 'Label that blurs in when the hold completes.'
  },
  {
    name: 'icon (slot)',
    type: 'slot',
    default: 'none',
    description: 'Optional icon rendered before the idle label.'
  },
  {
    name: 'doneIcon (slot)',
    type: 'slot',
    default: 'none',
    description: 'Optional icon rendered before the done label.'
  },
  { name: 'backgroundColor', type: 'string', default: '"#27272a"', description: 'Button body colour.' },
  {
    name: 'fillColor',
    type: 'string',
    default: '"#29ff27"',
    description: 'Colour of the liquid fill, its wave, the glow and the focus ring.'
  },
  { name: 'textColor', type: 'string', default: '"#f5f5f5"', description: 'Label colour outside the fill.' },
  {
    name: 'fillTextColor',
    type: 'string',
    default: '"#000000"',
    description: 'Label colour inside the fill; the ink inverts as the edge crosses it.'
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Height, padding and font size preset.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '14',
    description: 'Corner radius in pixels of the body, the fill and the focus ring.'
  },
  {
    name: 'fillDirection',
    type: '"right" | "up"',
    default: '"right"',
    description: 'Whether the liquid sweeps left to right or rises from the bottom.'
  },
  {
    name: 'holdTime',
    type: 'number',
    default: '2000',
    description: 'How long the press must last, in milliseconds. The fill moves at constant speed.'
  },
  {
    name: 'releaseTime',
    type: 'number',
    default: '200',
    description: 'How fast the fill snaps back on an early release or a reset, in milliseconds.'
  },
  {
    name: 'pressScale',
    type: 'number',
    default: '0.97',
    description: 'Squash of the button while a pointer holds it. 1 disables it.'
  },
  {
    name: 'wave',
    type: 'boolean',
    default: 'true',
    description: 'Scrolling meniscus on the leading edge of the fill.'
  },
  { name: 'waveAmplitude', type: 'number', default: '6', description: 'Height of the wave crests in pixels.' },
  {
    name: 'glow',
    type: 'boolean',
    default: 'true',
    description: 'Glow that charges with the hold and pulses once on completion.'
  },
  {
    name: 'resetAfter',
    type: 'number',
    default: '1200',
    description: 'Milliseconds the done state stays before the button resets. 0 keeps it done.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the button and ignores input.' },
  {
    name: '@hold',
    type: '() => void',
    default: '-',
    description: 'Emitted once, on the frame the fill completes.'
  },
  {
    name: '@tap',
    type: '() => void',
    default: '-',
    description: 'Emitted on a release shorter than 250ms that did not drift away.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the button.' }
];
</script>
