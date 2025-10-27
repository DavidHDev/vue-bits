<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative w-full h-[600px] overflow-hidden demo-container">
        <GhostCursor
          :trail-length="trailLength"
          :inertia="inertia"
          :grain-intensity="grainIntensity"
          :bloom-strength="bloomStrength"
          :bloom-radius="bloomRadius"
          :bloom-threshold="bloomThreshold"
          :brightness="brightness"
          :color="color"
          :fade-delay-ms="fadeDelayMs"
          :fade-duration-ms="fadeDurationMs"
        />

        <h3 class="z-11 absolute font-black text-[#060000] text-[clamp(3rem,8vw,8rem)] select-none">Boo!</h3>
      </div>

      <Customize>
        <PreviewColor title="Color" v-model="color" />
        <PreviewSlider title="Trail Length" :min="10" :max="50" :step="5" v-model="trailLength" />
        <PreviewSlider title="Inertia" :min="0" :max="0.99" :step="0.01" v-model="inertia" />
        <PreviewSlider title="Grain Intensity" :min="0" :max="0.5" :step="0.01" v-model="grainIntensity" />
        <PreviewSlider title="Bloom Strength" :min="0" :max="10" :step="0.05" v-model="bloomStrength" />
        <PreviewSlider title="Bloom Radius" :min="0" :max="10" :step="0.05" v-model="bloomRadius" />
        <PreviewSlider title="Bloom Threshold" :min="0" :max="1" :step="0.01" v-model="bloomThreshold" />
        <PreviewSlider title="Brightness" :min="0" :max="10" :step="0.1" v-model="brightness" />
        <PreviewSlider title="Fade Delay (ms)" :min="0" :max="3000" :step="100" v-model="fadeDelayMs" />
        <PreviewSlider title="Fade Duration (ms)" :min="100" :max="5000" :step="100" v-model="fadeDurationMs" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="ghostCursor" />
    </template>

    <template #cli>
      <CliInstallation :command="ghostCursor.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ghostCursor } from '@/constants/code/Animations/ghostCursorCode';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import GhostCursor from '../../content/Animations/GhostCursor/GhostCursor.vue';

const trailLength = ref(50);
const inertia = ref(0.5);
const grainIntensity = ref(0.05);
const bloomStrength = ref(0.1);
const bloomRadius = ref(1.0);
const bloomThreshold = ref(0.025);
const brightness = ref(2);
const color = ref('#A0FFBC');
const fadeDelayMs = ref(1000);
const fadeDurationMs = ref(1500);

const propData = [
  { name: 'className', type: 'string', default: "''", description: 'Additional CSS class names for the container.' },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles for the container element.'
  },
  {
    name: 'trailLength',
    type: 'number',
    default: '50',
    description: 'Number of points stored for the cursor trail (longer = longer smear).'
  },
  {
    name: 'inertia',
    type: 'number',
    default: '0.5',
    description: 'Velocity retention when the pointer stops. Higher values make the cursor glide longer.'
  },
  {
    name: 'grainIntensity',
    type: 'number',
    default: '0.05',
    description: 'Strength of the film grain post-processing pass.'
  },
  { name: 'bloomStrength', type: 'number', default: '0.1', description: 'UnrealBloom effect strength.' },
  {
    name: 'bloomRadius',
    type: 'number',
    default: '1.0',
    description: 'UnrealBloom radius controlling spread of glow.'
  },
  {
    name: 'bloomThreshold',
    type: 'number',
    default: '0.025',
    description: 'UnrealBloom threshold; lower includes more pixels in bloom.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '1',
    description: 'Final brightness multiplier applied to the effect color.'
  },
  { name: 'color', type: 'string', default: "'#A0FFBC'", description: 'Base color of the ghost cursor effect.' },
  {
    name: 'mixBlendMode',
    type: 'CSS mix-blend-mode',
    default: "'screen'",
    description: 'Blend mode used when compositing with page content.'
  },
  {
    name: 'edgeIntensity',
    type: 'number',
    default: '0',
    description: 'Darkening near edges of the canvas. 0 = none, 1 = strongest.'
  },
  {
    name: 'maxDevicePixelRatio',
    type: 'number',
    default: '0.5',
    description: 'Upper cap for devicePixelRatio to control render cost on high-DPR displays.'
  },
  {
    name: 'targetPixels',
    type: 'number',
    default: 'auto (~1.3e6 desktop, ~0.9e6 touch)',
    description: 'Pixel budget. Resolution is dynamically scaled to keep total pixel count under this budget.'
  },
  {
    name: 'fadeDelayMs',
    type: 'number',
    default: 'auto (1000 desktop, 500 touch)',
    description: 'Idle delay before the trail starts to fade after pointer leaves/stops.'
  },
  {
    name: 'fadeDurationMs',
    type: 'number',
    default: 'auto (1500 desktop, 1000 touch)',
    description: 'Duration of the trail fade-out once the delay has elapsed.'
  },
  {
    name: 'zIndex',
    type: 'number',
    default: '10',
    description: 'z-index applied to the canvas for layering above/below content.'
  }
];
</script>

<style scoped>
.demo-container {
  padding: 0;
}
</style>
