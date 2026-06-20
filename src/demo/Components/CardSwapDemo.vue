<template>
  <h1 class="sub-category">Card Swap</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="cardSwap.usage"
    :source="cardSwapSource"
    component-name="CardSwap"
    :props-table="props"
  >
    <template #preview>
      <div class="relative flex lg:flex-row flex-col h-[500px] overflow-hidden demo-container">
        <div
          class="flex flex-col justify-start lg:justify-center items-center lg:items-start pt-8 lg:pt-0 pb-4 lg:pb-0 w-full lg:w-1/2 h-auto lg:h-full lg:text-left text-center"
        >
          <p class="mb-4 lg:pl-24 font-medium text-2xl md:text-3xl lg:text-3xl leading-[1.1]">
            Card stacks have never
            <span class="lg:block inline">looked so good</span>
          </p>
          <p class="mb-4 lg:pl-24 font-normal text-[#999] text-lg lg:text-xl leading-[1.1]">Just look at it go!</p>
        </div>

        <div class="relative w-full lg:w-1/2 h-[400px] lg:h-full">
          <CardSwap
            :card-distance="cardDistance"
            :vertical-distance="verticalDistance"
            :delay="delay"
            :skew-amount="skewAmount"
            :easing="easing"
            :pause-on-hover="pauseOnHover"
          >
            <Card custom-class="one" style="display: flex; flex-direction: column; overflow: hidden">
              <div
                class="flex-shrink-0 border-white border-b"
                style="background: linear-gradient(to top, #1b1722, #060606)"
              >
                <p class="flex items-center gap-2 m-2 ml-4">
                  <svg class="fill-current w-3 h-3" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" /></svg>
                  Smooth
                </p>
              </div>
              <div class="relative flex-1">
                <img
                  src="@/assets/demo/cs1.webp"
                  alt="Card Swap Demo 1"
                  class="block absolute inset-0 grayscale w-full h-full object-cover"
                />
              </div>
            </Card>

            <Card custom-class="two" style="display: flex; flex-direction: column; overflow: hidden">
              <div
                class="flex-shrink-0 border-white border-b"
                style="background: linear-gradient(to top, #1b1722, #060606)"
              >
                <p class="flex items-center gap-2 m-2 ml-4">
                  <svg class="fill-current w-4 h-4" viewBox="0 0 640 512">
                    <path
                      d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3l89.3 89.4-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"
                    />
                  </svg>
                  Reliable
                </p>
              </div>
              <div class="relative flex-1">
                <img
                  src="@/assets/demo/cs2.webp"
                  alt="Card Swap Demo 2"
                  class="block absolute inset-0 grayscale w-full h-full object-cover"
                />
              </div>
            </Card>

            <Card custom-class="three" style="display: flex; flex-direction: column; overflow: hidden">
              <div
                class="flex-shrink-0 border-white border-b"
                style="background: linear-gradient(to top, #1b1722, #060606)"
              >
                <p class="flex items-center gap-2 m-2 ml-4">
                  <svg class="fill-current w-4 h-4" viewBox="0 0 512 512">
                    <path
                      d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-48C253 51.7 224.8 32 192 32s-61 19.7-73.3 48L32 80C14.3 80 0 94.3 0 112s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 144c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 80z"
                    />
                  </svg>
                  Customizable
                </p>
              </div>
              <div class="relative flex-1">
                <img
                  src="@/assets/demo/cs3.webp"
                  alt="Card Swap Demo 3"
                  class="block absolute inset-0 grayscale w-full h-full object-cover"
                />
              </div>
            </Card>
          </CardSwap>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Pause On Hover" v-model="pauseOnHover" />
        <PreviewSlider title="Card Distance" v-model="cardDistance" :min="30" :max="100" :step="5" />
        <PreviewSlider title="Vertical Distance" v-model="verticalDistance" :min="40" :max="120" :step="5" />
        <PreviewSlider title="Delay (ms)" v-model="delay" :min="3000" :max="8000" :step="500" />
        <PreviewSlider title="Skew Amount" v-model="skewAmount" :min="0" :max="12" :step="1" />
        <PreviewSelect title="Easing" :options="['elastic', 'linear']" v-model="easing" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="card-swap" :usage="cardSwap.usage!" :source="cardSwapSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { cardSwap } from '@/constants/code/Components/cardSwapCode';
import CardSwap, { Card } from '@/content/Components/CardSwap/CardSwap.vue';
import cardSwapSource from '@/content/Components/CardSwap/CardSwap.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  cardDistance: 60,
  verticalDistance: 70,
  delay: 5000,
  skewAmount: 6,
  easing: 'elastic' as 'elastic' | 'linear',
  pauseOnHover: false
};

const cardDistance = ref(DEFAULTS.cardDistance);
const verticalDistance = ref(DEFAULTS.verticalDistance);
const delay = ref(DEFAULTS.delay);
const skewAmount = ref(DEFAULTS.skewAmount);
const easing = ref<'elastic' | 'linear'>(DEFAULTS.easing);
const pauseOnHover = ref(DEFAULTS.pauseOnHover);

const hasChanges = computed(
  () =>
    cardDistance.value !== DEFAULTS.cardDistance ||
    verticalDistance.value !== DEFAULTS.verticalDistance ||
    delay.value !== DEFAULTS.delay ||
    skewAmount.value !== DEFAULTS.skewAmount ||
    easing.value !== DEFAULTS.easing ||
    pauseOnHover.value !== DEFAULTS.pauseOnHover
);

function reset() {
  cardDistance.value = DEFAULTS.cardDistance;
  verticalDistance.value = DEFAULTS.verticalDistance;
  delay.value = DEFAULTS.delay;
  skewAmount.value = DEFAULTS.skewAmount;
  easing.value = DEFAULTS.easing;
  pauseOnHover.value = DEFAULTS.pauseOnHover;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'width', type: 'number | string', default: '500', description: 'Width of the card container' },
  { name: 'height', type: 'number | string', default: '400', description: 'Height of the card container' },
  { name: 'cardDistance', type: 'number', default: '60', description: 'X-axis spacing between cards' },
  { name: 'verticalDistance', type: 'number', default: '70', description: 'Y-axis spacing between cards' },
  { name: 'delay', type: 'number', default: '5000', description: 'Milliseconds between card swaps' },
  { name: 'pauseOnHover', type: 'boolean', default: 'false', description: 'Whether to pause animation on hover' },
  {
    name: 'onCardClick',
    type: '(idx: number) => void',
    default: 'undefined',
    description: 'Callback function when a card is clicked'
  },
  { name: 'skewAmount', type: 'number', default: '6', description: 'Degree of slope for top/bottom edges' },
  { name: 'easing', type: "'linear' | 'elastic'", default: "'elastic'", description: 'Animation easing type' },
  { name: 'children', type: 'slot', default: 'required', description: 'Card components to display in the stack' }
];
</script>
