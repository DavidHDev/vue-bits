<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container" style="background: #000">
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

      <Customize>
        <div class="flex items-center gap-4 mt-4 flex-wrap">
          <PreviewColor title="Color 1" v-model="color1" />
          <PreviewColor title="Color 2" v-model="color2" />
          <PreviewColor title="Color 3" v-model="color3" />
          <PreviewColor title="Background" v-model="backgroundColor" />
        </div>

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

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="lightfall" />
    </template>

    <template #cli>
      <CliInstallation :command="lightfall.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { lightfall } from '@/constants/code/Backgrounds/lightfallCode';
import Lightfall from '@/content/Backgrounds/Lightfall/Lightfall.vue';

const color1 = ref('#A8FFB6');
const color2 = ref('#27FF64');
const color3 = ref('#7CFF67');
const backgroundColor = ref('#0A4A2A');
const speed = ref(0.5);
const streakCount = ref(2);
const streakWidth = ref(1);
const streakLength = ref(1);
const glow = ref(1);
const density = ref(0.6);
const twinkle = ref(1);
const zoom = ref(3);
const backgroundGlow = ref(0.5);
const mouseInteraction = ref(true);
const mouseStrength = ref(0.5);
const mouseRadius = ref(1);

const colors = computed(() => [color1.value, color2.value, color3.value]);

const propData = [
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
  { name: 'streakLength', type: 'number', default: '1', description: 'Length of the glowing tail trailing each streak.' },
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
  { name: 'zoom', type: 'number', default: '3', description: 'Field of view into the tunnel. Higher values zoom further in.' },
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
