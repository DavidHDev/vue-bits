<template>
  <h1 class="sub-category">Shape Waves</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="shapeWaves.usage"
    :source="shapeWavesSource"
    componentName="ShapeWaves"
    :props-table="props"
  >
    <template #preview>
      <div class="relative bg-[#14110e] rounded-2xl w-full h-125 overflow-hidden demo-container">
        <RefreshButton @click="introKey++" />
        <ShapeWaves :key="key" :intro-key="introKey" v-bind="shapeWavesProps" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Text" placeholder="Leave empty for no cutout" :maxLength="24" v-model="text" />
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewColorPicker title="Splash Color" v-model="hoverColor" />
        <PreviewColorPicker title="Background" v-model="backgroundColor" />
        <PreviewSelect title="Shapes" :options="SHAPE_OPTIONS" v-model="shapes" />
        <PreviewSlider title="Cell Size" :min="6" :max="24" :step="1" v-model="cellSize" />
        <PreviewSlider title="Dot Size" :min="0.3" :max="1" :step="0.01" v-model="dotSize" />
        <PreviewSlider title="Text Size" :min="0.1" :max="0.6" :step="0.01" v-model="textSize" />
        <PreviewSlider title="Speed" :min="0" :max="4" :step="0.1" v-model="speed" />
        <PreviewSlider title="Wave Scale" :min="0.3" :max="3" :step="0.05" v-model="scale" />
        <PreviewSlider title="Contrast" :min="0.3" :max="3" :step="0.05" v-model="contrast" />
        <PreviewSlider title="Brightness" :min="0" :max="1" :step="0.01" v-model="brightness" />
        <PreviewSlider title="Flow" :min="0" :max="4" :step="0.1" v-model="flow" />
        <PreviewSlider title="Direction" :min="0" :max="360" :step="5" v-model="direction" />
        <PreviewSlider title="Edge Fade" :min="0" :max="0.45" :step="0.01" v-model="fade" />
        <PreviewSwitch title="Interactive" v-model="interactive" />
        <PreviewSlider title="Splash Radius" :min="10" :max="120" :step="2" v-model="splashRadius" />
        <PreviewSlider title="Splash Strength" :min="0.2" :max="2.5" :step="0.05" v-model="splashStrength" />
        <PreviewSlider title="Glow" :min="0" :max="3" :step="0.05" v-model="glow" />
        <PreviewSwitch title="Intro" v-model="intro" />
        <PreviewSlider title="Intro Duration" :min="0.5" :max="4" :step="0.1" v-model="introDuration" />
        <PreviewSwitch title="Paused" v-model="paused" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="shapeWaves" :usage="shapeWaves.usage!" :source="shapeWavesSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { shapeWaves } from '@/constants/code/Backgrounds/shapeWavesCode';
import ShapeWaves, { type ShapeWavesShapes } from '@/content/Backgrounds/ShapeWaves/ShapeWaves.vue';
import shapeWavesSource from '@/content/Backgrounds/ShapeWaves/ShapeWaves.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  text: 'Vue Bits',
  textSize: 0.6,
  shapes: 'mixed' as ShapeWavesShapes,
  cellSize: 10,
  dotSize: 0.75,
  color: '#929292',
  hoverColor: '#ffffff',
  backgroundColor: '#120f17',
  speed: 1,
  scale: 1,
  contrast: 1,
  brightness: 0.4,
  flow: 0,
  direction: 0,
  fade: 0.25,
  interactive: true,
  splashRadius: 40,
  splashStrength: 0.4,
  glow: 0.35,
  intro: true,
  introDuration: 1.6,
  paused: false
};

const SHAPE_OPTIONS = [
  { value: 'mixed', label: 'Mixed' },
  { value: 'squares', label: 'Squares' },
  { value: 'circles', label: 'Circles' },
  { value: 'triangles', label: 'Triangles' }
];

const introKey = ref(0);
const text = ref(DEFAULTS.text);
const textSize = ref(DEFAULTS.textSize);
const shapes = ref(DEFAULTS.shapes);
const cellSize = ref(DEFAULTS.cellSize);
const dotSize = ref(DEFAULTS.dotSize);
const color = ref(DEFAULTS.color);
const hoverColor = ref(DEFAULTS.hoverColor);
const backgroundColor = ref(DEFAULTS.backgroundColor);
const speed = ref(DEFAULTS.speed);
const scale = ref(DEFAULTS.scale);
const contrast = ref(DEFAULTS.contrast);
const brightness = ref(DEFAULTS.brightness);
const flow = ref(DEFAULTS.flow);
const direction = ref(DEFAULTS.direction);
const fade = ref(DEFAULTS.fade);
const interactive = ref(DEFAULTS.interactive);
const splashRadius = ref(DEFAULTS.splashRadius);
const splashStrength = ref(DEFAULTS.splashStrength);
const glow = ref(DEFAULTS.glow);
const intro = ref(DEFAULTS.intro);
const introDuration = ref(DEFAULTS.introDuration);
const paused = ref(DEFAULTS.paused);

const shapeWavesProps = computed(() => ({
  text: text.value,
  textSize: textSize.value,
  shapes: shapes.value,
  cellSize: cellSize.value,
  dotSize: dotSize.value,
  color: color.value,
  hoverColor: hoverColor.value,
  backgroundColor: backgroundColor.value,
  speed: speed.value,
  scale: scale.value,
  contrast: contrast.value,
  brightness: brightness.value,
  flow: flow.value,
  direction: direction.value,
  fade: fade.value,
  interactive: interactive.value,
  splashRadius: splashRadius.value,
  splashStrength: splashStrength.value,
  glow: glow.value,
  intro: intro.value,
  introDuration: introDuration.value,
  paused: paused.value
}));

const hasChanges = computed(
  () =>
    text.value !== DEFAULTS.text ||
    textSize.value !== DEFAULTS.textSize ||
    shapes.value !== DEFAULTS.shapes ||
    cellSize.value !== DEFAULTS.cellSize ||
    dotSize.value !== DEFAULTS.dotSize ||
    color.value !== DEFAULTS.color ||
    hoverColor.value !== DEFAULTS.hoverColor ||
    backgroundColor.value !== DEFAULTS.backgroundColor ||
    speed.value !== DEFAULTS.speed ||
    scale.value !== DEFAULTS.scale ||
    contrast.value !== DEFAULTS.contrast ||
    brightness.value !== DEFAULTS.brightness ||
    flow.value !== DEFAULTS.flow ||
    direction.value !== DEFAULTS.direction ||
    fade.value !== DEFAULTS.fade ||
    interactive.value !== DEFAULTS.interactive ||
    splashRadius.value !== DEFAULTS.splashRadius ||
    splashStrength.value !== DEFAULTS.splashStrength ||
    glow.value !== DEFAULTS.glow ||
    intro.value !== DEFAULTS.intro ||
    introDuration.value !== DEFAULTS.introDuration ||
    paused.value !== DEFAULTS.paused
);

function reset() {
  text.value = DEFAULTS.text;
  textSize.value = DEFAULTS.textSize;
  shapes.value = DEFAULTS.shapes;
  cellSize.value = DEFAULTS.cellSize;
  dotSize.value = DEFAULTS.dotSize;
  color.value = DEFAULTS.color;
  hoverColor.value = DEFAULTS.hoverColor;
  backgroundColor.value = DEFAULTS.backgroundColor;
  speed.value = DEFAULTS.speed;
  scale.value = DEFAULTS.scale;
  contrast.value = DEFAULTS.contrast;
  brightness.value = DEFAULTS.brightness;
  flow.value = DEFAULTS.flow;
  direction.value = DEFAULTS.direction;
  fade.value = DEFAULTS.fade;
  interactive.value = DEFAULTS.interactive;
  splashRadius.value = DEFAULTS.splashRadius;
  splashStrength.value = DEFAULTS.splashStrength;
  glow.value = DEFAULTS.glow;
  intro.value = DEFAULTS.intro;
  introDuration.value = DEFAULTS.introDuration;
  paused.value = DEFAULTS.paused;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: "''",
    description:
      'Optional text carved out of the field. Cells under the glyphs stay empty and the waves flow around them.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: '\'Geist, "Geist Sans", system-ui, sans-serif\'',
    description: 'CSS font family used to draw the text cutout.'
  },
  { name: 'fontWeight', type: 'string | number', default: '500', description: 'Font weight of the text cutout.' },
  {
    name: 'textSize',
    type: 'number',
    default: '0.6',
    description: 'Text height as a fraction of the container height. Long text shrinks to fit the width.'
  },
  {
    name: 'shapes',
    type: 'string',
    default: "'mixed'",
    description:
      "'mixed' draws dark bands as triangles, mid bands as circles and bright bands as squares. 'squares', 'circles' or 'triangles' use one glyph and vary its size per band instead."
  },
  { name: 'cellSize', type: 'number', default: '10', description: 'Size of one grid cell in CSS pixels.' },
  { name: 'dotSize', type: 'number', default: '0.75', description: 'Glyph size as a fraction of the cell.' },
  {
    name: 'color',
    type: 'string',
    default: "'#929292'",
    description: 'Glyph color. One flat color for the whole field.'
  },
  {
    name: 'hoverColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color the glyphs step towards inside a splash.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#000000'",
    description: 'Background color behind the glyphs.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'How fast the wave bands morph over time. 0 freezes them.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Size of the wave bands. Larger values give broader, calmer swells.'
  },
  {
    name: 'contrast',
    type: 'number',
    default: '1',
    description: 'How sharply the field is cut into its three bands.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '0.4',
    description: 'Shifts the balance between dark, mid and bright bands.'
  },
  {
    name: 'flow',
    type: 'number',
    default: '0',
    description: 'Drift speed of the field in cells per second. 0 evolves in place.'
  },
  {
    name: 'direction',
    type: 'number',
    default: '0',
    description: 'Drift direction in degrees, used when flow is above 0.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0.25',
    description: 'Strength of the radial fade into the background towards the edges. 0 disables it.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Lets the cursor splash into the field, sending ripples that cycle the glyphs and light them up.'
  },
  { name: 'splashRadius', type: 'number', default: '40', description: 'Size of a cursor splash in CSS pixels.' },
  {
    name: 'splashStrength',
    type: 'number',
    default: '0.4',
    description: 'How much energy a splash drops in. Higher values throw wider, brighter ripples.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.35',
    description: 'Bloom on lit glyphs. 0 disables the glow pass entirely.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description:
      'Plays a spawn animation on mount: the shapes pop in along a wave that travels from the centre to the corners.'
  },
  { name: 'introDuration', type: 'number', default: '1.6', description: 'Length of the intro wave in seconds.' },
  {
    name: 'introKey',
    type: 'string | number',
    default: '0',
    description: 'Change this value to replay the intro wave without remounting.'
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the wave motion. Splashes keep working.'
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    default: 'undefined',
    description: 'Called when WebGPU is unavailable or rendering fails. The background color still shows.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' }
];
</script>
