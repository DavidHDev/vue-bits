<template>
  <h1 class="sub-category">Carousel</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="carousel.usage"
    :source="carouselSource"
    component-name="Carousel"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] overflow-hidden demo-container">
        <Carousel
          :key="rerenderKey"
          :base-width="baseWidth"
          :autoplay="autoplay"
          :autoplay-delay="autoplayDelay"
          :pause-on-hover="pauseOnHover"
          :loop="loop"
          :round="round"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Width" v-model="baseWidth" :min="250" :max="330" :step="10" />
        <PreviewSwitch title="Round Variant" v-model="round" />
        <PreviewSwitch title="Loop" v-model="loop" />
        <PreviewSwitch title="Autoplay" v-model="autoplay" />
        <PreviewSlider
          title="Delay"
          v-model="autoplayDelay"
          :min="1000"
          :max="4000"
          :step="1000"
          :disabled="!autoplay"
        />
        <PreviewSwitch title="Pause On Hover" v-model="pauseOnHover" :disabled="!autoplay" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="carousel" :usage="carousel.usage!" :source="carouselSource" />
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
import { carousel } from '@/constants/code/Components/carouselCode';
import Carousel from '@/content/Components/Carousel/Carousel.vue';
import carouselSource from '@/content/Components/Carousel/Carousel.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  baseWidth: 300,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false,
  loop: false,
  round: false
};

const baseWidth = ref(DEFAULTS.baseWidth);
const autoplay = ref(DEFAULTS.autoplay);
const autoplayDelay = ref(DEFAULTS.autoplayDelay);
const pauseOnHover = ref(DEFAULTS.pauseOnHover);
const loop = ref(DEFAULTS.loop);
const round = ref(DEFAULTS.round);

const hasChanges = computed(
  () =>
    baseWidth.value !== DEFAULTS.baseWidth ||
    autoplay.value !== DEFAULTS.autoplay ||
    autoplayDelay.value !== DEFAULTS.autoplayDelay ||
    pauseOnHover.value !== DEFAULTS.pauseOnHover ||
    loop.value !== DEFAULTS.loop ||
    round.value !== DEFAULTS.round
);

function reset() {
  baseWidth.value = DEFAULTS.baseWidth;
  autoplay.value = DEFAULTS.autoplay;
  autoplayDelay.value = DEFAULTS.autoplayDelay;
  pauseOnHover.value = DEFAULTS.pauseOnHover;
  loop.value = DEFAULTS.loop;
  round.value = DEFAULTS.round;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'CarouselItem[]',
    default: 'DEFAULT_ITEMS',
    description: 'An array of carousel items. Each item must include title, description, id, and icon.'
  },
  {
    name: 'baseWidth',
    type: 'number',
    default: '300',
    description: 'Total width (in px) of the carousel container. Effective item width is baseWidth minus padding.'
  },
  {
    name: 'autoplay',
    type: 'boolean',
    default: 'false',
    description: 'Enables automatic scrolling to the next item at a fixed interval.'
  },
  {
    name: 'autoplayDelay',
    type: 'number',
    default: '3000',
    description: 'Delay in milliseconds between automatic scrolls when autoplay is enabled.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Pauses the autoplay functionality when the carousel is hovered.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'When true, the carousel loops seamlessly from the last item back to the first.'
  },
  {
    name: 'round',
    type: 'boolean',
    default: 'true',
    description: 'When true, the carousel is rendered with a 1:1 aspect ratio and circular container/items.'
  }
];
</script>
