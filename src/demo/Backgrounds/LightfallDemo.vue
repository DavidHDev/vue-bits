<template>
  <h1 class="sub-category">Lightfall</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="lightfall.usage"
    :source="lightfallSource"
    component-name="Lightfall"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container" style="background: #000">
        <Lightfall
          :colors="colors"
          :background-color="backgroundColor"
          :speed="speed"
          :streak-count="streakCount"
          :streak-width="streakWidth"
          :streak-length="streakLength"
          :glow="glow"
          :density="density"
          :twinkle="twinkle"
          :zoom="zoom"
          :background-glow="backgroundGlow"
          :mouse-interaction="mouseInteraction"
          :mouse-strength="mouseStrength"
          :mouse-radius="mouseRadius"
        />
        <BackgroundContent pill-text="New Background" headline="Let the light rain down" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewColorPicker title="Color 3" v-model="color3" />
        <PreviewColorPicker title="Background" v-model="backgroundColor" />
        <PreviewSwitch title="Cursor Light" v-model="mouseInteraction" />
        <PreviewSlider title="Speed" :min="0" :max="4" :step="0.1" v-model="speed" />
        <PreviewSlider title="Streak Count" :min="1" :max="16" :step="1" v-model="streakCount" />
        <PreviewSlider title="Streak Width" :min="0.2" :max="4" :step="0.1" v-model="streakWidth" />
        <PreviewSlider title="Streak Length" :min="0.3" :max="3" :step="0.1" v-model="streakLength" />
        <PreviewSlider title="Density" :min="0.3" :max="3" :step="0.1" v-model="density" />
        <PreviewSlider title="Twinkle" :min="0" :max="1" :step="0.05" v-model="twinkle" />
        <PreviewSlider title="Glow" :min="0.2" :max="3" :step="0.1" v-model="glow" />
        <PreviewSlider title="Background Glow" :min="0" :max="3" :step="0.1" v-model="backgroundGlow" />
        <PreviewSlider title="Zoom" :min="1" :max="5" :step="0.1" v-model="zoom" />
        <PreviewSlider title="Cursor Strength" :min="0" :max="3" :step="0.1" v-model="mouseStrength" />
        <PreviewSlider title="Cursor Radius" :min="0.1" :max="2" :step="0.05" v-model="mouseRadius" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="lightfall" :usage="lightfall.usage!" :source="lightfallSource" />
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
import { lightfall } from '@/constants/code/Backgrounds/lightfallCode';
import Lightfall from '@/content/Backgrounds/Lightfall/Lightfall.vue';
import lightfallSource from '@/content/Backgrounds/Lightfall/Lightfall.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color1: '#A8FFB6',
  color2: '#27FF64',
  color3: '#7CFF67',
  backgroundColor: '#0A4A2A',
  speed: 0.5,
  streakCount: 2,
  streakWidth: 1,
  streakLength: 1,
  glow: 1,
  density: 0.6,
  twinkle: 1,
  zoom: 3,
  backgroundGlow: 0.5,
  mouseInteraction: true,
  mouseStrength: 0.5,
  mouseRadius: 1
};

const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const color3 = ref(DEFAULTS.color3);
const backgroundColor = ref(DEFAULTS.backgroundColor);
const speed = ref(DEFAULTS.speed);
const streakCount = ref(DEFAULTS.streakCount);
const streakWidth = ref(DEFAULTS.streakWidth);
const streakLength = ref(DEFAULTS.streakLength);
const glow = ref(DEFAULTS.glow);
const density = ref(DEFAULTS.density);
const twinkle = ref(DEFAULTS.twinkle);
const zoom = ref(DEFAULTS.zoom);
const backgroundGlow = ref(DEFAULTS.backgroundGlow);
const mouseInteraction = ref(DEFAULTS.mouseInteraction);
const mouseStrength = ref(DEFAULTS.mouseStrength);
const mouseRadius = ref(DEFAULTS.mouseRadius);

const colors = computed(() => [color1.value, color2.value, color3.value]);

const hasChanges = computed(
  () =>
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    color3.value !== DEFAULTS.color3 ||
    backgroundColor.value !== DEFAULTS.backgroundColor ||
    speed.value !== DEFAULTS.speed ||
    streakCount.value !== DEFAULTS.streakCount ||
    streakWidth.value !== DEFAULTS.streakWidth ||
    streakLength.value !== DEFAULTS.streakLength ||
    glow.value !== DEFAULTS.glow ||
    density.value !== DEFAULTS.density ||
    twinkle.value !== DEFAULTS.twinkle ||
    zoom.value !== DEFAULTS.zoom ||
    backgroundGlow.value !== DEFAULTS.backgroundGlow ||
    mouseInteraction.value !== DEFAULTS.mouseInteraction ||
    mouseStrength.value !== DEFAULTS.mouseStrength ||
    mouseRadius.value !== DEFAULTS.mouseRadius
);

function reset() {
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  color3.value = DEFAULTS.color3;
  backgroundColor.value = DEFAULTS.backgroundColor;
  speed.value = DEFAULTS.speed;
  streakCount.value = DEFAULTS.streakCount;
  streakWidth.value = DEFAULTS.streakWidth;
  streakLength.value = DEFAULTS.streakLength;
  glow.value = DEFAULTS.glow;
  density.value = DEFAULTS.density;
  twinkle.value = DEFAULTS.twinkle;
  zoom.value = DEFAULTS.zoom;
  backgroundGlow.value = DEFAULTS.backgroundGlow;
  mouseInteraction.value = DEFAULTS.mouseInteraction;
  mouseStrength.value = DEFAULTS.mouseStrength;
  mouseRadius.value = DEFAULTS.mouseRadius;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#A8FFB6', '#27FF64', '#7CFF67']",
    description:
      'Array of hex colors (up to 8) used to tint the falling light streaks. Each streak is randomly but evenly assigned one of the colors; a single color makes the whole effect uniform.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#0A4A2A'",
    description: 'Hex color of the soft ambient glow behind the streaks.'
  },
  { name: 'speed', type: 'number', default: '0.5', description: 'Multiplier for how fast the light streaks fall.' },
  {
    name: 'streakCount',
    type: 'number',
    default: '2',
    description: 'Number of streak layers rendered per cell (1–16). Higher = busier.'
  },
  { name: 'streakWidth', type: 'number', default: '1', description: 'Thickness of each light streak.' },
  {
    name: 'streakLength',
    type: 'number',
    default: '1',
    description: 'Length of the glowing tail trailing each streak.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '1',
    description: 'Overall brightness multiplier applied before tone mapping.'
  },
  {
    name: 'density',
    type: 'number',
    default: '0.6',
    description: 'Vertical frequency of streaks. Higher values pack more streaks into view.'
  },
  {
    name: 'twinkle',
    type: 'number',
    default: '1',
    description: 'Amount of per-streak brightness flicker. 0 = constant brightness.'
  },
  {
    name: 'zoom',
    type: 'number',
    default: '3',
    description: 'Field of view into the tunnel. Higher values zoom further in.'
  },
  { name: 'backgroundGlow', type: 'number', default: '0.5', description: 'Intensity of the ambient background glow.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall alpha of the rendered canvas.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enables a soft light that follows the cursor and flares nearby streaks (no warping).'
  },
  { name: 'mouseStrength', type: 'number', default: '0.5', description: 'Intensity of the cursor light.' },
  { name: 'mouseRadius', type: 'number', default: '1', description: 'Falloff radius of the cursor light.' },
  {
    name: 'mouseDampening',
    type: 'number',
    default: '0.15',
    description: 'Easing time constant (seconds) for the cursor light to follow the pointer. 0 = immediate.'
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
