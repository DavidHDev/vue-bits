<template>
  <h1 class="sub-category">Strands</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="strands.usage"
    :source="strandsSource"
    component-name="Strands"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <Strands
          :colors="colors"
          :count="count"
          :speed="speed"
          :amplitude="amplitude"
          :waviness="waviness"
          :thickness="thickness"
          :glow="glow"
          :taper="taper"
          :spread="spread"
          :hue-shift="hueShift"
          :intensity="intensity"
          :saturation="saturation"
          :opacity="opacity"
          :scale="scale"
          :glass="glass"
          :refraction="refraction"
          :dispersion="dispersion"
          :glass-size="glassSize"
          class="w-full h-full"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker
          v-for="(_, index) in colors"
          :key="index"
          :title="`Color ${index + 1}`"
          v-model="colors[index]"
        />
        <PreviewSlider title="Count" v-model="count" :min="1" :max="10" :step="1" />
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="3" :step="0.1" />
        <PreviewSlider title="Amplitude" v-model="amplitude" :min="0" :max="3" :step="0.1" />
        <PreviewSlider title="Waviness" v-model="waviness" :min="0.2" :max="3" :step="0.1" />
        <PreviewSlider title="Thickness" v-model="thickness" :min="0.2" :max="4" :step="0.1" />
        <PreviewSlider title="Glow" v-model="glow" :min="0.3" :max="3" :step="0.05" />
        <PreviewSlider title="Taper" v-model="taper" :min="0.5" :max="6" :step="0.1" />
        <PreviewSlider title="Spread" v-model="spread" :min="0" :max="3" :step="0.1" />
        <PreviewSlider title="Hue Shift" v-model="hueShift" :min="0" :max="1" :step="0.01" />
        <PreviewSlider title="Intensity" v-model="intensity" :min="0" :max="1" :step="0.05" />
        <PreviewSlider title="Saturation" v-model="saturation" :min="0" :max="2" :step="0.05" />
        <PreviewSlider title="Opacity" v-model="opacity" :min="0" :max="1" :step="0.05" />
        <PreviewSlider title="Scale" v-model="scale" :min="0.3" :max="3" :step="0.1" />
        <PreviewSwitch title="Glass Ball" v-model="glass" />
        <PreviewSlider title="Refraction" v-model="refraction" :min="0" :max="3" :step="0.05" :disabled="!glass" />
        <PreviewSlider title="Dispersion" v-model="dispersion" :min="0" :max="4" :step="0.05" :disabled="!glass" />
        <PreviewSlider title="Glass Size" v-model="glassSize" :min="0.3" :max="1" :step="0.01" :disabled="!glass" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="strands" :usage="strands.usage!" :source="strandsSource" />
    </template>
  </TabsLayout>
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
import { strands } from '@/constants/code/Animations/strandsCode';
import Strands from '@/content/Animations/Strands/Strands.vue';
import strandsSource from '@/content/Animations/Strands/Strands.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color1: '#F97316',
  color2: '#10B981',
  color3: '#06B6D4',
  count: 3,
  speed: 0.5,
  amplitude: 1,
  waviness: 1,
  thickness: 0.7,
  glow: 2.6,
  taper: 3,
  spread: 1,
  hueShift: 0,
  intensity: 0.6,
  saturation: 2,
  opacity: 1,
  scale: 1.5,
  glass: false,
  refraction: 1,
  dispersion: 1,
  glassSize: 1
};

const colors = ref([DEFAULTS.color1, DEFAULTS.color2, DEFAULTS.color3]);
const count = ref(DEFAULTS.count);
const speed = ref(DEFAULTS.speed);
const amplitude = ref(DEFAULTS.amplitude);
const waviness = ref(DEFAULTS.waviness);
const thickness = ref(DEFAULTS.thickness);
const glow = ref(DEFAULTS.glow);
const taper = ref(DEFAULTS.taper);
const spread = ref(DEFAULTS.spread);
const hueShift = ref(DEFAULTS.hueShift);
const intensity = ref(DEFAULTS.intensity);
const saturation = ref(DEFAULTS.saturation);
const opacity = ref(DEFAULTS.opacity);
const scale = ref(DEFAULTS.scale);
const glass = ref(DEFAULTS.glass);
const refraction = ref(DEFAULTS.refraction);
const dispersion = ref(DEFAULTS.dispersion);
const glassSize = ref(DEFAULTS.glassSize);

const hasChanges = computed(
  () =>
    colors.value[0] !== DEFAULTS.color1 ||
    colors.value[1] !== DEFAULTS.color2 ||
    colors.value[2] !== DEFAULTS.color3 ||
    count.value !== DEFAULTS.count ||
    speed.value !== DEFAULTS.speed ||
    amplitude.value !== DEFAULTS.amplitude ||
    waviness.value !== DEFAULTS.waviness ||
    thickness.value !== DEFAULTS.thickness ||
    glow.value !== DEFAULTS.glow ||
    taper.value !== DEFAULTS.taper ||
    spread.value !== DEFAULTS.spread ||
    hueShift.value !== DEFAULTS.hueShift ||
    intensity.value !== DEFAULTS.intensity ||
    saturation.value !== DEFAULTS.saturation ||
    opacity.value !== DEFAULTS.opacity ||
    scale.value !== DEFAULTS.scale ||
    glass.value !== DEFAULTS.glass ||
    refraction.value !== DEFAULTS.refraction ||
    dispersion.value !== DEFAULTS.dispersion ||
    glassSize.value !== DEFAULTS.glassSize
);

function reset() {
  colors.value = [DEFAULTS.color1, DEFAULTS.color2, DEFAULTS.color3];
  count.value = DEFAULTS.count;
  speed.value = DEFAULTS.speed;
  amplitude.value = DEFAULTS.amplitude;
  waviness.value = DEFAULTS.waviness;
  thickness.value = DEFAULTS.thickness;
  glow.value = DEFAULTS.glow;
  taper.value = DEFAULTS.taper;
  spread.value = DEFAULTS.spread;
  hueShift.value = DEFAULTS.hueShift;
  intensity.value = DEFAULTS.intensity;
  saturation.value = DEFAULTS.saturation;
  opacity.value = DEFAULTS.opacity;
  scale.value = DEFAULTS.scale;
  glass.value = DEFAULTS.glass;
  refraction.value = DEFAULTS.refraction;
  dispersion.value = DEFAULTS.dispersion;
  glassSize.value = DEFAULTS.glassSize;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: '["#FF4242", "#7C3AED", "#06B6D4", "#EAB308"]',
    description:
      'Palette of hex colors cycled across the strands. Pass an empty array to use the built-in rainbow spectrum.'
  },
  {
    name: 'count',
    type: 'number',
    default: '3',
    description: 'Number of strands woven through the animation.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'How quickly the strands ripple and flow.'
  },
  {
    name: 'amplitude',
    type: 'number',
    default: '1',
    description: 'Vertical reach of each strand as it waves up and down.'
  },
  {
    name: 'waviness',
    type: 'number',
    default: '1',
    description: 'Density of the curves along each strand.'
  },
  {
    name: 'thickness',
    type: 'number',
    default: '0.7',
    description: 'Width of each glowing strand.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '2.6',
    description: 'Strength of the luminous bloom around the strands.'
  },
  {
    name: 'taper',
    type: 'number',
    default: '3',
    description: 'How sharply the strands fade out toward the edges.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '1',
    description: 'Separation between strands so they fan out instead of overlapping.'
  },
  {
    name: 'hueShift',
    type: 'number',
    default: '0',
    description: 'Rotates the colors around the strands for variation.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '0.6',
    description: 'Overall brightness and energy of the effect.'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1.5',
    description: 'Vibrance of the colors. Above 1 makes them more intense, below 1 fades to grayscale.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: 'Overall transparency of the rendered strands.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1.5',
    description: 'Zooms the whole effect in or out to make the strands bigger or smaller.'
  },
  {
    name: 'glass',
    type: 'boolean',
    default: 'false',
    description: 'Renders the strands inside a refractive glass ball.'
  },
  {
    name: 'refraction',
    type: 'number',
    default: '1',
    description: 'How strongly the glass ball bends the light passing through it.'
  },
  {
    name: 'dispersion',
    type: 'number',
    default: '1',
    description: 'Amount of rainbow color separation along the edges of the glass ball.'
  },
  {
    name: 'glassSize',
    type: 'number',
    default: '1',
    description: 'Size of the glass ball relative to the canvas.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes to apply to the container.'
  }
];
</script>
