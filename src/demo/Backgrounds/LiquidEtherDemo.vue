<template>
  <h1 class="sub-category">Liquid Ether</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="liquidEther.usage"
    :source="liquidEtherSource"
    component-name="LiquidEther"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
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
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color0" />
        <PreviewColorPicker title="Color 2" v-model="color1" />
        <PreviewColorPicker title="Color 3" v-model="color2" />
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
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="liquid-ether" :usage="liquidEther.usage!" :source="liquidEtherSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { liquidEther } from '@/constants/code/Backgrounds/liquidEtherCode';
import LiquidEther from '@/content/Backgrounds/LiquidEther/LiquidEther.vue';
import liquidEtherSource from '@/content/Backgrounds/LiquidEther/LiquidEther.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color0: '#48FF28',
  color1: '#A2FFC6',
  color2: '#9EF19E',
  mouseForce: 20,
  cursorSize: 100,
  resolution: 0.5,
  isViscous: true,
  viscous: 30,
  iterationsViscous: 32,
  iterationsPoisson: 32,
  isBounce: false,
  autoDemo: true,
  autoSpeed: 0.5,
  autoIntensity: 2.2
};

const color0 = ref(DEFAULTS.color0);
const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const mouseForce = ref(DEFAULTS.mouseForce);
const cursorSize = ref(DEFAULTS.cursorSize);
const resolution = ref(DEFAULTS.resolution);
const isViscous = ref(DEFAULTS.isViscous);
const viscous = ref(DEFAULTS.viscous);
const iterationsViscous = ref(DEFAULTS.iterationsViscous);
const iterationsPoisson = ref(DEFAULTS.iterationsPoisson);
const isBounce = ref(DEFAULTS.isBounce);
const autoDemo = ref(DEFAULTS.autoDemo);
const autoSpeed = ref(DEFAULTS.autoSpeed);
const autoIntensity = ref(DEFAULTS.autoIntensity);

const userColors = computed(() => [color0.value, color1.value, color2.value].filter(Boolean) as string[]);

const hasChanges = computed(
  () =>
    color0.value !== DEFAULTS.color0 ||
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    mouseForce.value !== DEFAULTS.mouseForce ||
    cursorSize.value !== DEFAULTS.cursorSize ||
    resolution.value !== DEFAULTS.resolution ||
    isViscous.value !== DEFAULTS.isViscous ||
    viscous.value !== DEFAULTS.viscous ||
    iterationsViscous.value !== DEFAULTS.iterationsViscous ||
    iterationsPoisson.value !== DEFAULTS.iterationsPoisson ||
    isBounce.value !== DEFAULTS.isBounce ||
    autoDemo.value !== DEFAULTS.autoDemo ||
    autoSpeed.value !== DEFAULTS.autoSpeed ||
    autoIntensity.value !== DEFAULTS.autoIntensity
);

function reset() {
  color0.value = DEFAULTS.color0;
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  mouseForce.value = DEFAULTS.mouseForce;
  cursorSize.value = DEFAULTS.cursorSize;
  resolution.value = DEFAULTS.resolution;
  isViscous.value = DEFAULTS.isViscous;
  viscous.value = DEFAULTS.viscous;
  iterationsViscous.value = DEFAULTS.iterationsViscous;
  iterationsPoisson.value = DEFAULTS.iterationsPoisson;
  isBounce.value = DEFAULTS.isBounce;
  autoDemo.value = DEFAULTS.autoDemo;
  autoSpeed.value = DEFAULTS.autoSpeed;
  autoIntensity.value = DEFAULTS.autoIntensity;
  forceRerender();
}

const props: PropRow[] = [
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
