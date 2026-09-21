<template>
  <h1 class="sub-category">Ghost Fibers</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="ghostFibers.usage"
    :source="ghostFibersSource"
    componentName="GhostFibers"
    :props-table="props"
  >
    <template #preview>
      <div class="relative bg-[#14110e] rounded-2xl w-full h-125 overflow-hidden demo-container">
        <GhostFibers :key="key" v-bind="ghostFibersProps" />
        <BackgroundContent pillText="New Background" headline="Light woven from the quiet parts of the spectrum." />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Line Color" v-model="lineColor" />
        <PreviewColorPicker title="Glow Color" v-model="glowColor" />
        <PreviewSlider title="Speed" :min="0" :max="2" :step="0.01" v-model="speed" />
        <PreviewSlider title="Scale" :min="0.4" :max="2" :step="0.01" v-model="scale" />
        <PreviewSlider title="Rotation" :min="-180" :max="180" :step="1" valueUnit="deg" v-model="rotation" />
        <PreviewSlider title="Rotation Speed" :min="-0.4" :max="0.4" :step="0.01" v-model="rotationSpeed" />
        <PreviewSlider title="Layers" :min="1" :max="10" :step="1" v-model="layers" />
        <PreviewSlider title="Wave Amplitude" :min="0" :max="0.3" :step="0.005" v-model="waveAmplitude" />
        <PreviewSlider title="Wave Frequency" :min="0.5" :max="6" :step="0.05" v-model="waveFrequency" />
        <PreviewSlider title="Wave Speed" :min="-2" :max="2" :step="0.05" v-model="waveSpeed" />
        <PreviewSlider title="Layer Speed" :min="-0.3" :max="0.3" :step="0.01" v-model="layerSpeed" />
        <PreviewSlider title="Twist" :min="0" :max="0.5" :step="0.005" v-model="twist" />
        <PreviewSlider title="Twist Frequency" :min="0.5" :max="12" :step="0.1" v-model="twistFrequency" />
        <PreviewSlider title="Twist Speed" :min="-3" :max="3" :step="0.05" v-model="twistSpeed" />
        <PreviewSlider title="Line Frequency" :min="1" :max="10" :step="0.1" v-model="lineFrequency" />
        <PreviewSlider title="Line Spacing" :min="0" :max="4" :step="0.05" v-model="lineSpacing" />
        <PreviewSlider title="Line Sharpness" :min="1" :max="16" :step="0.25" v-model="lineSharpness" />
        <PreviewSlider title="Glow Falloff" :min="1" :max="16" :step="0.25" v-model="glowFalloff" />
        <PreviewSlider title="Glow Intensity" :min="0" :max="3" :step="0.05" v-model="glowIntensity" />
        <PreviewSlider title="Brightness" :min="0.2" :max="4" :step="0.05" v-model="brightness" />
        <PreviewSlider title="Blue Boost" :min="0.5" :max="2" :step="0.01" v-model="blueBoost" />
        <PreviewSlider title="Vignette" :min="0" :max="1" :step="0.01" v-model="vignette" />
        <PreviewSlider title="Grain" :min="0" :max="0.12" :step="0.0025" v-model="grain" />
        <PreviewSwitch title="Light Rendering" v-model="lightMode" />
        <PreviewSelect
          title="Render Quality"
          :options="[
            { value: 0.75, label: 'Performance' },
            { value: 1, label: 'Balanced' },
            { value: 1.25, label: 'Crisp' },
            { value: 1.5, label: 'Sharp' },
            { value: 2, label: 'Ultra' }
          ]"
          v-model="dpr"
        />
        <PreviewSelect
          title="Frame Rate"
          :options="[
            { value: 24, label: '24 FPS' },
            { value: 30, label: '30 FPS' },
            { value: 45, label: '45 FPS' },
            { value: 60, label: '60 FPS' }
          ]"
          v-model="fps"
        />
        <PreviewSwitch title="Paused" v-model="paused" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="ghostFibers" :usage="ghostFibers.usage!" :source="ghostFibersSource" />
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
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { ghostFibers } from '@/constants/code/Backgrounds/ghostFibersCode';
import GhostFibers from '@/content/Backgrounds/GhostFibers/GhostFibers.vue';
import ghostFibersSource from '@/content/Backgrounds/GhostFibers/GhostFibers.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  lineColor: '#0e3510',
  glowColor: '#38a034',
  speed: 0.2,
  scale: 2,
  rotation: 0,
  rotationSpeed: 0.25,
  layers: 4,
  waveAmplitude: 0.015,
  waveFrequency: 3,
  waveSpeed: 0.15,
  layerSpeed: 0.08,
  twist: 0.1,
  twistFrequency: 5,
  twistSpeed: 1.2,
  lineFrequency: 5,
  lineSpacing: 2,
  lineSharpness: 16,
  glowFalloff: 10,
  glowIntensity: 1.6,
  brightness: 2,
  blueBoost: 1.25,
  vignette: 0.8,
  grain: 0.05,
  lightMode: false,
  dpr: 1,
  fps: 60,
  paused: false
};

const lineColor = ref(DEFAULTS.lineColor);
const glowColor = ref(DEFAULTS.glowColor);
const speed = ref(DEFAULTS.speed);
const scale = ref(DEFAULTS.scale);
const rotation = ref(DEFAULTS.rotation);
const rotationSpeed = ref(DEFAULTS.rotationSpeed);
const layers = ref(DEFAULTS.layers);
const waveAmplitude = ref(DEFAULTS.waveAmplitude);
const waveFrequency = ref(DEFAULTS.waveFrequency);
const waveSpeed = ref(DEFAULTS.waveSpeed);
const layerSpeed = ref(DEFAULTS.layerSpeed);
const twist = ref(DEFAULTS.twist);
const twistFrequency = ref(DEFAULTS.twistFrequency);
const twistSpeed = ref(DEFAULTS.twistSpeed);
const lineFrequency = ref(DEFAULTS.lineFrequency);
const lineSpacing = ref(DEFAULTS.lineSpacing);
const lineSharpness = ref(DEFAULTS.lineSharpness);
const glowFalloff = ref(DEFAULTS.glowFalloff);
const glowIntensity = ref(DEFAULTS.glowIntensity);
const brightness = ref(DEFAULTS.brightness);
const blueBoost = ref(DEFAULTS.blueBoost);
const vignette = ref(DEFAULTS.vignette);
const grain = ref(DEFAULTS.grain);
const lightMode = ref(DEFAULTS.lightMode);
const dpr = ref(DEFAULTS.dpr);
const fps = ref(DEFAULTS.fps);
const paused = ref(DEFAULTS.paused);

const ghostFibersProps = computed(() => ({
  lineColor: lineColor.value,
  glowColor: glowColor.value,
  speed: speed.value,
  scale: scale.value,
  rotation: rotation.value,
  rotationSpeed: rotationSpeed.value,
  layers: layers.value,
  waveAmplitude: waveAmplitude.value,
  waveFrequency: waveFrequency.value,
  waveSpeed: waveSpeed.value,
  layerSpeed: layerSpeed.value,
  twist: twist.value,
  twistFrequency: twistFrequency.value,
  twistSpeed: twistSpeed.value,
  lineFrequency: lineFrequency.value,
  lineSpacing: lineSpacing.value,
  lineSharpness: lineSharpness.value,
  glowFalloff: glowFalloff.value,
  glowIntensity: glowIntensity.value,
  brightness: brightness.value,
  blueBoost: blueBoost.value,
  vignette: vignette.value,
  grain: grain.value,
  lightMode: lightMode.value,
  dpr: dpr.value,
  fps: fps.value,
  paused: paused.value
}));

const hasChanges = computed(
  () =>
    lineColor.value !== DEFAULTS.lineColor ||
    glowColor.value !== DEFAULTS.glowColor ||
    speed.value !== DEFAULTS.speed ||
    scale.value !== DEFAULTS.scale ||
    rotation.value !== DEFAULTS.rotation ||
    rotationSpeed.value !== DEFAULTS.rotationSpeed ||
    layers.value !== DEFAULTS.layers ||
    waveAmplitude.value !== DEFAULTS.waveAmplitude ||
    waveFrequency.value !== DEFAULTS.waveFrequency ||
    waveSpeed.value !== DEFAULTS.waveSpeed ||
    layerSpeed.value !== DEFAULTS.layerSpeed ||
    twist.value !== DEFAULTS.twist ||
    twistFrequency.value !== DEFAULTS.twistFrequency ||
    twistSpeed.value !== DEFAULTS.twistSpeed ||
    lineFrequency.value !== DEFAULTS.lineFrequency ||
    lineSpacing.value !== DEFAULTS.lineSpacing ||
    lineSharpness.value !== DEFAULTS.lineSharpness ||
    glowFalloff.value !== DEFAULTS.glowFalloff ||
    glowIntensity.value !== DEFAULTS.glowIntensity ||
    brightness.value !== DEFAULTS.brightness ||
    blueBoost.value !== DEFAULTS.blueBoost ||
    vignette.value !== DEFAULTS.vignette ||
    grain.value !== DEFAULTS.grain ||
    lightMode.value !== DEFAULTS.lightMode ||
    dpr.value !== DEFAULTS.dpr ||
    fps.value !== DEFAULTS.fps ||
    paused.value !== DEFAULTS.paused
);

function reset() {
  lineColor.value = DEFAULTS.lineColor;
  glowColor.value = DEFAULTS.glowColor;
  speed.value = DEFAULTS.speed;
  scale.value = DEFAULTS.scale;
  rotation.value = DEFAULTS.rotation;
  rotationSpeed.value = DEFAULTS.rotationSpeed;
  layers.value = DEFAULTS.layers;
  waveAmplitude.value = DEFAULTS.waveAmplitude;
  waveFrequency.value = DEFAULTS.waveFrequency;
  waveSpeed.value = DEFAULTS.waveSpeed;
  layerSpeed.value = DEFAULTS.layerSpeed;
  twist.value = DEFAULTS.twist;
  twistFrequency.value = DEFAULTS.twistFrequency;
  twistSpeed.value = DEFAULTS.twistSpeed;
  lineFrequency.value = DEFAULTS.lineFrequency;
  lineSpacing.value = DEFAULTS.lineSpacing;
  lineSharpness.value = DEFAULTS.lineSharpness;
  glowFalloff.value = DEFAULTS.glowFalloff;
  glowIntensity.value = DEFAULTS.glowIntensity;
  brightness.value = DEFAULTS.brightness;
  blueBoost.value = DEFAULTS.blueBoost;
  vignette.value = DEFAULTS.vignette;
  grain.value = DEFAULTS.grain;
  lightMode.value = DEFAULTS.lightMode;
  dpr.value = DEFAULTS.dpr;
  fps.value = DEFAULTS.fps;
  paused.value = DEFAULTS.paused;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'lineColor', type: 'string', default: "'#0e3510'", description: 'Color of the thin fiber cores.' },
  { name: 'glowColor', type: 'string', default: "'#38a034'", description: 'Color of the broad luminous bands.' },
  { name: 'speed', type: 'number', default: '0.2', description: 'Master animation speed.' },
  { name: 'scale', type: 'number', default: '2', description: 'Zoom level of the field.' },
  { name: 'rotation', type: 'number', default: '0', description: 'Static field rotation in degrees.' },
  { name: 'rotationSpeed', type: 'number', default: '0.25', description: 'Continuous rotation rate.' },
  { name: 'layers', type: 'number', default: '4', description: 'Number of cumulative fiber layers, from 1 to 10.' },
  {
    name: 'waveAmplitude',
    type: 'number',
    default: '0.015',
    description: 'Strength of the recursive wave displacement.'
  },
  {
    name: 'waveFrequency',
    type: 'number',
    default: '3',
    description: 'Frequency of the recursive wave displacement.'
  },
  { name: 'waveSpeed', type: 'number', default: '0.15', description: 'Base speed of the layered waves.' },
  {
    name: 'layerSpeed',
    type: 'number',
    default: '0.08',
    description: 'Additional wave speed contributed by each layer.'
  },
  {
    name: 'twist',
    type: 'number',
    default: '0.1',
    description: 'Angular distortion applied during each iteration.'
  },
  {
    name: 'twistFrequency',
    type: 'number',
    default: '5',
    description: 'Radial frequency of the angular distortion.'
  },
  { name: 'twistSpeed', type: 'number', default: '1.2', description: 'Animation speed of the angular distortion.' },
  { name: 'lineFrequency', type: 'number', default: '5', description: 'Base frequency of the bright fibers.' },
  { name: 'lineSpacing', type: 'number', default: '2', description: 'Frequency increment applied per layer.' },
  { name: 'lineSharpness', type: 'number', default: '16', description: 'Sharpness of the thin fiber cores.' },
  { name: 'glowFalloff', type: 'number', default: '10', description: 'Falloff of the broad glowing bands.' },
  {
    name: 'glowIntensity',
    type: 'number',
    default: '1.6',
    description: 'Brightness multiplier for the broad glow.'
  },
  { name: 'brightness', type: 'number', default: '2', description: 'Exposure used by the final tone mapping.' },
  {
    name: 'blueBoost',
    type: 'number',
    default: '1.25',
    description: 'Multiplier applied to the final blue channel.'
  },
  { name: 'vignette', type: 'number', default: '0.8', description: 'Strength of the original edge darkening.' },
  {
    name: 'grain',
    type: 'number',
    default: '0.05',
    description: 'Strength of the layered screen-space film grain.'
  },
  { name: 'lightMode', type: 'boolean', default: 'false', description: 'Uses an ink-on-light compositing mode.' },
  { name: 'dpr', type: 'number', default: '1', description: 'Canvas pixel density, clamped between 0.5 and 2.' },
  { name: 'fps', type: 'number', default: '60', description: 'Maximum shader render rate.' },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the animation and stops its render loop.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS classes applied to the container.'
  }
];
</script>
