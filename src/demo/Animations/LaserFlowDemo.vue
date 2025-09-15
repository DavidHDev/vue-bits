<template>
  <TabbedLayout>
    <template #preview>
      <div
        class="relative w-full h-[600px] overflow-hidden demo-container"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        ref="containerRef"
      >
        <RefreshButton @click="forceRerender" />

        <LaserFlow
          :horizontal-beam-offset="selectedExample === 'box' ? 0.1 : 0.0"
          :vertical-beam-offset="selectedExample === 'box' ? -0.2 : -0.5"
          :horizontal-sizing="horizontalSizing"
          :vertical-sizing="verticalSizing"
          :wisp-density="wispDensity"
          :wisp-speed="wispSpeed"
          :wisp-intensity="wispIntensity"
          :flow-speed="flowSpeed"
          :flow-strength="flowStrength"
          :fog-intensity="fogIntensity"
          :fog-scale="fogScale"
          :fog-fall-speed="fogFallSpeed"
          :decay="decay"
          :dpr="1"
          :falloff-start="falloffStart"
          :color="laserColor"
          :key="key"
          :class-name="`laser-flow-demo-${selectedExample}`"
        />

        <template v-if="selectedExample === 'box'">
          <div
            class="top-[70%] left-1/2 z-[6] absolute flex justify-center items-center bg-black border-2 rounded-[20px] w-[86%] h-[60%] text-white text-2xl -translate-x-1/2"
            :style="{
              borderColor: laserColor,
              backgroundImage: 'radial-gradient(circle, #165f2b 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }"
          ></div>
          <img
            ref="revealImgRef"
            src="https://cdn.dribbble.com/userupload/15325964/file/original-25ae735b5d9255a4a31d3471fd1c346a.png?resize=1024x768&vertical=center"
            class="-top-1/2 z-2 absolute opacity-30 w-full pointer-events-none mix-blend-lighten"
            :style="{
              ['--mx']: '-9999px',
              ['--my']: '-9999px',
              WebkitMaskImage:
                'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
              maskImage:
                'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat'
            }"
          />
        </template>
      </div>

      <Customize>
        <PreviewSelect title="Example:" v-model="selectedExample" :options="exampleOptions" />
        <PreviewColor title="Color" v-model="laserColor" />
        <PreviewSlider title="Horizontal Sizing" :min="0.1" :max="2" :step="0.01" v-model="horizontalSizing" />
        <PreviewSlider title="Vertical Sizing" :min="0.1" :max="5" :step="0.1" v-model="verticalSizing" />
        <PreviewSlider title="Wisp Density" :min="0" :max="5" :step="0.1" v-model="wispDensity" />
        <PreviewSlider title="Wisp Speed" :min="1" :max="50" :step="0.5" v-model="wispSpeed" />
        <PreviewSlider title="Wisp Intensity" :min="0" :max="20" :step="0.1" v-model="wispIntensity" />
        <PreviewSlider title="Flow Speed" :min="0" :max="2" :step="0.02" v-model="flowSpeed" />
        <PreviewSlider title="Flow Strength" :min="0" :max="1" :step="0.01" v-model="flowStrength" />
        <PreviewSlider title="Fog Intensity" :min="0" :max="1" :step="0.01" v-model="fogIntensity" />
        <PreviewSlider title="Fog Scale" :min="0.1" :max="1" :step="0.01" v-model="fogScale" />
        <PreviewSlider title="Fog Fall Speed" :min="0" :max="2" :step="0.01" v-model="fogFallSpeed" />
        <PreviewSlider title="Decay" :min="0.5" :max="3" :step="0.01" v-model="decay" />
        <PreviewSlider title="Falloff Start" :min="0.5" :max="3" :step="0.01" v-model="falloffStart" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="laserFlow" />
    </template>

    <template #cli>
      <CliInstallation :command="laserFlow.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { useForceRerender } from '@/composables/useForceRerender';
import { laserFlow } from '@/constants/code/Animations/laserFlowCode';
import { ref, useTemplateRef } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import LaserFlow from '../../content/Animations/LaserFlow/LaserFlow.vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type ExampleKey = 'box' | 'basic';

const exampleOptions = [
  { label: 'Box', value: 'box' },
  { label: 'Basic', value: 'basic' }
];

const containerRef = useTemplateRef('containerRef');
const revealImgRef = useTemplateRef('revealImgRef');
const selectedExample = ref<ExampleKey>('box');
const laserColor = ref('#A0FFBC');
const horizontalSizing = ref(0.5);
const verticalSizing = ref(2.0);
const wispDensity = ref(1);
const wispSpeed = ref(15.0);
const wispIntensity = ref(5.0);
const flowSpeed = ref(0.35);
const flowStrength = ref(0.25);
const fogIntensity = ref(0.45);
const fogScale = ref(0.3);
const fogFallSpeed = ref(0.6);
const decay = ref(1.1);
const falloffStart = ref(1.2);

function handleMouseMove(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const el = revealImgRef.value;
  if (el) {
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
  }
}

function handleMouseLeave() {
  const el = revealImgRef.value;
  if (el) {
    el.style.setProperty('--mx', `-9999px`);
    el.style.setProperty('--my', `-9999px`);
  }
}

const propData = [
  {
    name: 'horizontalBeamOffset',
    type: 'number',
    default: '0.1',
    description: 'Horizontal offset of the beam (0–1 of canvas width).'
  },
  {
    name: 'verticalBeamOffset',
    type: 'number',
    default: '0.0',
    description: 'Vertical offset of the beam (0–1 of canvas height).'
  },
  {
    name: 'horizontalSizing',
    type: 'number',
    default: '0.5',
    description: 'Horizontal sizing factor of the beam footprint.'
  },
  {
    name: 'verticalSizing',
    type: 'number',
    default: '2.0',
    description: 'Vertical sizing factor of the beam footprint.'
  },
  { name: 'wispDensity', type: 'number', default: '1', description: 'Density of micro-streak wisps.' },
  { name: 'wispSpeed', type: 'number', default: '15.0', description: 'Speed of wisp motion.' },
  { name: 'wispIntensity', type: 'number', default: '5.0', description: 'Brightness of wisps.' },
  { name: 'flowSpeed', type: 'number', default: '0.35', description: 'Speed of the beam’s flow modulation.' },
  { name: 'flowStrength', type: 'number', default: '0.25', description: 'Strength of the beam’s flow modulation.' },
  { name: 'fogIntensity', type: 'number', default: '0.45', description: 'Overall volumetric fog intensity.' },
  { name: 'fogScale', type: 'number', default: '0.3', description: 'Spatial scale for the fog noise.' },
  { name: 'fogFallSpeed', type: 'number', default: '0.6', description: 'Drift speed for the fog field.' },
  {
    name: 'mouseTiltStrength',
    type: 'number',
    default: '0.01',
    description: 'How much mouse x tilts the fog volume.'
  },
  { name: 'mouseSmoothTime', type: 'number', default: '0.0', description: 'Pointer smoothing time (seconds).' },
  { name: 'decay', type: 'number', default: '1.1', description: 'Beam decay shaping for sampling envelope.' },
  {
    name: 'falloffStart',
    type: 'number',
    default: '1.2',
    description: 'Falloff start radius used in inverse-square blending.'
  },
  {
    name: 'dpr',
    type: 'number',
    default: 'auto',
    description: 'Device pixel ratio override (defaults to window.devicePixelRatio).'
  },
  { name: 'color', type: 'string', default: '#A0FFBC', description: 'Beam color (hex).' }
];
</script>

<style scoped>
.demo-container {
  padding: 0;
}
</style>
