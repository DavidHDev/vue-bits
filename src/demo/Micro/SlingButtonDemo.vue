<template>
  <h1 class="sub-category">Sling Button</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="slingButton.usage"
    :source="slingButtonSource"
    component-name="SlingButton"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <SlingButton
          :key="key"
          :pad-color="padColor"
          :icon-color="iconColor"
          :accent-color="accentColor"
          :well-color="wellColor"
          :band-color="bandColor"
          :size="size"
          :stroke-width="strokeWidth"
          :arm-at="armAt"
          :max-pull="maxPull"
          :launch-speed="launchSpeed"
          :recoil="recoil"
          :flight="flight"
          :particles="particles"
          :spread="spread"
          :axis="axis"
          :tap-sends="tapSends"
          :disabled="disabled"
          @send="handleSend"
        />
        <div
          class="top-1/2 left-1/2 absolute pointer-events-none"
          :style="{
            transform: 'translate(-50%, 0)',
            marginTop: `${Math.round(size / 2) + 22}px`,
            fontSize: '12px',
            lineHeight: 1,
            letterSpacing: '0.02em',
            color: accentColor,
            opacity: sent ? 0.6 : 0,
            transition: 'opacity 200ms ease'
          }"
          aria-live="polite"
        >
          {{ sent ? 'Sent' : '' }}
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Pad" v-model="padColor" />
        <PreviewColorPicker title="Icon" v-model="iconColor" />
        <PreviewColorPicker title="Accent" v-model="accentColor" />
        <PreviewColorPicker title="Well" v-model="wellColor" />
        <PreviewColorPicker title="Band" v-model="bandColor" />
        <PreviewSlider title="Size" :min="40" :max="88" :step="2" valueUnit="px" v-model="size" />
        <PreviewSlider title="Stroke Width" :min="1.5" :max="6" :step="0.5" valueUnit="px" v-model="strokeWidth" />
        <PreviewSlider title="Arm At" :min="24" :max="96" :step="4" valueUnit="px" v-model="armAt" />
        <PreviewSlider title="Max Pull" :min="80" :max="320" :step="10" valueUnit="px" v-model="maxPull" />
        <PreviewSlider title="Launch Speed" :min="800" :max="4000" :step="100" valueUnit="px/s" v-model="launchSpeed" />
        <PreviewSlider title="Recoil" :min="0" :max="0.3" :step="0.05" v-model="recoil" />
        <PreviewSlider title="Flight" :min="40" :max="240" :step="10" valueUnit="px" v-model="flight" />
        <PreviewSlider title="Particles" :min="0" :max="80" :step="1" v-model="particles" />
        <PreviewSlider title="Spread" :min="0" :max="180" :step="5" valueUnit="°" v-model="spread" />
        <PreviewSelect title="Axis" :options="AXIS_OPTIONS" :width="130" v-model="axis" />
        <PreviewSwitch title="Tap Sends" v-model="tapSends" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="sling-button" :usage="slingButton.usage!" :source="slingButtonSource" />
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
import { slingButton } from '@/constants/code/Micro/slingButtonCode';
import SlingButton, { type SlingAxis } from '@/content/Micro/SlingButton/SlingButton.vue';
import slingButtonSource from '@/content/Micro/SlingButton/SlingButton.vue?raw';
import { computed, onUnmounted, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  padColor: '#f5f5f5',
  iconColor: '#18181b',
  accentColor: '#f5f5f5',
  wellColor: '#27272a',
  bandColor: '#52525b',
  size: 56,
  strokeWidth: 3,
  armAt: 48,
  maxPull: 160,
  launchSpeed: 2600,
  recoil: 0.2,
  flight: 120,
  particles: 14,
  spread: 60,
  axis: 'any' as SlingAxis,
  tapSends: true,
  disabled: false
};

const AXIS_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' }
];

const padColor = ref(DEFAULTS.padColor);
const iconColor = ref(DEFAULTS.iconColor);
const accentColor = ref(DEFAULTS.accentColor);
const wellColor = ref(DEFAULTS.wellColor);
const bandColor = ref(DEFAULTS.bandColor);
const size = ref(DEFAULTS.size);
const strokeWidth = ref(DEFAULTS.strokeWidth);
const armAt = ref(DEFAULTS.armAt);
const maxPull = ref(DEFAULTS.maxPull);
const launchSpeed = ref(DEFAULTS.launchSpeed);
const recoil = ref(DEFAULTS.recoil);
const flight = ref(DEFAULTS.flight);
const particles = ref(DEFAULTS.particles);
const spread = ref(DEFAULTS.spread);
const axis = ref(DEFAULTS.axis);
const tapSends = ref(DEFAULTS.tapSends);
const disabled = ref(DEFAULTS.disabled);

const sent = ref(false);
let sentTimer: ReturnType<typeof setTimeout> | undefined;
const handleSend = () => {
  clearTimeout(sentTimer);
  sent.value = true;
  sentTimer = setTimeout(() => (sent.value = false), 1400);
};
onUnmounted(() => clearTimeout(sentTimer));

const hasChanges = computed(
  () =>
    padColor.value !== DEFAULTS.padColor ||
    iconColor.value !== DEFAULTS.iconColor ||
    accentColor.value !== DEFAULTS.accentColor ||
    wellColor.value !== DEFAULTS.wellColor ||
    bandColor.value !== DEFAULTS.bandColor ||
    size.value !== DEFAULTS.size ||
    strokeWidth.value !== DEFAULTS.strokeWidth ||
    armAt.value !== DEFAULTS.armAt ||
    maxPull.value !== DEFAULTS.maxPull ||
    launchSpeed.value !== DEFAULTS.launchSpeed ||
    recoil.value !== DEFAULTS.recoil ||
    flight.value !== DEFAULTS.flight ||
    particles.value !== DEFAULTS.particles ||
    spread.value !== DEFAULTS.spread ||
    axis.value !== DEFAULTS.axis ||
    tapSends.value !== DEFAULTS.tapSends ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  padColor.value = DEFAULTS.padColor;
  iconColor.value = DEFAULTS.iconColor;
  accentColor.value = DEFAULTS.accentColor;
  wellColor.value = DEFAULTS.wellColor;
  bandColor.value = DEFAULTS.bandColor;
  size.value = DEFAULTS.size;
  strokeWidth.value = DEFAULTS.strokeWidth;
  armAt.value = DEFAULTS.armAt;
  maxPull.value = DEFAULTS.maxPull;
  launchSpeed.value = DEFAULTS.launchSpeed;
  recoil.value = DEFAULTS.recoil;
  flight.value = DEFAULTS.flight;
  particles.value = DEFAULTS.particles;
  spread.value = DEFAULTS.spread;
  axis.value = DEFAULTS.axis;
  tapSends.value = DEFAULTS.tapSends;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'default slot', type: 'slot', default: 'arrow', description: 'Pad content. Defaults to an arrow.' },
  {
    name: '@send',
    type: '() => void',
    default: '-',
    description: 'Emitted on a loaded release, on a tap when tapSends is on, and on Enter or Space.'
  },
  { name: 'padColor', type: 'string', default: '"#f5f5f5"', description: 'The pad fill.' },
  { name: 'iconColor', type: 'string', default: '"#18181b"', description: 'The pad content colour.' },
  {
    name: 'accentColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The power arc, the loaded band and the dot.'
  },
  { name: 'wellColor', type: 'string', default: '"#27272a"', description: 'The seat the pad rests in.' },
  { name: 'bandColor', type: 'string', default: '"#52525b"', description: 'The band before it loads.' },
  {
    name: 'size',
    type: 'number',
    default: '56',
    description: 'Pad diameter in pixels. Seat, hit area and dot follow.'
  },
  {
    name: 'strokeWidth',
    type: 'number',
    default: '3',
    description: 'Arc and band thickness in pixels. The band thins as it stretches.'
  },
  { name: 'armAt', type: 'number', default: '48', description: 'Pull distance in pixels that loads the send.' },
  {
    name: 'maxPull',
    type: 'number',
    default: '160',
    description: 'How far the band can stretch before it stops giving.'
  },
  {
    name: 'launchSpeed',
    type: 'number',
    default: '2600',
    description: 'Speed the band adds on release, in pixels per second. Sets how far the pad snaps through its seat.'
  },
  { name: 'recoil', type: 'number', default: '0.2', description: 'Bounce of the return spring. 0 stops dead.' },
  {
    name: 'flight',
    type: 'number',
    default: '120',
    description: 'How far the lead particle flies, in pixels. The rest scatter around that distance.'
  },
  {
    name: 'particles',
    type: 'number',
    default: '14',
    description:
      'How many particles a launch throws. Each gets a random angle, reach, size, drift, speed and delay. 1 is a single dot, 0 is none.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '60',
    description: 'The cone the burst fans across, in degrees, centred on the launch direction.'
  },
  {
    name: 'axis',
    type: '"any" | "horizontal" | "vertical"',
    default: '"any"',
    description: 'Free pull, or one axis with a little give across it.'
  },
  {
    name: 'tapSends',
    type: 'boolean',
    default: 'true',
    description: 'Whether a plain tap sends. Enter always does.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the pad and ignores input.' },
  { name: 'ariaLabel', type: 'string', default: '"Send"', description: 'Accessible name of the button.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
