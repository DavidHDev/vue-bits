<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
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

      <Customize>
        <div class="flex items-center gap-4 mt-4">
          <PreviewColor title="Color 1" v-model="color1" />
          <PreviewColor title="Color 2" v-model="color2" />
        </div>

        <PreviewSlider title="Speed" :min="0.1" :max="5" :step="0.1" v-model="speed" />
        <PreviewSlider title="Scale" :min="0.1" :max="3" :step="0.1" v-model="scale" />
        <PreviewSlider title="Brightness" :min="1" :max="30" :step="1" v-model="brightness" />
        <PreviewSlider title="Noise Frequency" :min="1" :max="36" :step="1" v-model="noiseFrequency" />
        <PreviewSlider title="Noise Amplitude" :min="0.01" :max="0.3" :step="0.01" v-model="noiseAmplitude" />
        <PreviewSlider title="Band Height" :min="0.01" :max="0.2" :step="0.01" v-model="bandHeight" />
        <PreviewSlider title="Band Spread" :min="0.1" :max="5" :step="0.1" v-model="bandSpread" />
        <PreviewSlider title="Octave Decay" :min="1" :max="20" :step="1" v-model="octaveDecay" />
        <PreviewSlider title="Layer Offset" :min="1" :max="6" :step="1" v-model="layerOffset" />
        <PreviewSlider title="Color Speed" :min="0.1" :max="3" :step="0.1" v-model="colorSpeed" />
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

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="radar" />
    </template>

    <template #cli>
      <CliInstallation :command="radar.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { radar } from '@/constants/code/Backgrounds/radarCode';
import SoftAurora from '@/content/Backgrounds/SoftAurora/SoftAurora.vue';
import { ref } from 'vue';

const speed = ref(0.6);
const scale = ref(1.5);
const brightness = ref(1.0);
const color1 = ref('#f7f7f7');
const color2 = ref('#27FF64');
const noiseFrequency = ref(2.5);
const noiseAmplitude = ref(1.0);
const bandHeight = ref(0.5);
const bandSpread = ref(1.0);
const octaveDecay = ref(0.1);
const layerOffset = ref(0);
const colorSpeed = ref(1.0);
const enableMouseInteraction = ref(true);
const mouseInfluence = ref(0.25);

const propData = [
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
