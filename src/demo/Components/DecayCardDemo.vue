<template>
  <h1 class="sub-category">Decay Card</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="decayCard.usage"
    :source="decayCardSource"
    component-name="DecayCard"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <DecayCard
          :key="key"
          :width="width"
          :height="height"
          :base-frequency="baseFrequency"
          :num-octaves="numOctaves"
          :seed="seed"
          :max-displacement="maxDisplacement"
          :movement-bound="movementBound"
        >
          <div class="text-[2rem] mix-blend-overlay">
            Decay
            <br />
            Card
          </div>
        </DecayCard>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Width" :min="100" :max="600" :step="25" v-model="width" />
        <PreviewSlider title="Height" :min="200" :max="600" :step="25" v-model="height" />
        <PreviewSlider title="Base Frequency" :min="0.0" :max="0.1" :step="0.001" v-model="baseFrequency" />
        <PreviewSlider title="Num Octaves" :min="1" :max="10" :step="1" v-model="numOctaves" />
        <PreviewSlider title="Seed" :min="0" :max="100" :step="1" v-model="seed" />
        <PreviewSlider title="Max Displacement" :min="50" :max="1000" :step="50" v-model="maxDisplacement" />
        <PreviewSlider title="Movement Bound" :min="10" :max="150" :step="5" v-model="movementBound" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="decay-card" :usage="decayCard.usage!" :source="decayCardSource" />
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
import { decayCard } from '@/constants/code/Components/decayCardCode';
import DecayCard from '@/content/Components/DecayCard/DecayCard.vue';
import decayCardSource from '@/content/Components/DecayCard/DecayCard.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  width: 300,
  height: 400,
  baseFrequency: 0.015,
  numOctaves: 5,
  seed: 4,
  maxDisplacement: 400,
  movementBound: 50
};

const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const baseFrequency = ref(DEFAULTS.baseFrequency);
const numOctaves = ref(DEFAULTS.numOctaves);
const seed = ref(DEFAULTS.seed);
const maxDisplacement = ref(DEFAULTS.maxDisplacement);
const movementBound = ref(DEFAULTS.movementBound);

const hasChanges = computed(
  () =>
    width.value !== DEFAULTS.width ||
    height.value !== DEFAULTS.height ||
    baseFrequency.value !== DEFAULTS.baseFrequency ||
    numOctaves.value !== DEFAULTS.numOctaves ||
    seed.value !== DEFAULTS.seed ||
    maxDisplacement.value !== DEFAULTS.maxDisplacement ||
    movementBound.value !== DEFAULTS.movementBound
);

function reset() {
  width.value = DEFAULTS.width;
  height.value = DEFAULTS.height;
  baseFrequency.value = DEFAULTS.baseFrequency;
  numOctaves.value = DEFAULTS.numOctaves;
  seed.value = DEFAULTS.seed;
  maxDisplacement.value = DEFAULTS.maxDisplacement;
  movementBound.value = DEFAULTS.movementBound;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'children',
    type: 'slot',
    default: '',
    description: 'The content (JSX) to be rendered inside the card.'
  },
  {
    name: 'width',
    type: 'number',
    default: '300',
    description: 'The width of the card in pixels.'
  },
  {
    name: 'height',
    type: 'number',
    default: '400',
    description: 'The height of the card in pixels.'
  },
  {
    name: 'image',
    type: 'string',
    default: '',
    description: 'Allows setting the background image of the card.'
  },
  {
    name: 'baseFrequency',
    type: 'number',
    default: '0.015',
    description: 'Base frequency for the turbulence filter. Lower values create larger, smoother patterns.'
  },
  {
    name: 'numOctaves',
    type: 'number',
    default: '5',
    description: 'Number of octaves for the turbulence filter. Higher values add finer detail.'
  },
  {
    name: 'seed',
    type: 'number',
    default: '4',
    description: 'Seed value for the turbulence random number generator.'
  },
  {
    name: 'maxDisplacement',
    type: 'number',
    default: '400',
    description: 'Maximum displacement scale applied when the cursor moves. Controls the intensity of the decay effect.'
  },
  {
    name: 'movementBound',
    type: 'number',
    default: '50',
    description: 'Maximum pixel distance the card can translate from its origin when following the cursor.'
  }
];
</script>
