<template>
  <h1 class="sub-category">Reflective Card</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="reflectiveCard.usage"
    :source="reflectiveCardSource"
    component-name="ReflectiveCard"
    :props-table="propData"
  >
    <template #preview>
      <div class="demo-container h-[700px] overflow-hidden">
        <ReflectiveCard
          :key="rerenderKey"
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
    </template>

    <template #customize>
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
    </template>

    <template #propTable>
      <PropTable :data="propData" />
    </template>

    <template #code>
      <DemoCodeTab slug="reflective-card" :usage="reflectiveCard.usage!" :source="reflectiveCardSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { reflectiveCard } from '@/constants/code/Components/reflectiveCardCode';
import ReflectiveCard from '@/content/Components/ReflectiveCard/ReflectiveCard.vue';
import reflectiveCardSource from '@/content/Components/ReflectiveCard/ReflectiveCard.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  blurStrength: 12,
  metalness: 1,
  roughness: 0.75,
  displacementStrength: 20,
  noiseScale: 1,
  specularConstant: 5,
  grayscale: 0.15,
  glassDistortion: 30
};

const blurStrength = ref(DEFAULTS.blurStrength);
const metalness = ref(DEFAULTS.metalness);
const roughness = ref(DEFAULTS.roughness);
const displacementStrength = ref(DEFAULTS.displacementStrength);
const noiseScale = ref(DEFAULTS.noiseScale);
const specularConstant = ref(DEFAULTS.specularConstant);
const grayscale = ref(DEFAULTS.grayscale);
const glassDistortion = ref(DEFAULTS.glassDistortion);

const hasChanges = computed(
  () =>
    blurStrength.value !== DEFAULTS.blurStrength ||
    metalness.value !== DEFAULTS.metalness ||
    roughness.value !== DEFAULTS.roughness ||
    displacementStrength.value !== DEFAULTS.displacementStrength ||
    noiseScale.value !== DEFAULTS.noiseScale ||
    specularConstant.value !== DEFAULTS.specularConstant ||
    grayscale.value !== DEFAULTS.grayscale ||
    glassDistortion.value !== DEFAULTS.glassDistortion
);

function reset() {
  blurStrength.value = DEFAULTS.blurStrength;
  metalness.value = DEFAULTS.metalness;
  roughness.value = DEFAULTS.roughness;
  displacementStrength.value = DEFAULTS.displacementStrength;
  noiseScale.value = DEFAULTS.noiseScale;
  specularConstant.value = DEFAULTS.specularConstant;
  grayscale.value = DEFAULTS.grayscale;
  glassDistortion.value = DEFAULTS.glassDistortion;
  forceRerender();
}

const propData: PropRow[] = [
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
