<template>
  <h1 class="sub-category">Metallic Paint</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="metallicPaint.usage"
    :source="metallicPaintSource"
    component-name="MetallicPaint"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <MetallicPaint
          :key="rerenderKey"
          :image-src="logo"
          :seed="seed"
          :scale="scale"
          :refraction="refraction"
          :blur="blur"
          :liquid="liquid"
          :speed="speed"
          :brightness="brightness"
          :contrast="contrast"
          :angle="angle"
          :fresnel="fresnel"
          :light-color="lightColor"
          :dark-color="darkColor"
          :pattern-sharpness="patternSharpness"
          :wave-amplitude="waveAmplitude"
          :noise-scale="noiseScale"
          :chromatic-spread="chromaticSpread"
          :mouse-animation="mouseAnimation"
          :distortion="distortion"
          :contour="contour"
          :tint-color="tintColor"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Tint Color" v-model="tintColor" />
        <PreviewSlider title="Scale" :min="0.5" :max="10" :step="0.1" v-model="scale" />
        <PreviewSlider title="Liquid" :min="0" :max="2" :step="0.05" v-model="liquid" />
        <PreviewSlider title="Speed" :min="0" :max="2" :step="0.05" v-model="speed" />
        <PreviewSlider title="Brightness" :min="0" :max="5" :step="0.1" v-model="brightness" />
        <PreviewSlider title="Contrast" :min="0" :max="2" :step="0.05" v-model="contrast" />
        <PreviewSlider title="Refraction" :min="0" :max="0.1" :step="0.005" v-model="refraction" />
        <PreviewSlider title="Blur" :min="0" :max="0.1" :step="0.005" v-model="blur" />
        <PreviewSlider title="Fresnel" :min="0" :max="5" :step="0.1" v-model="fresnel" />
        <PreviewSlider title="Pattern Sharpness" :min="0" :max="3" :step="0.1" v-model="patternSharpness" />
        <PreviewSlider title="Wave Amplitude" :min="0" :max="3" :step="0.1" v-model="waveAmplitude" />
        <PreviewSlider title="Noise Scale" :min="0" :max="2" :step="0.05" v-model="noiseScale" />
        <PreviewSlider title="Chromatic Spread" :min="0" :max="5" :step="0.1" v-model="chromaticSpread" />
        <PreviewSlider title="Distortion" :min="0" :max="3" :step="0.05" v-model="distortion" />
        <PreviewSlider title="Contour" :min="0" :max="1" :step="0.05" v-model]="contour" />
        <PreviewSwitch title="Mouse Animation" v-model="mouseAnimation" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="metallic-paint" :usage="metallicPaint.usage!" :source="metallicPaintSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import logo from '@/assets/logos/vue-bits-logo-small-dark.svg';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { metallicPaint } from '@/constants/code/Animations/metallicPaintCode';
import { computed, ref } from 'vue';
import MetallicPaint from '@/content/Animations/MetallicPaint/MetallicPaint.vue';
import metallicPaintSource from '@/content/Animations/MetallicPaint/MetallicPaint.vue?raw';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  seed: 42,
  scale: 4,
  refraction: 0.01,
  blur: 0.015,
  liquid: 0.75,
  speed: 0.3,
  brightness: 2,
  contrast: 0.5,
  angle: 0,
  fresnel: 1,
  lightColor: '#ffffff',
  darkColor: '#000000',
  patternSharpness: 1,
  waveAmplitude: 1,
  noiseScale: 0.5,
  chromaticSpread: 2,
  mouseAnimation: false,
  distortion: 1,
  contour: 0.2,
  tintColor: '#27FF64'
};

const seed = ref<number>(DEFAULTS.seed);
const scale = ref<number>(DEFAULTS.scale);
const refraction = ref<number>(DEFAULTS.refraction);
const blur = ref<number>(DEFAULTS.blur);
const liquid = ref<number>(DEFAULTS.liquid);
const speed = ref<number>(DEFAULTS.speed);
const brightness = ref<number>(DEFAULTS.brightness);
const contrast = ref<number>(DEFAULTS.contrast);
const angle = ref<number>(DEFAULTS.angle);
const fresnel = ref<number>(DEFAULTS.fresnel);
const patternSharpness = ref<number>(DEFAULTS.patternSharpness);
const waveAmplitude = ref<number>(DEFAULTS.waveAmplitude);
const noiseScale = ref<number>(DEFAULTS.noiseScale);
const chromaticSpread = ref<number>(DEFAULTS.chromaticSpread);
const distortion = ref<number>(DEFAULTS.distortion);
const contour = ref<number>(DEFAULTS.contour);
const mouseAnimation = ref<boolean>(DEFAULTS.mouseAnimation);
const lightColor = ref<string>(DEFAULTS.lightColor);
const darkColor = ref<string>(DEFAULTS.darkColor);
const tintColor = ref<string>(DEFAULTS.tintColor);

const hasChanges = computed(
  () =>
    seed.value !== DEFAULTS.seed ||
    scale.value !== DEFAULTS.scale ||
    refraction.value !== DEFAULTS.refraction ||
    blur.value !== DEFAULTS.blur ||
    liquid.value !== DEFAULTS.liquid ||
    speed.value !== DEFAULTS.speed ||
    brightness.value !== DEFAULTS.brightness ||
    contrast.value !== DEFAULTS.contrast ||
    angle.value !== DEFAULTS.angle ||
    fresnel.value !== DEFAULTS.fresnel ||
    patternSharpness.value !== DEFAULTS.patternSharpness ||
    waveAmplitude.value !== DEFAULTS.waveAmplitude ||
    noiseScale.value !== DEFAULTS.noiseScale ||
    chromaticSpread.value !== DEFAULTS.chromaticSpread ||
    distortion.value !== DEFAULTS.distortion ||
    contour.value !== DEFAULTS.contour ||
    mouseAnimation.value !== DEFAULTS.mouseAnimation ||
    lightColor.value !== DEFAULTS.lightColor ||
    darkColor.value !== DEFAULTS.darkColor ||
    tintColor.value !== DEFAULTS.tintColor
);

function reset() {
  seed.value = DEFAULTS.seed;
  scale.value = DEFAULTS.scale;
  refraction.value = DEFAULTS.refraction;
  blur.value = DEFAULTS.blur;
  liquid.value = DEFAULTS.liquid;
  speed.value = DEFAULTS.speed;
  brightness.value = DEFAULTS.brightness;
  contrast.value = DEFAULTS.contrast;
  angle.value = DEFAULTS.angle;
  fresnel.value = DEFAULTS.fresnel;
  patternSharpness.value = DEFAULTS.patternSharpness;
  waveAmplitude.value = DEFAULTS.waveAmplitude;
  noiseScale.value = DEFAULTS.noiseScale;
  chromaticSpread.value = DEFAULTS.chromaticSpread;
  distortion.value = DEFAULTS.distortion;
  contour.value = DEFAULTS.contour;
  mouseAnimation.value = DEFAULTS.mouseAnimation;
  lightColor.value = DEFAULTS.lightColor;
  darkColor.value = DEFAULTS.darkColor;
  tintColor.value = DEFAULTS.tintColor;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'imageSrc',
    type: 'string',
    default: 'none (required)',
    description: 'URL or path to the image used for the metallic paint effect. The image is processed internally.'
  },
  {
    name: 'seed',
    type: 'number',
    default: '42',
    description: 'Random seed for pattern generation. Different values create different pattern variations.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '2',
    description: 'Scale of the metallic pattern. Higher values create more repetitions.'
  },
  {
    name: 'refraction',
    type: 'number',
    default: '0.015',
    description: 'Amount of chromatic aberration (color separation). Creates the rainbow edge effect.'
  },
  {
    name: 'blur',
    type: 'number',
    default: '0.005',
    description: 'Blur amount for the pattern transitions. Higher values create softer gradients.'
  },
  {
    name: 'liquid',
    type: 'number',
    default: '0.07',
    description: 'Amount of liquid/wavy animation applied to the pattern.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.3',
    description: 'Animation speed multiplier. Set to 0 to disable animation.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '1',
    description: 'Overall brightness of the metallic effect. Values above 1 increase brightness.'
  },
  {
    name: 'contrast',
    type: 'number',
    default: '1',
    description: 'Color contrast of the effect. Higher values create more distinct light/dark areas.'
  },
  {
    name: 'angle',
    type: 'number',
    default: '0',
    description: 'Rotation angle of the pattern in degrees.'
  },
  {
    name: 'fresnel',
    type: 'number',
    default: '1',
    description: 'Fresnel effect intensity. Controls edge highlighting based on viewing angle.'
  },
  {
    name: 'lightColor',
    type: 'string',
    default: '#ffffff',
    description: 'Hex color for the bright/highlight areas of the metallic effect.'
  },
  {
    name: 'darkColor',
    type: 'string',
    default: '#111111',
    description: 'Hex color for the dark/shadow areas of the metallic effect.'
  },
  {
    name: 'patternSharpness',
    type: 'number',
    default: '1',
    description: 'Controls the sharpness of metallic band transitions. Higher = sharper edges.'
  },
  {
    name: 'waveAmplitude',
    type: 'number',
    default: '1',
    description: 'Intensity of the wave distortion effect.'
  },
  {
    name: 'noiseScale',
    type: 'number',
    default: '1',
    description: 'Scale of the noise pattern. Higher = more detailed noise.'
  },
  {
    name: 'chromaticSpread',
    type: 'number',
    default: '1',
    description: 'Multiplier for chromatic aberration spread between RGB channels.'
  },
  {
    name: 'mouseAnimation',
    type: 'boolean',
    default: 'false',
    description: 'When true, mouse position controls wave animation instead of auto-loop.'
  },
  {
    name: 'distortion',
    type: 'number',
    default: '0',
    description: 'Amount of noise-based distortion applied to the pattern flow (0-1).'
  },
  {
    name: 'contour',
    type: 'number',
    default: '0',
    description: 'Intensity of edge contour effect that warps the pattern along shape boundaries (0-1).'
  },
  {
    name: 'tintColor',
    type: 'string',
    default: '#ffffff',
    description: 'Hex color for color burn tint effect. White = no tint.'
  }
];
</script>
