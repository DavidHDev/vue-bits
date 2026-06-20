<template>
  <h1 class="sub-category">Particles</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="particles.usage"
    :source="particlesSource"
    component-name="Particles"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Particles
          :key="rerenderKey"
          :particle-colors="[colors]"
          :particle-count="particleCount"
          :particle-spread="particleSpread"
          :speed="speed"
          :particle-base-size="particleBaseSize"
          :move-particles-on-hover="moveParticlesOnHover"
          :alpha-particles="alphaParticles"
          :disable-rotation="disableRotation"
          :pixel-ratio="Number(pixelRatio)"
        />
        <BackgroundContent pillText="New Background" headline="Particles that mimick the dance of the cosmos" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color" v-model="colors" />
        <PreviewSlider title="Count" v-model="particleCount" :min="100" :max="1000" :step="100" />
        <PreviewSlider title="Spread" v-model="particleSpread" :min="10" :max="100" :step="10" />
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="2" :step="0.1" />
        <PreviewSlider title="Base Size" v-model="particleBaseSize" :min="100" :max="1000" :step="100" />
        <PreviewSwitch title="Mouse Interaction" v-model="moveParticlesOnHover" />
        <PreviewSwitch title="Particle Transparency" v-model="alphaParticles" />
        <PreviewSwitch title="Disable Rotation" v-model="disableRotation" />
        <PreviewInput title="Pixel Ratio" v-model="pixelRatio" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="particles" :usage="particles.usage!" :source="particlesSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { particles } from '@/constants/code/Backgrounds/particlesCode';
import Particles from '@/content/Backgrounds/Particles/Particles.vue';
import particlesSource from '@/content/Backgrounds/Particles/Particles.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  colors: '#ffffff',
  particleCount: 200,
  particleSpread: 10,
  speed: 0.1,
  particleBaseSize: 100,
  moveParticlesOnHover: true,
  alphaParticles: false,
  disableRotation: false,
  pixelRatio: 1
};

const colors = ref(DEFAULTS.colors);
const particleCount = ref(DEFAULTS.particleCount);
const particleSpread = ref(DEFAULTS.particleSpread);
const speed = ref(DEFAULTS.speed);
const particleBaseSize = ref(DEFAULTS.particleBaseSize);
const moveParticlesOnHover = ref(DEFAULTS.moveParticlesOnHover);
const alphaParticles = ref(DEFAULTS.alphaParticles);
const disableRotation = ref(DEFAULTS.disableRotation);
const pixelRatio = ref(String(DEFAULTS.pixelRatio));

const hasChanges = computed(
  () =>
    colors.value !== DEFAULTS.colors ||
    particleCount.value !== DEFAULTS.particleCount ||
    particleSpread.value !== DEFAULTS.particleSpread ||
    speed.value !== DEFAULTS.speed ||
    particleBaseSize.value !== DEFAULTS.particleBaseSize ||
    moveParticlesOnHover.value !== DEFAULTS.moveParticlesOnHover ||
    alphaParticles.value !== DEFAULTS.alphaParticles ||
    disableRotation.value !== DEFAULTS.disableRotation ||
    pixelRatio.value !== String(DEFAULTS.pixelRatio)
);

function reset() {
  colors.value = DEFAULTS.colors;
  particleCount.value = DEFAULTS.particleCount;
  particleSpread.value = DEFAULTS.particleSpread;
  speed.value = DEFAULTS.speed;
  particleBaseSize.value = DEFAULTS.particleBaseSize;
  moveParticlesOnHover.value = DEFAULTS.moveParticlesOnHover;
  alphaParticles.value = DEFAULTS.alphaParticles;
  disableRotation.value = DEFAULTS.disableRotation;
  pixelRatio.value = String(DEFAULTS.pixelRatio);
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'particleCount',
    type: 'number',
    default: '200',
    description: 'The number of particles to generate.'
  },
  {
    name: 'particleSpread',
    type: 'number',
    default: '10',
    description: 'Controls how far particles are spread from the center.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.1',
    description: 'Speed factor controlling the animation pace.'
  },
  {
    name: 'particleColors',
    type: 'string[]',
    default: "['#ffffff']",
    description: 'An array of hex color strings used to color the particles.'
  },
  {
    name: 'moveParticlesOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Determines if particles should move in response to mouse hover.'
  },
  {
    name: 'particleHoverFactor',
    type: 'number',
    default: '1',
    description: 'Multiplier for the particle movement when hovering.'
  },
  {
    name: 'alphaParticles',
    type: 'boolean',
    default: 'false',
    description: 'If true, particles are rendered with varying transparency; otherwise, as solid circles.'
  },
  {
    name: 'particleBaseSize',
    type: 'number',
    default: '100',
    description: 'The base size of the particles.'
  },
  {
    name: 'sizeRandomness',
    type: 'number',
    default: '1',
    description: 'Controls the variation in particle sizes (0 means all particles have the same size).'
  },
  {
    name: 'cameraDistance',
    type: 'number',
    default: '20',
    description: 'Distance from the camera to the particle system.'
  },
  {
    name: 'disableRotation',
    type: 'boolean',
    default: 'false',
    description: 'If true, stops the particle system from rotating.'
  },
  {
    name: 'pixelRatio',
    type: 'number',
    default: '1',
    description: 'Sets the pixel ratio for sharper rendering on high-DPI screens.'
  }
];
</script>
