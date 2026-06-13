<template>
  <h1 class="sub-category">Color Bends</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="colorBends.usage"
    :source="colorBendsSource"
    component-name="ColorBends"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <ColorBends
          :key="key"
          :rotation="rotation"
          :auto-rotate="autoRotate"
          :speed="speed"
          :scale="scale"
          :frequency="frequency"
          :warp-strength="warpStrength"
          :mouse-influence="mouseInfluence"
          :parallax="parallax"
          :noise="noise"
          :iterations="iterations"
          :intensity="intensity"
          :band-width="bandWidth"
          :colors="[color]"
        />
        <BackgroundContent pill-text="New Background" headline="You have the power to reshape your own destiny" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker v-model="color" title="Single Color" />
        <PreviewSlider title="Rotation (deg)" :min="-180" :max="180" :step="1" v-model="rotation" />
        <PreviewSlider title="Auto Rotate (deg/s)" :min="-5" :max="5" :step="1" v-model="autoRotate" />
        <PreviewSlider title="Speed" :min="0" :max="1" :step="0.01" v-model="speed" />
        <PreviewSlider title="Scale" :min="0.2" :max="5" :step="0.1" v-model="scale" />
        <PreviewSlider title="Frequency" :min="0" :max="5" :step="0.1" v-model="frequency" />
        <PreviewSlider title="Warp Strength" :min="0.9" :max="1" :step="0.005" v-model="warpStrength" />
        <PreviewSlider title="Mouse Influence" :min="0" :max="2" :step="0.05" v-model="mouseInfluence" />
        <PreviewSlider title="Parallax" :min="0" :max="2" :step="0.05" v-model="parallax" />
        <PreviewSlider title="Noise" :min="0" :max="1" :step="0.01" v-model="noise" />
        <PreviewSlider title="Iterations" :min="1" :max="5" :step="1" v-model="iterations" />
        <PreviewSlider title="Intensity" :min="0.1" :max="2" :step="0.1" v-model="intensity" />
        <PreviewSlider title="Band Width" :min="1" :max="20" :step="0.5" v-model="bandWidth" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="color-bends" :usage="colorBends.usage!" :source="colorBendsSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { colorBends } from '@/constants/code/Backgrounds/colorBendsCode';
import ColorBends from '@/content/Backgrounds/ColorBends/ColorBends.vue';
import colorBendsSource from '@/content/Backgrounds/ColorBends/ColorBends.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  rotation: 90,
  autoRotate: 0,
  speed: 0.2,
  scale: 1,
  frequency: 1,
  warpStrength: 1,
  mouseInfluence: 1,
  parallax: 0.5,
  noise: 0.15,
  iterations: 1,
  intensity: 1.5,
  bandWidth: 6,
  color: '#27ff64'
};

const rotation = ref(DEFAULTS.rotation);
const autoRotate = ref(DEFAULTS.autoRotate);
const speed = ref(DEFAULTS.speed);
const scale = ref(DEFAULTS.scale);
const frequency = ref(DEFAULTS.frequency);
const warpStrength = ref(DEFAULTS.warpStrength);
const mouseInfluence = ref(DEFAULTS.mouseInfluence);
const parallax = ref(DEFAULTS.parallax);
const noise = ref(DEFAULTS.noise);
const iterations = ref(DEFAULTS.iterations);
const intensity = ref(DEFAULTS.intensity);
const bandWidth = ref(DEFAULTS.bandWidth);
const color = ref(DEFAULTS.color);

const hasChanges = computed(
  () =>
    rotation.value !== DEFAULTS.rotation ||
    autoRotate.value !== DEFAULTS.autoRotate ||
    speed.value !== DEFAULTS.speed ||
    scale.value !== DEFAULTS.scale ||
    frequency.value !== DEFAULTS.frequency ||
    warpStrength.value !== DEFAULTS.warpStrength ||
    mouseInfluence.value !== DEFAULTS.mouseInfluence ||
    parallax.value !== DEFAULTS.parallax ||
    noise.value !== DEFAULTS.noise ||
    iterations.value !== DEFAULTS.iterations ||
    intensity.value !== DEFAULTS.intensity ||
    bandWidth.value !== DEFAULTS.bandWidth ||
    color.value !== DEFAULTS.color
);

function reset() {
  rotation.value = DEFAULTS.rotation;
  autoRotate.value = DEFAULTS.autoRotate;
  speed.value = DEFAULTS.speed;
  scale.value = DEFAULTS.scale;
  frequency.value = DEFAULTS.frequency;
  warpStrength.value = DEFAULTS.warpStrength;
  mouseInfluence.value = DEFAULTS.mouseInfluence;
  parallax.value = DEFAULTS.parallax;
  noise.value = DEFAULTS.noise;
  iterations.value = DEFAULTS.iterations;
  intensity.value = DEFAULTS.intensity;
  bandWidth.value = DEFAULTS.bandWidth;
  color.value = DEFAULTS.color;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'rotation', type: 'number', default: '90', description: 'Base rotation angle in degrees.' },
  { name: 'autoRotate', type: 'number', default: '0', description: 'Automatic rotation speed in degrees/sec.' },
  { name: 'speed', type: 'number', default: '0.2', description: 'Animation time scale of the shader.' },
  {
    name: 'colors',
    type: 'string[]',
    default: '[]',
    description: 'Palette of up to 8 hex colors used to blend the bends.'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Whether the background is transparent (uses alpha).'
  },
  { name: 'scale', type: 'number', default: '1', description: 'Zoom factor of the pattern.' },
  { name: 'frequency', type: 'number', default: '1', description: 'Wave frequency used in the pattern.' },
  {
    name: 'warpStrength',
    type: 'number',
    default: '1',
    description: 'Amount of warping/distortion applied to waves.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '1',
    description: 'How strongly the waves react to pointer movement.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '0.5',
    description: 'Parallax factor shifting content with pointer.'
  },
  { name: 'noise', type: 'number', default: '0.15', description: 'Adds subtle grain. 0 disables noise.' },
  {
    name: 'iterations',
    type: 'number',
    default: '1',
    description: 'Number of extra warp passes (1-5). Higher values create more complex patterns.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '1.5',
    description: 'Brightness multiplier for the final color output.'
  },
  { name: 'bandWidth', type: 'number', default: '6', description: 'Controls the width/falloff of each color band.' },
  { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes for the container.' },
  { name: 'style', type: 'CSSProperties', default: '{}', description: 'Inline styles for the container.' }
];
</script>
