<template>
  <h1 class="sub-category">Radar</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="radar.usage"
    :source="radarSource"
    component-name="Radar"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <Radar
          :speed="speed"
          :scale="scale"
          :ring-count="ringCount"
          :spoke-count="spokeCount"
          :ring-thickness="ringThickness"
          :spoke-thickness="spokeThickness"
          :sweep-speed="sweepSpeed"
          :sweep-width="sweepWidth"
          :sweep-lobes="sweepLobes"
          :color="color"
          :background-color="backgroundColor"
          :falloff="falloff"
          :brightness="brightness"
          :enable-mouse-interaction="enableMouseInteraction"
          :mouse-influence="mouseInfluence"
        />
        <BackgroundContent pill-text="New Background" headline="Scan the horizon of your imagination!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewColorPicker title="Background" v-model="backgroundColor" />
        <PreviewSlider title="Speed" :min="0.1" :max="5" :step="0.1" v-model="speed" />
        <PreviewSlider title="Scale" :min="0.1" :max="3" :step="0.1" v-model="scale" />
        <PreviewSlider title="Ring Count" :min="1" :max="30" :step="1" v-model="ringCount" />
        <PreviewSlider title="Spoke Count" :min="1" :max="36" :step="1" v-model="spokeCount" />
        <PreviewSlider title="Ring Thickness" :min="0.01" :max="0.3" :step="0.01" v-model="ringThickness" />
        <PreviewSlider title="Spoke Thickness" :min="0.01" :max="0.2" :step="0.01" v-model="spokeThickness" />
        <PreviewSlider title="Sweep Speed" :min="0.1" :max="5" :step="0.1" v-model="sweepSpeed" />
        <PreviewSlider title="Sweep Width" :min="1" :max="20" :step="1" v-model="sweepWidth" />
        <PreviewSlider title="Sweep Lobes" :min="1" :max="6" :step="1" v-model="sweepLobes" />
        <PreviewSlider title="Falloff" :min="0.1" :max="3" :step="0.1" v-model="falloff" />
        <PreviewSlider title="Brightness" :min="0.1" :max="3" :step="0.1" v-model="brightness" />
        <PreviewSwitch title="Mouse Interaction" v-model="enableMouseInteraction" />
        <PreviewSlider
          v-if="enableMouseInteraction"
          title="Mouse Influence"
          :min="0.1"
          :max="1"
          :step="0.05"
          v-model="mouseInfluence"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="radar" :usage="radar.usage!" :source="radarSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { radar } from '@/constants/code/Backgrounds/radarCode';
import Radar from '@/content/Backgrounds/Radar/Radar.vue';
import radarSource from '@/content/Backgrounds/Radar/Radar.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 1.0,
  scale: 0.5,
  ringCount: 10.0,
  spokeCount: 10.0,
  ringThickness: 0.05,
  spokeThickness: 0.01,
  sweepSpeed: 1.0,
  sweepWidth: 2.0,
  sweepLobes: 1.0,
  color: '#27FF64',
  backgroundColor: '#000000',
  falloff: 2.0,
  brightness: 1.0,
  enableMouseInteraction: true,
  mouseInfluence: 0.1
};

const speed = ref(DEFAULTS.speed);
const scale = ref(DEFAULTS.scale);
const ringCount = ref(DEFAULTS.ringCount);
const spokeCount = ref(DEFAULTS.spokeCount);
const ringThickness = ref(DEFAULTS.ringThickness);
const spokeThickness = ref(DEFAULTS.spokeThickness);
const sweepSpeed = ref(DEFAULTS.sweepSpeed);
const sweepWidth = ref(DEFAULTS.sweepWidth);
const sweepLobes = ref(DEFAULTS.sweepLobes);
const color = ref(DEFAULTS.color);
const backgroundColor = ref(DEFAULTS.backgroundColor);
const falloff = ref(DEFAULTS.falloff);
const brightness = ref(DEFAULTS.brightness);
const enableMouseInteraction = ref(DEFAULTS.enableMouseInteraction);
const mouseInfluence = ref(DEFAULTS.mouseInfluence);

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    scale.value !== DEFAULTS.scale ||
    ringCount.value !== DEFAULTS.ringCount ||
    spokeCount.value !== DEFAULTS.spokeCount ||
    ringThickness.value !== DEFAULTS.ringThickness ||
    spokeThickness.value !== DEFAULTS.spokeThickness ||
    sweepSpeed.value !== DEFAULTS.sweepSpeed ||
    sweepWidth.value !== DEFAULTS.sweepWidth ||
    sweepLobes.value !== DEFAULTS.sweepLobes ||
    color.value !== DEFAULTS.color ||
    backgroundColor.value !== DEFAULTS.backgroundColor ||
    falloff.value !== DEFAULTS.falloff ||
    brightness.value !== DEFAULTS.brightness ||
    enableMouseInteraction.value !== DEFAULTS.enableMouseInteraction ||
    mouseInfluence.value !== DEFAULTS.mouseInfluence
);

function reset() {
  speed.value = DEFAULTS.speed;
  scale.value = DEFAULTS.scale;
  ringCount.value = DEFAULTS.ringCount;
  spokeCount.value = DEFAULTS.spokeCount;
  ringThickness.value = DEFAULTS.ringThickness;
  spokeThickness.value = DEFAULTS.spokeThickness;
  sweepSpeed.value = DEFAULTS.sweepSpeed;
  sweepWidth.value = DEFAULTS.sweepWidth;
  sweepLobes.value = DEFAULTS.sweepLobes;
  color.value = DEFAULTS.color;
  backgroundColor.value = DEFAULTS.backgroundColor;
  falloff.value = DEFAULTS.falloff;
  brightness.value = DEFAULTS.brightness;
  enableMouseInteraction.value = DEFAULTS.enableMouseInteraction;
  mouseInfluence.value = DEFAULTS.mouseInfluence;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'speed',
    type: 'number',
    default: '1.0',
    description: 'Overall animation speed multiplier.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '0.5',
    description: 'Zoom level of the radar pattern.'
  },
  {
    name: 'ringCount',
    type: 'number',
    default: '10.0',
    description: 'Number of concentric rings.'
  },
  {
    name: 'spokeCount',
    type: 'number',
    default: '10.0',
    description: 'Number of radial spoke lines.'
  },
  {
    name: 'ringThickness',
    type: 'number',
    default: '0.05',
    description: 'Thickness of the concentric ring lines.'
  },
  {
    name: 'spokeThickness',
    type: 'number',
    default: '0.01',
    description: 'Thickness of the radial spoke lines.'
  },
  {
    name: 'sweepSpeed',
    type: 'number',
    default: '1.0',
    description: 'Rotation speed of the sweep beam.'
  },
  {
    name: 'sweepWidth',
    type: 'number',
    default: '2.0',
    description: 'Width of the sweep trail (higher = thinner).'
  },
  {
    name: 'sweepLobes',
    type: 'number',
    default: '1.0',
    description: 'Number of sweep beams around the radar.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"#27FF64"',
    description: 'Primary radar color in HEX format.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '"#000000"',
    description: 'Background color in HEX format.'
  },
  {
    name: 'falloff',
    type: 'number',
    default: '2.0',
    description: 'Edge fade intensity based on distance from center.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '1.0',
    description: 'Overall brightness multiplier.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enable cursor-reactive center offset.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '0.1',
    description: 'Strength of the mouse offset effect.'
  }
];
</script>
