<template>
  <h1 class="sub-category">Light Pillar</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="lightPillar.usage"
    :source="lightPillarSource"
    component-name="LightPillar"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <LightPillar
          :key="rerenderKey"
          :top-color="topColor"
          :bottom-color="bottomColor"
          :intensity="intensity"
          :rotation-speed="rotationSpeed"
          :interactive="interactive"
          :glow-amount="glowAmount"
          :pillar-width="pillarWidth"
          :pillar-height="pillarHeight"
          :noise-intensity="noiseIntensity"
          :pillar-rotation="pillarRotation"
          :mix-blend-mode="mixBlendMode"
          :quality="quality"
        />
        <BackgroundContent pill-text="New Background" headline="Ethereal light pillar for your hero sections." />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker v-model="topColor" title="Top Color" />
        <PreviewColorPicker v-model="bottomColor" title="Bottom Color" />
        <PreviewSlider :min="0.1" :max="3" :step="0.1" v-model="intensity" title="Intensity" />
        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="rotationSpeed" title="Rotation Speed" />
        <PreviewSlider :min="0.001" :max="0.02" :step="0.001" v-model="glowAmount" title="Glow Amount" />
        <PreviewSlider :min="1" :max="10" :step="0.1" v-model="pillarWidth" title="Pillar Width" />
        <PreviewSlider :min="0.1" :max="2" :step="0.1" v-model="pillarHeight" title="Pillar Height" />
        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="noiseIntensity" title="Noise Intensity" />
        <PreviewSlider :min="0" :max="360" :step="1" v-model="pillarRotation" title="Pillar Rotation" />
        <PreviewSwitch title="Interactive Rotation" v-model="interactive" />
        <PreviewSelect :options="blendModeOptions" v-model="mixBlendMode" title="Mix Blend Mode" />
        <PreviewSelect :options="['low', 'medium', 'high']" v-model="quality" title="Quality" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="light-pillar" :usage="lightPillar.usage!" :source="lightPillarSource" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { lightPillar } from '@/constants/code/Backgrounds/lightPillarCode';
import LightPillar from '@/content/Backgrounds/LightPillar/LightPillar.vue';
import lightPillarSource from '@/content/Backgrounds/LightPillar/LightPillar.vue?raw';
import { computed, ref, type CSSProperties } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  topColor: '#48FF28',
  bottomColor: '#9EF19E',
  intensity: 1.0,
  rotationSpeed: 0.3,
  interactive: false,
  glowAmount: 0.002,
  pillarWidth: 3.0,
  pillarHeight: 0.4,
  noiseIntensity: 0.5,
  mixBlendMode: 'screen' as CSSProperties['mixBlendMode'],
  pillarRotation: 25,
  quality: 'high' as 'low' | 'medium' | 'high'
};

const topColor = ref(DEFAULTS.topColor);
const bottomColor = ref(DEFAULTS.bottomColor);
const intensity = ref(DEFAULTS.intensity);
const rotationSpeed = ref(DEFAULTS.rotationSpeed);
const interactive = ref(DEFAULTS.interactive);
const glowAmount = ref(DEFAULTS.glowAmount);
const pillarWidth = ref(DEFAULTS.pillarWidth);
const pillarHeight = ref(DEFAULTS.pillarHeight);
const noiseIntensity = ref(DEFAULTS.noiseIntensity);
const pillarRotation = ref(DEFAULTS.pillarRotation);
const mixBlendMode = ref<CSSProperties['mixBlendMode']>(DEFAULTS.mixBlendMode);
const quality = ref<'low' | 'medium' | 'high'>(DEFAULTS.quality);

const hasChanges = computed(
  () =>
    topColor.value !== DEFAULTS.topColor ||
    bottomColor.value !== DEFAULTS.bottomColor ||
    intensity.value !== DEFAULTS.intensity ||
    rotationSpeed.value !== DEFAULTS.rotationSpeed ||
    interactive.value !== DEFAULTS.interactive ||
    glowAmount.value !== DEFAULTS.glowAmount ||
    pillarWidth.value !== DEFAULTS.pillarWidth ||
    pillarHeight.value !== DEFAULTS.pillarHeight ||
    noiseIntensity.value !== DEFAULTS.noiseIntensity ||
    pillarRotation.value !== DEFAULTS.pillarRotation ||
    mixBlendMode.value !== DEFAULTS.mixBlendMode ||
    quality.value !== DEFAULTS.quality
);

function reset() {
  topColor.value = DEFAULTS.topColor;
  bottomColor.value = DEFAULTS.bottomColor;
  intensity.value = DEFAULTS.intensity;
  rotationSpeed.value = DEFAULTS.rotationSpeed;
  interactive.value = DEFAULTS.interactive;
  glowAmount.value = DEFAULTS.glowAmount;
  pillarWidth.value = DEFAULTS.pillarWidth;
  pillarHeight.value = DEFAULTS.pillarHeight;
  noiseIntensity.value = DEFAULTS.noiseIntensity;
  pillarRotation.value = DEFAULTS.pillarRotation;
  mixBlendMode.value = DEFAULTS.mixBlendMode;
  quality.value = DEFAULTS.quality;
  forceRerender();
}

const blendModeOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'screen', label: 'Screen' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'luminosity', label: 'Luminosity' }
];

const props: PropRow[] = [
  {
    name: 'topColor',
    type: 'string',
    default: "'#48FF28'",
    description: 'Hex color string for the top gradient color of the light pillar.'
  },
  {
    name: 'bottomColor',
    type: 'string',
    default: "'#9EF19E'",
    description: 'Hex color string for the bottom gradient color of the light pillar.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '1.0',
    description: 'Controls the overall brightness and intensity of the effect.'
  },
  {
    name: 'rotationSpeed',
    type: 'number',
    default: '0.3',
    description: 'Speed multiplier for the pillar rotation animation.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'false',
    description: 'Enable mouse interaction to control the pillar rotation.'
  },
  {
    name: 'glowAmount',
    type: 'number',
    default: '0.005',
    description: 'Controls the glow intensity and spread of the light effect.'
  },
  {
    name: 'pillarWidth',
    type: 'number',
    default: '3.0',
    description: 'Width/radius of the light pillar.'
  },
  {
    name: 'pillarHeight',
    type: 'number',
    default: '0.4',
    description: 'Height scaling factor for the pillar distortion.'
  },
  {
    name: 'noiseIntensity',
    type: 'number',
    default: '0.5',
    description: 'Intensity of the film grain noise postprocessing effect.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS class names to apply to the container element.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: "'screen'",
    description: 'CSS mix-blend-mode property to control how the component blends with its background.'
  },
  {
    name: 'pillarRotation',
    type: 'number',
    default: '0',
    description: 'Rotation angle of the pillar in degrees (0-360).'
  },
  {
    name: 'quality',
    type: "'low' | 'medium' | 'high'",
    default: "'high'",
    description:
      'Rendering quality level. Lower settings improve performance on mobile devices. Mobile devices automatically downgrade from high to medium.'
  }
];
</script>
