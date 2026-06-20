<template>
  <h1 class="sub-category">Magic Bento</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="magicBento.usage"
    :source="magicBentoSource"
    component-name="MagicBento"
    :props-table="props"
  >
    <template #preview>
      <div class="py-8 overflow-hidden demo-container">
        <MagicBento
          :enable-stars="enableStars"
          :enable-spotlight="enableSpotlight"
          :disable-animations="disableAnimations"
          :spotlight-radius="spotlightRadius"
          :enable-tilt="enableTilt"
          :click-effect="clickEffect"
          :enable-magnetism="enableMagnetism"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Spotlight Radius" v-model="spotlightRadius" :min="50" :max="800" :step="10" />
        <PreviewSwitch title="Stars Effect" v-model="enableStars" />
        <PreviewSwitch title="Spotlight Effect" v-model="enableSpotlight" />
        <PreviewSwitch title="Tilt Effect" v-model="enableTilt" />
        <PreviewSwitch title="Click Effect" v-model="clickEffect" />
        <PreviewSwitch title="Magnetism" v-model="enableMagnetism" />
        <PreviewSwitch title="Disable All Animations" v-model="disableAnimations" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="magic-bento" :usage="magicBento.usage!" :source="magicBentoSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { magicBento } from '@/constants/code/Components/magicBentoCode';
import MagicBento from '@/content/Components/MagicBento/MagicBento.vue';
import magicBentoSource from '@/content/Components/MagicBento/MagicBento.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  enableStars: true,
  enableSpotlight: true,
  disableAnimations: false,
  spotlightRadius: 400,
  enableTilt: false,
  clickEffect: true,
  enableMagnetism: false
};

const enableStars = ref(DEFAULTS.enableStars);
const enableSpotlight = ref(DEFAULTS.enableSpotlight);
const disableAnimations = ref(DEFAULTS.disableAnimations);
const spotlightRadius = ref(DEFAULTS.spotlightRadius);
const enableTilt = ref(DEFAULTS.enableTilt);
const clickEffect = ref(DEFAULTS.clickEffect);
const enableMagnetism = ref(DEFAULTS.enableMagnetism);

const hasChanges = computed(
  () =>
    enableStars.value !== DEFAULTS.enableStars ||
    enableSpotlight.value !== DEFAULTS.enableSpotlight ||
    disableAnimations.value !== DEFAULTS.disableAnimations ||
    spotlightRadius.value !== DEFAULTS.spotlightRadius ||
    enableTilt.value !== DEFAULTS.enableTilt ||
    clickEffect.value !== DEFAULTS.clickEffect ||
    enableMagnetism.value !== DEFAULTS.enableMagnetism
);

function reset() {
  enableStars.value = DEFAULTS.enableStars;
  enableSpotlight.value = DEFAULTS.enableSpotlight;
  disableAnimations.value = DEFAULTS.disableAnimations;
  spotlightRadius.value = DEFAULTS.spotlightRadius;
  enableTilt.value = DEFAULTS.enableTilt;
  clickEffect.value = DEFAULTS.clickEffect;
  enableMagnetism.value = DEFAULTS.enableMagnetism;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'textAutoHide',
    type: 'boolean',
    default: 'true',
    description: 'Whether text content should auto-hide on hover'
  },
  {
    name: 'enableStars',
    type: 'boolean',
    default: 'true',
    description: 'Enable particle star animation effect'
  },
  {
    name: 'enableSpotlight',
    type: 'boolean',
    default: 'true',
    description: 'Enable spotlight cursor following effect'
  },
  {
    name: 'enableBorderGlow',
    type: 'boolean',
    default: 'true',
    description: 'Enable border glow effect that follows cursor'
  },
  {
    name: 'disableAnimations',
    type: 'boolean',
    default: 'false',
    description: 'Disable all animations (automatically enabled on mobile)'
  },
  {
    name: 'spotlightRadius',
    type: 'number',
    default: '300',
    description: 'Radius of the spotlight effect in pixels'
  },
  {
    name: 'particleCount',
    type: 'number',
    default: '12',
    description: 'Number of particles in the star animation'
  },
  {
    name: 'enableTilt',
    type: 'boolean',
    default: 'false',
    description: 'Enable 3D tilt effect on card hover'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: '"77, 254, 6"',
    description: 'RGB color values for glow effects (without rgba wrapper)'
  },
  {
    name: 'clickEffect',
    type: 'boolean',
    default: 'true',
    description: 'Enable ripple effect on card click'
  },
  {
    name: 'enableMagnetism',
    type: 'boolean',
    default: 'true',
    description: 'Enable subtle card attraction to cursor'
  }
];
</script>
