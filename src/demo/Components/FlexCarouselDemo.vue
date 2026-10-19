<template>
  <h1 class="sub-category">Flex Carousel</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="flexCarousel.usage"
    :source="flexCarouselSource"
    component-name="FlexCarousel"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-135 overflow-hidden demo-container">
        <FlexCarousel
          :key="run"
          :preset="preset"
          :intro="intro"
          :fit="fit"
          :card-height="cardHeight"
          :gap="gap"
          :radius="radius"
          :lens-width="lensWidth"
          :lens-height="lensHeight"
          :tilt="tilt"
          :roundness="roundness"
          :bend="bend"
          :reach="reach"
          :curl="curl"
          :dispersion="dispersion"
          :liquid="liquid"
          :follow-cursor="followCursor"
          :squeeze="squeeze"
          :focus-on-click="focusOnClick"
          :autoplay="autoplay"
          :interval="interval"
          :captions="captions"
          :capture-wheel="captureWheel"
        />
        <RefreshButton @click="run++" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Preset"
          :options="PRESET_OPTIONS"
          :model-value="preset"
          @update:model-value="choosePreset($event as BendPreset)"
        />
        <PreviewSelect
          title="Intro"
          :options="INTRO_OPTIONS"
          :model-value="intro"
          @update:model-value="chooseIntro($event as CarouselIntro)"
        />
        <PreviewSelect title="Fit" :options="FIT_OPTIONS" v-model="fit" />

        <PreviewSlider title="Card Height" :min="0.3" :max="0.8" :step="0.01" v-model="cardHeight" />
        <PreviewSlider title="Gap" :min="0" :max="64" :step="1" valueUnit="px" v-model="gap" />
        <PreviewSlider title="Radius" :min="0" :max="48" :step="1" valueUnit="px" v-model="radius" />

        <PreviewSlider title="Lens Width" :min="0.2" :max="2" :step="0.01" v-model="lensWidth" />
        <PreviewSlider title="Lens Height" :min="0.2" :max="2" :step="0.01" v-model="lensHeight" />
        <PreviewSlider title="Tilt" :min="-180" :max="180" :step="1" valueUnit="°" v-model="tilt" />
        <PreviewSlider title="Roundness" :min="0" :max="1" :step="0.01" v-model="roundness" />

        <PreviewSlider title="Bend" :min="0" :max="1.2" :step="0.01" v-model="bend" />
        <PreviewSlider title="Reach" :min="0.1" :max="0.9" :step="0.01" v-model="reach" />
        <PreviewSelect title="Curl" :options="CURL_OPTIONS" v-model="curl" />
        <PreviewSlider title="Dispersion" :min="0" :max="2" :step="0.01" v-model="dispersion" />
        <PreviewSlider title="Liquid" :min="0" :max="1" :step="0.01" v-model="liquid" />

        <PreviewSwitch title="Follow Cursor" v-model="followCursor" />
        <PreviewSlider title="Squeeze" :min="0" :max="0.4" :step="0.01" v-model="squeeze" />
        <PreviewSwitch title="Focus On Click" v-model="focusOnClick" />
        <PreviewSwitch title="Autoplay" v-model="autoplay" />
        <PreviewSlider
          title="Interval"
          :min="1.5"
          :max="10"
          :step="0.5"
          valueUnit="s"
          :isDisabled="!autoplay"
          v-model="interval"
        />
        <PreviewSwitch title="Captions" v-model="captions" />
        <PreviewSwitch title="Capture Wheel" v-model="captureWheel" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="flex-carousel" :usage="flexCarousel.usage!" :source="flexCarouselSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { flexCarousel } from '@/constants/code/Components/flexCarouselCode';
import FlexCarousel from '@/content/Components/FlexCarousel/FlexCarousel.vue';
import flexCarouselSource from '@/content/Components/FlexCarousel/FlexCarousel.vue?raw';
import { computed, ref } from 'vue';

type BendPreset = 'liquid' | 'ribbon' | 'vortex' | 'arch';
type CarouselIntro = 'rise' | 'bloom' | 'spin' | 'deal' | 'none';
type CurlMode = 'twist' | 'rise' | 'fall';
type CardFit = 'natural' | 'portrait' | 'square' | 'landscape';

interface PresetValues {
  lensWidth: number;
  lensHeight: number;
  tilt: number;
  roundness: number;
  bend: number;
  reach: number;
  curl: CurlMode;
  dispersion: number;
  liquid: number;
  followCursor: boolean;
}

const PRESETS: Record<BendPreset, PresetValues> = {
  liquid: {
    lensWidth: 0.74,
    lensHeight: 1.18,
    tilt: 62,
    roundness: 1,
    bend: 0.34,
    reach: 0.38,
    curl: 'twist',
    dispersion: 0.45,
    liquid: 0,
    followCursor: false
  },
  ribbon: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.34,
    reach: 0.34,
    curl: 'twist',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false
  },
  vortex: {
    lensWidth: 0.7,
    lensHeight: 0.95,
    tilt: 30,
    roundness: 1,
    bend: 0.46,
    reach: 0.3,
    curl: 'twist',
    dispersion: 0.5,
    liquid: 0,
    followCursor: false
  },
  arch: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.3,
    reach: 0.36,
    curl: 'rise',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false
  }
};

const PRESET_OPTIONS = [
  { label: 'Liquid', value: 'liquid' },
  { label: 'Ribbon', value: 'ribbon' },
  { label: 'Vortex', value: 'vortex' },
  { label: 'Arch', value: 'arch' }
];
const INTRO_OPTIONS = [
  { label: 'Rise', value: 'rise' },
  { label: 'Bloom', value: 'bloom' },
  { label: 'Spin', value: 'spin' },
  { label: 'Deal', value: 'deal' },
  { label: 'None', value: 'none' }
];
const CURL_OPTIONS = [
  { label: 'Twist', value: 'twist' },
  { label: 'Rise', value: 'rise' },
  { label: 'Fall', value: 'fall' }
];
const FIT_OPTIONS = [
  { label: 'Natural', value: 'natural' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Square', value: 'square' },
  { label: 'Landscape', value: 'landscape' }
];

const DEFAULTS = {
  preset: 'liquid' as BendPreset,
  intro: 'rise' as CarouselIntro,
  fit: 'natural' as CardFit,
  cardHeight: 0.5,
  gap: 12,
  radius: 0,
  ...PRESETS.liquid,
  squeeze: 0.2,
  focusOnClick: true,
  autoplay: false,
  interval: 4,
  captions: true,
  captureWheel: true
};

const preset = ref(DEFAULTS.preset);
const intro = ref(DEFAULTS.intro);
const fit = ref(DEFAULTS.fit);
const cardHeight = ref(DEFAULTS.cardHeight);
const gap = ref(DEFAULTS.gap);
const radius = ref(DEFAULTS.radius);
const lensWidth = ref(DEFAULTS.lensWidth);
const lensHeight = ref(DEFAULTS.lensHeight);
const tilt = ref(DEFAULTS.tilt);
const roundness = ref(DEFAULTS.roundness);
const bend = ref(DEFAULTS.bend);
const reach = ref(DEFAULTS.reach);
const curl = ref(DEFAULTS.curl);
const dispersion = ref(DEFAULTS.dispersion);
const liquid = ref(DEFAULTS.liquid);
const followCursor = ref(DEFAULTS.followCursor);
const squeeze = ref(DEFAULTS.squeeze);
const focusOnClick = ref(DEFAULTS.focusOnClick);
const autoplay = ref(DEFAULTS.autoplay);
const interval = ref(DEFAULTS.interval);
const captions = ref(DEFAULTS.captions);
const captureWheel = ref(DEFAULTS.captureWheel);
const run = ref(0);

const state = {
  preset,
  intro,
  fit,
  cardHeight,
  gap,
  radius,
  lensWidth,
  lensHeight,
  tilt,
  roundness,
  bend,
  reach,
  curl,
  dispersion,
  liquid,
  followCursor,
  squeeze,
  focusOnClick,
  autoplay,
  interval,
  captions,
  captureWheel
};
type Key = keyof typeof state;
const keys = Object.keys(DEFAULTS) as Key[];

const choosePreset = (value: BendPreset) => {
  preset.value = value;
  const values = PRESETS[value] || PRESETS.liquid;
  (Object.keys(values) as (keyof PresetValues)[]).forEach(k => ((state[k] as { value: unknown }).value = values[k]));
};
const chooseIntro = (value: CarouselIntro) => {
  intro.value = value;
  run.value++;
};

const hasChanges = computed(() => keys.some(k => state[k].value !== DEFAULTS[k]));
function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
  run.value++;
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'Array<{ src: string; alt?: string; title?: string; subtitle?: string }>',
    default: '12 sample photos',
    description:
      'Images shown in the row. Each keeps its natural aspect ratio unless fit is set. The alt text is announced to screen readers, the title and optional subtitle are shown under the row.'
  },
  {
    name: 'preset',
    type: '"liquid" | "ribbon" | "vortex" | "arch"',
    default: '"liquid"',
    description:
      'A starting shape for the invisible glass. Every lens prop below overrides the preset value when you pass it.'
  },
  {
    name: 'intro',
    type: '"rise" | "bloom" | "spin" | "deal" | "none"',
    default: '"rise"',
    description:
      'Entrance once the images load. Rise lifts the cards in from below, bloom fades them in while the bend forms, spin lands a fast flick, deal spreads the cards from the middle. Any input skips it.'
  },
  {
    name: 'fit',
    type: '"natural" | "portrait" | "square" | "landscape"',
    default: '"natural"',
    description: 'Card shape. Natural keeps each image uncropped, the others crop every card to the same shape.'
  },
  {
    name: 'cardHeight',
    type: 'number',
    default: '0.5',
    description: 'Card height as a fraction of the container height.'
  },
  { name: 'gap', type: 'number', default: '12', description: 'Space between cards, in px.' },
  { name: 'radius', type: 'number', default: '0', description: 'Corner radius of the cards, in px.' },
  {
    name: 'lensWidth',
    type: 'number',
    default: 'from preset',
    description: 'Width of the invisible glass as a fraction of the container width.'
  },
  {
    name: 'lensHeight',
    type: 'number',
    default: 'from preset',
    description:
      'Height of the invisible glass as a fraction of the container width, so the bend keeps its shape at any size.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: 'from preset',
    description: 'Rotation of the glass in degrees. It decides where its edge crosses the row.'
  },
  {
    name: 'roundness',
    type: 'number',
    default: 'from preset',
    description: 'Shape of the glass, from a rounded rectangle at 0 to a perfect ellipse at 1.'
  },
  {
    name: 'bend',
    type: 'number',
    default: 'from preset',
    description:
      'How far the row flexes where it passes the edge of the glass. The glass itself is never drawn and the images always stay connected.'
  },
  {
    name: 'reach',
    type: 'number',
    default: 'from preset',
    description:
      'Width of the curved edge of the glass. Small values give a tight kink, large values a long smooth bend.'
  },
  {
    name: 'curl',
    type: '"twist" | "rise" | "fall"',
    default: 'from preset',
    description:
      'Which way the ends of the row flex. Twist sends the left end down and the right end up, rise lifts both, fall drops both.'
  },
  {
    name: 'dispersion',
    type: 'number',
    default: 'from preset',
    description: 'Rainbow splitting of light, only where the edge of the glass bends the images.'
  },
  {
    name: 'liquid',
    type: 'number',
    default: 'from preset',
    description: 'How much the glass stretches and wobbles like a liquid when the row moves. Off in every preset.'
  },
  {
    name: 'followCursor',
    type: 'boolean',
    default: 'from preset',
    description: 'Let the lens drift after the cursor like a loupe, and return to the center when it leaves.'
  },
  {
    name: 'squeeze',
    type: 'number',
    default: '0.2',
    description: 'How much the cards shrink while the row moves fast. 0 keeps them at full size.'
  },
  {
    name: 'focusOnClick',
    type: 'boolean',
    default: 'true',
    description:
      'Clicking a card centers it and opens it: the others part, the bend melts away and the card grows. Click, drag, scroll or Escape closes it.'
  },
  {
    name: 'autoplay',
    type: 'boolean',
    default: 'false',
    description: 'Advance one card at a time. Pauses on hover, focus and interaction, and when reduced motion is on.'
  },
  { name: 'interval', type: 'number', default: '4', description: 'Seconds between autoplay steps.' },
  {
    name: 'captions',
    type: 'boolean',
    default: 'true',
    description: 'Show the title of the centered card under the row and a counter below it.'
  },
  {
    name: 'captureWheel',
    type: 'boolean',
    default: 'true',
    description:
      'Let a vertical mouse wheel scroll the carousel while hovering. Horizontal wheels and trackpads always scroll it.'
  },
  {
    name: '@change',
    type: '(index: number, item) => void',
    default: '-',
    description: 'Called whenever a different card reaches the center.'
  },
  {
    name: '@select',
    type: '(index: number, item) => void',
    default: '-',
    description: 'Called when the centered card is clicked or Enter is pressed. Clicking a side card centers it first.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes on the container.' }
];
</script>
