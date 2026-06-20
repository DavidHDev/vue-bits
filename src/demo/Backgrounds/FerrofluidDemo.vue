<template>
  <h1 class="sub-category">Ferrofluid</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="ferrofluid.usage"
    :source="ferrofluidSource"
    component-name="Ferrofluid"
    :props-table="props"
  >
    <template #preview>
      <div
        class="relative p-0 h-[500px] overflow-hidden demo-container"
        style="background: linear-gradient(to bottom right, #04130a, #0a2a14, #04130a)"
      >
        <Ferrofluid
          :colors="colors"
          :speed="speed"
          :scale="scale"
          :turbulence="turbulence"
          :fluidity="fluidity"
          :rim-width="rimWidth"
          :sharpness="sharpness"
          :shimmer="shimmer"
          :glow="glow"
          :flow-direction="flowDirection"
          :mouse-interaction="mouseInteraction"
          :mouse-strength="mouseStrength"
          :mouse-radius="mouseRadius"
        />
        <BackgroundContent pill-text="New Background" headline="Bend the magnetic fluid" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewColorPicker title="Color 3" v-model="color3" />
        <PreviewSwitch title="Cursor Magnet" v-model="mouseInteraction" />
        <PreviewSelect title="Flow Direction" v-model="flowDirection" :options="['down', 'up', 'left', 'right']" />
        <PreviewSlider title="Speed" :min="0" :max="3" :step="0.1" v-model="speed" />
        <PreviewSlider title="Scale" :min="0.3" :max="3" :step="0.1" v-model="scale" />
        <PreviewSlider title="Turbulence" :min="0" :max="2" :step="0.05" v-model="turbulence" />
        <PreviewSlider title="Fluidity" :min="0.02" :max="0.5" :step="0.01" v-model="fluidity" />
        <PreviewSlider title="Rim Width" :min="0.05" :max="0.5" :step="0.01" v-model="rimWidth" />
        <PreviewSlider title="Sharpness" :min="1" :max="6" :step="0.1" v-model="sharpness" />
        <PreviewSlider title="Shimmer" :min="0" :max="2" :step="0.05" v-model="shimmer" />
        <PreviewSlider title="Glow" :min="0.5" :max="5" :step="0.1" v-model="glow" />
        <PreviewSlider title="Cursor Strength" :min="0" :max="3" :step="0.1" v-model="mouseStrength" />
        <PreviewSlider title="Cursor Radius" :min="0.05" :max="1" :step="0.05" v-model="mouseRadius" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="ferrofluid" :usage="ferrofluid.usage!" :source="ferrofluidSource" />
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
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { ferrofluid } from '@/constants/code/Backgrounds/ferrofluidCode';
import Ferrofluid, { type FerrofluidFlowDirection } from '@/content/Backgrounds/Ferrofluid/Ferrofluid.vue';
import ferrofluidSource from '@/content/Backgrounds/Ferrofluid/Ferrofluid.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color1: '#27FF64',
  color2: '#7CFF67',
  color3: '#A8FFB6',
  speed: 0.5,
  scale: 1.6,
  turbulence: 1,
  fluidity: 0.1,
  rimWidth: 0.2,
  sharpness: 2.5,
  shimmer: 1.5,
  glow: 2,
  flowDirection: 'down' as FerrofluidFlowDirection,
  mouseInteraction: true,
  mouseStrength: 1,
  mouseRadius: 0.35
};

const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const color3 = ref(DEFAULTS.color3);
const speed = ref(DEFAULTS.speed);
const scale = ref(DEFAULTS.scale);
const turbulence = ref(DEFAULTS.turbulence);
const fluidity = ref(DEFAULTS.fluidity);
const rimWidth = ref(DEFAULTS.rimWidth);
const sharpness = ref(DEFAULTS.sharpness);
const shimmer = ref(DEFAULTS.shimmer);
const glow = ref(DEFAULTS.glow);
const flowDirection = ref<FerrofluidFlowDirection>(DEFAULTS.flowDirection);
const mouseInteraction = ref(DEFAULTS.mouseInteraction);
const mouseStrength = ref(DEFAULTS.mouseStrength);
const mouseRadius = ref(DEFAULTS.mouseRadius);

const colors = computed(() => [color1.value, color2.value, color3.value]);

const hasChanges = computed(
  () =>
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    color3.value !== DEFAULTS.color3 ||
    speed.value !== DEFAULTS.speed ||
    scale.value !== DEFAULTS.scale ||
    turbulence.value !== DEFAULTS.turbulence ||
    fluidity.value !== DEFAULTS.fluidity ||
    rimWidth.value !== DEFAULTS.rimWidth ||
    sharpness.value !== DEFAULTS.sharpness ||
    shimmer.value !== DEFAULTS.shimmer ||
    glow.value !== DEFAULTS.glow ||
    flowDirection.value !== DEFAULTS.flowDirection ||
    mouseInteraction.value !== DEFAULTS.mouseInteraction ||
    mouseStrength.value !== DEFAULTS.mouseStrength ||
    mouseRadius.value !== DEFAULTS.mouseRadius
);

function reset() {
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  color3.value = DEFAULTS.color3;
  speed.value = DEFAULTS.speed;
  scale.value = DEFAULTS.scale;
  turbulence.value = DEFAULTS.turbulence;
  fluidity.value = DEFAULTS.fluidity;
  rimWidth.value = DEFAULTS.rimWidth;
  sharpness.value = DEFAULTS.sharpness;
  shimmer.value = DEFAULTS.shimmer;
  glow.value = DEFAULTS.glow;
  flowDirection.value = DEFAULTS.flowDirection;
  mouseInteraction.value = DEFAULTS.mouseInteraction;
  mouseStrength.value = DEFAULTS.mouseStrength;
  mouseRadius.value = DEFAULTS.mouseRadius;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#27FF64', '#7CFF67', '#A8FFB6']",
    description:
      'Array of hex colors (up to 8) used to tint the fluid rim. Colors are spread across the surface by height; a single color makes the whole effect uniform.'
  },
  { name: 'speed', type: 'number', default: '0.5', description: 'Multiplier for how fast the fluid churns and flows.' },
  {
    name: 'scale',
    type: 'number',
    default: '1.6',
    description: 'Overall feature size. Higher values zoom in for larger, fewer blobs.'
  },
  {
    name: 'turbulence',
    type: 'number',
    default: '1',
    description: 'Amount of domain distortion. Higher values create more chaotic, swirling motion.'
  },
  {
    name: 'fluidity',
    type: 'number',
    default: '0.1',
    description: 'Smoothness of the merge between the two fluid layers. Higher = softer, more liquid blending.'
  },
  {
    name: 'rimWidth',
    type: 'number',
    default: '0.2',
    description: 'Thickness of the glowing contour lines tracing the fluid surface.'
  },
  {
    name: 'sharpness',
    type: 'number',
    default: '2.5',
    description: 'Contrast of the rim highlights. Higher values give crisper, thinner edges.'
  },
  {
    name: 'shimmer',
    type: 'number',
    default: '1.5',
    description: 'Amount of fine grainy break-up applied to the rim. 0 = smooth lines.'
  },
  { name: 'glow', type: 'number', default: '2', description: 'Overall brightness multiplier of the rim highlights.' },
  {
    name: 'flowDirection',
    type: "'up' | 'down' | 'left' | 'right'",
    default: "'down'",
    description: 'Primary direction the fluid surface drifts.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall alpha of the rendered canvas.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enables a magnetic spike that rises and glows under the cursor.'
  },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'Intensity of the magnetic cursor spike.' },
  { name: 'mouseRadius', type: 'number', default: '0.35', description: 'Falloff radius of the magnetic cursor spike.' },
  {
    name: 'mouseDampening',
    type: 'number',
    default: '0.15',
    description: 'Easing time constant (seconds) for the cursor to follow the pointer. 0 = immediate.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: 'undefined',
    description: "CSS mix-blend-mode applied to the canvas (e.g. 'screen', 'lighten')."
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'If true, stops rendering updates (freezing the current frame).'
  },
  {
    name: 'dpr',
    type: 'number',
    default: 'window.devicePixelRatio',
    description: 'Overrides device pixel ratio; lower for performance, higher for sharpness.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Additional class names for the root container.' }
];
</script>
