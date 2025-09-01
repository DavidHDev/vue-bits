<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <div
          class="w-full lg:w-1/2 h-auto lg:h-full flex flex-col justify-center items-center lg:items-start text-center lg:text-left pt-8 lg:pt-0 pb-4 lg:pb-0 px-4 lg:px-4"
        >
          <h2 class="text-2xl md:text-3xl lg:text-4xl mb-4 font-medium leading-tight pl-0 lg:pl-24">
            Card stacks have never
            <span class="inline lg:block">looked so good</span>
          </h2>

          <p class="text-lg lg:text-xl mb-4 font-normal leading-tight text-gray-400 pl-0 lg:pl-24">
            Just look at it go!
          </p>
        </div>

        <div class="w-full lg:w-1/2 h-full lg:h-full relative">
          <CardSwap
            :key="rerenderKey"
            :width="500"
            :height="400"
            :card-distance="cardDistance"
            :vertical-distance="verticalDistance"
            :delay="delay"
            :skew-amount="skewAmount"
            :easing="easing"
            :pause-on-hover="pauseOnHover"
            @card-click="handleCardClick"
          >
            <template #card-0>
              <div class="h-full flex flex-col">
                <div class="rounded-2xl border-b border-white bg-gradient-to-t from-[#222] to-[#0b0b0b] shrink-0">
                  <div class="m-2 flex items-center">
                    <i class="pi pi-circle-fill mr-2"></i>
                    <span>Smooth</span>
                  </div>
                </div>
                <div class="relative p-2 flex-1 overflow-hidden rounded-[15px]">
                  <img
                    src="@/assets/demo/cs1.webp"
                    alt="Card swap demo screenshot 1"
                    class="w-full h-full object-cover grayscale block transform scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </template>

            <template #card-1>
              <div class="h-full flex flex-col">
                <div class="rounded-2xl border-b border-white bg-gradient-to-t from-[#222] to-[#0b0b0b] shrink-0">
                  <div class="m-2 flex items-center">
                    <i class="pi pi-code mr-2"></i>
                    <span>Reliable</span>
                  </div>
                </div>
                <div class="relative p-2 flex-1 overflow-hidden rounded-[15px]">
                  <img
                    src="@/assets/demo/cs2.webp"
                    alt="Card swap demo screenshot 2"
                    class="w-full h-full object-cover grayscale block transform scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </template>

            <template #card-2>
              <div class="h-full flex flex-col">
                <div class="rounded-2xl border-b border-white bg-gradient-to-t from-[#222] to-[#0b0b0b] shrink-0">
                  <div class="m-2 flex items-center">
                    <i class="pi pi-sliders-h mr-2"></i>
                    <span>Customizable</span>
                  </div>
                </div>
                <div class="relative p-2 flex-1 overflow-hidden rounded-[15px]">
                  <img
                    src="@/assets/demo/cs3.webp"
                    alt="Card swap demo screenshot 3"
                    class="w-full h-full object-cover grayscale block transform scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </template>
          </CardSwap>
        </div>
      </div>

      <Customize>
        <PreviewSwitch title="Pause On Hover" v-model="pauseOnHover" />

        <PreviewSlider title="Card Distance" v-model="cardDistance" :min="30" :max="100" :step="5" />

        <PreviewSlider title="Vertical Distance" v-model="verticalDistance" :min="40" :max="120" :step="5" />

        <PreviewSlider title="Delay (ms)" v-model="delay" :min="3000" :max="8000" :step="500" />

        <PreviewSlider title="Skew Amount" v-model="skewAmount" :min="0" :max="12" :step="1" />

        <button
          class="text-xs bg-[#111] rounded-[10px] border border-[#333] hover:bg-[#222] text-white h-8 px-3 transition-colors"
          @click="toggleEasing"
        >
          Easing:
          <span class="text-zinc-400">&nbsp;{{ easing }}</span>
        </button>
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="cardSwap" />
    </template>

    <template #cli>
      <CliInstallation :command="cardSwap.cli" />
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
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import CardSwap from '../../content/Components/CardSwap/CardSwap.vue';
import { cardSwap } from '@/constants/code/Components/cardSwapCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey, forceRerender } = useForceRerender();

const cardDistance = ref(60);
const verticalDistance = ref(70);
const delay = ref(5000);
const skewAmount = ref(6);
const easing = ref<'elastic' | 'linear'>('elastic');
const pauseOnHover = ref(false);

const toggleEasing = () => {
  easing.value = easing.value === 'elastic' ? 'linear' : 'elastic';
  forceRerender();
};

const handleCardClick = (index: number) => {
  console.log(`Card ${index} clicked`);
};

const propData = [
  {
    name: 'width',
    type: 'number | string',
    default: '500',
    description: 'Width of the card container'
  },
  {
    name: 'height',
    type: 'number | string',
    default: '400',
    description: 'Height of the card container'
  },
  {
    name: 'cardDistance',
    type: 'number',
    default: '60',
    description: 'X-axis spacing between cards'
  },
  {
    name: 'verticalDistance',
    type: 'number',
    default: '70',
    description: 'Y-axis spacing between cards'
  },
  {
    name: 'delay',
    type: 'number',
    default: '5000',
    description: 'Milliseconds between card swaps'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Whether to pause animation on hover'
  },
  {
    name: 'onCardClick',
    type: '(idx: number) => void',
    default: 'undefined',
    description: 'Callback function when a card is clicked'
  },
  {
    name: 'skewAmount',
    type: 'number',
    default: '6',
    description: 'Degree of slope for top/bottom edges'
  },
  {
    name: 'easing',
    type: "'linear' | 'elastic'",
    default: "'elastic'",
    description: 'Animation easing type'
  }
];
</script>
