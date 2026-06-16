<template>
  <h1 class="sub-category">Scroll Stack</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="scrollStack.usage"
    :source="scrollStackSource"
    component-name="ScrollStack"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <RefreshButton
          @click="
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
    </template>

    <template #customize>
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
        <PreviewSelect
          title="Stack Position"
          v-model="stackPosition"
          :options="['10%', '15%', '20%', '25%', '30%', '35%']"
        />
        <PreviewSlider title="Base Scale" v-model="baseScale" :min="0.5" :max="1.0" :step="0.05" />
        <PreviewSlider title="Rotation Amount" v-model="rotationAmount" :min="0" :max="1" :step="0.1" value-unit="°" />
        <PreviewSlider title="Blur Amount" v-model="blurAmount" :min="0" :max="10" :step="0.5" value-unit="px" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="scroll-stack" :usage="scrollStack.usage!" :source="scrollStackSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { scrollStack } from '@/constants/code/Components/scrollStackCode';
import ScrollStack, { ScrollStackItem } from '@/content/Components/ScrollStack/ScrollStack.vue';
import scrollStackSource from '@/content/Components/ScrollStack/ScrollStack.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  itemDistance: 200,
  itemStackDistance: 30,
  baseScale: 0.85,
  rotationAmount: 0,
  blurAmount: 0,
  stackPosition: '20%'
};

const isCompleted = ref(false);
const itemDistance = ref(DEFAULTS.itemDistance);
const itemStackDistance = ref(DEFAULTS.itemStackDistance);
const baseScale = ref(DEFAULTS.baseScale);
const rotationAmount = ref(DEFAULTS.rotationAmount);
const blurAmount = ref(DEFAULTS.blurAmount);
const stackPosition = ref(DEFAULTS.stackPosition);

const handleStackComplete = () => {
  isCompleted.value = true;
};

const hasChanges = computed(
  () =>
    itemDistance.value !== DEFAULTS.itemDistance ||
    itemStackDistance.value !== DEFAULTS.itemStackDistance ||
    baseScale.value !== DEFAULTS.baseScale ||
    rotationAmount.value !== DEFAULTS.rotationAmount ||
    blurAmount.value !== DEFAULTS.blurAmount ||
    stackPosition.value !== DEFAULTS.stackPosition
);

function reset() {
  isCompleted.value = false;
  itemDistance.value = DEFAULTS.itemDistance;
  itemStackDistance.value = DEFAULTS.itemStackDistance;
  baseScale.value = DEFAULTS.baseScale;
  rotationAmount.value = DEFAULTS.rotationAmount;
  blurAmount.value = DEFAULTS.blurAmount;
  stackPosition.value = DEFAULTS.stackPosition;
  forceRerender();
}

// const stackPositionOptions = [
//   { value: '10%', label: '10%' },
//   { value: '15%', label: '15%' },
//   { value: '20%', label: '20%' },
//   { value: '25%', label: '25%' },
//   { value: '30%', label: '30%' },
//   { value: '35%', label: '35%' }
// ];

const props: PropRow[] = [
  {
    name: 'children',
    type: 'slot',
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
    name: 'useWindowScroll',
    type: 'boolean',
    default: 'false',
    description: 'Whether to use window scroll for the stack.'
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
.scroll-stack-card-demo {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 900;
  color: #fff;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 1rem;
  white-space: nowrap;
  text-align: center;
}

.scroll-stack-card-demo .stack-img-container {
  width: 100%;
  height: 100%;
  min-height: 150px;
  border-radius: 1.5rem;
  border: 10px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(4rem, 8vw, 8rem);
}

.scroll-stack-demo-container .scroll-stack-inner {
  padding: 20vh 2rem 50rem;
}

.ssc-demo-1 {
  background-color: #35724d;
}

.ssc-demo-2 {
  background-color: #333;
}

.ssc-demo-3 {
  background-color: #35724d;
}

.ssc-demo-4 {
  background-color: #333;
}

.ssc-demo-5 {
  background-color: #35724d;
  text-align: center;
  justify-content: center;
  align-items: center;
}

@media only screen and (min-width: 1240px) {
  .scroll-stack-card-demo {
    flex-direction: row;
    gap: 2rem;
    text-align: left;
  }

  .scroll-stack-demo-container .scroll-stack-inner {
    padding: 20vh 5rem 50rem;
  }

  .scroll-stack-card-demo .stack-img-container {
    width: 50%;
    min-height: auto;
  }

  .scroll-stack-card-demo h3 {
    margin-bottom: 1em;
  }
}

@media only screen and (max-width: 480px) {
  .scroll-stack-card-demo {
    font-size: 1rem;
    padding: 0.2rem;
    gap: 0.5rem;
  }

  .scroll-stack-card-demo .stack-img-container {
    border-width: 5px;
    border-radius: 1rem;
    min-height: 120px;
    font-size: 3rem;
  }
}
</style>
