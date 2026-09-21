<template>
  <h1 class="sub-category">Bell Toggle</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="bellToggle.usage"
    :source="bellToggleSource"
    component-name="BellToggle"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-125 overflow-hidden demo-container">
        <BellToggle :key="key" v-bind="bellToggleProps" :pressed="on" :count="count" @change="on = $event" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Text" v-model="color" />
        <PreviewColorPicker title="Background" v-model="background" />
        <PreviewColorPicker title="Pressed Text" v-model="onColor" />
        <PreviewColorPicker title="Pressed Background" v-model="onBackground" />
        <PreviewSelect title="Size" :options="SIZE_OPTIONS" :width="120" v-model="size" />
        <PreviewSlider title="Radius" :min="0" :max="26" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Ring Amplitude" :min="6" :max="40" :step="1" valueUnit="°" v-model="ringAmplitude" />
        <PreviewSlider title="Ring Passes" :min="2" :max="9" :step="1" v-model="ringPasses" />
        <PreviewSlider title="Ring Decay" :min="0.5" :max="2" :step="0.1" v-model="ringDecay" />
        <PreviewSlider title="Ring Duration" :min="400" :max="1400" :step="20" valueUnit="ms" v-model="ringDuration" />
        <PreviewSlider title="Ring Pivot" :min="0" :max="100" :step="2" valueUnit="%" v-model="ringPivot" />
        <PreviewSlider title="Crossfade" :min="100" :max="300" :step="10" valueUnit="ms" v-model="crossfadeMs" />
        <PreviewSlider title="Reveal Bounce" :min="0" :max="0.3" :step="0.05" v-model="revealBounce" />
        <PreviewSwitch title="Badge" v-model="badge" />
        <PreviewColorPicker title="Badge Color" v-model="badgeColor" />
        <PreviewSwitch title="Waves" v-model="waves" />
        <PreviewSwitch title="Clapper" v-model="clapper" />
        <PreviewInput title="Off Label" :maxLength="24" v-model="offLabel" />
        <PreviewInput title="On Label" :maxLength="24" v-model="onLabel" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="bell-toggle" :usage="bellToggle.usage!" :source="bellToggleSource" />
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
import { bellToggle } from '@/constants/code/Micro/bellToggleCode';
import BellToggle, { type BellToggleSize } from '@/content/Micro/BellToggle/BellToggle.vue';
import bellToggleSource from '@/content/Micro/BellToggle/BellToggle.vue?raw';
import { computed, ref, watch } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  offLabel: 'Notify me',
  onLabel: "You'll be notified",
  color: '#f5f5f5',
  background: '#27272a',
  onColor: '#18181b',
  onBackground: '#f5f5f5',
  size: 'md' as BellToggleSize,
  radius: 22,
  ringAmplitude: 17,
  ringPasses: 5,
  ringDecay: 1,
  ringDuration: 820,
  ringPivot: 16,
  crossfadeMs: 200,
  revealBounce: 0,
  badge: true,
  badgeColor: '#ef4444',
  waves: true,
  clapper: false,
  disabled: false
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const offLabel = ref(DEFAULTS.offLabel);
const onLabel = ref(DEFAULTS.onLabel);
const color = ref(DEFAULTS.color);
const background = ref(DEFAULTS.background);
const onColor = ref(DEFAULTS.onColor);
const onBackground = ref(DEFAULTS.onBackground);
const size = ref(DEFAULTS.size);
const radius = ref(DEFAULTS.radius);
const ringAmplitude = ref(DEFAULTS.ringAmplitude);
const ringPasses = ref(DEFAULTS.ringPasses);
const ringDecay = ref(DEFAULTS.ringDecay);
const ringDuration = ref(DEFAULTS.ringDuration);
const ringPivot = ref(DEFAULTS.ringPivot);
const crossfadeMs = ref(DEFAULTS.crossfadeMs);
const revealBounce = ref(DEFAULTS.revealBounce);
const badge = ref(DEFAULTS.badge);
const badgeColor = ref(DEFAULTS.badgeColor);
const waves = ref(DEFAULTS.waves);
const clapper = ref(DEFAULTS.clapper);
const disabled = ref(DEFAULTS.disabled);

const on = ref(false);
const count = ref(0);

const bellToggleProps = computed(() => ({
  offLabel: offLabel.value,
  onLabel: onLabel.value,
  color: color.value,
  background: background.value,
  onColor: onColor.value,
  onBackground: onBackground.value,
  size: size.value,
  radius: radius.value,
  ringAmplitude: ringAmplitude.value,
  ringPasses: ringPasses.value,
  ringDecay: ringDecay.value,
  ringDuration: ringDuration.value,
  ringPivot: ringPivot.value,
  crossfadeMs: crossfadeMs.value,
  revealBounce: revealBounce.value,
  badge: badge.value,
  badgeColor: badgeColor.value,
  waves: waves.value,
  clapper: clapper.value,
  disabled: disabled.value
}));

const hasChanges = computed(
  () =>
    offLabel.value !== DEFAULTS.offLabel ||
    onLabel.value !== DEFAULTS.onLabel ||
    color.value !== DEFAULTS.color ||
    background.value !== DEFAULTS.background ||
    onColor.value !== DEFAULTS.onColor ||
    onBackground.value !== DEFAULTS.onBackground ||
    size.value !== DEFAULTS.size ||
    radius.value !== DEFAULTS.radius ||
    ringAmplitude.value !== DEFAULTS.ringAmplitude ||
    ringPasses.value !== DEFAULTS.ringPasses ||
    ringDecay.value !== DEFAULTS.ringDecay ||
    ringDuration.value !== DEFAULTS.ringDuration ||
    ringPivot.value !== DEFAULTS.ringPivot ||
    crossfadeMs.value !== DEFAULTS.crossfadeMs ||
    revealBounce.value !== DEFAULTS.revealBounce ||
    badge.value !== DEFAULTS.badge ||
    badgeColor.value !== DEFAULTS.badgeColor ||
    waves.value !== DEFAULTS.waves ||
    clapper.value !== DEFAULTS.clapper ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  offLabel.value = DEFAULTS.offLabel;
  onLabel.value = DEFAULTS.onLabel;
  color.value = DEFAULTS.color;
  background.value = DEFAULTS.background;
  onColor.value = DEFAULTS.onColor;
  onBackground.value = DEFAULTS.onBackground;
  size.value = DEFAULTS.size;
  radius.value = DEFAULTS.radius;
  ringAmplitude.value = DEFAULTS.ringAmplitude;
  ringPasses.value = DEFAULTS.ringPasses;
  ringDecay.value = DEFAULTS.ringDecay;
  ringDuration.value = DEFAULTS.ringDuration;
  ringPivot.value = DEFAULTS.ringPivot;
  crossfadeMs.value = DEFAULTS.crossfadeMs;
  revealBounce.value = DEFAULTS.revealBounce;
  badge.value = DEFAULTS.badge;
  badgeColor.value = DEFAULTS.badgeColor;
  waves.value = DEFAULTS.waves;
  clapper.value = DEFAULTS.clapper;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

watch(
  on,
  (isOn, _oldVal, onCleanup) => {
    if (!isOn) {
      count.value = 0;
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    const next = () => {
      timer = setTimeout(
        () => {
          count.value = Math.min(9, count.value + 1);
          next();
        },
        1100 + Math.random() * 1400
      );
    };

    next();

    onCleanup(() => {
      clearTimeout(timer);
    });
  },
  { immediate: true }
);

const props: PropRow[] = [
  {
    name: 'offLabel',
    type: 'string',
    default: '"Notify me"',
    description: 'The face at rest. Its width sets how far the pill is clipped.'
  },
  {
    name: 'onLabel',
    type: 'string',
    default: '"You\'ll be notified"',
    description:
      'The face after the yes press. The pill reserves the width of the longer label; only the visible part changes, so neighbours never shift.'
  },
  {
    name: 'icon (slot)',
    type: 'slot',
    default: 'Bell icon',
    description: 'Replaces the bell. Adjust ringPivot for a glyph that hangs elsewhere.'
  },
  {
    name: 'label',
    type: 'string',
    default: 'undefined',
    description: 'Constant accessible name. Falls back to offLabel.'
  },
  { name: 'color', type: 'string', default: '"#f5f5f5"', description: 'Ink at rest: label, bell and hover tint.' },
  { name: 'background', type: 'string', default: '"#27272a"', description: 'Pill fill at rest.' },
  { name: 'onColor', type: 'string', default: '"#18181b"', description: 'Ink when pressed.' },
  { name: 'onBackground', type: 'string', default: '"#f5f5f5"', description: 'Fill when pressed.' },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: '36, 44 or 52 pixels tall with matching type, icon and padding.'
  },
  { name: 'radius', type: 'number', default: '22', description: 'Corner radius of the pill and of the clip cap.' },
  {
    name: 'ringAmplitude',
    type: 'number',
    default: '17',
    description: 'Degrees of the first swing. Every later swing scales from it.'
  },
  {
    name: 'ringPasses',
    type: 'number',
    default: '5',
    description: 'Half-swings before rest. 2 is a nod, 9 a peal.'
  },
  {
    name: 'ringDecay',
    type: 'number',
    default: '1',
    description: 'How fast the swings die. 1 evenly, 2 the second is already small, 0.5 keeps shaking.'
  },
  { name: 'ringDuration', type: 'number', default: '820', description: 'Milliseconds for the whole ring.' },
  {
    name: 'ringPivot',
    type: 'number',
    default: '16',
    description: 'Where the icon hangs from, as a percentage of its height. 16 is the crown, 50 the centre.'
  },
  {
    name: 'crossfadeMs',
    type: 'number',
    default: '200',
    description: 'The label and fill crossfade. Also all a keyboard toggle gets.'
  },
  {
    name: 'revealBounce',
    type: 'number',
    default: '0',
    description: 'Overshoot of the unfurl. 0 is critically damped; 0.2 lets the cap pass its mark and return.'
  },
  {
    name: 'count',
    type: 'number',
    default: '0',
    description: 'Notifications waiting. A rise while on rolls the badge and wobbles the bell.'
  },
  { name: 'badge', type: 'boolean', default: 'true', description: 'Show the count on the bell while on.' },
  { name: 'badgeColor', type: 'string', default: '"#ef4444"', description: 'The badge.' },
  { name: 'badgeTextColor', type: 'string', default: '"#ffffff"', description: 'The count on the badge.' },
  { name: 'waves', type: 'boolean', default: 'true', description: 'Sound waves leave the rim on every swing.' },
  {
    name: 'clapper',
    type: 'boolean',
    default: 'false',
    description: 'Draw a bell with a clapper that swings a beat behind the body.'
  },
  {
    name: 'pressed',
    type: 'boolean',
    default: 'undefined',
    description: 'Controlled state. Outside changes only crossfade.'
  },
  { name: 'defaultPressed', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
  { name: '@change', type: '(pressed: boolean) => void', default: '-', description: 'Emitted on every toggle.' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Dims the pill and ignores input. The state is kept.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
