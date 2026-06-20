<template>
  <h1 class="sub-category">Circular Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="circularText.usage"
    :source="circularTextSource"
    component-name="CircularText"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <CircularText :key="rerenderKey" :text="text" :spin-duration="spinDuration" :on-hover="onHover" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Text" v-model="text" placeholder="Enter text..." :maxlength="25" />
        <PreviewSelect title="On Hover" v-model="onHover" :options="hoverOptions" />
        <PreviewSlider title="Spin Duration (s)" v-model="spinDuration" :min="1" :max="60" :step="1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="circular-text" :usage="circularText.usage!" :source="circularTextSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { circularText } from '@/constants/code/TextAnimations/circularTextCode';
import CircularText from '@/content/TextAnimations/CircularText/CircularText.vue';
import circularTextSource from '@/content/TextAnimations/CircularText/CircularText.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  text: 'VUE*BITS*COMPONENTS*',
  onHover: 'speedUp' as 'slowDown' | 'speedUp' | 'pause' | 'goBonkers',
  spinDuration: 20
};

const text = ref(DEFAULTS.text);
const onHover = ref(DEFAULTS.onHover);
const spinDuration = ref(DEFAULTS.spinDuration);

const hoverOptions = [
  { label: 'Slow Down', value: 'slowDown' },
  { label: 'Speed Up', value: 'speedUp' },
  { label: 'Pause', value: 'pause' },
  { label: 'Go Bonkers', value: 'goBonkers' }
];

const hasChanges = computed(
  () =>
    text.value !== DEFAULTS.text || onHover.value !== DEFAULTS.onHover || spinDuration.value !== DEFAULTS.spinDuration
);

function reset() {
  text.value = DEFAULTS.text;
  onHover.value = DEFAULTS.onHover;
  spinDuration.value = DEFAULTS.spinDuration;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: "''",
    description: 'The text to display in a circular layout.'
  },
  {
    name: 'spinDuration',
    type: 'number',
    default: '20',
    description: 'The duration (in seconds) for one full rotation.'
  },
  {
    name: 'onHover',
    type: "'slowDown' | 'speedUp' | 'pause' | 'goBonkers'",
    default: 'undefined',
    description:
      "Specifies the hover behavior variant. Options include 'slowDown', 'speedUp', 'pause', and 'goBonkers'."
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Optional additional CSS classes to apply to the component.'
  }
];
</script>
