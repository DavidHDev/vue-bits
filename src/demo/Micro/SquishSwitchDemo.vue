<template>
  <h1 class="sub-category">Squish Switch</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="squishSwitch.usage"
    :source="squishSwitchSource"
    component-name="SquishSwitch"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <SquishSwitch
          :key="key"
          :checked="checked"
          label="Airplane mode"
          :disabled="disabled"
          :track-color="trackColor"
          :track-on-color="trackOnColor"
          :thumb-color="thumbColor"
          :thumb-on-color="thumbOnColor"
          :width="width"
          :height="height"
          :radius="radius"
          :speed="speed"
          :stretch="stretch"
          :hover-scale="hoverScale"
          :color-duration="colorDuration"
          @change="checked = $event"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Checked" v-model="checked" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
        <PreviewColorPicker title="Track" v-model="trackColor" />
        <PreviewColorPicker title="Track On" v-model="trackOnColor" />
        <PreviewColorPicker title="Thumb" v-model="thumbColor" />
        <PreviewColorPicker title="Thumb On" v-model="thumbOnColor" />
        <PreviewSlider title="Width" :min="44" :max="120" :step="2" valueUnit="px" v-model="width" />
        <PreviewSlider title="Height" :min="24" :max="64" :step="2" valueUnit="px" v-model="height" />
        <PreviewSlider title="Radius" :min="0" :max="32" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Speed" :min="0" :max="100" :step="5" v-model="speed" />
        <PreviewSlider title="Stretch" :min="0" :max="100" :step="2" v-model="stretch" />
        <PreviewSlider title="Hover Scale" :min="1" :max="1.1" :step="0.005" v-model="hoverScale" />
        <PreviewSlider title="Color Fade" :min="0" :max="800" :step="20" valueUnit="ms" v-model="colorDuration" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="squish-switch" :usage="squishSwitch.usage!" :source="squishSwitchSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { squishSwitch } from '@/constants/code/Micro/squishSwitchCode';
import SquishSwitch from '@/content/Micro/SquishSwitch/SquishSwitch.vue';
import squishSwitchSource from '@/content/Micro/SquishSwitch/SquishSwitch.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  disabled: false,
  trackColor: '#27272a',
  trackOnColor: '#f5f5f5',
  thumbColor: '#4e4e51',
  thumbOnColor: '#27272a',
  width: 76,
  height: 38,
  radius: 19,
  speed: 50,
  stretch: 36,
  hoverScale: 1.035,
  colorDuration: 320
};

const checked = ref(false);
const disabled = ref(DEFAULTS.disabled);
const trackColor = ref(DEFAULTS.trackColor);
const trackOnColor = ref(DEFAULTS.trackOnColor);
const thumbColor = ref(DEFAULTS.thumbColor);
const thumbOnColor = ref(DEFAULTS.thumbOnColor);
const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const radius = ref(DEFAULTS.radius);
const speed = ref(DEFAULTS.speed);
const stretch = ref(DEFAULTS.stretch);
const hoverScale = ref(DEFAULTS.hoverScale);
const colorDuration = ref(DEFAULTS.colorDuration);

const hasChanges = computed(
  () =>
    disabled.value !== DEFAULTS.disabled ||
    trackColor.value !== DEFAULTS.trackColor ||
    trackOnColor.value !== DEFAULTS.trackOnColor ||
    thumbColor.value !== DEFAULTS.thumbColor ||
    thumbOnColor.value !== DEFAULTS.thumbOnColor ||
    width.value !== DEFAULTS.width ||
    height.value !== DEFAULTS.height ||
    radius.value !== DEFAULTS.radius ||
    speed.value !== DEFAULTS.speed ||
    stretch.value !== DEFAULTS.stretch ||
    hoverScale.value !== DEFAULTS.hoverScale ||
    colorDuration.value !== DEFAULTS.colorDuration
);

function reset() {
  disabled.value = DEFAULTS.disabled;
  trackColor.value = DEFAULTS.trackColor;
  trackOnColor.value = DEFAULTS.trackOnColor;
  thumbColor.value = DEFAULTS.thumbColor;
  thumbOnColor.value = DEFAULTS.thumbOnColor;
  width.value = DEFAULTS.width;
  height.value = DEFAULTS.height;
  radius.value = DEFAULTS.radius;
  speed.value = DEFAULTS.speed;
  stretch.value = DEFAULTS.stretch;
  hoverScale.value = DEFAULTS.hoverScale;
  colorDuration.value = DEFAULTS.colorDuration;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'checked',
    type: 'boolean',
    default: 'undefined',
    description: 'Controlled state. Leave it out to let the switch keep its own.'
  },
  { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
  {
    name: '@change',
    type: '(checked: boolean) => void',
    default: '-',
    description: 'A tap, a drag past the middle, or a key.'
  },
  { name: 'label', type: 'string', default: '""', description: 'A label beside the switch, wired to it.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dimmed and inert.' },
  { name: 'trackColor', type: 'string', default: '"#27272a"', description: 'The track while off.' },
  { name: 'trackOnColor', type: 'string', default: '"#f5f5f5"', description: 'The track while on.' },
  {
    name: 'thumbColor',
    type: 'string',
    default: '""',
    description: 'The thumb while off. Empty mixes the on colour faintly into the track.'
  },
  {
    name: 'thumbOnColor',
    type: 'string',
    default: '""',
    description: 'The thumb while on. Empty uses the off track colour.'
  },
  { name: 'width', type: 'number', default: '76', description: 'Track width in px.' },
  {
    name: 'height',
    type: 'number',
    default: '38',
    description: 'Track height in px. The thumb and its inset follow.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '19',
    description: 'Track corner radius in px, capped at half the height.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '50',
    description: 'Stiffness of the settle spring, 0 to 100. Low is lazy, high is snappy.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '36',
    description: 'How much the thumb lengthens with speed, 0 to 100. It narrows to keep its area.'
  },
  { name: 'hoverScale', type: 'number', default: '1.035', description: 'The thumb swells to this on hover.' },
  { name: 'colorDuration', type: 'number', default: '320', description: 'The colour cross-fade, in ms.' },
  { name: 'ariaLabel', type: 'string', default: '-', description: 'Accessible name when there is no label.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root element.' },
  { name: 'id', type: 'string', default: '-', description: 'Id for the switch button; the label uses it.' }
];
</script>
