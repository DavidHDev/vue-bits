<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <div class="relative flex justify-center items-center">
          <ScrollVelocity
            :texts="['Vue Bits', 'Scroll Down']"
            :velocity="velocity"
            :damping="damping"
            :stiffness="stiffness"
            :velocity-mapping="velocityMapping"
            class-name="custom-scroll-text"
          />
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Velocity" v-model="velocity" :min="10" :max="500" :step="10" />
        <PreviewSlider title="Damping" v-model="damping" :min="10" :max="100" :step="10" />
        <PreviewSlider title="Stiffness" v-model="stiffness" :min="100" :max="1000" :step="50" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="scrollVelocity" />
    </template>

    <template #cli>
      <CliInstallation :command="scrollVelocity.cli" />
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
import ScrollVelocity from '../../content/TextAnimations/ScrollVelocity/ScrollVelocity.vue';
import { scrollVelocity } from '@/constants/code/TextAnimations/scrollVelocityCode';

const velocity = ref(100);
const damping = ref(50);
const stiffness = ref(400);
const velocityMapping = ref<{ input: [number, number]; output: [number, number] }>({
  input: [0, 1000],
  output: [0, 5]
});

const propData = [
  {
    name: 'scrollContainerRef',
    type: 'HTMLElement | null',
    default: 'null',
    description: 'Optional ref for a custom scroll container to track scroll position.'
  },
  {
    name: 'texts',
    type: 'string[]',
    default: '[]',
    description: 'Array of strings to display as scrolling text.'
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
    name: 'velocityMapping',
    type: '{ input: [number, number]; output: [number, number] }',
    default: '{ input: [0, 1000], output: [0, 5] }',
    description: 'Mapping from scroll velocity to a movement multiplier for dynamic scrolling.'
  },
  {
    name: 'parallaxClassName',
    type: 'string',
    default: '""',
    description: 'CSS class for the parallax container.'
  },
  {
    name: 'scrollerClassName',
    type: 'string',
    default: '""',
    description: 'CSS class for the scroller container.'
  },
  {
    name: 'parallaxStyle',
    type: 'Record<string, string | number>',
    default: '{}',
    description: 'Inline styles for the parallax container.'
  },
  {
    name: 'scrollerStyle',
    type: 'Record<string, string | number>',
    default: '{}',
    description: 'Inline styles for the scroller container.'
  }
];
</script>
