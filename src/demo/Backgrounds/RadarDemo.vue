<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <Radar
          :speed="speed"
          :scale="scale"
          :ring-count="ringCount"
          :spoke-count="spokeCount"
          :ring-thickness="ringThickness"
          :spoke-thickness="spokeThickness"
          :sweep-speed="sweepSpeed"
          :sweep-width="sweepWidth"
          :sweep-lobes="sweepLobes"
          :color="color"
          :background-color="backgroundColor"
          :falloff="falloff"
          :brightness="brightness"
          :enable-mouse-interaction="enableMouseInteraction"
          :mouse-influence="mouseInfluence"
        />

        <BackgroundContent pill-text="New Background" headline="Scan the horizon of your imagination!" />
      </div>

      <Customize>
        <div class="flex items-center gap-4 mt-4">
          <PreviewColor title="Color" v-model="color" />
          <PreviewColor title="Background" v-model="backgroundColor" />
        </div>

        <PreviewSlider title="Speed" :min="0.1" :max="5" :step="0.1" v-model="speed" />
        <PreviewSlider title="Scale" :min="0.1" :max="3" :step="0.1" v-model="scale" />
        <PreviewSlider title="Ring Count" :min="1" :max="30" :step="1" v-model="ringCount" />
        <PreviewSlider title="Spoke Count" :min="1" :max="36" :step="1" v-model="spokeCount" />
        <PreviewSlider title="Ring Thickness" :min="0.01" :max="0.3" :step="0.01" v-model="ringThickness" />
        <PreviewSlider title="Spoke Thickness" :min="0.01" :max="0.2" :step="0.01" v-model="spokeThickness" />
        <PreviewSlider title="Sweep Speed" :min="0.1" :max="5" :step="0.1" v-model="sweepSpeed" />
        <PreviewSlider title="Sweep Width" :min="1" :max="20" :step="1" v-model="sweepWidth" />
        <PreviewSlider title="Sweep Lobes" :min="1" :max="6" :step="1" v-model="sweepLobes" />
        <PreviewSlider title="Falloff" :min="0.1" :max="3" :step="0.1" v-model="falloff" />
        <PreviewSlider title="Brightness" :min="0.1" :max="3" :step="0.1" v-model="brightness" />
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
import Radar from '@/content/Backgrounds/Radar/Radar.vue';
import { ref } from 'vue';

const speed = ref(1.0);
const scale = ref(0.5);
const ringCount = ref(10.0);
const spokeCount = ref(10.0);
const ringThickness = ref(0.05);
const spokeThickness = ref(0.01);
const sweepSpeed = ref(1.0);
const sweepWidth = ref(2.0);
const sweepLobes = ref(1.0);
const color = ref('#27FF64');
const backgroundColor = ref('#000000');
const falloff = ref(2.0);
const brightness = ref(1.0);
const enableMouseInteraction = ref(true);
const mouseInfluence = ref(0.1);

const propData = [
  {
    name: 'speed',
    type: 'number',
    default: '1.0',
    description: 'Overall animation speed multiplier.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '0.5',
    description: 'Zoom level of the radar pattern.'
  },
  {
    name: 'ringCount',
    type: 'number',
    default: '10.0',
    description: 'Number of concentric rings.'
  },
  {
    name: 'spokeCount',
    type: 'number',
    default: '10.0',
    description: 'Number of radial spoke lines.'
  },
  {
    name: 'ringThickness',
    type: 'number',
    default: '0.05',
    description: 'Thickness of the concentric ring lines.'
  },
  {
    name: 'spokeThickness',
    type: 'number',
    default: '0.01',
    description: 'Thickness of the radial spoke lines.'
  },
  {
    name: 'sweepSpeed',
    type: 'number',
    default: '1.0',
    description: 'Rotation speed of the sweep beam.'
  },
  {
    name: 'sweepWidth',
    type: 'number',
    default: '2.0',
    description: 'Width of the sweep trail (higher = thinner).'
  },
  {
    name: 'sweepLobes',
    type: 'number',
    default: '1.0',
    description: 'Number of sweep beams around the radar.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"#27FF64"',
    description: 'Primary radar color in HEX format.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '"#000000"',
    description: 'Background color in HEX format.'
  },
  {
    name: 'falloff',
    type: 'number',
    default: '2.0',
    description: 'Edge fade intensity based on distance from center.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '1.0',
    description: 'Overall brightness multiplier.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enable cursor-reactive center offset.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '0.1',
    description: 'Strength of the mouse offset effect.'
  }
];
</script>
