<template>
  <h1 class="sub-category">Micro Slats</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="microSlats.usage"
    :source="microSlatsSource"
    component-name="MicroSlats"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-125 overflow-hidden demo-container">
        <MicroSlats
          :key="run"
          :preset="preset"
          :color="color"
          :glint-color="glintColor"
          :background-color="backgroundColor"
          :slat-width="slatWidth"
          :slat-height="slatHeight"
          :gap="gap"
          :roundness="roundness"
          :scale="scale"
          :speed="speed"
          :direction="direction"
          :chop="chop"
          :stretch="stretch"
          :glint="glint"
          :contrast="contrast"
          :perspective="perspective"
          :fog="fog"
          :interactive="interactive"
          :cursor-strength="cursorStrength"
          :cursor-size="cursorSize"
          :swirl="swirl"
          :trail="trail"
          :lean="lean"
          :intro="intro"
          :intro-duration="introDuration"
          :paused="paused"
        />
        <BackgroundContent pill-text="New Background" headline="A quiet pattern, drawn one slat at a time." />
        <RefreshButton @click="run++" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Preset"
          :options="PRESET_OPTIONS"
          :model-value="preset"
          @update:model-value="choosePreset($event as SwellPreset)"
        />
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewColorPicker title="Glint Color" v-model="glintColor" />
        <PreviewColorPicker title="Background" v-model="backgroundColor" />

        <PreviewSlider title="Slat Width" :min="2" :max="16" :step="1" valueUnit="px" v-model="slatWidth" />
        <PreviewSlider title="Slat Height" :min="6" :max="64" :step="1" valueUnit="px" v-model="slatHeight" />
        <PreviewSlider title="Gap" :min="1" :max="12" :step="1" valueUnit="px" v-model="gap" />
        <PreviewSlider title="Roundness" :min="0" :max="1" :step="0.05" v-model="roundness" />

        <PreviewSlider title="Speed" :min="0" :max="3" :step="0.05" v-model="speed" />
        <PreviewSlider title="Scale" :min="0.3" :max="2.5" :step="0.05" v-model="scale" />
        <PreviewSlider title="Direction" :min="0" :max="360" :step="1" valueUnit="°" v-model="direction" />
        <PreviewSlider title="Chop" :min="0" :max="1.5" :step="0.05" v-model="chop" />
        <PreviewSlider title="Stretch" :min="0" :max="0.95" :step="0.05" v-model="stretch" />
        <PreviewSlider title="Glint" :min="0" :max="2" :step="0.05" v-model="glint" />
        <PreviewSlider title="Contrast" :min="0.5" :max="3" :step="0.05" v-model="contrast" />
        <PreviewSlider title="Perspective" :min="0" :max="1" :step="0.05" v-model="perspective" />
        <PreviewSlider title="Fog" :min="0" :max="1" :step="0.05" v-model="fog" />

        <PreviewSwitch title="Interactive" v-model="interactive" />
        <PreviewSlider
          title="Cursor Strength"
          :min="0"
          :max="2"
          :step="0.05"
          :isDisabled="!interactive"
          v-model="cursorStrength"
        />
        <PreviewSlider
          title="Cursor Size"
          :min="20"
          :max="240"
          :step="5"
          valueUnit="px"
          :isDisabled="!interactive"
          v-model="cursorSize"
        />
        <PreviewSlider title="Swirl" :min="0" :max="1.5" :step="0.05" :isDisabled="!interactive" v-model="swirl" />
        <PreviewSlider
          title="Trail"
          :min="0.3"
          :max="4"
          :step="0.1"
          valueUnit="s"
          :isDisabled="!interactive"
          v-model="trail"
        />
        <PreviewSlider title="Lean" :min="0" :max="1" :step="0.05" :isDisabled="!interactive" v-model="lean" />

        <PreviewSwitch title="Intro" v-model="intro" />
        <PreviewSlider
          title="Intro Duration"
          :min="0.6"
          :max="5"
          :step="0.1"
          valueUnit="s"
          :isDisabled="!intro"
          v-model="introDuration"
        />
        <PreviewSwitch title="Paused" v-model="paused" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="micro-slats" :usage="microSlats.usage!" :source="microSlatsSource" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { microSlats } from '@/constants/code/Backgrounds/microSlatsCode';
import MicroSlats from '@/content/Backgrounds/MicroSlats/MicroSlats.vue';
import microSlatsSource from '@/content/Backgrounds/MicroSlats/MicroSlats.vue?raw';
import { computed, ref } from 'vue';

type SwellPreset = 'swell' | 'tide' | 'storm' | 'signal';

interface WaveValues {
  scale: number;
  speed: number;
  direction: number;
  chop: number;
  stretch: number;
  glint: number;
  contrast: number;
  perspective: number;
  fog: number;
}

const PRESETS: Record<SwellPreset, WaveValues> = {
  swell: {
    scale: 1.5,
    speed: 0.6,
    direction: 250,
    chop: 0.55,
    stretch: 0,
    glint: 0.7,
    contrast: 1.25,
    perspective: 0.55,
    fog: 0.55
  },
  tide: {
    scale: 1.3,
    speed: 0.5,
    direction: 262,
    chop: 0.2,
    stretch: 0.12,
    glint: 0.45,
    contrast: 1.1,
    perspective: 0.5,
    fog: 0.4
  },
  storm: {
    scale: 0.55,
    speed: 1.6,
    direction: 236,
    chop: 1,
    stretch: 0.3,
    glint: 1.3,
    contrast: 1.8,
    perspective: 0.8,
    fog: 0.35
  },
  signal: {
    scale: 0.85,
    speed: 1.2,
    direction: 180,
    chop: 0.6,
    stretch: 0.85,
    glint: 0.25,
    contrast: 1.2,
    perspective: 0,
    fog: 0
  }
};

const PRESET_OPTIONS = [
  { label: 'Swell', value: 'swell' },
  { label: 'Tide', value: 'tide' },
  { label: 'Storm', value: 'storm' },
  { label: 'Signal', value: 'signal' }
];

const DEFAULTS = {
  preset: 'swell' as SwellPreset,
  color: '#10B981',
  glintColor: '#ffffff',
  backgroundColor: '#120f17',
  slatWidth: 10,
  slatHeight: 25,
  gap: 3,
  roundness: 0.75,
  ...PRESETS.swell,
  interactive: true,
  cursorStrength: 1,
  cursorSize: 40,
  swirl: 0,
  trail: 1.4,
  lean: 0,
  intro: true,
  introDuration: 1.5,
  paused: false
};

const preset = ref(DEFAULTS.preset);
const color = ref(DEFAULTS.color);
const glintColor = ref(DEFAULTS.glintColor);
const backgroundColor = ref(DEFAULTS.backgroundColor);
const slatWidth = ref(DEFAULTS.slatWidth);
const slatHeight = ref(DEFAULTS.slatHeight);
const gap = ref(DEFAULTS.gap);
const roundness = ref(DEFAULTS.roundness);
const scale = ref(DEFAULTS.scale);
const speed = ref(DEFAULTS.speed);
const direction = ref(DEFAULTS.direction);
const chop = ref(DEFAULTS.chop);
const stretch = ref(DEFAULTS.stretch);
const glint = ref(DEFAULTS.glint);
const contrast = ref(DEFAULTS.contrast);
const perspective = ref(DEFAULTS.perspective);
const fog = ref(DEFAULTS.fog);
const interactive = ref(DEFAULTS.interactive);
const cursorStrength = ref(DEFAULTS.cursorStrength);
const cursorSize = ref(DEFAULTS.cursorSize);
const swirl = ref(DEFAULTS.swirl);
const trail = ref(DEFAULTS.trail);
const lean = ref(DEFAULTS.lean);
const intro = ref(DEFAULTS.intro);
const introDuration = ref(DEFAULTS.introDuration);
const paused = ref(DEFAULTS.paused);
const run = ref(0);

const state = {
  preset,
  color,
  glintColor,
  backgroundColor,
  slatWidth,
  slatHeight,
  gap,
  roundness,
  scale,
  speed,
  direction,
  chop,
  stretch,
  glint,
  contrast,
  perspective,
  fog,
  interactive,
  cursorStrength,
  cursorSize,
  swirl,
  trail,
  lean,
  intro,
  introDuration,
  paused
};
type Key = keyof typeof state;
const keys = Object.keys(DEFAULTS) as Key[];

const choosePreset = (value: SwellPreset) => {
  preset.value = value;
  const values = PRESETS[value] || PRESETS.swell;
  (Object.keys(values) as (keyof WaveValues)[]).forEach(k => (state[k].value = values[k]));
};

const hasChanges = computed(() => keys.some(k => state[k].value !== DEFAULTS[k]));
function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
  run.value++;
}

const props: PropRow[] = [
  {
    name: 'preset',
    type: '"swell" | "tide" | "storm" | "signal"',
    default: '"swell"',
    description:
      'A starting look for the sea. Every wave prop below overrides the preset value when you pass it. Signal turns the field into a flat, equalizer style wall.'
  },
  { name: 'color', type: 'string', default: '"#10B981"', description: 'Color of the slats.' },
  {
    name: 'glintColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'Color the slats shift towards on wave crests and in the light the cursor leaves.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '"#000000"',
    description: 'Color behind the slats. Pass transparent to show the page through.'
  },
  { name: 'slatWidth', type: 'number', default: '10', description: 'Width of one slat in CSS pixels.' },
  { name: 'slatHeight', type: 'number', default: '25', description: 'Full height of one slat in CSS pixels.' },
  { name: 'gap', type: 'number', default: '3', description: 'Space between slats in CSS pixels.' },
  {
    name: 'roundness',
    type: 'number',
    default: '0.75',
    description: 'Corner rounding of each slat, from square at 0 to a full pill at 1.'
  },
  {
    name: 'scale',
    type: 'number',
    default: 'from preset',
    description: 'Size of the swell. Larger values give longer, calmer waves.'
  },
  {
    name: 'speed',
    type: 'number',
    default: 'from preset',
    description: 'How fast the waves roll. 0 freezes the sea while the cursor can still stir it.'
  },
  {
    name: 'direction',
    type: 'number',
    default: 'from preset',
    description: 'Heading of the swell in degrees. 270 rolls straight towards the viewer.'
  },
  {
    name: 'chop',
    type: 'number',
    default: 'from preset',
    description: 'Sharpens the crests and flattens the troughs, like wind on the water.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: 'from preset',
    description: 'How much each slat grows and shrinks with the wave under it. 0 keeps every slat full length.'
  },
  { name: 'glint', type: 'number', default: 'from preset', description: 'Strength of the light caught on the crests.' },
  {
    name: 'contrast',
    type: 'number',
    default: 'from preset',
    description: 'Spread between dark troughs and bright crests.'
  },
  {
    name: 'perspective',
    type: 'number',
    default: 'from preset',
    description: 'How far the sea recedes towards a horizon above the top edge. 0 is a flat wall.'
  },
  {
    name: 'fog',
    type: 'number',
    default: 'from preset',
    description: 'Haze that fades the far rows into the background.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description:
      'Lets the cursor stir the water. Moving it pushes a real fluid that bends the swell and carries a swirling trail of light, and a click spins out a splash.'
  },
  {
    name: 'cursorStrength',
    type: 'number',
    default: '1',
    description: 'Brightness of the light the cursor leaves in the water.'
  },
  {
    name: 'cursorSize',
    type: 'number',
    default: '40',
    description: 'Radius of the patch of water the cursor pushes, in CSS pixels.'
  },
  { name: 'swirl', type: 'number', default: '0', description: 'How strongly the stirred water curls into eddies.' },
  {
    name: 'trail',
    type: 'number',
    default: '1.4',
    description: 'How long the stirred water and its light linger, in seconds.'
  },
  {
    name: 'lean',
    type: 'number',
    default: '0',
    description: 'How far the slats tilt with the current. 0 keeps them upright.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Rolls the sea in from the horizon on mount, unfolding the slats row by row.'
  },
  { name: 'introDuration', type: 'number', default: '1.5', description: 'Length of the intro in seconds.' },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the waves. The cursor can still stir the water.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra class names for the root element.' }
];
</script>
