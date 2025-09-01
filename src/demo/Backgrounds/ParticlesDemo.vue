<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container">
        <Particles
          :key="rerenderKey"
          :particle-colors="[color]"
          :particle-count="particleCount"
          :particle-spread="particleSpread"
          :speed="speed"
          :particle-base-size="baseSize"
          :move-particles-on-hover="moveParticlesOnHover"
          :alpha-particles="alphaParticles"
          :disable-rotation="disableRotation"
          class="w-full h-full"
        />
        <BackgroundContent pillText="New Background" headline="Particles that mimick the dance of the cosmos" />
      </div>

      <Customize>
        <div class="flex items-center gap-4">
          <PreviewColor title="Color" v-model="color" />
        </div>

        <PreviewSlider title="Count" v-model="particleCount" :min="100" :max="1000" :step="100" />

        <PreviewSlider title="Spread" v-model="particleSpread" :min="10" :max="100" :step="10" />

        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="2" :step="0.1" />

        <PreviewSlider title="Base Size" v-model="baseSize" :min="100" :max="1000" :step="100" />

        <PreviewSwitch title="Mouse Interaction" v-model="moveParticlesOnHover" />

        <PreviewSwitch title="Particle Transparency" v-model="alphaParticles" />

        <PreviewSwitch title="Disable Rotation" v-model="disableRotation" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="particles" />
    </template>

    <template #cli>
      <CliInstallation :command="particles.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import Particles from '@/content/Backgrounds/Particles/Particles.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import { particles } from '@/constants/code/Backgrounds/particlesCode';
import { useForceRerender } from '@/composables/useForceRerender';

const color = ref('#ffffff');
const particleCount = ref(200);
const particleSpread = ref(10);
const speed = ref(0.1);
const baseSize = ref(100);
const moveParticlesOnHover = ref(true);
const alphaParticles = ref(false);
const disableRotation = ref(false);

const { rerenderKey } = useForceRerender();

const propData = [
  { name: 'particleCount', type: 'number', default: '200', description: 'The number of particles to generate.' },
  {
    name: 'particleSpread',
    type: 'number',
    default: '10',
    description: 'Controls how far particles are spread from the center.'
  },
  { name: 'speed', type: 'number', default: '0.1', description: 'Speed factor controlling the animation pace.' },
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
  { name: 'particleBaseSize', type: 'number', default: '100', description: 'The base size of the particles.' },
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
  }
];
</script>
