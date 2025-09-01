<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-section">
        <div class="demo-container h-[300px] overflow-hidden">
          <ElasticSlider />
        </div>
      </div>

      <div class="demo-section">
        <h2 class="demo-title-extra">Using Steps</h2>

        <div class="demo-container h-[300px] overflow-hidden">
          <ElasticSlider :is-stepped="true" :step-size="10" />
        </div>
      </div>

      <div class="demo-section">
        <h2 class="demo-title-extra">Custom Range & Icons</h2>

        <div class="demo-container h-[300px] overflow-hidden">
          <ElasticSlider :starting-value="500" :default-value="750" :max-value="1000">
            <template #left-icon>
              <i class="pi pi-thumbs-down text-xl"></i>
            </template>

            <template #right-icon>
              <i class="pi pi-thumbs-up text-xl"></i>
            </template>
          </ElasticSlider>
        </div>
      </div>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="elasticSlider" />
    </template>

    <template #cli>
      <CliInstallation v-bind="elasticSlider" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import PropTable from '@/components/common/PropTable.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import ElasticSlider from '@/content/Components/ElasticSlider/ElasticSlider.vue';
import { elasticSlider } from '@/constants/code/Components/elasticSliderCode';

const propData = [
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
    default: "''",
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
    description: 'Custom Vue component or string to display on the left side of the slider.'
  },
  {
    name: 'rightIcon',
    type: 'Component | string',
    default: "'+'",
    description: 'Custom Vue component or string to display on the right side of the slider.'
  }
];
</script>
