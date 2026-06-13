<template>
  <h1 class="sub-category">Pixel Snow</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="pixelSnow.usage"
    :source="pixelSnowSource"
    component-name="PixelSnow"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <PixelSnow
          :color="color"
          :flake-size="flakeSize"
          :min-flake-size="minFlakeSize"
          :pixel-resolution="pixelResolution"
          :speed="speed"
          :depth-fade="depthFade"
          :far-plane="farPlane"
          :brightness="brightness"
          :gamma="gamma"
          :density="density"
          :variant="variant"
          :direction="direction"
        />
        <BackgroundContent pill-text="New Background" headline="Oh, the weather outside is frightful!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Variant" v-model="variant" :options="['square', 'round', 'snowflake']" />
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewSlider title="Pixel Resolution" v-model="pixelResolution" :min="50" :max="500" :step="10" />
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="5" :step="0.1" />
        <PreviewSlider title="Density" v-model="density" :min="0.1" :max="1" :step="0.05" />
        <PreviewSlider title="Flake Size" v-model="flakeSize" :min="0.001" :max="0.05" :step="0.001" />
        <PreviewSlider title="Brightness" v-model="brightness" :min="0.1" :max="3" :step="0.1" />
        <PreviewSlider title="Depth Fade" v-model="depthFade" :min="1" :max="20" :step="0.5" />
        <PreviewSlider title="Far Plane" v-model="farPlane" :min="5" :max="50" :step="1" />
        <PreviewSlider title="Direction" v-model="direction" :min="0" :max="360" :step="5" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="pixel-snow" :usage="pixelSnow.usage!" :source="pixelSnowSource" />
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
import { pixelSnow } from '@/constants/code/Backgrounds/pixelSnowCode';
import PixelSnow from '@/content/Backgrounds/PixelSnow/PixelSnow.vue';
import pixelSnowSource from '@/content/Backgrounds/PixelSnow/PixelSnow.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color: '#ffffff',
  flakeSize: 0.01,
  minFlakeSize: 1.25,
  pixelResolution: 200,
  speed: 1.25,
  depthFade: 8,
  farPlane: 20,
  brightness: 1,
  gamma: 0.4545,
  density: 0.3,
  variant: 'square' as 'square' | 'round' | 'snowflake',
  direction: 125
};

const color = ref(DEFAULTS.color);
const flakeSize = ref(DEFAULTS.flakeSize);
const minFlakeSize = ref(DEFAULTS.minFlakeSize);
const pixelResolution = ref(DEFAULTS.pixelResolution);
const speed = ref(DEFAULTS.speed);
const depthFade = ref(DEFAULTS.depthFade);
const farPlane = ref(DEFAULTS.farPlane);
const brightness = ref(DEFAULTS.brightness);
const gamma = ref(DEFAULTS.gamma);
const density = ref(DEFAULTS.density);
const variant = ref<'square' | 'round' | 'snowflake'>(DEFAULTS.variant);
const direction = ref(DEFAULTS.direction);

const hasChanges = computed(
  () =>
    color.value !== DEFAULTS.color ||
    flakeSize.value !== DEFAULTS.flakeSize ||
    minFlakeSize.value !== DEFAULTS.minFlakeSize ||
    pixelResolution.value !== DEFAULTS.pixelResolution ||
    speed.value !== DEFAULTS.speed ||
    depthFade.value !== DEFAULTS.depthFade ||
    farPlane.value !== DEFAULTS.farPlane ||
    brightness.value !== DEFAULTS.brightness ||
    gamma.value !== DEFAULTS.gamma ||
    density.value !== DEFAULTS.density ||
    variant.value !== DEFAULTS.variant ||
    direction.value !== DEFAULTS.direction
);

function reset() {
  color.value = DEFAULTS.color;
  flakeSize.value = DEFAULTS.flakeSize;
  minFlakeSize.value = DEFAULTS.minFlakeSize;
  pixelResolution.value = DEFAULTS.pixelResolution;
  speed.value = DEFAULTS.speed;
  depthFade.value = DEFAULTS.depthFade;
  farPlane.value = DEFAULTS.farPlane;
  brightness.value = DEFAULTS.brightness;
  gamma.value = DEFAULTS.gamma;
  density.value = DEFAULTS.density;
  variant.value = DEFAULTS.variant;
  direction.value = DEFAULTS.direction;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: '"#ffffff"',
    description: 'Color of the snowflakes (hex or CSS color)'
  },
  {
    name: 'flakeSize',
    type: 'number',
    default: '0.01',
    description: 'Size of snowflakes in scene units'
  },
  {
    name: 'minFlakeSize',
    type: 'number',
    default: '1.25',
    description: 'Minimum flake size in pixels on screen'
  },
  {
    name: 'pixelResolution',
    type: 'number',
    default: '200',
    description: 'Pixel resolution - lower values create larger pixels for a more retro look'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1.25',
    description: 'Animation speed multiplier'
  },
  {
    name: 'depthFade',
    type: 'number',
    default: '8',
    description: 'Depth fade intensity - higher values make distant flakes fade faster'
  },
  {
    name: 'farPlane',
    type: 'number',
    default: '20',
    description: 'Far plane distance for rendering - higher values show more distant flakes'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '1',
    description: 'Overall brightness multiplier'
  },
  {
    name: 'gamma',
    type: 'number',
    default: '0.4545',
    description: 'Gamma correction value for final color output'
  },
  {
    name: 'density',
    type: 'number',
    default: '0.3',
    description: 'Probability of snowflakes appearing (0-1) - lower values = fewer flakes'
  },
  {
    name: 'variant',
    type: '"square" | "round" | "snowflake"',
    default: '"square"',
    description: 'Shape of the snowflakes - square, round, or snowflake pattern'
  },
  {
    name: 'direction',
    type: 'number',
    default: '125',
    description: 'Wind direction angle in degrees (0-360)'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS class name'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Additional inline styles'
  }
];
</script>
