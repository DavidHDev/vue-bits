<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <LiquidEther
          :colors="userColors"
          :mouse-force="mouseForce"
          :cursor-size="cursorSize"
          :resolution="resolution"
          :is-viscous="isViscous"
          :viscous="viscous"
          :iterations-viscous="iterationsViscous"
          :iterations-poisson="iterationsPoisson"
          :is-bounce="isBounce"
          :auto-demo="autoDemo"
          :auto-speed="autoSpeed"
          :auto-intensity="autoIntensity"
          :auto-resume-delay="500"
        />

        <BackgroundContent pill-text="New Background" headline="The web, made fluid at your fingertips." />
      </div>

      <Customize>
        <div class="flex gap-4">
          <p class="mt-2 mb-1 text-sm">Color</p>
          <PreviewColor v-model="color0" />
          <PreviewColor v-model="color1" />
          <PreviewColor v-model="color2" />
        </div>

        <PreviewSlider :min="0" :max="60" :step="1" v-model="mouseForce" title="Mouse Force" />
        <PreviewSlider :min="10" :max="200" :step="5" v-model="cursorSize" title="Cursor Size" />
        <PreviewSlider :min="0.2" :max="0.5" :step="0.05" v-model="resolution" title="Resolution" />
        <PreviewSlider :min="0" :max="1" :step="0.05" v-model="autoSpeed" title="Auto Speed" />
        <PreviewSlider :min="0" :max="4" :step="0.1" v-model="autoIntensity" title="Auto Intensity" />
        <PreviewSlider :min="1" :max="64" :step="1" v-model="iterationsPoisson" title="Pressure" />

        <PreviewSwitch title="Bounce Edges" v-model="isBounce" />
        <PreviewSwitch title="Auto Animate" v-model="autoDemo" />
        <PreviewSwitch title="Viscous" v-model="isViscous" />

        <PreviewSlider v-if="isViscous" :min="1" :max="100" :step="1" v-model="viscous" title="Viscous Coef" />
        <PreviewSlider
          v-if="isViscous"
          :min="1"
          :max="64"
          :step="1"
          v-model="iterationsViscous"
          title="Viscous Iterations"
        />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="liquidEther" />
    </template>

    <template #cli>
      <CliInstallation :command="liquidEther.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { liquidEther } from '@/constants/code/Backgrounds/liquidEtherCode';
import { computed, ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import LiquidEther from '../../content/Backgrounds/LiquidEther/LiquidEther.vue';

const mouseForce = ref(20);
const cursorSize = ref(100);
const resolution = ref(0.5);
const isViscous = ref(true);
const viscous = ref(30);
const iterationsViscous = ref(32);
const iterationsPoisson = ref(32);
const isBounce = ref(false);
const autoDemo = ref(true);
const autoSpeed = ref(0.5);
const autoIntensity = ref(2.2);

const color0 = ref('#48FF28');
const color1 = ref('#A2FFC6');
const color2 = ref('#9EF19E');

const userColors = computed(() => [color0.value, color1.value, color2.value].filter(Boolean) as string[]);

const propData = [
  {
    name: 'colors',
    type: 'string[]',
    default: `["#48FF28", "#A2FFC6", "#9EF19E"]`,
    description: 'Array of hex color stops used to build the velocity-to-color palette.'
  },
  {
    name: 'mouseForce',
    type: 'number',
    default: '20',
    description: 'Strength multiplier applied to mouse / touch movement when injecting velocity.'
  },
  {
    name: 'cursorSize',
    type: 'number',
    default: '100',
    description: 'Radius (in pixels at base resolution) of the force brush.'
  },
  {
    name: 'resolution',
    type: 'number',
    default: '0.5',
    description: 'Simulation texture scale relative to canvas size (lower = better performance, more blur).'
  },
  {
    name: 'dt',
    type: 'number',
    default: '0.014',
    description: 'Fixed simulation timestep used inside the advection / diffusion passes.'
  },
  {
    name: 'BFECC',
    type: 'boolean',
    default: 'true',
    description: 'Enable BFECC advection (error-compensated) for crisper flow; disable for slight performance gain.'
  },
  {
    name: 'isViscous',
    type: 'boolean',
    default: 'false',
    description: 'Toggle iterative viscosity solve (smoother, thicker motion when enabled).'
  },
  {
    name: 'viscous',
    type: 'number',
    default: '30',
    description: 'Viscosity coefficient used when isViscous is true.'
  },
  {
    name: 'iterationsViscous',
    type: 'number',
    default: '32',
    description: 'Number of Gauss-Seidel iterations for viscosity (higher = smoother, slower).'
  },
  {
    name: 'iterationsPoisson',
    type: 'number',
    default: '32',
    description: 'Number of pressure Poisson iterations to enforce incompressibility.'
  },
  {
    name: 'isBounce',
    type: 'boolean',
    default: 'false',
    description: 'If true, shows bounce boundaries (velocity clamped at edges).'
  },
  {
    name: 'autoDemo',
    type: 'boolean',
    default: 'true',
    description: 'Enable idle auto-driving of the pointer when no user interaction.'
  },
  {
    name: 'autoSpeed',
    type: 'number',
    default: '0.5',
    description: 'Speed (normalized units/sec) for auto pointer motion.'
  },
  {
    name: 'autoIntensity',
    type: 'number',
    default: '2.2',
    description: 'Multiplier applied to velocity delta while in auto mode.'
  },
  {
    name: 'takeoverDuration',
    type: 'number',
    default: '0.25',
    description: 'Seconds to interpolate from auto pointer to real cursor when user moves mouse.'
  },
  {
    name: 'autoResumeDelay',
    type: 'number',
    default: '1000',
    description: 'Milliseconds of inactivity before auto mode resumes.'
  },
  {
    name: 'autoRampDuration',
    type: 'number',
    default: '0.6',
    description: 'Seconds to ramp auto movement speed from 0 to full after activation.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Optional class for the root container.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles applied to the root container.'
  }
];
</script>
