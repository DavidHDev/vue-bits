<template>
  <h1 class="sub-category">Evil Eye</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="evilEye.usage"
    :source="evilEyeSource"
    component-name="EvilEye"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <EvilEye
          :eye-color="eyeColor"
          :intensity="intensity"
          :pupil-size="pupilSize"
          :iris-width="irisWidth"
          :glow-intensity="glowIntensity"
          :scale="scale"
          :noise-scale="noiseScale"
          :pupil-follow="pupilFollow"
          :flame-speed="flameSpeed"
          :background-color="backgroundColor"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Eye Color" v-model="eyeColor" />
        <PreviewColorPicker title="Background" v-model="backgroundColor" />
        <PreviewSlider title="Intensity" :min="0.5" :max="5" :step="0.1" v-model="intensity" />
        <PreviewSlider title="Pupil Size" :min="0.1" :max="2" :step="0.05" v-model="pupilSize" />
        <PreviewSlider title="Iris Width" :min="0.1" :max="0.8" :step="0.05" v-model="irisWidth" />
        <PreviewSlider title="Glow Intensity" :min="0" :max="1.5" :step="0.05" v-model="glowIntensity" />
        <PreviewSlider title="Scale" :min="0.2" :max="3" :step="0.1" v-model="scale" />
        <PreviewSlider title="Noise Scale" :min="0.1" :max="3" :step="0.1" v-model="noiseScale" />
        <PreviewSlider title="Pupil Follow" :min="0" :max="2" :step="0.1" v-model="pupilFollow" />
        <PreviewSlider title="Flame Speed" :min="0.1" :max="5" :step="0.1" v-model="flameSpeed" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="evil-eye" :usage="evilEye.usage!" :source="evilEyeSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { evilEye } from '@/constants/code/Backgrounds/evilEyeCode';
import EvilEye from '@/content/Backgrounds/EvilEye/EvilEye.vue';
import evilEyeSource from '@/content/Backgrounds/EvilEye/EvilEye.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  eyeColor: '#FF6F37',
  intensity: 1.5,
  pupilSize: 0.6,
  irisWidth: 0.25,
  glowIntensity: 0.35,
  scale: 0.8,
  noiseScale: 1.0,
  pupilFollow: 1.0,
  flameSpeed: 1.0,
  backgroundColor: '#060010'
};

const eyeColor = ref(DEFAULTS.eyeColor);
const intensity = ref(DEFAULTS.intensity);
const pupilSize = ref(DEFAULTS.pupilSize);
const irisWidth = ref(DEFAULTS.irisWidth);
const glowIntensity = ref(DEFAULTS.glowIntensity);
const scale = ref(DEFAULTS.scale);
const noiseScale = ref(DEFAULTS.noiseScale);
const pupilFollow = ref(DEFAULTS.pupilFollow);
const flameSpeed = ref(DEFAULTS.flameSpeed);
const backgroundColor = ref(DEFAULTS.backgroundColor);

const hasChanges = computed(
  () =>
    eyeColor.value !== DEFAULTS.eyeColor ||
    intensity.value !== DEFAULTS.intensity ||
    pupilSize.value !== DEFAULTS.pupilSize ||
    irisWidth.value !== DEFAULTS.irisWidth ||
    glowIntensity.value !== DEFAULTS.glowIntensity ||
    scale.value !== DEFAULTS.scale ||
    noiseScale.value !== DEFAULTS.noiseScale ||
    pupilFollow.value !== DEFAULTS.pupilFollow ||
    flameSpeed.value !== DEFAULTS.flameSpeed ||
    backgroundColor.value !== DEFAULTS.backgroundColor
);

function reset() {
  eyeColor.value = DEFAULTS.eyeColor;
  intensity.value = DEFAULTS.intensity;
  pupilSize.value = DEFAULTS.pupilSize;
  irisWidth.value = DEFAULTS.irisWidth;
  glowIntensity.value = DEFAULTS.glowIntensity;
  scale.value = DEFAULTS.scale;
  noiseScale.value = DEFAULTS.noiseScale;
  pupilFollow.value = DEFAULTS.pupilFollow;
  flameSpeed.value = DEFAULTS.flameSpeed;
  backgroundColor.value = DEFAULTS.backgroundColor;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'eyeColor',
    type: 'string',
    default: '"#FF6F37"',
    description: 'Primary eye color in HEX format.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '1.5',
    description: 'Brightness / HDR intensity of the eye color.'
  },
  {
    name: 'pupilSize',
    type: 'number',
    default: '0.6',
    description: 'Size and darkness of the pupil slit.'
  },
  {
    name: 'irisWidth',
    type: 'number',
    default: '0.25',
    description: 'Width of the main iris ring.'
  },
  {
    name: 'glowIntensity',
    type: 'number',
    default: '0.35',
    description: 'Strength of the outer eye glow.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '0.8',
    description: 'Zoom level of the eye. Values > 1 zoom in, < 1 zoom out.'
  },
  {
    name: 'noiseScale',
    type: 'number',
    default: '1.0',
    description: 'Scale of the fire/noise texture sampling.'
  },
  {
    name: 'pupilFollow',
    type: 'number',
    default: '1.0',
    description: 'Intensity of pupil cursor tracking. 0 disables it.'
  },
  {
    name: 'flameSpeed',
    type: 'number',
    default: '1.0',
    description: 'Independent flame flicker animation speed.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '"#000000"',
    description: 'Background color in HEX format.'
  }
];
</script>
