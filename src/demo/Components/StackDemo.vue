<template>
  <h1 class="sub-category">Stack</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="stack.usage"
    :source="stackSource"
    component-name="Stack"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] demo-container">
        <div class="w-[208px] h-[208px]">
          <Stack
            :key="rerenderKey"
            :random-rotation="randomRotation"
            :sensitivity="sensitivity"
            :autoplay="autoplay"
            :autoplay-delay="autoplayDelay"
            :pause-on-hover="pauseOnHover"
            :cardsData="images"
          />
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Random Rotation" v-model="randomRotation" />
        <PreviewSwitch title="Autoplay" v-model="autoplay" />
        <PreviewSwitch title="Pause On Hover" v-model="pauseOnHover" />
        <PreviewSlider title="Sensitivity" v-model="sensitivity" :min="100" :max="300" :step="10" />
        <PreviewSlider title="Autoplay Delay" v-model="autoplayDelay" :min="1000" :max="5000" :step="500" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="stack" :usage="stack.usage!" :source="stackSource" />
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
import { stack } from '@/constants/code/Components/stackCode';
import Stack from '@/content/Components/Stack/Stack.vue';
import stackSource from '@/content/Components/Stack/Stack.vue?raw';
import { computed, ref } from 'vue';

const images = [
  { id: 1, img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format' },
  { id: 2, img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format' },
  { id: 3, img: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format' },
  { id: 4, img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format' }
];

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  randomRotation: false,
  sensitivity: 200,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false
};

const randomRotation = ref<boolean>(DEFAULTS.randomRotation);
const sensitivity = ref<number>(DEFAULTS.sensitivity);
const autoplay = ref<boolean>(DEFAULTS.autoplay);
const autoplayDelay = ref<number>(DEFAULTS.autoplayDelay);
const pauseOnHover = ref<boolean>(DEFAULTS.pauseOnHover);

const hasChanges = computed(
  () =>
    randomRotation.value !== DEFAULTS.randomRotation ||
    sensitivity.value !== DEFAULTS.sensitivity ||
    autoplay.value !== DEFAULTS.autoplay ||
    autoplayDelay.value !== DEFAULTS.autoplayDelay ||
    pauseOnHover.value !== DEFAULTS.pauseOnHover
);

function reset() {
  randomRotation.value = DEFAULTS.randomRotation;
  sensitivity.value = DEFAULTS.sensitivity;
  autoplay.value = DEFAULTS.autoplay;
  autoplayDelay.value = DEFAULTS.autoplayDelay;
  pauseOnHover.value = DEFAULTS.pauseOnHover;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'randomRotation',
    type: 'boolean',
    default: 'false',
    description: "Applies a random rotation to each card for a 'messy' look."
  },
  {
    name: 'sensitivity',
    type: 'number',
    default: '200',
    description: 'Drag sensitivity for sending a card to the back.'
  },
  {
    name: 'sendToBackOnClick',
    type: 'boolean',
    default: 'false',
    description: 'When enabled, the stack also shifts to the next card on click.'
  },
  {
    name: 'cards',
    type: 'array',
    default: '[]',
    description: 'The array of card elements to display in the stack.'
  },
  {
    name: 'animationConfig',
    type: 'object',
    default: '{ stiffness: 260, damping: 20 }',
    description: "Configures the spring animation's stiffness and damping."
  },
  {
    name: 'autoplay',
    type: 'boolean',
    default: 'false',
    description: 'When enabled, the stack automatically cycles through cards.'
  },
  {
    name: 'autoplayDelay',
    type: 'number',
    default: '3000',
    description: 'Delay in milliseconds between automatic card transitions.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'When enabled, autoplay pauses when hovering over the stack.'
  }
];
</script>
