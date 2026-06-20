<template>
  <h1 class="sub-category">Side Rays</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="sideRays.usage"
    :source="sideRaysSource"
    component-name="SideRays"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <SideRays
          :speed="speed"
          :ray-color1="rayColor1"
          :ray-color2="rayColor2"
          :intensity="intensity"
          :spread="spread"
          :origin="origin"
          :tilt="tilt"
          :saturation="saturation"
          :blend="blend"
          :falloff="falloff"
          :opacity="opacity"
        />
        <BackgroundContent pill-text="New Background" headline="Light cascading from the corner" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Ray Color 1" v-model="rayColor1" />
        <PreviewColorPicker title="Ray Color 2" v-model="rayColor2" />
        <PreviewSelect title="Origin" v-model="origin" :options="originOptions" />
        <PreviewSlider title="Speed" :min="0.1" :max="5" :step="0.1" v-model="speed" />
        <PreviewSlider title="Intensity" :min="0.1" :max="3" :step="0.1" v-model="intensity" />
        <PreviewSlider title="Spread" :min="0.1" :max="3" :step="0.1" v-model="spread" />
        <PreviewSlider title="Tilt" :min="-60" :max="60" :step="1" v-model="tilt" />
        <PreviewSlider title="Saturation" :min="0" :max="2" :step="0.05" v-model="saturation" />
        <PreviewSlider title="Blend" :min="0" :max="1" :step="0.01" v-model="blend" />
        <PreviewSlider title="Falloff" :min="0.5" :max="4" :step="0.1" v-model="falloff" />
        <PreviewSlider title="Opacity" :min="0" :max="1" :step="0.05" v-model="opacity" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="side-rays" :usage="sideRays.usage!" :source="sideRaysSource" />
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
import { sideRays } from '@/constants/code/Backgrounds/sideRaysCode';
import SideRays, { type SideRaysOrigin } from '@/content/Backgrounds/SideRays/SideRays.vue';
import sideRaysSource from '@/content/Backgrounds/SideRays/SideRays.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 2.5,
  rayColor1: '#27FF64',
  rayColor2: '#A8FFB6',
  intensity: 2,
  spread: 2,
  origin: 'top-right' as SideRaysOrigin,
  tilt: 0,
  saturation: 1.5,
  blend: 0.75,
  falloff: 1.6,
  opacity: 1.0
};

const speed = ref(DEFAULTS.speed);
const rayColor1 = ref(DEFAULTS.rayColor1);
const rayColor2 = ref(DEFAULTS.rayColor2);
const intensity = ref(DEFAULTS.intensity);
const spread = ref(DEFAULTS.spread);
const origin = ref<SideRaysOrigin>(DEFAULTS.origin);
const tilt = ref(DEFAULTS.tilt);
const saturation = ref(DEFAULTS.saturation);
const blend = ref(DEFAULTS.blend);
const falloff = ref(DEFAULTS.falloff);
const opacity = ref(DEFAULTS.opacity);

const originOptions = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' }
];

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    rayColor1.value !== DEFAULTS.rayColor1 ||
    rayColor2.value !== DEFAULTS.rayColor2 ||
    intensity.value !== DEFAULTS.intensity ||
    spread.value !== DEFAULTS.spread ||
    origin.value !== DEFAULTS.origin ||
    tilt.value !== DEFAULTS.tilt ||
    saturation.value !== DEFAULTS.saturation ||
    blend.value !== DEFAULTS.blend ||
    falloff.value !== DEFAULTS.falloff ||
    opacity.value !== DEFAULTS.opacity
);

function reset() {
  speed.value = DEFAULTS.speed;
  rayColor1.value = DEFAULTS.rayColor1;
  rayColor2.value = DEFAULTS.rayColor2;
  intensity.value = DEFAULTS.intensity;
  spread.value = DEFAULTS.spread;
  origin.value = DEFAULTS.origin;
  tilt.value = DEFAULTS.tilt;
  saturation.value = DEFAULTS.saturation;
  blend.value = DEFAULTS.blend;
  falloff.value = DEFAULTS.falloff;
  opacity.value = DEFAULTS.opacity;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'speed', type: 'number', default: '2.5', description: 'Animation speed of the rays' },
  {
    name: 'rayColor1',
    type: 'string',
    default: '"#27FF64"',
    description: 'Color of the first ray layer in hex format'
  },
  {
    name: 'rayColor2',
    type: 'string',
    default: '"#A8FFB6"',
    description: 'Color of the second ray layer in hex format'
  },
  { name: 'intensity', type: 'number', default: '2', description: 'Overall brightness of the rays' },
  {
    name: 'spread',
    type: 'number',
    default: '2',
    description: 'Angular width of the ray fan — higher values create a wider spread between the two ray layers'
  },
  {
    name: 'origin',
    type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"',
    default: '"top-right"',
    description: 'Corner of the canvas from which the rays emerge'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Rotation of the ray fan in degrees — positive values tilt clockwise'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1.5',
    description: 'Color saturation of the rays — 0 renders in grayscale, values above 1 boost color'
  },
  {
    name: 'blend',
    type: 'number',
    default: '0.75',
    description: 'Balance between the two ray layers — 0 is all ray 1, 1 is all ray 2'
  },
  {
    name: 'falloff',
    type: 'number',
    default: '2.0',
    description: 'How steeply brightness diminishes with distance from the source — higher = tighter glow'
  },
  { name: 'opacity', type: 'number', default: '1.0', description: 'Overall opacity of the effect' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS classes to apply to the container' }
];
</script>
