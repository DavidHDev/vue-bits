<template>
  <h1 class="sub-category">Slide Commit</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="slideCommit.usage"
    :source="slideCommitSource"
    component-name="SlideCommit"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <SlideCommit
          :key="key"
          :label="label"
          :done-label="doneLabel"
          :error-label="errorLabel"
          :on-confirm="handleConfirm"
          :track-color="trackColor"
          :handle-color="handleColor"
          :success-color="successColor"
          :danger-color="dangerColor"
          :width="width"
          :height="height"
          :radius="radius"
          :speed="speed"
          :return-bounce="returnBounce"
          :landing-dip="landingDip"
          :hold-ms="holdMs"
          :disabled="disabled"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Outcome" :options="OUTCOME_OPTIONS" :width="120" v-model="outcome" />
        <PreviewSlider title="Latency" :min="0" :max="3000" :step="100" valueUnit="ms" v-model="latency" />
        <PreviewInput title="Label" :maxlength="28" v-model="label" />
        <PreviewInput title="Done Label" :maxlength="20" v-model="doneLabel" />
        <PreviewInput title="Error Label" :maxlength="28" v-model="errorLabel" />
        <PreviewColorPicker title="Track" v-model="trackColor" />
        <PreviewColorPicker title="Handle" v-model="handleColor" />
        <PreviewColorPicker title="Success" v-model="successColor" />
        <PreviewColorPicker title="Danger" v-model="dangerColor" />
        <PreviewSlider title="Width" :min="220" :max="380" :step="4" valueUnit="px" v-model="width" />
        <PreviewSlider title="Height" :min="44" :max="72" :step="2" valueUnit="px" v-model="height" />
        <PreviewSlider title="Radius" :min="0" :max="36" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Speed" :min="0" :max="100" :step="1" v-model="speed" />
        <PreviewSlider title="Return Bounce" :min="0" :max="0.5" :step="0.02" v-model="returnBounce" />
        <PreviewSlider title="Landing Dip" :min="0" :max="0.06" :step="0.002" v-model="landingDip" />
        <PreviewSlider title="Hold" :min="500" :max="4000" :step="100" valueUnit="ms" v-model="holdMs" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="slide-commit" :usage="slideCommit.usage!" :source="slideCommitSource" />
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
import { slideCommit } from '@/constants/code/Micro/slideCommitCode';
import SlideCommit from '@/content/Micro/SlideCommit/SlideCommit.vue';
import slideCommitSource from '@/content/Micro/SlideCommit/SlideCommit.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  outcome: 'resolve',
  latency: 1200,
  label: 'Slide to pay',
  doneLabel: 'Paid',
  errorLabel: 'Payment failed',
  trackColor: '#262626',
  handleColor: '#f5f5f5',
  successColor: '#22c55e',
  dangerColor: '#e5484d',
  width: 280,
  height: 56,
  radius: 28,
  speed: 50,
  returnBounce: 0.38,
  landingDip: 0.026,
  holdMs: 1500,
  disabled: false
};

const OUTCOME_OPTIONS = [
  { value: 'resolve', label: 'Resolve' },
  { value: 'reject', label: 'Reject' },
  { value: 'instant', label: 'Instant' }
];

const outcome = ref(DEFAULTS.outcome);
const latency = ref(DEFAULTS.latency);
const label = ref(DEFAULTS.label);
const doneLabel = ref(DEFAULTS.doneLabel);
const errorLabel = ref(DEFAULTS.errorLabel);
const trackColor = ref(DEFAULTS.trackColor);
const handleColor = ref(DEFAULTS.handleColor);
const successColor = ref(DEFAULTS.successColor);
const dangerColor = ref(DEFAULTS.dangerColor);
const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const radius = ref(DEFAULTS.radius);
const speed = ref(DEFAULTS.speed);
const returnBounce = ref(DEFAULTS.returnBounce);
const landingDip = ref(DEFAULTS.landingDip);
const holdMs = ref(DEFAULTS.holdMs);
const disabled = ref(DEFAULTS.disabled);

const handleConfirm = () => {
  if (outcome.value === 'instant') return undefined;
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => (outcome.value === 'reject' ? reject(new Error('Declined')) : resolve()), latency.value);
  });
};

const hasChanges = computed(
  () =>
    outcome.value !== DEFAULTS.outcome ||
    latency.value !== DEFAULTS.latency ||
    label.value !== DEFAULTS.label ||
    doneLabel.value !== DEFAULTS.doneLabel ||
    errorLabel.value !== DEFAULTS.errorLabel ||
    trackColor.value !== DEFAULTS.trackColor ||
    handleColor.value !== DEFAULTS.handleColor ||
    successColor.value !== DEFAULTS.successColor ||
    dangerColor.value !== DEFAULTS.dangerColor ||
    width.value !== DEFAULTS.width ||
    height.value !== DEFAULTS.height ||
    radius.value !== DEFAULTS.radius ||
    speed.value !== DEFAULTS.speed ||
    returnBounce.value !== DEFAULTS.returnBounce ||
    landingDip.value !== DEFAULTS.landingDip ||
    holdMs.value !== DEFAULTS.holdMs ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  outcome.value = DEFAULTS.outcome;
  latency.value = DEFAULTS.latency;
  label.value = DEFAULTS.label;
  doneLabel.value = DEFAULTS.doneLabel;
  errorLabel.value = DEFAULTS.errorLabel;
  trackColor.value = DEFAULTS.trackColor;
  handleColor.value = DEFAULTS.handleColor;
  successColor.value = DEFAULTS.successColor;
  dangerColor.value = DEFAULTS.dangerColor;
  width.value = DEFAULTS.width;
  height.value = DEFAULTS.height;
  radius.value = DEFAULTS.radius;
  speed.value = DEFAULTS.speed;
  returnBounce.value = DEFAULTS.returnBounce;
  landingDip.value = DEFAULTS.landingDip;
  holdMs.value = DEFAULTS.holdMs;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'label',
    type: 'string',
    default: '"Slide to pay"',
    description: 'The instruction centred in the pill; the capsule wipes it as you drag.'
  },
  {
    name: 'doneLabel',
    type: 'string',
    default: '"Paid"',
    description: 'The words beside the check once confirmed.'
  },
  {
    name: 'errorLabel',
    type: 'string',
    default: '"Payment failed"',
    description: 'Replaces the instruction, in the danger colour, after a rejected promise.'
  },
  {
    name: 'onConfirm',
    type: '() => void | Promise<unknown>',
    default: '-',
    description:
      'Function prop, called when the handle reaches the end. Return a promise to show the spinner; it unfurls on resolve and springs home on reject.'
  },
  { name: '@done', type: '() => void', default: '-', description: 'Emitted when the done pill unfurls.' },
  {
    name: '@error',
    type: '(reason: unknown) => void',
    default: '-',
    description: 'Emitted with the rejection reason; the component swallows it otherwise.'
  },
  { name: 'trackColor', type: 'string', default: '"#262626"', description: 'The pill behind the handle.' },
  {
    name: 'handleColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The handle and the ground it paints; the arrow colour is picked to read on it.'
  },
  { name: 'successColor', type: 'string', default: '"#22c55e"', description: 'Fill of the done pill.' },
  {
    name: 'dangerColor',
    type: 'string',
    default: '"#e5484d"',
    description: 'Tint of the handle and error label after a reject.'
  },
  {
    name: 'width',
    type: 'number',
    default: '280',
    description: 'Track width in pixels; the travel scales with it.'
  },
  {
    name: 'height',
    type: 'number',
    default: '56',
    description: 'Track height in pixels; the handle is 8px smaller.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '28',
    description: 'Track corner radius; the handle corner is 4px smaller so the two stay concentric.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '50',
    description: 'How fast the unfurl and the return take over once you let go.'
  },
  {
    name: 'returnBounce',
    type: 'number',
    default: '0.38',
    description: 'Energy left when the handle returns to the wall: 0 stops dead, 0.38 fills the 8% squash.'
  },
  {
    name: 'landingDip',
    type: 'number',
    default: '0.026',
    description: 'How much the track dips as the done pill lands. 0 removes it.'
  },
  {
    name: 'holdMs',
    type: 'number',
    default: '1500',
    description: 'How long the done pill stands before it closes back. 0 keeps it until the component remounts.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the control and ignores input.' },
  { name: 'icon (slot)', type: 'slot', default: 'arrow', description: 'Replaces the arrow in the handle.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root element.' }
];
</script>
