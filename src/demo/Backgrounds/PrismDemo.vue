<template>
  <h1 class="sub-category">Prism</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="prism.usage"
    :source="prismSource"
    component-name="Prism"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <Prism
          :animation-type="animationType"
          :time-scale="timeScale"
          :scale="scale"
          :noise="noise"
          :glow="glow"
          :height="height"
          :base-width="baseWidth"
          :hue-shift="hueShift"
          :color-frequency="colorFrequency"
        />
        <BackgroundContent pill-text="New Background" headline="A spectrum of colors that spark creativity" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Animation Type" v-model="animationType" :options="animationOptions" />
        <PreviewSlider title="Time Scale" :min="0.1" :max="2" :step="0.1" v-model="timeScale" />
        <PreviewSlider title="Scale" :min="1" :max="5" :step="0.1" v-model="scale" />
        <PreviewSlider title="Height" :min="1" :max="5" :step="0.1" v-model="height" />
        <PreviewSlider title="Base Width" :min="1" :max="10" :step="0.1" v-model="baseWidth" />
        <PreviewSlider title="Noise" :min="0" :max="1" :step="0.05" v-model="noise" />
        <PreviewSlider title="Glow" :min="0" :max="3" :step="0.1" v-model="glow" />
        <PreviewSlider title="Hue Shift" :min="-3.1416" :max="3.1416" :step="0.1" v-model="hueShift" />
        <PreviewSlider title="Color Frequency" :min="0.25" :max="4" :step="0.05" v-model="colorFrequency" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="prism" :usage="prism.usage!" :source="prismSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { prism } from '@/constants/code/Backgrounds/prismCode';
import Prism from '@/content/Backgrounds/Prism/Prism.vue';
import prismSource from '@/content/Backgrounds/Prism/Prism.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  animationType: 'rotate' as 'rotate' | 'hover' | '3drotate',
  timeScale: 0.5,
  scale: 3.6,
  noise: 0,
  glow: 1,
  height: 3.5,
  baseWidth: 5.5,
  hueShift: 0,
  colorFrequency: 1
};

const animationType = ref<'rotate' | 'hover' | '3drotate'>(DEFAULTS.animationType);
const timeScale = ref(DEFAULTS.timeScale);
const scale = ref(DEFAULTS.scale);
const noise = ref(DEFAULTS.noise);
const glow = ref(DEFAULTS.glow);
const height = ref(DEFAULTS.height);
const baseWidth = ref(DEFAULTS.baseWidth);
const hueShift = ref(DEFAULTS.hueShift);
const colorFrequency = ref(DEFAULTS.colorFrequency);

const animationOptions = [
  { value: 'rotate', label: 'Rotate' },
  { value: 'hover', label: 'Hover' },
  { value: '3drotate', label: '3D Rotate' }
];

const hasChanges = computed(
  () =>
    animationType.value !== DEFAULTS.animationType ||
    timeScale.value !== DEFAULTS.timeScale ||
    scale.value !== DEFAULTS.scale ||
    noise.value !== DEFAULTS.noise ||
    glow.value !== DEFAULTS.glow ||
    height.value !== DEFAULTS.height ||
    baseWidth.value !== DEFAULTS.baseWidth ||
    hueShift.value !== DEFAULTS.hueShift ||
    colorFrequency.value !== DEFAULTS.colorFrequency
);

function reset() {
  animationType.value = DEFAULTS.animationType;
  timeScale.value = DEFAULTS.timeScale;
  scale.value = DEFAULTS.scale;
  noise.value = DEFAULTS.noise;
  glow.value = DEFAULTS.glow;
  height.value = DEFAULTS.height;
  baseWidth.value = DEFAULTS.baseWidth;
  hueShift.value = DEFAULTS.hueShift;
  colorFrequency.value = DEFAULTS.colorFrequency;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'height',
    type: 'number',
    default: '3.5',
    description: 'Apex height of the prism (world units).'
  },
  {
    name: 'baseWidth',
    type: 'number',
    default: '5.5',
    description: 'Total base width across X/Z (world units).'
  },
  {
    name: 'animationType',
    type: '"rotate" | "hover" | "3drotate"',
    default: '"rotate"',
    description: 'Animation mode: shader wobble, pointer hover tilt, or full 3D rotation.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '1',
    description: 'Glow/bleed intensity multiplier.'
  },
  {
    name: 'offset',
    type: '{ x?: number; y?: number }',
    default: '{ x: 0, y: 0 }',
    description: 'Pixel offset within the canvas (x→right, y→down).'
  },
  {
    name: 'noise',
    type: 'number',
    default: '0.5',
    description: 'Film-grain noise amount added to final color (0 disables).'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Whether the canvas has an alpha channel (transparent background).'
  },
  {
    name: 'scale',
    type: 'number',
    default: '3.6',
    description: 'Overall screen-space scale of the prism (bigger = larger).'
  },
  {
    name: 'hueShift',
    type: 'number',
    default: '0',
    description: 'Hue rotation (radians) applied to final color.'
  },
  {
    name: 'colorFrequency',
    type: 'number',
    default: '1',
    description: 'Frequency of internal sine bands controlling color variation.'
  },
  {
    name: 'hoverStrength',
    type: 'number',
    default: '2',
    description: 'Sensitivity of hover tilt (pitch/yaw amplitude).'
  },
  {
    name: 'inertia',
    type: 'number',
    default: '0.05',
    description: 'Easing factor for hover (0..1, higher = snappier).'
  },
  {
    name: 'bloom',
    type: 'number',
    default: '1',
    description: 'Extra bloom factor layered on top of glow.'
  },
  {
    name: 'suspendWhenOffscreen',
    type: 'boolean',
    default: 'false',
    description: 'Pause rendering when the element is not in the viewport.'
  },
  {
    name: 'timeScale',
    type: 'number',
    default: '0.5',
    description: 'Global time multiplier for animations (0=frozen, 1=normal).'
  }
];
</script>
