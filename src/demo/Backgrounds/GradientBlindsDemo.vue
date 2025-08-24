<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <GradientBlinds
          :gradient-colors="gradientColors"
          :angle="angle"
          :noise="noise"
          :blind-count="blindCount"
          :blind-min-width="blindMinWidth"
          :spotlight-radius="spotlightRadius"
          :distort-amount="distortAmount"
          :mouse-dampening="mouseDampening"
          :shine-direction="shineDirection"
        />

        <BackgroundContent pill-text="New Background" headline="Smooth gradients make everything better" />
      </div>

      <Customize>
        <PreviewColor title="Color 1" v-model="color1" />
        <PreviewColor title="Color 2" v-model="color2" />
        <PreviewSelect title="Light Direction" v-model="shineDirection" :options="directionOptions" />
        <PreviewSlider title="Blinds Angle" :min="0" :max="360" :step="1" v-model="angle" />
        <PreviewSlider title="Noise Amount" :min="0" :max="1" :step="0.01" v-model="noise" />
        <PreviewSlider title="Blinds Count" :min="1" :max="64" :step="1" v-model="blindCount" />
        <PreviewSlider title="Min Blind W" :min="10" :max="200" :step="5" v-model="blindMinWidth" />
        <PreviewSlider title="Spot Radius" :min="0.05" :max="1" :step="0.05" v-model="spotlightRadius" />
        <PreviewSlider title="Distort" :min="0" :max="100" :step="1" v-model="distortAmount" />
        <PreviewSlider title="Mouse Damp" :min="0" :max="1" :step="0.01" v-model="mouseDampening" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="gradientBlinds" />
    </template>

    <template #cli>
      <CliInstallation :command="gradientBlinds.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { gradientBlinds } from '@/constants/code/Backgrounds/gradientBlindsCode';
import { computed, ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import GradientBlinds from '../../content/Backgrounds/GradientBlinds/GradientBlinds.vue';

type DirectionKey = 'left' | 'right';

const directionOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' }
];

const color1 = ref('#1EA03F');
const color2 = ref('#182FFF');
const angle = ref(20);
const noise = ref(0.5);
const blindCount = ref(16);
const blindMinWidth = ref(60);
const spotlightRadius = ref(0.5);
const distortAmount = ref(0);
const mouseDampening = ref(0.15);
const shineDirection = ref<DirectionKey>('left');

const gradientColors = computed(() => [color1.value, color2.value]);

const propData = [
  {
    name: 'gradientColors',
    type: 'string[]',
    default: "['#1EA03F', '#182FFF']",
    description:
      'Array of hex colors (up to 8) forming the animated gradient. If one color is provided it is duplicated.'
  },
  {
    name: 'angle',
    type: 'number',
    default: '0',
    description: 'Rotation of the gradient in degrees (0 = horizontal left→right).'
  },
  {
    name: 'noise',
    type: 'number',
    default: '0.3',
    description: 'Strength of per‑pixel noise added to the final color (0 = clean).'
  },
  {
    name: 'blindCount',
    type: 'number',
    default: '16',
    description: 'Target number of vertical blinds. Acts as an upper bound when blindMinWidth is set.'
  },
  {
    name: 'blindMinWidth',
    type: 'number',
    default: '60',
    description: 'Minimum pixel width for each blind. Reduces effective blindCount if necessary to satisfy this width.'
  },
  {
    name: 'mouseDampening',
    type: 'number',
    default: '0.15',
    description: 'Easing time constant (seconds) for the spotlight to follow the cursor. 0 = immediate.'
  },
  {
    name: 'mirrorGradient',
    type: 'boolean',
    default: 'false',
    description: 'Creates a mirrored ping‑pong gradient progression instead of a linear wrap.'
  },
  {
    name: 'spotlightRadius',
    type: 'number',
    default: '0.5',
    description: 'Normalized spotlight radius relative to the shorter canvas dimension.'
  },
  {
    name: 'spotlightSoftness',
    type: 'number',
    default: '1',
    description: 'Falloff exponent for spotlight edge. Higher = sharper edge (values >1 increase contrast).'
  },
  {
    name: 'spotlightOpacity',
    type: 'number',
    default: '1',
    description: 'Overall intensity multiplier for the spotlight highlight.'
  },
  {
    name: 'distortAmount',
    type: 'number',
    default: '0',
    description: 'Sin/cos warp intensity applied to UVs for subtle wavy distortion.'
  },
  {
    name: 'shineDirection',
    type: "'left' | 'right'",
    default: 'left',
    description: 'Flips the bright side of each blind; useful for composition with other elements.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: "'lighten'",
    description: "CSS mix-blend-mode applied to the canvas (e.g. 'screen', 'overlay', 'multiply')."
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'If true, stops rendering updates (freezing the current frame).'
  },
  {
    name: 'dpr',
    type: 'number',
    default: 'window.devicePixelRatio',
    description: 'Overrides device pixel ratio; lower for performance, higher for sharpness.'
  },
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Additional class names for the root container.'
  }
];
</script>

<style scoped>
.demo-container {
  padding: 0;
}
</style>
