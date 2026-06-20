<template>
  <h1 class="sub-category">Antigravity</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="antigravity.usage"
    :source="antigravitySource"
    component-name="Antigravity"
    :props-table="props"
  >
    <template #preview>
      <div class="p-0 h-[600px] overflow-hidden demo-container">
        <Antigravity
          :key="componentKey"
          :count="count"
          :magnetRadius="magnetRadius"
          :ringRadius="ringRadius"
          :waveSpeed="waveSpeed"
          :waveAmplitude="waveAmplitude"
          :particleSize="particleSize"
          :lerpSpeed="lerpSpeed"
          :color="color"
          :autoAnimate="autoAnimate"
          :particleVariance="particleVariance"
          :rotationSpeed="rotationSpeed"
          :depthFactor="depthFactor"
          :pulseSpeed="pulseSpeed"
          :particleShape="particleShape"
          :fieldStrength="fieldStrength"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewSelect title="Particle Shape" :options="shapeOptions" v-model="particleShape" />
        <PreviewSlider title="Magnet Radius" :min="5" :max="50" :step="1" v-model="magnetRadius" />
        <PreviewSlider title="Ring Radius" :min="5" :max="25" :step="1" v-model="ringRadius" />
        <PreviewSlider title="Wave Speed" :min="0" :max="5" :step="0.1" v-model="waveSpeed" />
        <PreviewSlider title="Wave Amplitude" :min="0" :max="5" :step="0.1" v-model="waveAmplitude" />
        <PreviewSlider title="Particle Size" :min="0.1" :max="2" :step="0.1" v-model="particleSize" />
        <PreviewSlider title="Particle Variance" :min="0" :max="1" :step="0.1" v-model="particleVariance" />
        <PreviewSlider title="Lerp Speed" :min="0.01" :max="0.2" :step="0.01" v-model="lerpSpeed" />
        <PreviewSlider title="Count" :min="100" :max="5000" :step="100" v-model="count" />
        <PreviewSlider title="Rotation Speed" :min="0" :max="5" :step="0.1" v-model="rotationSpeed" />
        <PreviewSlider title="Depth Factor" :min="0" :max="5" :step="0.1" v-model="depthFactor" />
        <PreviewSlider title="Pulse Speed" :min="0" :max="10" :step="0.1" v-model="pulseSpeed" />
        <PreviewSlider title="Field Strength" :min="0.1" :max="20" :step="0.1" v-model="fieldStrength" />
        <PreviewSwitch title="Auto Animate" v-model="autoAnimate" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="antigravity" :usage="antigravity.usage!" :source="antigravitySource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender.ts';
import { antigravity } from '@/constants/code/Animations/antigravityCode';
import Antigravity, { type ParticleShape } from '@/content/Animations/Antigravity/Antigravity.vue';
import antigravitySource from '@/content/Animations/Antigravity/Antigravity.vue?raw';
import { computed, ref, watch } from 'vue';

const { forceRerender } = useForceRerender();

type Shape = 'capsule' | 'sphere' | 'box' | 'tetrahedron';
const DEFAULTS = {
  count: 300,
  color: '#27FF64',
  particleShape: 'capsule' as Shape,
  magnetRadius: 10,
  ringRadius: 10,
  waveSpeed: 0.4,
  waveAmplitude: 1,
  particleSize: 2,
  lerpSpeed: 0.1,
  autoAnimate: false,
  fieldStrength: 10,
  depthFactor: 1,
  pulseSpeed: 3,
  particleVariance: 1,
  rotationSpeed: 0
};

const magnetRadius = ref(DEFAULTS.magnetRadius);
const ringRadius = ref(DEFAULTS.ringRadius);
const waveSpeed = ref(DEFAULTS.waveSpeed);
const waveAmplitude = ref(DEFAULTS.waveAmplitude);
const particleSize = ref(DEFAULTS.particleSize);
const lerpSpeed = ref(DEFAULTS.lerpSpeed);
const count = ref(DEFAULTS.count);
const color = ref(DEFAULTS.color);
const autoAnimate = ref(DEFAULTS.autoAnimate);
const particleVariance = ref(DEFAULTS.particleVariance);
const rotationSpeed = ref(DEFAULTS.rotationSpeed);
const depthFactor = ref(DEFAULTS.depthFactor);
const pulseSpeed = ref(DEFAULTS.pulseSpeed);
const particleShape = ref<ParticleShape>(DEFAULTS.particleShape);
const fieldStrength = ref(DEFAULTS.fieldStrength);

const componentKey = ref(0);

const shapeOptions = [
  { value: 'capsule', label: 'Capsule' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'box', label: 'Box' },
  { value: 'tetrahedron', label: 'Tetrahedron' }
];

const hasChanges = computed(
  () =>
    magnetRadius.value !== DEFAULTS.magnetRadius ||
    ringRadius.value !== DEFAULTS.ringRadius ||
    waveSpeed.value !== DEFAULTS.waveSpeed ||
    waveAmplitude.value !== DEFAULTS.waveAmplitude ||
    particleSize.value !== DEFAULTS.particleSize ||
    lerpSpeed.value !== DEFAULTS.lerpSpeed ||
    count.value !== DEFAULTS.count ||
    color.value !== DEFAULTS.color ||
    autoAnimate.value !== DEFAULTS.autoAnimate ||
    particleVariance.value !== DEFAULTS.particleVariance ||
    rotationSpeed.value !== DEFAULTS.rotationSpeed ||
    depthFactor.value !== DEFAULTS.depthFactor ||
    pulseSpeed.value !== DEFAULTS.pulseSpeed ||
    particleShape.value !== DEFAULTS.particleShape ||
    fieldStrength.value !== DEFAULTS.fieldStrength
);

function reset() {
  magnetRadius.value = DEFAULTS.magnetRadius;
  ringRadius.value = DEFAULTS.ringRadius;
  waveSpeed.value = DEFAULTS.waveSpeed;
  waveAmplitude.value = DEFAULTS.waveAmplitude;
  particleSize.value = DEFAULTS.particleSize;
  lerpSpeed.value = DEFAULTS.lerpSpeed;
  count.value = DEFAULTS.count;
  color.value = DEFAULTS.color;
  autoAnimate.value = DEFAULTS.autoAnimate;
  particleVariance.value = DEFAULTS.particleVariance;
  rotationSpeed.value = DEFAULTS.rotationSpeed;
  depthFactor.value = DEFAULTS.depthFactor;
  pulseSpeed.value = DEFAULTS.pulseSpeed;
  particleShape.value = DEFAULTS.particleShape;
  fieldStrength.value = DEFAULTS.fieldStrength;
  forceRerender();
}

watch(
  [
    magnetRadius,
    ringRadius,
    waveSpeed,
    waveAmplitude,
    particleSize,
    lerpSpeed,
    count,
    color,
    autoAnimate,
    particleVariance,
    rotationSpeed,
    depthFactor,
    pulseSpeed,
    particleShape,
    fieldStrength
  ],
  () => {
    componentKey.value++;
  }
);

const props: PropRow[] = [
  {
    name: 'count',
    type: 'number',
    default: '300',
    description: 'Number of particles'
  },
  {
    name: 'magnetRadius',
    type: 'number',
    default: '10',
    description: 'Radius of the magnetic field'
  },
  {
    name: 'ringRadius',
    type: 'number',
    default: '10',
    description: 'Radius of the formed ring'
  },
  {
    name: 'waveSpeed',
    type: 'number',
    default: '0.4',
    description: 'Speed of the wave animation'
  },
  {
    name: 'waveAmplitude',
    type: 'number',
    default: '1',
    description: 'Intensity of the wave (0 for perfect circle)'
  },
  {
    name: 'particleSize',
    type: 'number',
    default: '2',
    description: 'Scale multiplier for particles'
  },
  {
    name: 'lerpSpeed',
    type: 'number',
    default: '0.1',
    description: 'How fast particles move to the ring'
  },
  {
    name: 'color',
    type: 'string',
    default: '#27FF64',
    description: 'Color of the particles'
  },
  {
    name: 'autoAnimate',
    type: 'boolean',
    default: 'false',
    description: 'Automatically animate when idle'
  },
  {
    name: 'particleVariance',
    type: 'number',
    default: '1',
    description: 'Variance in particle size (0-1)'
  },
  {
    name: 'rotationSpeed',
    type: 'number',
    default: '0',
    description: 'Rotation speed of the ring'
  },
  {
    name: 'depthFactor',
    type: 'number',
    default: '1',
    description: 'Z-axis depth multiplier'
  },
  {
    name: 'pulseSpeed',
    type: 'number',
    default: '3',
    description: 'Speed of particle size pulsation'
  },
  {
    name: 'particleShape',
    type: 'string',
    default: 'capsule',
    description: 'Shape of the particles (capsule, sphere, box, tetrahedron)'
  },
  {
    name: 'fieldStrength',
    type: 'number',
    default: '10',
    description: 'Tightness of the ring formation'
  }
];
</script>
