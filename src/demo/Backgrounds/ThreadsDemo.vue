<template>
  <h1 class="sub-category">Threads</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="threads.usage"
    :source="threadsSource"
    component-name="Threads"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <Threads :amplitude="amplitude" :distance="distance" :enableMouseInteraction="enableMouseInteraction" />
        <BackgroundContent pillText="New Background" headline="Not to be confused with the Threads app by Meta!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider :min="0" :max="5" :step="0.1" v-model="amplitude" title="Amplitude" />
        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="distance" title="Distance" />
        <PreviewSwitch v-model="enableMouseInteraction" title="Enable Mouse Interaction" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="threads" :usage="threads.usage!" :source="threadsSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { threads } from '@/constants/code/Backgrounds/threadsCode';
import Threads from '@/content/Backgrounds/Threads/Threads.vue';
import threadsSource from '@/content/Backgrounds/Threads/Threads.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  amplitude: 1,
  distance: 0,
  enableMouseInteraction: true
};

const amplitude = ref(DEFAULTS.amplitude);
const distance = ref(DEFAULTS.distance);
const enableMouseInteraction = ref(DEFAULTS.enableMouseInteraction);

const hasChanges = computed(
  () =>
    amplitude.value !== DEFAULTS.amplitude ||
    distance.value !== DEFAULTS.distance ||
    enableMouseInteraction.value !== DEFAULTS.enableMouseInteraction
);

function reset() {
  amplitude.value = DEFAULTS.amplitude;
  distance.value = DEFAULTS.distance;
  enableMouseInteraction.value = DEFAULTS.enableMouseInteraction;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'color',
    type: '[number, number, number]',
    default: '[1, 1, 1]',
    description: 'Customizes the color of the lines (RGB).'
  },
  {
    name: 'amplitude',
    type: 'number',
    default: '1',
    description: 'Adjusts the intensity of the wave effect on the lines.'
  },
  {
    name: 'distance',
    type: 'number',
    default: '0',
    description: 'Controls the spacing between the lines. A value of 0 means no offset.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'false',
    description: "Enables smooth mouse hover effects that modulate the line's movement and amplitude."
  }
];
</script>
