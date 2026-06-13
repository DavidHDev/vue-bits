<template>
  <h1 class="sub-category">Gradient Blinds</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="gradientBlinds.usage"
    :source="gradientBlindsSource"
    component-name="Gradient Blinds"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
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
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewSelect title="Light Direction" v-model="shineDirection" :options="['left', 'right']" />
        <PreviewSlider title="Blinds Angle" :min="0" :max="360" :step="1" v-model="angle" />
        <PreviewSlider title="Noise Amount" :min="0" :max="1" :step="0.01" v-model="noise" />
        <PreviewSlider title="Blinds Count" :min="1" :max="64" :step="1" v-model="blindCount" />
        <PreviewSlider title="Min Blind W" :min="10" :max="200" :step="5" v-model="blindMinWidth" />
        <PreviewSlider title="Spot Radius" :min="0.05" :max="1" :step="0.05" v-model="spotlightRadius" />
        <PreviewSlider title="Distort" :min="0" :max="100" :step="1" v-model="distortAmount" />
        <PreviewSlider title="Mouse Damp" :min="0" :max="1" :step="0.01" v-model="mouseDampening" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="gradientblinds" :usage="gradientBlinds.usage!" :source="gradientBlindsSource" />
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
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { gradientBlinds } from '@/constants/code/Backgrounds/gradientBlindsCode';
import GradientBlinds from '@/content/Backgrounds/GradientBlinds/GradientBlinds.vue';
import gradientBlindsSource from '@/content/Backgrounds/GradientBlinds/GradientBlinds.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

type DirectionKey = 'left' | 'right';

const DEFAULTS = {
  color1: '#1EA03F',
  color2: '#182FFF',
  angle: 20,
  noise: 0.5,
  blindCount: 16,
  blindMinWidth: 60,
  spotlightRadius: 0.5,
  distortAmount: 0,
  mouseDampening: 0.15,
  shineDirection: 'left' as DirectionKey
};

const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const angle = ref(DEFAULTS.angle);
const noise = ref(DEFAULTS.noise);
const blindCount = ref(DEFAULTS.blindCount);
const blindMinWidth = ref(DEFAULTS.blindMinWidth);
const spotlightRadius = ref(DEFAULTS.spotlightRadius);
const distortAmount = ref(DEFAULTS.distortAmount);
const mouseDampening = ref(DEFAULTS.mouseDampening);
const shineDirection = ref<DirectionKey>(DEFAULTS.shineDirection);

const gradientColors = computed(() => [color1.value, color2.value]);

const hasChanges = computed(
  () =>
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    angle.value !== DEFAULTS.angle ||
    noise.value !== DEFAULTS.noise ||
    blindCount.value !== DEFAULTS.blindCount ||
    blindMinWidth.value !== DEFAULTS.blindMinWidth ||
    spotlightRadius.value !== DEFAULTS.spotlightRadius ||
    distortAmount.value !== DEFAULTS.distortAmount ||
    mouseDampening.value !== DEFAULTS.mouseDampening ||
    shineDirection.value !== DEFAULTS.shineDirection
);

function reset() {
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  angle.value = DEFAULTS.angle;
  noise.value = DEFAULTS.noise;
  blindCount.value = DEFAULTS.blindCount;
  blindMinWidth.value = DEFAULTS.blindMinWidth;
  spotlightRadius.value = DEFAULTS.spotlightRadius;
  distortAmount.value = DEFAULTS.distortAmount;
  mouseDampening.value = DEFAULTS.mouseDampening;
  shineDirection.value = DEFAULTS.shineDirection;
  forceRerender();
}

const props: PropRow[] = [
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
    description: 'Strength of per-pixel noise added to the final color (0 = clean).'
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
    description: 'Creates a mirrored ping-pong gradient progression instead of a linear wrap.'
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
