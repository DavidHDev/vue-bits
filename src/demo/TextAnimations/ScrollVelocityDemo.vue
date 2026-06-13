<template>
  <h1 class="sub-category">Scroll Velocity</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="scrollVelocity.usage"
    :source="scrollVelocitySource"
    component-name="ScrollVelocity"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] overflow-hidden demo-container">
        <div class="relative flex justify-center items-center">
          <ScrollVelocity
            :texts="['Vue Bits', 'Scroll Down']"
            :velocity="velocity"
            :num-copies="numCopies"
            :damping="damping"
            :stiffness="stiffness"
            class-name="custom-scroll-text"
          />
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Velocity" v-model="velocity" :min="10" :max="500" :step="10" />
        <PreviewSlider title="Num Copies" v-model="numCopies" :min="2" :max="12" :step="1" />
        <PreviewSlider title="Damping" v-model="damping" :min="10" :max="100" :step="10" />
        <PreviewSlider title="Stiffness" v-model="stiffness" :min="100" :max="1000" :step="50" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="scroll-velocity" :usage="scrollVelocity.usage!" :source="scrollVelocitySource" />
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
import { scrollVelocity } from '@/constants/code/TextAnimations/scrollVelocityCode';
import ScrollVelocity from '@/content/TextAnimations/ScrollVelocity/ScrollVelocity.vue';
import scrollVelocitySource from '@/content/TextAnimations/ScrollVelocity/ScrollVelocity.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  velocity: 100,
  numCopies: 6,
  damping: 50,
  stiffness: 400
};

const velocity = ref(DEFAULTS.velocity);
const numCopies = ref(DEFAULTS.numCopies);
const damping = ref(DEFAULTS.damping);
const stiffness = ref(DEFAULTS.stiffness);

const hasChanges = computed(
  () =>
    velocity.value !== DEFAULTS.velocity ||
    numCopies.value !== DEFAULTS.numCopies ||
    damping.value !== DEFAULTS.damping ||
    stiffness.value !== DEFAULTS.stiffness
);

function reset() {
  velocity.value = DEFAULTS.velocity;
  numCopies.value = DEFAULTS.numCopies;
  damping.value = DEFAULTS.damping;
  stiffness.value = DEFAULTS.stiffness;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'scrollContainerRef',
    type: 'HTMLElement',
    default: 'undefined',
    description: 'Optional ref for a custom scroll container to track scroll position.'
  },
  {
    name: 'texts',
    type: 'string[]',
    default: '[]',
    description:
      'Array of items to display as scrolling content. Accepts strings, JSX elements, icons, or any valid React node.'
  },
  {
    name: 'velocity',
    type: 'number',
    default: '100',
    description: 'Base velocity for scrolling; sign is flipped for odd indexed texts.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'CSS class applied to each text copy (span).'
  },
  {
    name: 'damping',
    type: 'number',
    default: '50',
    description: 'Damping value for the spring animation.'
  },
  {
    name: 'stiffness',
    type: 'number',
    default: '400',
    description: 'Stiffness value for the spring animation.'
  },
  {
    name: 'numCopies',
    type: 'number',
    default: '6',
    description: 'Number of copies of the text rendered for a continuous scrolling effect.'
  },
  {
    name: 'velocityMapping',
    type: '{ input: number[]; output: number[] }',
    default: '{ input: [0, 1000], output: [0, 5] }',
    description: 'Mapping from scroll velocity to a movement multiplier for dynamic scrolling.'
  },
  {
    name: 'parallaxClassName',
    type: 'string',
    default: '"parallax"',
    description: 'CSS class for the parallax container.'
  },
  {
    name: 'scrollerClassName',
    type: 'string',
    default: '"scroller"',
    description: 'CSS class for the scroller container.'
  },
  {
    name: 'parallaxStyle',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Inline styles for the parallax container.'
  },
  {
    name: 'scrollerStyle',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Inline styles for the scroller container.'
  }
];
</script>
