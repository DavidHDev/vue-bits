<template>
  <h1 class="sub-category">Dither Veil</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="ditherVeil.usage"
    :source="ditherVeilSource"
    component-name="DitherVeil"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-150 overflow-hidden demo-container">
        <DitherVeil
          :key="run"
          :fit="fit"
          :ink-color="inkColor"
          :paper-color="paperColor"
          :rim-color="rimColor"
          :pattern="pattern"
          :palette="palette"
          :pixel-size="pixelSize"
          :levels="levels"
          :contrast="contrast"
          :brightness="brightness"
          :reveal-radius="revealRadius"
          :softness="softness"
          :linger="linger"
          :rim="rim"
          :reverse="reverse"
          :wander="wander"
          :click-burst="clickBurst"
        />
        <RefreshButton @click="run++" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Ink" v-model="inkColor" />
        <PreviewColorPicker title="Paper" v-model="paperColor" />
        <PreviewColorPicker title="Rim Color" v-model="rimColor" />
        <PreviewSelect title="Fit" :options="FIT_OPTIONS" v-model="fit" />
        <PreviewSelect title="Pattern" :options="PATTERN_OPTIONS" v-model="pattern" />
        <PreviewSelect title="Palette" :options="PALETTE_OPTIONS" v-model="palette" />
        <PreviewSlider title="Pixel Size" :min="1" :max="10" :step="1" valueUnit="px" v-model="pixelSize" />
        <PreviewSlider title="Levels" :min="2" :max="6" :step="1" v-model="levels" />
        <PreviewSlider title="Contrast" :min="0.5" :max="2" :step="0.05" v-model="contrast" />
        <PreviewSlider title="Brightness" :min="-0.4" :max="0.4" :step="0.02" v-model="brightness" />
        <PreviewSlider title="Reveal Radius" :min="40" :max="300" :step="5" valueUnit="px" v-model="revealRadius" />
        <PreviewSlider title="Softness" :min="0" :max="1" :step="0.05" v-model="softness" />
        <PreviewSlider title="Linger" :min="0" :max="4" :step="0.1" valueUnit="s" v-model="linger" />
        <PreviewSlider title="Rim" :min="0" :max="0.6" :step="0.02" v-model="rim" />
        <PreviewSwitch title="Reverse" v-model="reverse" />
        <PreviewSwitch title="Wander" v-model="wander" />
        <PreviewSwitch title="Click Burst" v-model="clickBurst" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="dither-veil" :usage="ditherVeil.usage!" :source="ditherVeilSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { ditherVeil } from '@/constants/code/Animations/ditherVeilCode';
import DitherVeil from '@/content/Animations/DitherVeil/DitherVeil.vue';
import ditherVeilSource from '@/content/Animations/DitherVeil/DitherVeil.vue?raw';
import { computed, ref } from 'vue';

const DEFAULTS = {
  fit: 'contain' as 'contain' | 'cover',
  inkColor: '#10170f',
  paperColor: '#f4f1ea',
  rimColor: '#8bfaaa',
  pattern: 'floyd' as 'bayer' | 'noise' | 'atkinson' | 'floyd' | 'lines',
  palette: 'duotone' as 'duotone' | 'rgb',
  pixelSize: 2,
  levels: 2,
  contrast: 1.15,
  brightness: 0,
  revealRadius: 200,
  softness: 0.6,
  linger: 1,
  rim: 0,
  reverse: false,
  wander: false,
  clickBurst: true
};

const PATTERN_OPTIONS = [
  { label: 'Bayer', value: 'bayer' },
  { label: 'Blue Noise', value: 'noise' },
  { label: 'Atkinson', value: 'atkinson' },
  { label: 'Floyd-Steinberg', value: 'floyd' },
  { label: 'Lines', value: 'lines' }
];
const FIT_OPTIONS = [
  { label: 'Contain', value: 'contain' },
  { label: 'Cover', value: 'cover' }
];
const PALETTE_OPTIONS = [
  { label: 'Duotone', value: 'duotone' },
  { label: 'RGB', value: 'rgb' }
];

const fit = ref(DEFAULTS.fit);
const inkColor = ref(DEFAULTS.inkColor);
const paperColor = ref(DEFAULTS.paperColor);
const rimColor = ref(DEFAULTS.rimColor);
const pattern = ref(DEFAULTS.pattern);
const palette = ref(DEFAULTS.palette);
const pixelSize = ref(DEFAULTS.pixelSize);
const levels = ref(DEFAULTS.levels);
const contrast = ref(DEFAULTS.contrast);
const brightness = ref(DEFAULTS.brightness);
const revealRadius = ref(DEFAULTS.revealRadius);
const softness = ref(DEFAULTS.softness);
const linger = ref(DEFAULTS.linger);
const rim = ref(DEFAULTS.rim);
const reverse = ref(DEFAULTS.reverse);
const wander = ref(DEFAULTS.wander);
const clickBurst = ref(DEFAULTS.clickBurst);
const run = ref(0);

const state = {
  fit,
  inkColor,
  paperColor,
  rimColor,
  pattern,
  palette,
  pixelSize,
  levels,
  contrast,
  brightness,
  revealRadius,
  softness,
  linger,
  rim,
  reverse,
  wander,
  clickBurst
};
const keys = Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[];
const hasChanges = computed(() => keys.some(k => state[k].value !== DEFAULTS[k]));
function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
  run.value++;
}

const props: PropRow[] = [
  {
    name: 'src',
    type: 'string',
    default: '"https://images.unsplash.com/..."',
    description: 'Image to veil. Must be served with CORS headers.'
  },
  {
    name: 'fit',
    type: '"contain" | "cover"',
    default: '"contain"',
    description: 'Show the whole image on the ink, or crop it to fill the container.'
  },
  {
    name: 'pattern',
    type: '"bayer" | "noise" | "atkinson" | "floyd" | "lines"',
    default: '"floyd"',
    description:
      'How the image is broken into dots: an ordered Bayer grid, blue noise stipple, Atkinson or Floyd-Steinberg error diffusion, or diagonal engraving lines.'
  },
  {
    name: 'palette',
    type: '"duotone" | "rgb"',
    default: '"duotone"',
    description:
      'Duotone maps brightness between the ink and paper colours. RGB dithers each channel for a retro colour look.'
  },
  { name: 'pixelSize', type: 'number', default: '2', description: 'Size of each dither cell, in px.' },
  {
    name: 'levels',
    type: 'number',
    default: '2',
    description: 'Tones per channel. 2 is pure 1-bit, higher values add in-between shades.'
  },
  { name: 'inkColor', type: 'string', default: '"#10170f"', description: 'Colour of the darkest tone.' },
  { name: 'paperColor', type: 'string', default: '"#f4f1ea"', description: 'Colour of the lightest tone.' },
  { name: 'contrast', type: 'number', default: '1.15', description: 'Tonal contrast applied before dithering.' },
  {
    name: 'brightness',
    type: 'number',
    default: '0',
    description: 'Shifts the image lighter or darker before dithering.'
  },
  {
    name: 'revealRadius',
    type: 'number',
    default: '200',
    description: 'Radius of the full-colour window around the cursor, in px.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.6',
    description: 'How much of the reveal edge dissolves through the dither. 0 is a hard cut.'
  },
  {
    name: 'linger',
    type: 'number',
    default: '1',
    description: 'Seconds the revealed trail takes to knit back into dither. 0 turns the trail off.'
  },
  {
    name: 'rimColor',
    type: 'string',
    default: '"#8bfaaa"',
    description: 'Colour of the cells along the dissolving edge.'
  },
  {
    name: 'rim',
    type: 'number',
    default: '0',
    description: 'Thickness of the coloured rim on the dissolving edge. 0 hides it.'
  },
  {
    name: 'reverse',
    type: 'boolean',
    default: 'false',
    description: 'Start in full colour and dither wherever the cursor goes.'
  },
  {
    name: 'wander',
    type: 'boolean',
    default: 'false',
    description: 'Let the reveal drift around on its own while the pointer is away.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ring of colour rippling out across the image.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes on the container.' }
];
</script>
