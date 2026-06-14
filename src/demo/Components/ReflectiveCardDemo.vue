<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[700px] overflow-hidden">
        <ReflectiveCard
          :blur-strength="blurStrength"
          :metalness="metalness"
          :roughness="roughness"
          :displacement-strength="displacementStrength"
          :noise-scale="noiseScale"
          :specular-constant="specularConstant"
          :grayscale="grayscale"
          :glass-distortion="glassDistortion"
        />
      </div>

      <Customize>
        <PreviewSlider title="Blur Strength" v-model="blurStrength" :min="0" :max="20" :step="0.5" value-unit="px" />
        <PreviewSlider title="Metalness" v-model="metalness" :min="0" :max="1" :step="0.05" />
        <PreviewSlider title="Roughness" v-model="roughness" :min="0" :max="1" :step="0.05" />
        <PreviewSlider title="Warp Strength" v-model="displacementStrength" :min="0" :max="50" :step="1" />
        <PreviewSlider title="Warp Scale" v-model="noiseScale" :min="0.1" :max="5" :step="0.1" />
        <PreviewSlider title="Glass Distortion" v-model="glassDistortion" :min="0" :max="50" :step="1" />
        <PreviewSlider title="Shininess" v-model="specularConstant" :min="0" :max="5" :step="0.1" />
        <PreviewSlider title="Grayscale" v-model="grayscale" :min="0" :max="1" :step="0.05" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['lucide-vue-next']" />
    </template>

    <template #code>
      <CodeExample :code-object="reflectiveCard" />
    </template>

    <template #cli>
      <CliInstallation :command="reflectiveCard.cli" />
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
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import ReflectiveCard from '../../content/Components/ReflectiveCard/ReflectiveCard.vue';
import { reflectiveCard } from '@/constants/code/Components/reflectiveCardCode';

const blurStrength = ref(12);
const metalness = ref(1);
const roughness = ref(0.75);
const displacementStrength = ref(20);
const noiseScale = ref(1);
const specularConstant = ref(5);
const grayscale = ref(0.15);
const glassDistortion = ref(30);

const propData = [
  {
    name: 'blurStrength',
    type: 'number',
    default: '12',
    description: 'The intensity of the blur effect (0-20px)'
  },
  {
    name: 'metalness',
    type: 'number',
    default: '1',
    description: 'The opacity of the metallic sheen (0-1)'
  },
  {
    name: 'roughness',
    type: 'number',
    default: '0.4',
    description: 'The opacity of the noise texture (0-1)'
  },
  {
    name: 'displacementStrength',
    type: 'number',
    default: '20',
    description: 'Strength of the displacement (how much it warps)'
  },
  {
    name: 'noiseScale',
    type: 'number',
    default: '1',
    description: 'Scale of the noise texture (size of the ripples)'
  },
  {
    name: 'specularConstant',
    type: 'number',
    default: '1.2',
    description: 'Specular constant for the lighting (shininess)'
  },
  {
    name: 'grayscale',
    type: 'number',
    default: '1',
    description: 'Grayscale intensity (0-1)'
  },
  {
    name: 'glassDistortion',
    type: 'number',
    default: '0',
    description: 'Strength of the glass edge distortion'
  },
  {
    name: 'color',
    type: 'string',
    default: 'white',
    description: 'The base text color'
  },
  {
    name: 'overlayColor',
    type: 'string',
    default: 'rgba(255, 255, 255, 0.1)',
    description: 'The color of the overlay tint'
  }
];
</script>
