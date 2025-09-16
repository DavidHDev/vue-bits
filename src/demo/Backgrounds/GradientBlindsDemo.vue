<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container">
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
          :mirror-gradient="mirrorGradient"
          :spotlight-softness="spotlightSoftness"
          :spotlight-opacity="spotlightOpacity"
          :mix-blend-mode="mixBlendMode"
          :paused="paused"
          class="w-full"
        />
        <BackgroundContent pillText="New Background" headline="Smooth gradients make everything better" />
      </div>

      <Customize>
        <div class="flex gap-2 mb-4">
          <PreviewColor
            v-for="(_, index) in gradientColors"
            :key="index"
            :title="`Color ${index + 1}`"
            v-model="gradientColors[index]"
          />
          <button
            v-if="gradientColors.length < 8"
            @click="addColor"
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Color
          </button>
          <button
            v-if="gradientColors.length > 2"
            @click="removeColor"
            class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove Color
          </button>
        </div>

        <PreviewSelect
          title="Light Direction"
          v-model="shineDirection"
          :options="[
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' }
          ]"
        />

        <PreviewSelect
          title="Mix Blend Mode"
          v-model="mixBlendMode"
          :options="[
            { label: 'Lighten', value: 'lighten' },
            { label: 'Screen', value: 'screen' },
            { label: 'Overlay', value: 'overlay' },
            { label: 'Multiply', value: 'multiply' },
            { label: 'Normal', value: 'normal' }
          ]"
        />

        <PreviewSlider title="Blinds Angle" v-model="angle" :min="0" :max="360" :step="1" />
        <PreviewSlider title="Noise Amount" v-model="noise" :min="0" :max="1" :step="0.01" />
        <PreviewSlider title="Blinds Count" v-model="blindCount" :min="1" :max="64" :step="1" />
        <PreviewSlider title="Min Blind Width" v-model="blindMinWidth" :min="10" :max="200" :step="5" />
        <PreviewSlider title="Spotlight Radius" v-model="spotlightRadius" :min="0.05" :max="1" :step="0.05" />
        <PreviewSlider title="Spotlight Softness" v-model="spotlightSoftness" :min="0.1" :max="3" :step="0.1" />
        <PreviewSlider title="Spotlight Opacity" v-model="spotlightOpacity" :min="0" :max="2" :step="0.1" />
        <PreviewSlider title="Distort Amount" v-model="distortAmount" :min="0" :max="100" :step="1" />
        <PreviewSlider title="Mouse Dampening" v-model="mouseDampening" :min="0" :max="1" :step="0.01" />

        <div class="flex items-center gap-4 mt-4">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="mirrorGradient" />
            <span class="text-sm">Mirror Gradient</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="paused" />
            <span class="text-sm">Paused</span>
          </label>
        </div>
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
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import { gradientBlinds } from '@/constants/code/Backgrounds/gradientBlindsCode';
import GradientBlinds from '@/content/Backgrounds/GradientBlinds/GradientBlinds.vue';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';

// Reactive state
const gradientColors = ref(['#FF9FFC', '#5227FF']);
const angle = ref(20);
const noise = ref(0.5);
const blindCount = ref(16);
const blindMinWidth = ref(60);
const spotlightRadius = ref(0.5);
const spotlightSoftness = ref(1);
const spotlightOpacity = ref(1);
const distortAmount = ref(0);
const mouseDampening = ref(0.15);
const shineDirection = ref<'left' | 'right'>('left');
const mixBlendMode = ref('lighten');
const mirrorGradient = ref(false);
const paused = ref(false);

// Color management functions
const addColor = () => {
  if (gradientColors.value.length < 8) {
    gradientColors.value.push('#FF5733');
  }
};

const removeColor = () => {
  if (gradientColors.value.length > 2) {
    gradientColors.value.pop();
  }
};

const propData = [
  {
    name: 'gradientColors',
    type: 'string[]',
    default: "['#FF9FFC', '#5227FF']",
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
    description:
      'Minimum pixel width for each blind. Reduces effective blindCount if necessary to satisfy this width.'
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
    default: "'left'",
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
    default: '""',
    description: 'Additional class names for the root container.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles for the component.'
  }
];
</script>

<style scoped>
.demo-container {
  padding: 0;
}
</style>