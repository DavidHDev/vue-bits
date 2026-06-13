<template>
  <h1 class="sub-category">Splash Cursor</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="splashCursor.usage"
    :source="splashCursorSource"
    component-name="SplashCursor"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] demo-container">
        <span class="font-black text-[#333] text-6xl text-center select-none">Move Your Cursor</span>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Density Dissipation" :min="0.5" :max="10" :step="0.5" v-model="DENSITY_DISSIPATION" />
        <PreviewSlider title="Velocity Dissipation" :min="0.5" :max="10" :step="0.5" v-model="VELOCITY_DISSIPATION" />
        <PreviewSlider title="Pressure" :min="0" :max="1" :step="0.05" v-model="PRESSURE" />
        <PreviewSlider title="Curl" :min="0" :max="50" :step="1" v-model="CURL" />
        <PreviewSlider title="Splat Radius" :min="0.01" :max="1" :step="0.01" v-model="SPLAT_RADIUS" />
        <PreviewSlider title="Splat Force" :min="1000" :max="20000" :step="500" v-model="SPLAT_FORCE" />
        <PreviewSlider title="Color Update Speed" :min="1" :max="30" :step="1" v-model="COLOR_UPDATE_SPEED" />
        <PreviewSwitch title="Shading" v-model="SHADING" />
        <PreviewSwitch title="Rainbow Mode" v-model="RAINBOW_MODE" />
        <PreviewColorPicker v-if="!RAINBOW_MODE" title="Color" v-model="COLOR" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="splash-cursor" :usage="splashCursor.usage!" :source="splashCursorSource" />
    </template>
  </TabsLayout>

  <SplashCursor
    :key="rerenderKey"
    :DENSITY_DISSIPATION="DENSITY_DISSIPATION"
    :VELOCITY_DISSIPATION="VELOCITY_DISSIPATION"
    :PRESSURE="PRESSURE"
    :CURL="CURL"
    :SPLAT_RADIUS="SPLAT_RADIUS"
    :SPLAT_FORCE="SPLAT_FORCE"
    :COLOR_UPDATE_SPEED="COLOR_UPDATE_SPEED"
    :SHADING="SHADING"
    :RAINBOW_MODE="RAINBOW_MODE"
    :COLOR="COLOR"
  />
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
import { splashCursor } from '@/constants/code/Animations/splashCursorCode';
import SplashCursor from '@/content/Animations/SplashCursor/SplashCursor.vue';
import splashCursorSource from '@/content/Animations/SplashCursor/SplashCursor.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  DENSITY_DISSIPATION: 3.5,
  VELOCITY_DISSIPATION: 2,
  PRESSURE: 0.1,
  CURL: 3,
  SPLAT_RADIUS: 0.2,
  SPLAT_FORCE: 6000,
  COLOR_UPDATE_SPEED: 10,
  SHADING: true,
  RAINBOW_MODE: false,
  COLOR: '#27FF64'
};

const DENSITY_DISSIPATION = ref(DEFAULTS.DENSITY_DISSIPATION);
const VELOCITY_DISSIPATION = ref(DEFAULTS.VELOCITY_DISSIPATION);
const PRESSURE = ref(DEFAULTS.PRESSURE);
const CURL = ref(DEFAULTS.CURL);
const SPLAT_RADIUS = ref(DEFAULTS.SPLAT_RADIUS);
const SPLAT_FORCE = ref(DEFAULTS.SPLAT_FORCE);
const COLOR_UPDATE_SPEED = ref(DEFAULTS.COLOR_UPDATE_SPEED);
const SHADING = ref(DEFAULTS.SHADING);
const RAINBOW_MODE = ref(DEFAULTS.RAINBOW_MODE);
const COLOR = ref(DEFAULTS.COLOR);

const hasChanges = computed(
  () =>
    DENSITY_DISSIPATION.value !== DEFAULTS.DENSITY_DISSIPATION ||
    VELOCITY_DISSIPATION.value !== DEFAULTS.VELOCITY_DISSIPATION ||
    PRESSURE.value !== DEFAULTS.PRESSURE ||
    CURL.value !== DEFAULTS.CURL ||
    SPLAT_RADIUS.value !== DEFAULTS.SPLAT_RADIUS ||
    SPLAT_FORCE.value !== DEFAULTS.SPLAT_FORCE ||
    COLOR_UPDATE_SPEED.value !== DEFAULTS.COLOR_UPDATE_SPEED ||
    SHADING.value !== DEFAULTS.SHADING ||
    RAINBOW_MODE.value !== DEFAULTS.RAINBOW_MODE ||
    COLOR.value !== DEFAULTS.COLOR
);

function reset() {
  DENSITY_DISSIPATION.value = DEFAULTS.DENSITY_DISSIPATION;
  VELOCITY_DISSIPATION.value = DEFAULTS.VELOCITY_DISSIPATION;
  PRESSURE.value = DEFAULTS.PRESSURE;
  CURL.value = DEFAULTS.CURL;
  SPLAT_RADIUS.value = DEFAULTS.SPLAT_RADIUS;
  SPLAT_FORCE.value = DEFAULTS.SPLAT_FORCE;
  COLOR_UPDATE_SPEED.value = DEFAULTS.COLOR_UPDATE_SPEED;
  SHADING.value = DEFAULTS.SHADING;
  RAINBOW_MODE.value = DEFAULTS.RAINBOW_MODE;
  COLOR.value = DEFAULTS.COLOR;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'SIM_RESOLUTION',
    type: 'number',
    default: '128',
    description: 'Fluid simulation resolution for velocity fields.'
  },
  {
    name: 'DYE_RESOLUTION',
    type: 'number',
    default: '1440',
    description: 'Resolution of the color/dye texture.'
  },
  {
    name: 'CAPTURE_RESOLUTION',
    type: 'number',
    default: '512',
    description: 'Resolution used for certain capture operations (rarely changed).'
  },
  {
    name: 'DENSITY_DISSIPATION',
    type: 'number',
    default: '3.5',
    description: 'Rate at which color/density dissipates over time.'
  },
  {
    name: 'VELOCITY_DISSIPATION',
    type: 'number',
    default: '2',
    description: 'Rate at which velocity dissipates over time.'
  },
  {
    name: 'PRESSURE',
    type: 'number',
    default: '0.1',
    description: 'Base pressure for the fluid simulation.'
  },
  {
    name: 'PRESSURE_ITERATIONS',
    type: 'number',
    default: '20',
    description: 'Number of Jacobi iterations used for the pressure solver.'
  },
  {
    name: 'CURL',
    type: 'number',
    default: '3',
    description: 'Amount of vorticity/curl to apply for swirling effects.'
  },
  {
    name: 'SPLAT_RADIUS',
    type: 'number',
    default: '0.2',
    description: "Radius of the 'splat' effect when user interacts."
  },
  {
    name: 'SPLAT_FORCE',
    type: 'number',
    default: '6000',
    description: "Force of the fluid 'splat' on each interaction."
  },
  {
    name: 'SHADING',
    type: 'boolean',
    default: 'true',
    description: 'Toggles simple lighting/shading on the fluid.'
  },
  {
    name: 'COLOR_UPDATE_SPEED',
    type: 'number',
    default: '10',
    description: 'Frequency at which pointer colors are re-randomized.'
  },
  {
    name: 'RAINBOW_MODE',
    type: 'boolean',
    default: 'true',
    description: 'When true, uses randomly cycling rainbow colors. When false, uses the COLOR prop.'
  },
  {
    name: 'COLOR',
    type: 'string',
    default: "'#ff0000'",
    description: 'Hex color for the cursor effect when RAINBOW_MODE is false.'
  },
  {
    name: 'BACK_COLOR',
    type: 'object',
    default: '{ r: 0.5, g: 0, b: 0 }',
    description: 'Base background color for the fluid. Not always used if TRANSPARENT is true.'
  }
];
</script>
