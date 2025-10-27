<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <ColorBends
          :rotation="rotation"
          :auto-rotate="autoRotate"
          :speed="speed"
          :scale="scale"
          :frequency="frequency"
          :warp-strength="warpStrength"
          :mouse-influence="mouseInfluence"
          :parallax="parallax"
          :noise="noise"
          :colors="[color]"
        />

        <BackgroundContent pill-text="New Background" headline="You have the power to reshape your own destiny" />
      </div>

      <Customize>
        <PreviewColor v-model="color" title="Single Color" />
        <PreviewSlider :min="-180" :max="180" :step="1" v-model="rotation" title="Rotation (deg)" />
        <PreviewSlider :min="-5" :max="5" :step="1" v-model="autoRotate" title="Auto Rotate (deg/s)" />
        <PreviewSlider :min="0" :max="1" :step="0.01" v-model="speed" title="Speed" />
        <PreviewSlider :min="0.2" :max="5" :step="0.1" v-model="scale" title="Scale" />
        <PreviewSlider :min="0" :max="5" :step="0.1" v-model="frequency" title="Frequency" />
        <PreviewSlider :min="0" :max="1" :step="0.05" v-model="warpStrength" title="Warp Strength" />
        <PreviewSlider :min="0" :max="2" :step="0.05" v-model="mouseInfluence" title="Mouse Influence" />
        <PreviewSlider :min="0" :max="2" :step="0.05" v-model="parallax" title="Parallax" />
        <PreviewSlider :min="0" :max="1" :step="0.01" v-model="noise" title="Noise" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="colorBends" />
    </template>

    <template #cli>
      <CliInstallation :command="colorBends.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { colorBends } from '@/constants/code/Backgrounds/colorBendsCode';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import ColorBends from '../../content/Backgrounds/ColorBends/ColorBends.vue';

const rotation = ref(0);
const autoRotate = ref(0);
const speed = ref(0.2);
const scale = ref(1);
const frequency = ref(1);
const warpStrength = ref(1);
const mouseInfluence = ref(1);
const parallax = ref(0.5);
const noise = ref(0.1);
const color = ref('');

const propData = [
  { name: 'rotation', type: 'number', default: '45', description: 'Base rotation angle in degrees.' },
  { name: 'autoRotate', type: 'number', default: '0', description: 'Automatic rotation speed in degrees/sec.' },
  { name: 'speed', type: 'number', default: '0.2', description: 'Animation time scale of the shader.' },
  {
    name: 'colors',
    type: 'string[]',
    default: '[]',
    description: 'Palette of up to 8 hex colors used to blend the bends.'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Whether the background is transparent (uses alpha).'
  },
  { name: 'scale', type: 'number', default: '1', description: 'Zoom factor of the pattern.' },
  { name: 'frequency', type: 'number', default: '1', description: 'Wave frequency used in the pattern.' },
  {
    name: 'warpStrength',
    type: 'number',
    default: '1',
    description: 'Amount of warping/distortion applied to waves.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '1',
    description: 'How strongly the waves react to pointer movement.'
  },
  { name: 'parallax', type: 'number', default: '0.5', description: 'Parallax factor shifting content with pointer.' },
  { name: 'noise', type: 'number', default: '0.1', description: 'Adds subtle grain. 0 disables noise.' },
  { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes for the container.' },
  { name: 'style', type: 'CSSProperties', default: '{}', description: 'Inline styles for the container.' }
];
</script>
