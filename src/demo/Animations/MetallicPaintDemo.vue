<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
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

      <Customize>
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-full md:min-w-[200px] lg:min-w-[180px]">
            <PreviewColor title="Tint Color" v-model="tintColor" class="mb-2" />
            <PreviewColor title="Dark Color" v-model="darkColor" class="mb-2" />
            <PreviewColor title="Light Color" v-model="lightColor" class="mb-2" />
            <PreviewSlider title="Seed" v-model="seed" :min="0" :max="200" :step="0.01" />
            <PreviewSlider title="Scale" v-model="scale" :min="0.5" :max="5" :step="0.1" />
            <PreviewSlider title="Refraction" v-model="refraction" :min="0" :max="0.1" :step="0.001" />
            <PreviewSlider title="Blur" v-model="blur" :min="0" :max="0.1" :step="0.001" />
          </div>

          <div class="flex-1 min-w-full md:min-w-[200px] lg:min-w-[180px]">
            <PreviewSlider title="Speed" v-model="speed" :min="0" :max="1" :step="0.01" />
            <PreviewSlider title="Brightness" v-model="brightness" :min="0.5" :max="2" :step="0.05" />
            <PreviewSlider title="Contrast" v-model="contrast" :min="0.5" :max="2" :step="0.05" />
            <PreviewSlider title="Angle" v-model="angle" :min="-180" :max="180" :step="1" />
            <PreviewSlider title="Fresnel" v-model="fresnel" :min="0" :max="3" :step="0.1" />
            <PreviewSlider title="Pattern Sharpness" v-model="patternSharpness" :min="0.1" :max="2" :step="0.1" />
            <PreviewSlider title="Wave Amplitude" v-model="waveAmplitude" :min="0" :max="3" :step="0.1" />
          </div>

          <div class="flex-1 min-w-full md:min-w-[200px] lg:min-w-[180px]">
            <PreviewSlider title="Liquid" v-model="liquid" :min="0" :max="1" :step="0.01" />
            <PreviewSlider title="Noise Scale" v-model="noiseScale" :min="0" :max="3" :step="0.1" />
            <PreviewSlider title="Chromatic Spread" v-model="chromaticSpread" :min="0" :max="3" :step="0.1" />
            <PreviewSlider title="Distortion" v-model="distortion" :min="0" :max="1" :step="0.05" />
            <PreviewSlider title="Contour" v-model="contour" :min="0" :max="1" :step="0.05" />
            <PreviewSwitch title="Mouse Animation" v-model="mouseAnimation" />
          </div>
        </div>
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="metallicPaint" />
    </template>

    <template #cli>
      <CliInstallation :command="metallicPaint.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import logo from '@/assets/logos/vue-bits-logo-small-dark.svg';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { metallicPaint } from '@/constants/code/Animations/metallicPaintCode';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import MetallicPaint from '../../content/Animations/MetallicPaint/MetallicPaint.vue';

const seed = ref<number>(42);
const scale = ref<number>(2);
const refraction = ref<number>(0.01);
const blur = ref<number>(0.015);
const liquid = ref<number>(0.75);
const speed = ref<number>(0.3);
const brightness = ref<number>(2);
const contrast = ref<number>(0.5);
const angle = ref<number>(0);
const fresnel = ref<number>(1);
const patternSharpness = ref<number>(1);
const waveAmplitude = ref<number>(1);
const noiseScale = ref<number>(0.5);
const chromaticSpread = ref<number>(2);
const distortion = ref<number>(1);
const contour = ref<number>(0.2);
const mouseAnimation = ref<boolean>(false);
const lightColor = ref<string>('#ffffff');
const darkColor = ref<string>('#000000');
const tintColor = ref<string>('#27FF64');

const { rerenderKey } = useForceRerender();

const propData = [
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
