<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <RefreshButton
          @refresh="
            () => {
              isCompleted = false;
              forceRerender();
            }
          "
        />
        <p
          class="top-[25%] left-[50%] absolute font-black text-[#333] text-[clamp(2rem,4vw,3rem)] text-center transition-all -translate-x-1/2 -translate-y-1/2 duration-300 ease-in-out pointer-events-none transform"
        >
          {{ isCompleted ? 'Stack Completed!' : 'Scroll Down' }}
        </p>

        <ScrollStack
          :key="rerenderKey"
          :item-distance="itemDistance"
          className="scroll-stack-demo-container"
          :item-stack-distance="itemStackDistance"
          :stack-position="stackPosition"
          :base-scale="baseScale"
          :rotation-amount="rotationAmount"
          :blur-amount="blurAmount"
          @stackComplete="handleStackComplete"
        >
          <ScrollStackItem itemClassName="scroll-stack-card-demo ssc-demo-1">
            <h3>Text Animations</h3>

            <div className="stack-img-container">
              <i class="pi-align-left pi" style="font-size: 120px"></i>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="scroll-stack-card-demo ssc-demo-2">
            <h3>Animations</h3>

            <div className="stack-img-container">
              <i class="pi pi-play" style="font-size: 120px"></i>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="scroll-stack-card-demo ssc-demo-3">
            <h3>Components</h3>

            <div className="stack-img-container">
              <i class="pi pi-sliders-h" style="font-size: 120px"></i>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="scroll-stack-card-demo ssc-demo-4">
            <h3>Backgrounds</h3>

            <div className="stack-img-container">
              <i class="pi pi-image" style="font-size: 120px"></i>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="scroll-stack-card-demo ssc-demo-5">
            <h3>All on Vue Bits!</h3>
          </ScrollStackItem>
        </ScrollStack>
      </div>

      <Customize>
        <PreviewSlider title="Item Distance" v-model="itemDistance" :min="0" :max="1000" :step="10" value-unit="px" />
        <PreviewSlider
          title="Stack Distance"
          v-model="itemStackDistance"
          :min="0"
          :max="40"
          :step="5"
          value-unit="px"
        />
        <PreviewSelect title="Stack Position" v-model="stackPosition" :options="stackPositionOptions" />
        <PreviewSlider title="Base Scale" v-model="baseScale" :min="0.5" :max="1.0" :step="0.05" />
        <PreviewSlider title="Rotation Amount" v-model="rotationAmount" :min="0" :max="1" :step="0.1" value-unit="°" />
        <PreviewSlider title="Blur Amount" v-model="blurAmount" :min="0" :max="10" :step="0.5" value-unit="px" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['lenis']" />
    </template>

    <template #code>
      <CodeExample :code-object="scrollStack" />
    </template>

    <template #cli>
      <CliInstallation :command="scrollStack.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { scrollStack } from '../../constants/code/Components/scrollStackCode';
import ScrollStack, { ScrollStackItem } from '../../content/Components/ScrollStack/ScrollStack.vue';

const { rerenderKey, forceRerender } = useForceRerender();

const isCompleted = ref(false);
const itemDistance = ref(200);
const itemStackDistance = ref(30);
const baseScale = ref(0.85);
const rotationAmount = ref(0);
const blurAmount = ref(0);
const stackPosition = ref('20%');

const handleStackComplete = () => {
  isCompleted.value = true;
};

const stackPositionOptions = [
  { value: '10%', label: '10%' },
  { value: '15%', label: '15%' },
  { value: '20%', label: '20%' },
  { value: '25%', label: '25%' },
  { value: '30%', label: '30%' },
  { value: '35%', label: '35%' }
];

const propData = [
  {
    name: 'children',
    type: 'ReactNode',
    default: 'required',
    description: 'The content to be displayed in the scroll stack. Should contain ScrollStackItem components.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes to apply to the scroll stack container.'
  },
  {
    name: 'itemDistance',
    type: 'number',
    default: '100',
    description: 'Distance between stacked items in pixels.'
  },
  {
    name: 'itemScale',
    type: 'number',
    default: '0.03',
    description: 'Scale increment for each stacked item.'
  },
  {
    name: 'itemStackDistance',
    type: 'number',
    default: '30',
    description: 'Distance between items when they start stacking.'
  },
  {
    name: 'stackPosition',
    type: 'string',
    default: '"20%"',
    description: 'Position where the stacking effect begins as a percentage of viewport height.'
  },
  {
    name: 'scaleEndPosition',
    type: 'string',
    default: '"10%"',
    description: 'Position where the scaling effect ends as a percentage of viewport height.'
  },
  {
    name: 'baseScale',
    type: 'number',
    default: '0.85',
    description: 'Base scale value for the first item in the stack.'
  },
  {
    name: 'scaleDuration',
    type: 'number',
    default: '0.5',
    description: 'Duration of the scaling animation in seconds.'
  },
  {
    name: 'rotationAmount',
    type: 'number',
    default: '0',
    description: 'Rotation amount for each item in degrees.'
  },
  {
    name: 'blurAmount',
    type: 'number',
    default: '0',
    description: 'Blur amount for items that are further back in the stack.'
  },
  {
    name: 'onStackComplete',
    type: 'function',
    default: 'undefined',
    description: 'Callback function called when the stack animation is complete.'
  }
];
</script>

<style scoped>
.demo-container {
  padding: 0;
}
</style>
