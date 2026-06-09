<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[520px] overflow-hidden">
        <FluidGlass
          :mode="mode"
          title="Vue Bits"
          :images="images"
          :lens-props="lensProps"
          :cube-props="cubeProps"
          :bar-props="barProps"
        />
      </div>

      <Customize>
        <PreviewSelect title="Mode" v-model="mode" :options="modeOptions" />

        <PreviewSlider v-if="mode !== 'bar'" title="Scale" v-model="scale" :min="0.1" :max="0.45" :step="0.01" />

        <PreviewSlider title="IOR" v-model="ior" :min="1" :max="2" :step="0.01" />

        <PreviewSlider title="Thickness" v-model="thickness" :min="0" :max="12" :step="0.1" />

        <PreviewSlider
          v-if="mode !== 'bar'"
          title="Chromatic Aberration"
          v-model="chromaticAberration"
          :min="0"
          :max="0.2"
          :step="0.01"
        />

        <PreviewSlider
          v-if="mode !== 'bar'"
          title="Anisotropy"
          v-model="anisotropy"
          :min="0"
          :max="0.08"
          :step="0.005"
        />

        <PreviewSlider v-if="mode === 'bar'" title="Roughness" v-model="roughness" :min="0" :max="0.5" :step="0.01" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three']" />
    </template>

    <template #code>
      <CodeExample :code-object="fluidGlass" />
    </template>

    <template #cli>
      <CliInstallation :command="fluidGlass.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { fluidGlass } from '@/constants/code/Components/fluidGlassCode';
import FluidGlass from '@/content/Components/FluidGlass/FluidGlass.vue';
import cs1 from '@/assets/demo/cs1.webp';
import cs2 from '@/assets/demo/cs2.webp';
import cs3 from '@/assets/demo/cs3.webp';
import { computed, ref } from 'vue';

type Mode = 'lens' | 'bar' | 'cube';

const mode = ref<Mode>('lens');
const scale = ref(0.25);
const ior = ref(1.15);
const thickness = ref(2);
const chromaticAberration = ref(0.05);
const anisotropy = ref(0.01);
const roughness = ref(0);
const images = [cs1, cs2, cs3, cs1, cs2];

const modeOptions = [
  { label: 'Lens', value: 'lens' },
  { label: 'Bar', value: 'bar' },
  { label: 'Cube', value: 'cube' }
];

const lensProps = computed(() => ({
  scale: scale.value,
  ior: ior.value,
  thickness: thickness.value,
  chromaticAberration: chromaticAberration.value,
  anisotropy: anisotropy.value
}));

const cubeProps = computed(() => ({
  scale: scale.value,
  ior: ior.value,
  thickness: thickness.value,
  chromaticAberration: chromaticAberration.value,
  anisotropy: anisotropy.value
}));

const barProps = computed(() => ({
  ior: ior.value,
  thickness: thickness.value * 3,
  roughness: roughness.value,
  navItems: [
    { label: 'Home', link: '' },
    { label: 'Work', link: '' },
    { label: 'Contact', link: '' }
  ]
}));

const propData = [
  {
    name: 'mode',
    type: "'lens' | 'bar' | 'cube'",
    default: "'lens'",
    description: 'Display mode of the fluid glass effect.'
  },
  {
    name: 'images',
    type: 'string[]',
    default: '[]',
    description: 'Images displayed behind the glass object.'
  },
  {
    name: 'title',
    type: 'string',
    default: "'Vue Bits'",
    description: 'Text rendered in the scene title layer.'
  },
  {
    name: 'lensProps',
    type: 'object',
    default: '{}',
    description: 'Props for lens mode such as scale, ior, thickness, chromaticAberration and anisotropy.'
  },
  {
    name: 'barProps',
    type: 'object',
    default: '{}',
    description: 'Props for bar mode including navItems and transmission material options.'
  },
  {
    name: 'cubeProps',
    type: 'object',
    default: '{}',
    description: 'Props for cube mode using the same material controls as lens mode.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS class names for the root container.'
  }
];
</script>
