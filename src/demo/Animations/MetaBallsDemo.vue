<template>
  <h1 class="sub-category">Meta Balls</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="metaBalls.usage"
    :source="metaBallsSource"
    component-name="MetaBalls"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] demo-container">
        <MetaBalls
          :color="color"
          :cursor-ball-color="cursorBallColor"
          :cursor-ball-size="cursorBallSize"
          :ball-count="ballCount"
          :animation-size="animationSize"
          :enable-mouse-interaction="enableMouseInteraction"
          :hover-smoothness="hoverSmoothness"
          :clumpFactor="clumpFactor"
          :speed="speed"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewColorPicker title="Cursor Ball Color" v-model="cursorBallColor" />
        <PreviewSlider title="Ball Count" :min="1" :max="50" :step="1" v-model="ballCount" />
        <PreviewSlider title="Speed" :min="0" :max="2" :step="0.05" v-model="speed" />
        <PreviewSlider title="Animation Size" :min="5" :max="80" :step="1" v-model="animationSize" />
        <PreviewSlider title="Clump Factor" :min="0" :max="3" :step="0.1" v-model="clumpFactor" />
        <PreviewSlider title="Hover Smoothness" :min="0.01" :max="1" :step="0.01" v-model="hoverSmoothness" />
        <PreviewSlider title="Cursor Ball Size" :min="0.5" :max="10" :step="0.1" v-model="cursorBallSize" />
        <PreviewSwitch title="Mouse Interaction" v-model="enableMouseInteraction" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="meta-balls" :usage="metaBalls.usage!" :source="metaBallsSource" />
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
import { metaBalls } from '@/constants/code/Animations/metaBallsCode';
import MetaBalls from '@/content/Animations/MetaBalls/MetaBalls.vue';
import metaBallsSource from '@/content/Animations/MetaBalls/MetaBalls.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color: '#27FF64',
  cursorBallColor: '#27FF64',
  speed: 0.3,
  animationSize: 30,
  ballCount: 15,
  clumpFactor: 1,
  enableMouseInteraction: true,
  hoverSmoothness: 0.15,
  cursorBallSize: 2
};

const color = ref(DEFAULTS.color);
const cursorBallColor = ref(DEFAULTS.cursorBallColor);
const speed = ref(DEFAULTS.speed);
const animationSize = ref(DEFAULTS.animationSize);
const ballCount = ref(DEFAULTS.ballCount);
const clumpFactor = ref(DEFAULTS.clumpFactor);
const enableMouseInteraction = ref(DEFAULTS.enableMouseInteraction);
const hoverSmoothness = ref(DEFAULTS.hoverSmoothness);
const cursorBallSize = ref(DEFAULTS.cursorBallSize);

const hasChanges = computed(
  () =>
    color.value !== DEFAULTS.color ||
    cursorBallColor.value !== DEFAULTS.cursorBallColor ||
    speed.value !== DEFAULTS.speed ||
    animationSize.value !== DEFAULTS.animationSize ||
    ballCount.value !== DEFAULTS.ballCount ||
    clumpFactor.value !== DEFAULTS.clumpFactor ||
    enableMouseInteraction.value !== DEFAULTS.enableMouseInteraction ||
    hoverSmoothness.value !== DEFAULTS.hoverSmoothness ||
    cursorBallSize.value !== DEFAULTS.cursorBallSize
);

function reset() {
  color.value = DEFAULTS.color;
  cursorBallColor.value = DEFAULTS.cursorBallColor;
  speed.value = DEFAULTS.speed;
  animationSize.value = DEFAULTS.animationSize;
  ballCount.value = DEFAULTS.ballCount;
  clumpFactor.value = DEFAULTS.clumpFactor;
  enableMouseInteraction.value = DEFAULTS.enableMouseInteraction;
  hoverSmoothness.value = DEFAULTS.hoverSmoothness;
  cursorBallSize.value = DEFAULTS.cursorBallSize;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: '#ffffff',
    description: 'The base color of the metaballs.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.3',
    description: 'Speed multiplier for the animation.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enables or disables the ball following the mouse.'
  },
  {
    name: 'enableTransparency',
    type: 'boolean',
    default: 'false',
    description: 'Enables or disables transparency for the container of the animation.'
  },
  {
    name: 'hoverSmoothness',
    type: 'number',
    default: '0.05',
    description: 'Smoothness factor for the cursor ball when following the mouse.'
  },
  {
    name: 'animationSize',
    type: 'number',
    default: '30',
    description: 'The size of the world for the animation.'
  },
  {
    name: 'ballCount',
    type: 'number',
    default: '15',
    description: 'Number of metaballs rendered.'
  },
  {
    name: 'clumpFactor',
    type: 'number',
    default: '1',
    description: 'Determines how close together the balls are rendered.'
  },
  {
    name: 'cursorBallSize',
    type: 'number',
    default: '3',
    description: 'Size of the cursor-controlled ball.'
  },
  {
    name: 'cursorBallColor',
    type: 'string',
    default: '#ff0000',
    description: 'Color of the cursor ball.'
  }
];
</script>
