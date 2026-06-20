<template>
  <h1 class="sub-category">Prismatic Burst</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="prismaticBurst.usage"
    :source="prismaticBurstSource"
    component-name="PrismaticBurst"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <PrismaticBurst
          :animation-type="animationType"
          :intensity="intensity"
          :speed="speed"
          :distort="distort"
          :hover-dampness="hoverDampness"
          :ray-count="rayCount || undefined"
          v-bind="userColors.length ? { colors: userColors } : {}"
        />
        <BackgroundContent pill-text="New Background" headline="A burst of dancing colors, beautifully unleashed" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color0" />
        <PreviewColorPicker title="Color 2" v-model="color1" />
        <PreviewColorPicker title="Color 3" v-model="color2" />
        <PreviewSelect title="Animation Type" v-model="animationType" :options="animationOptions" />
        <PreviewSlider :min="0.1" :max="5" :step="0.1" v-model="intensity" title="Intensity" />
        <PreviewSlider :min="0" :max="2" :step="0.5" v-model="speed" title="Speed" />
        <PreviewSlider :min="0" :max="10" :step="0.1" v-model="distort" title="Distort" />
        <PreviewSlider :min="0" :max="64" :step="1" v-model="rayCount" title="Ray Count" />
        <PreviewSlider
          v-if="animationType === 'hover'"
          :min="0"
          :max="1"
          :step="0.01"
          v-model="hoverDampness"
          title="Hover Dampness"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="prismatic-burst" :usage="prismaticBurst.usage!" :source="prismaticBurstSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { prismaticBurst } from '@/constants/code/Backgrounds/prismaticBurstCode';
import PrismaticBurst from '@/content/Backgrounds/PrismaticBurst/PrismaticBurst.vue';
import prismaticBurstSource from '@/content/Backgrounds/PrismaticBurst/PrismaticBurst.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  animationType: 'rotate3d' as 'rotate' | 'rotate3d' | 'hover',
  intensity: 2,
  speed: 0.5,
  distort: 0,
  hoverDampness: 0.25,
  rayCount: 0,
  color0: '#10B981',
  color1: '#84CC16',
  color2: '#EAB308'
};

const animationType = ref<'rotate' | 'rotate3d' | 'hover'>(DEFAULTS.animationType);
const intensity = ref(DEFAULTS.intensity);
const speed = ref(DEFAULTS.speed);
const distort = ref(DEFAULTS.distort);
const hoverDampness = ref(DEFAULTS.hoverDampness);
const rayCount = ref(DEFAULTS.rayCount);
const color0 = ref(DEFAULTS.color0);
const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);

const userColors = computed(() => [color0.value, color1.value, color2.value].filter(Boolean) as string[]);

const animationOptions = [
  { value: 'rotate', label: 'Rotate' },
  { value: 'rotate3d', label: 'Rotate 3D' },
  { value: 'hover', label: 'Hover' }
];

const hasChanges = computed(
  () =>
    animationType.value !== DEFAULTS.animationType ||
    intensity.value !== DEFAULTS.intensity ||
    speed.value !== DEFAULTS.speed ||
    distort.value !== DEFAULTS.distort ||
    hoverDampness.value !== DEFAULTS.hoverDampness ||
    rayCount.value !== DEFAULTS.rayCount ||
    color0.value !== DEFAULTS.color0 ||
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2
);

function reset() {
  animationType.value = DEFAULTS.animationType;
  intensity.value = DEFAULTS.intensity;
  speed.value = DEFAULTS.speed;
  distort.value = DEFAULTS.distort;
  hoverDampness.value = DEFAULTS.hoverDampness;
  rayCount.value = DEFAULTS.rayCount;
  color0.value = DEFAULTS.color0;
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'intensity',
    type: 'number',
    default: '2',
    description: 'Overall brightness multiplier applied after accumulation.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Global time multiplier controlling ray motion & distortion.'
  },
  {
    name: 'animationType',
    type: '"rotate" | "rotate3d" | "hover"',
    default: '"rotate3d"',
    description: 'Core motion style: planar rotation, full 3D rotation, or pointer hover orbit'
  },
  {
    name: 'colors',
    type: 'string[]',
    default: '[]',
    description: 'Optional array of hex colors used as a gradient (otherwise spectral)'
  },
  {
    name: 'distort',
    type: 'number',
    default: '0',
    description: 'Amount of bend/distortion applied to marching space (adds organic wobble)'
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freeze time progression when true (animation stops)'
  },
  {
    name: 'offset',
    type: '{ x?: number|string; y?: number|string }',
    default: '{ x: 0, y: 0 }',
    description: 'Pixel (or CSS length) offset of focal origin from center'
  },
  {
    name: 'hoverDampness',
    type: 'number',
    default: '0',
    description: "Smoothing factor (0-1) for pointer tracking when animationType='hover'"
  },
  {
    name: 'rayCount',
    type: 'number',
    default: 'undefined',
    description: 'If > 0 applies an angular comb filter to produce discrete ray spokes'
  },
  {
    name: 'mixBlendMode',
    type: "CSSProperties['mixBlendMode'] | 'none'",
    default: '"lighten"',
    description: "Canvas CSS mix-blend-mode (e.g. lighten, screen) or 'none' for normal"
  }
];
</script>
