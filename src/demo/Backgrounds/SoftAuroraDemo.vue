<template>
  <h1 class="sub-category">Soft Aurora</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="softAurora.usage"
    :source="softAuroraSource"
    component-name="SoftAurora"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <SoftAurora
          :speed="speed"
          :scale="scale"
          :brightness="brightness"
          :color1="color1"
          :color2="color2"
          :noise-frequency="noiseFrequency"
          :noise-amplitude="noiseAmplitude"
          :band-height="bandHeight"
          :band-spread="bandSpread"
          :octave-decay="octaveDecay"
          :layer-offset="layerOffset"
          :color-speed="colorSpeed"
          :enable-mouse-interaction="enableMouseInteraction"
          :mouse-influence="mouseInfluence"
        />
        <BackgroundContent pill-text="New Background" headline="A gentle glow to light your way!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewSlider title="Speed" :min="0.1" :max="5" :step="0.1" v-model="speed" />
        <PreviewSlider title="Scale" :min="0.1" :max="3" :step="0.1" v-model="scale" />
        <PreviewSlider title="Brightness" :min="0.1" :max="3" :step="0.1" v-model="brightness" />
        <PreviewSlider title="Noise Frequency" :min="0.5" :max="10" :step="0.5" v-model="noiseFrequency" />
        <PreviewSlider title="Noise Amplitude" :min="0.5" :max="10" :step="0.5" v-model="noiseAmplitude" />
        <PreviewSlider title="Band Height" :min="0" :max="1" :step="0.05" v-model="bandHeight" />
        <PreviewSlider title="Band Spread" :min="0.1" :max="3" :step="0.1" v-model="bandSpread" />
        <PreviewSlider title="Octave Decay" :min="0.01" :max="0.5" :step="0.01" v-model="octaveDecay" />
        <PreviewSlider title="Layer Offset" :min="0" :max="1" :step="0.05" v-model="layerOffset" />
        <PreviewSlider title="Color Speed" :min="0.1" :max="5" :step="0.1" v-model="colorSpeed" />
        <PreviewSwitch title="Mouse Interaction" v-model="enableMouseInteraction" />
        <PreviewSlider
          v-if="enableMouseInteraction"
          title="Mouse Influence"
          :min="0.1"
          :max="1"
          :step="0.05"
          v-model="mouseInfluence"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="soft-aurora" :usage="softAurora.usage!" :source="softAuroraSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { softAurora } from '@/constants/code/Backgrounds/softAuroraCode';
import SoftAurora from '@/content/Backgrounds/SoftAurora/SoftAurora.vue';
import softAuroraSource from '@/content/Backgrounds/SoftAurora/SoftAurora.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 0.6,
  scale: 1.5,
  brightness: 1.0,
  color1: '#f7f7f7',
  color2: '#27FF64',
  noiseFrequency: 2.5,
  noiseAmplitude: 1.0,
  bandHeight: 0.5,
  bandSpread: 1.0,
  octaveDecay: 0.1,
  layerOffset: 0,
  colorSpeed: 1.0,
  enableMouseInteraction: true,
  mouseInfluence: 0.25
};

const speed = ref(DEFAULTS.speed);
const scale = ref(DEFAULTS.scale);
const brightness = ref(DEFAULTS.brightness);
const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const noiseFrequency = ref(DEFAULTS.noiseFrequency);
const noiseAmplitude = ref(DEFAULTS.noiseAmplitude);
const bandHeight = ref(DEFAULTS.bandHeight);
const bandSpread = ref(DEFAULTS.bandSpread);
const octaveDecay = ref(DEFAULTS.octaveDecay);
const layerOffset = ref(DEFAULTS.layerOffset);
const colorSpeed = ref(DEFAULTS.colorSpeed);
const enableMouseInteraction = ref(DEFAULTS.enableMouseInteraction);
const mouseInfluence = ref(DEFAULTS.mouseInfluence);

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    scale.value !== DEFAULTS.scale ||
    brightness.value !== DEFAULTS.brightness ||
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    noiseFrequency.value !== DEFAULTS.noiseFrequency ||
    noiseAmplitude.value !== DEFAULTS.noiseAmplitude ||
    bandHeight.value !== DEFAULTS.bandHeight ||
    bandSpread.value !== DEFAULTS.bandSpread ||
    octaveDecay.value !== DEFAULTS.octaveDecay ||
    layerOffset.value !== DEFAULTS.layerOffset ||
    colorSpeed.value !== DEFAULTS.colorSpeed ||
    enableMouseInteraction.value !== DEFAULTS.enableMouseInteraction ||
    mouseInfluence.value !== DEFAULTS.mouseInfluence
);

function reset() {
  speed.value = DEFAULTS.speed;
  scale.value = DEFAULTS.scale;
  brightness.value = DEFAULTS.brightness;
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  noiseFrequency.value = DEFAULTS.noiseFrequency;
  noiseAmplitude.value = DEFAULTS.noiseAmplitude;
  bandHeight.value = DEFAULTS.bandHeight;
  bandSpread.value = DEFAULTS.bandSpread;
  octaveDecay.value = DEFAULTS.octaveDecay;
  layerOffset.value = DEFAULTS.layerOffset;
  colorSpeed.value = DEFAULTS.colorSpeed;
  enableMouseInteraction.value = DEFAULTS.enableMouseInteraction;
  mouseInfluence.value = DEFAULTS.mouseInfluence;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'speed', type: 'number', default: '0.6', description: 'Overall animation speed multiplier.' },
  { name: 'scale', type: 'number', default: '1.5', description: 'Scale of the noise pattern.' },
  { name: 'brightness', type: 'number', default: '1.0', description: 'Overall brightness multiplier.' },
  { name: 'color1', type: 'string', default: '"#f7f7f7"', description: 'Tint color for the first aurora layer.' },
  { name: 'color2', type: 'string', default: '"#27FF64"', description: 'Tint color for the second aurora layer.' },
  { name: 'noiseFrequency', type: 'number', default: '2.5', description: 'Base frequency of the Perlin noise.' },
  { name: 'noiseAmplitude', type: 'number', default: '1.0', description: 'Base amplitude of the Perlin noise.' },
  { name: 'bandHeight', type: 'number', default: '0.5', description: 'Vertical position of the aurora band (0-1).' },
  { name: 'bandSpread', type: 'number', default: '1.0', description: 'Vertical spread of the aurora glow.' },
  { name: 'octaveDecay', type: 'number', default: '0.1', description: 'Amplitude decay per noise octave.' },
  { name: 'layerOffset', type: 'number', default: '0', description: 'Time offset between the two aurora layers.' },
  { name: 'colorSpeed', type: 'number', default: '1.0', description: 'Speed of palette color shifting.' },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enable cursor-reactive aurora offset.'
  },
  { name: 'mouseInfluence', type: 'number', default: '0.25', description: 'Strength of the mouse offset effect.' }
];
</script>
