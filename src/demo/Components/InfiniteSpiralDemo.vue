<template>
  <h1 class="sub-category">Infinite Spiral</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="infiniteSpiral.usage"
    :source="infiniteSpiralSource"
    component-name="InfiniteSpiral"
    :props-table="props"
  >
    <template #preview>
      <div class="h-140 overflow-hidden demo-container">
        <InfiniteSpiral :key="key" :items="DEMO_ITEMS" v-bind="infiniteSpiralProps" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Animation Mode" :options="ANIMATION_MODE_OPTIONS" v-model="animationMode" />
        <PreviewSelect title="Direction" :options="DIRECTION_OPTIONS" v-model="direction" />
        <PreviewSelect title="Image Fit" :options="IMAGE_FIT_OPTIONS" v-model="imageFit" />
        <PreviewSlider title="Grayscale" :min="0" :max="1" :step="0.05" v-model="grayscale" />
        <PreviewSlider title="Speed" :min="0" :max="2" :step="0.05" v-model="speed" />
        <PreviewSlider title="Radius" :min="100" :max="420" :step="5" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Card Width" :min="80" :max="260" :step="4" valueUnit="px" v-model="cardWidth" />
        <PreviewSlider title="Card Height" :min="60" :max="200" :step="4" valueUnit="px" v-model="cardHeight" />
        <PreviewSlider title="Spacing" :min="24" :max="120" :step="2" valueUnit="px" v-model="verticalSpacing" />
        <PreviewSlider title="Perspective" :min="500" :max="1800" :step="25" valueUnit="px" v-model="perspective" />
        <PreviewSlider title="Cards Per Turn" :min="3" :max="14" :step="1" v-model="cardsPerTurn" />
        <PreviewSlider title="Rotation" :min="-180" :max="180" :step="2" valueUnit="deg" v-model="rotation" />
        <PreviewSlider title="Card Tilt" :min="-30" :max="30" :step="1" valueUnit="deg" v-model="cardTilt" />
        <PreviewSlider title="Corner Radius" :min="0" :max="40" :step="1" valueUnit="px" v-model="cardRadius" />
        <PreviewSlider title="Center Scale" :min="0.8" :max="1.6" :step="0.02" v-model="centerScale" />
        <PreviewSlider title="Edge Fade" :min="0" :max="0.8" :step="0.02" v-model="edgeFade" />
        <PreviewSlider title="Edge Blur" :min="0" :max="10" :step="0.25" valueUnit="px" v-model="edgeBlur" />
        <PreviewSwitch title="Pause On Hover" v-model="pauseOnHover" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="infinite-spiral" :usage="infiniteSpiral.usage!" :source="infiniteSpiralSource" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { infiniteSpiral } from '@/constants/code/Components/infiniteSpiralCode';
import InfiniteSpiral from '@/content/Components/InfiniteSpiral/InfiniteSpiral.vue';
import infiniteSpiralSource from '@/content/Components/InfiniteSpiral/InfiniteSpiral.vue?raw';
import { computed, ref, type CSSProperties } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 0.55,
  direction: 'up' as 'up' | 'down',
  animationMode: 'auto' as 'auto' | 'drag' | 'scroll' | 'all',
  radius: 170,
  cardWidth: 100,
  cardHeight: 100,
  verticalSpacing: 60,
  perspective: 1000,
  cardsPerTurn: 7,
  rotation: 0,
  cardTilt: 0,
  cardRadius: 10,
  centerScale: 1.2,
  edgeFade: 0.3,
  edgeBlur: 6,
  pauseOnHover: true,
  imageFit: 'cover' as CSSProperties['objectFit'],
  grayscale: 1
};

const DEMO_ITEMS = [
  {
    src: 'https://images.unsplash.com/photo-1781764177519-9c9c88733c3e?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 1 by Eugene Golovesov'
  },
  {
    src: 'https://images.unsplash.com/photo-1774009485852-13a515d32e36?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 2 by Eugene Golovesov'
  },
  {
    src: 'https://images.unsplash.com/photo-1705032033999-efa3082e1a4e?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 3 by Eugene Golovesov'
  },
  {
    src: 'https://images.unsplash.com/photo-1709699714159-29bc3ac99486?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 4 by Eugene Golovesov'
  },
  {
    src: 'https://images.unsplash.com/photo-1763440519433-5467759054fc?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 5 by Eugene Golovesov'
  },
  {
    src: 'https://images.unsplash.com/photo-1724152312974-d4d48b8b36fd?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 6 by Eugene Golovesov'
  },
  {
    src: 'https://images.unsplash.com/photo-1656651356997-71fcb0f04d3b?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 7 by Eugene Golovesov'
  },
  {
    src: 'https://images.unsplash.com/photo-1636269603887-702d9a201bb4?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 8 by Eugene Golovesov'
  },
  {
    src: 'https://images.unsplash.com/photo-1772440337285-8b5674e1ee8a?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 9 by Eugene Golovesov'
  },
  {
    src: 'https://images.unsplash.com/photo-1762846818262-33c197852fa8?auto=format&fit=crop&w=900&q=80',
    alt: 'Photograph 10 by Eugene Golovesov'
  }
];

const DIRECTION_OPTIONS = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' }
];

const ANIMATION_MODE_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'drag', label: 'Drag' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'all', label: 'All' }
];

const IMAGE_FIT_OPTIONS = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' }
];

const speed = ref(DEFAULTS.speed);
const direction = ref(DEFAULTS.direction);
const animationMode = ref(DEFAULTS.animationMode);
const radius = ref(DEFAULTS.radius);
const cardWidth = ref(DEFAULTS.cardWidth);
const cardHeight = ref(DEFAULTS.cardHeight);
const verticalSpacing = ref(DEFAULTS.verticalSpacing);
const perspective = ref(DEFAULTS.perspective);
const cardsPerTurn = ref(DEFAULTS.cardsPerTurn);
const rotation = ref(DEFAULTS.rotation);
const cardTilt = ref(DEFAULTS.cardTilt);
const cardRadius = ref(DEFAULTS.cardRadius);
const centerScale = ref(DEFAULTS.centerScale);
const edgeFade = ref(DEFAULTS.edgeFade);
const edgeBlur = ref(DEFAULTS.edgeBlur);
const pauseOnHover = ref(DEFAULTS.pauseOnHover);
const imageFit = ref(DEFAULTS.imageFit);
const grayscale = ref(DEFAULTS.grayscale);

const infiniteSpiralProps = computed(() => ({
  speed: speed.value,
  direction: direction.value,
  animationMode: animationMode.value,
  radius: radius.value,
  cardWidth: cardWidth.value,
  cardHeight: cardHeight.value,
  verticalSpacing: verticalSpacing.value,
  perspective: perspective.value,
  cardsPerTurn: cardsPerTurn.value,
  rotation: rotation.value,
  cardTilt: cardTilt.value,
  cardRadius: cardRadius.value,
  centerScale: centerScale.value,
  edgeFade: edgeFade.value,
  edgeBlur: edgeBlur.value,
  pauseOnHover: pauseOnHover.value,
  imageFit: imageFit.value,
  grayscale: grayscale.value
}));

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    direction.value !== DEFAULTS.direction ||
    animationMode.value !== DEFAULTS.animationMode ||
    radius.value !== DEFAULTS.radius ||
    cardWidth.value !== DEFAULTS.cardWidth ||
    cardHeight.value !== DEFAULTS.cardHeight ||
    verticalSpacing.value !== DEFAULTS.verticalSpacing ||
    perspective.value !== DEFAULTS.perspective ||
    cardsPerTurn.value !== DEFAULTS.cardsPerTurn ||
    rotation.value !== DEFAULTS.rotation ||
    cardTilt.value !== DEFAULTS.cardTilt ||
    cardRadius.value !== DEFAULTS.cardRadius ||
    centerScale.value !== DEFAULTS.centerScale ||
    edgeFade.value !== DEFAULTS.edgeFade ||
    edgeBlur.value !== DEFAULTS.edgeBlur ||
    pauseOnHover.value !== DEFAULTS.pauseOnHover ||
    imageFit.value !== DEFAULTS.imageFit ||
    grayscale.value !== DEFAULTS.grayscale
);

function reset() {
  speed.value = DEFAULTS.speed;
  direction.value = DEFAULTS.direction;
  animationMode.value = DEFAULTS.animationMode;
  radius.value = DEFAULTS.radius;
  cardWidth.value = DEFAULTS.cardWidth;
  cardHeight.value = DEFAULTS.cardHeight;
  verticalSpacing.value = DEFAULTS.verticalSpacing;
  perspective.value = DEFAULTS.perspective;
  cardsPerTurn.value = DEFAULTS.cardsPerTurn;
  rotation.value = DEFAULTS.rotation;
  cardTilt.value = DEFAULTS.cardTilt;
  cardRadius.value = DEFAULTS.cardRadius;
  centerScale.value = DEFAULTS.centerScale;
  edgeFade.value = DEFAULTS.edgeFade;
  edgeBlur.value = DEFAULTS.edgeBlur;
  pauseOnHover.value = DEFAULTS.pauseOnHover;
  imageFit.value = DEFAULTS.imageFit;
  grayscale.value = DEFAULTS.grayscale;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: '(string | SpiralItem)[]',
    default: '[]',
    description: 'Images shown in the spiral. Objects may also include alt, href, target, label and id.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.55',
    description: 'Automatic travel speed in cards per second and the sensitivity of scroll-controlled motion.'
  },
  { name: 'direction', type: '"up" | "down"', default: '"up"', description: 'Vertical travel direction.' },
  {
    name: 'animationMode',
    type: '"auto" | "drag" | "scroll" | "all"',
    default: '"auto"',
    description: 'Selects automatic motion, pointer dragging, page-scroll control or all interactions.'
  },
  { name: 'radius', type: 'number', default: '170', description: 'Depth radius of the helix in pixels.' },
  { name: 'cardWidth', type: 'number', default: '100', description: 'Card width in pixels.' },
  { name: 'cardHeight', type: 'number', default: '100', description: 'Card height in pixels.' },
  {
    name: 'verticalSpacing',
    type: 'number',
    default: '60',
    description: 'Vertical distance between neighboring cards.'
  },
  { name: 'perspective', type: 'number', default: '1000', description: 'CSS perspective applied to the 3D stage.' },
  {
    name: 'cardsPerTurn',
    type: 'number',
    default: '7',
    description: 'Number of cards used for one complete revolution.'
  },
  { name: 'rotation', type: 'number', default: '0', description: 'Global angular offset in degrees.' },
  { name: 'cardTilt', type: 'number', default: '0', description: 'Additional clockwise card tilt in degrees.' },
  { name: 'cardRadius', type: 'number', default: '10', description: 'Card corner radius in pixels.' },
  {
    name: 'centerScale',
    type: 'number',
    default: '1.2',
    description: 'Scale multiplier for cards nearest the center.'
  },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0.3',
    description: 'Fraction of the outer travel range used for fading.'
  },
  { name: 'edgeBlur', type: 'number', default: '6', description: 'Maximum blur applied near the edges.' },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Smoothly eases automatic motion to a stop while the gallery is hovered.'
  },
  {
    name: 'imageFit',
    type: '"cover" | "contain"',
    default: '"cover"',
    description: 'Object fit used by every image.'
  },
  {
    name: 'grayscale',
    type: 'number',
    default: '0',
    description: 'Grayscale amount applied to every image, from 0 to 1.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Additional class names for the root element.' }
];
</script>
