<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[600px] overflow-hidden p-0">
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

      <Customize>
        <PreviewColor title="Color" v-model="color" />

        <PreviewSelect
          title="Particle Shape"
          :options="shapeOptions"
          v-model="particleShape"
        />

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

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="antigravity" />
    </template>

    <template #cli>
      <CliInstallation :command="antigravity.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { antigravity } from '../../constants/code/Animations/antigravityCode';
import Antigravity, { type ParticleShape } from '../../content/Animations/Antigravity/Antigravity.vue';

const magnetRadius = ref(6);
const ringRadius = ref(7);
const waveSpeed = ref(0.4);
const waveAmplitude = ref(1);
const particleSize = ref(1.5);
const lerpSpeed = ref(0.05);
const count = ref(300);
const color = ref('#27FF64');
const autoAnimate = ref(true);
const particleVariance = ref(1);
const rotationSpeed = ref(0);
const depthFactor = ref(1);
const pulseSpeed = ref(3);
const particleShape = ref<ParticleShape>('capsule');
const fieldStrength = ref(10);

const componentKey = ref(0);

const shapeOptions = [
  { value: 'capsule', label: 'Capsule' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'box', label: 'Box' },
  { value: 'tetrahedron', label: 'Tetrahedron' }
];

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

const propData = [
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
