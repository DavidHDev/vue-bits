<template>
  <h1 class="sub-category">Elastic Slider</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="elasticSlider.usage"
    :source="elasticSliderSource"
    component-name="ElasticSlider"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] demo-container">
        <ElasticSlider
          :default-value="defaultValue"
          :starting-value="startingValue"
          :max-value="maxValue"
          :is-stepped="isStepped"
          :step-size="stepSize"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Default Value" :min="0" :max="1000" :step="10" v-model="defaultValue" />
        <PreviewSlider title="Starting Value" :min="0" :max="500" :step="10" v-model="startingValue" />
        <PreviewSlider title="Max Value" :min="10" :max="1000" :step="10" v-model="maxValue" />
        <PreviewSwitch title="Stepped" v-model="isStepped" />
        <PreviewSlider title="Step Size" :min="1" :max="50" :step="1" v-model="stepSize" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="elastic-slider" :usage="elasticSlider.usage!" :source="elasticSliderSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { elasticSlider } from '@/constants/code/Components/elasticSliderCode';
import ElasticSlider from '@/content/Components/ElasticSlider/ElasticSlider.vue';
import elasticSliderSource from '@/content/Components/ElasticSlider/ElasticSlider.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  defaultValue: 50,
  startingValue: 0,
  maxValue: 100,
  isStepped: false,
  stepSize: 10
};

const defaultValue = ref(DEFAULTS.defaultValue);
const startingValue = ref(DEFAULTS.startingValue);
const maxValue = ref(DEFAULTS.maxValue);
const isStepped = ref(DEFAULTS.isStepped);
const stepSize = ref(DEFAULTS.stepSize);

const hasChanges = computed(
  () =>
    defaultValue.value !== DEFAULTS.defaultValue ||
    startingValue.value !== DEFAULTS.startingValue ||
    maxValue.value !== DEFAULTS.maxValue ||
    isStepped.value !== DEFAULTS.isStepped ||
    stepSize.value !== DEFAULTS.stepSize
);

function reset() {
  defaultValue.value = DEFAULTS.defaultValue;
  startingValue.value = DEFAULTS.startingValue;
  maxValue.value = DEFAULTS.maxValue;
  isStepped.value = DEFAULTS.isStepped;
  stepSize.value = DEFAULTS.stepSize;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'defaultValue',
    type: 'number',
    default: '50',
    description: 'The initial value of the slider. It can be less than startingValue or greater than maxValue.'
  },
  {
    name: 'startingValue',
    type: 'number',
    default: '0',
    description: "The starting point for the slider's range, e.g., startingValue=100 allows the slider to start at 100."
  },
  {
    name: 'maxValue',
    type: 'number',
    default: '100',
    description: 'The maximum value the slider can reach.'
  },
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Allows passing custom class names to style the component.'
  },
  {
    name: 'isStepped',
    type: 'boolean',
    default: 'false',
    description: 'Enables or disables stepped increments on the slider.'
  },
  {
    name: 'stepSize',
    type: 'number',
    default: '1',
    description: 'The size of the increments for the slider when isStepped is enabled.'
  },
  {
    name: 'leftIcon',
    type: 'Component | string',
    default: "'-'",
    description: 'Custom JSX or HTML code to display on the left side of the slider.'
  },
  {
    name: 'rightIcon',
    type: 'Component | string',
    default: "'+'",
    description: 'Custom JSX or HTML code to display on the right side of the slider.'
  }
];
</script>
