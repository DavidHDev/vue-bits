<template>
  <h1 class="sub-category">Laser Flow</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="laserFlow.usage"
    :source="laserFlowSource"
    component-name="LaserFlow"
    :props-table="props"
  >
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
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Example:" v-model="selectedExample" :options="['box', 'basic']" />
        <PreviewColorPicker title="Color" v-model="laserColor" />
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
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="laser-flow" :usage="laserFlow.usage!" :source="laserFlowSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { laserFlow } from '@/constants/code/Animations/laserFlowCode';
import LaserFlow from '@/content/Animations/LaserFlow/LaserFlow.vue';
import laserFlowSource from '@/content/Animations/LaserFlow/LaserFlow.vue?raw';
import { computed, ref, useTemplateRef } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type Example = 'box' | 'basic';
const DEFAULTS = {
  selectedExample: 'box' as Example,
  color: '#A0FFBC',
  horizontalSizing: 0.5,
  verticalSizing: 2.0,
  wispDensity: 1,
  wispSpeed: 15.0,
  wispIntensity: 5.0,
  flowSpeed: 0.35,
  flowStrength: 0.25,
  fogIntensity: 0.45,
  fogScale: 0.3,
  fogFallSpeed: 0.6,
  decay: 1.1,
  falloffStart: 1.2
};

const containerRef = useTemplateRef('containerRef');
const revealImgRef = useTemplateRef('revealImgRef');

const selectedExample = ref<Example>(DEFAULTS.selectedExample);
const laserColor = ref(DEFAULTS.color);
const horizontalSizing = ref(DEFAULTS.horizontalSizing);
const verticalSizing = ref(DEFAULTS.verticalSizing);
const wispDensity = ref(DEFAULTS.wispDensity);
const wispSpeed = ref(DEFAULTS.wispSpeed);
const wispIntensity = ref(DEFAULTS.wispIntensity);
const flowSpeed = ref(DEFAULTS.flowSpeed);
const flowStrength = ref(DEFAULTS.flowStrength);
const fogIntensity = ref(DEFAULTS.fogIntensity);
const fogScale = ref(DEFAULTS.fogScale);
const fogFallSpeed = ref(DEFAULTS.fogFallSpeed);
const decay = ref(DEFAULTS.decay);
const falloffStart = ref(DEFAULTS.falloffStart);

const hasChanges = computed(
  () =>
    selectedExample.value !== DEFAULTS.selectedExample ||
    laserColor.value !== DEFAULTS.color ||
    horizontalSizing.value !== DEFAULTS.horizontalSizing ||
    verticalSizing.value !== DEFAULTS.verticalSizing ||
    wispDensity.value !== DEFAULTS.wispDensity ||
    wispSpeed.value !== DEFAULTS.wispSpeed ||
    wispIntensity.value !== DEFAULTS.wispIntensity ||
    flowSpeed.value !== DEFAULTS.flowSpeed ||
    flowStrength.value !== DEFAULTS.flowStrength ||
    fogIntensity.value !== DEFAULTS.fogIntensity ||
    fogScale.value !== DEFAULTS.fogScale ||
    fogFallSpeed.value !== DEFAULTS.fogFallSpeed ||
    decay.value !== DEFAULTS.decay ||
    falloffStart.value !== DEFAULTS.falloffStart
);

function reset() {
  selectedExample.value = DEFAULTS.selectedExample;
  laserColor.value = DEFAULTS.color;
  horizontalSizing.value = DEFAULTS.horizontalSizing;
  verticalSizing.value = DEFAULTS.verticalSizing;
  wispDensity.value = DEFAULTS.wispDensity;
  wispSpeed.value = DEFAULTS.wispSpeed;
  wispIntensity.value = DEFAULTS.wispIntensity;
  flowSpeed.value = DEFAULTS.flowSpeed;
  flowStrength.value = DEFAULTS.flowStrength;
  fogIntensity.value = DEFAULTS.fogIntensity;
  fogScale.value = DEFAULTS.fogScale;
  fogFallSpeed.value = DEFAULTS.fogFallSpeed;
  decay.value = DEFAULTS.decay;
  falloffStart.value = DEFAULTS.falloffStart;
  forceRerender();
}

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

const props: PropRow[] = [
  {
    name: 'horizontalBeamOffset',
    type: 'number',
    default: '0.1',
    description: 'Horizontal offset of the beam (0-1 of canvas width).'
  },
  {
    name: 'verticalBeamOffset',
    type: 'number',
    default: '0.0',
    description: 'Vertical offset of the beam (0-1 of canvas height).'
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
