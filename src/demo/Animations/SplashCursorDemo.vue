<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px]">
        <span class="text-6xl text-center text-[#333] font-black select-none">Move Your Cursor</span>
      </div>

      <Customize>
        <PreviewSlider title="Simulation Resolution" v-model="simResolution" :min="64" :max="512" :step="32" />

        <PreviewSlider title="Density Dissipation" v-model="densityDissipation" :min="1" :max="10" :step="0.5" />

        <PreviewSlider title="Splat Force" v-model="splatForce" :min="1000" :max="15000" :step="1000" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="splashCursor" />
    </template>

    <template #cli>
      <CliInstallation :command="splashCursor.cli" />
    </template>
  </TabbedLayout>

  <SplashCursor
    :key="rerenderKey"
    :SIM_RESOLUTION="simResolution"
    :DENSITY_DISSIPATION="densityDissipation"
    :SPLAT_FORCE="splatForce"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import SplashCursor from '../../content/Animations/SplashCursor/SplashCursor.vue';
import { splashCursor } from '@/constants/code/Animations/splashCursorCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey, forceRerender } = useForceRerender();

const simResolution = ref(128);
const densityDissipation = ref(3.5);
const splatForce = ref(6000);

watch([simResolution, densityDissipation, splatForce], () => {
  forceRerender();
});

const propData = [
  {
    name: 'SIM_RESOLUTION',
    type: 'number',
    default: '128',
    description: 'Fluid simulation resolution for velocity fields.'
  },
  {
    name: 'DYE_RESOLUTION',
    type: 'number',
    default: '1440',
    description: 'Resolution of the color/dye texture.'
  },
  {
    name: 'CAPTURE_RESOLUTION',
    type: 'number',
    default: '512',
    description: 'Resolution used for certain capture operations (rarely changed).'
  },
  {
    name: 'DENSITY_DISSIPATION',
    type: 'number',
    default: '3.5',
    description: 'Rate at which color/density dissipates over time.'
  },
  {
    name: 'VELOCITY_DISSIPATION',
    type: 'number',
    default: '2',
    description: 'Rate at which velocity dissipates over time.'
  },
  {
    name: 'PRESSURE',
    type: 'number',
    default: '0.1',
    description: 'Base pressure for the fluid simulation.'
  },
  {
    name: 'PRESSURE_ITERATIONS',
    type: 'number',
    default: '20',
    description: 'Number of Jacobi iterations used for the pressure solver.'
  },
  {
    name: 'CURL',
    type: 'number',
    default: '3',
    description: 'Amount of vorticity/curl to apply for swirling effects.'
  },
  {
    name: 'SPLAT_RADIUS',
    type: 'number',
    default: '0.2',
    description: "Radius of the 'splat' effect when user interacts."
  },
  {
    name: 'SPLAT_FORCE',
    type: 'number',
    default: '6000',
    description: "Force of the fluid 'splat' on each interaction."
  },
  {
    name: 'SHADING',
    type: 'boolean',
    default: 'true',
    description: 'Toggles simple lighting/shading on the fluid.'
  },
  {
    name: 'COLOR_UPDATE_SPEED',
    type: 'number',
    default: '10',
    description: 'Frequency at which pointer colors are re-randomized.'
  },
  {
    name: 'BACK_COLOR',
    type: 'object',
    default: '{ r: 0.5, g: 0, b: 0 }',
    description: 'Base background color for the fluid. Not always used if TRANSPARENT is true.'
  },
  {
    name: 'TRANSPARENT',
    type: 'boolean',
    default: 'true',
    description: 'Determines if the canvas background should be rendered with alpha.'
  }
];
</script>
