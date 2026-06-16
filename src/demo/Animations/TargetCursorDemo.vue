<template>
  <h1 class="sub-category">Target Cursor</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="targetCursor.usage"
    :source="targetCursorSource"
    component-name="TargetCursor"
    :props-table="props"
  >
    <template #preview>
      <div class="flex-col h-[500px] overflow-hidden demo-container">
        <p class="mb-6 font-black text-[#aeffc5]/20 text-[clamp(2rem,6vw,3rem)]">Hover Below.</p>

        <div class="gap-4 grid grid-cols-3 mb-2">
          <div>
            <p
              class="px-6 py-2 border border-[#aeffc5] border-dashed rounded-[15px] font-black text-[#aeffc5] text-[2rem] text-center cursor-target"
            >
              THIS
            </p>
          </div>
          <div>
            <p
              class="px-6 py-2 border border-[#aeffc5] border-dashed rounded-[15px] font-black text-[#aeffc5] text-[2rem] text-center cursor-target"
            >
              FEELS
            </p>
          </div>
          <div>
            <p
              class="px-6 py-2 border border-[#aeffc5] border-dashed rounded-[15px] font-black text-[#aeffc5] text-[2rem] text-center cursor-target"
            >
              QUITE
            </p>
          </div>
          <div class="col-span-3">
            <p
              class="px-6 py-2 border border-[#aeffc5] border-dashed rounded-[15px] font-black text-[#aeffc5] text-[2rem] text-center cursor-target"
            >
              SNAPPY!
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Spin Duration" :min="0.5" :max="6" :step="0.1" value-unit="s" v-model="spinDuration" />
        <PreviewSlider
          title="Hover Duration"
          :min="0.05"
          :max="1"
          :step="0.05"
          value-unit="s"
          v-model="hoverDuration"
        />
        <PreviewSwitch title="Hide Default Cursor" v-model="hideDefaultCursor" />
        <PreviewSwitch title="Parallax On Hover" v-model="parallaxOn" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="target-cursor" :usage="targetCursor.usage!" :source="targetCursorSource" />
    </template>
  </TabsLayout>

  <TargetCursor :spin-duration="spinDuration" :hide-default-cursor="hideDefaultCursor" />
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { targetCursor } from '@/constants/code/Animations/targetCursorCode';
import TargetCursor from '@/content/Animations/TargetCursor/TargetCursor.vue';
import targetCursorSource from '@/content/Animations/TargetCursor/TargetCursor.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  spinDuration: 2,
  hideDefaultCursor: true,
  hoverDuration: 0.2,
  parallaxOn: true
};

const spinDuration = ref(DEFAULTS.spinDuration);
const hideDefaultCursor = ref(DEFAULTS.hideDefaultCursor);
const hoverDuration = ref(DEFAULTS.hoverDuration);
const parallaxOn = ref(DEFAULTS.parallaxOn);

const hasChanges = computed(
  () =>
    spinDuration.value !== DEFAULTS.spinDuration ||
    hideDefaultCursor.value !== DEFAULTS.hideDefaultCursor ||
    hoverDuration.value !== DEFAULTS.hoverDuration ||
    parallaxOn.value !== DEFAULTS.parallaxOn
);

function reset() {
  spinDuration.value = DEFAULTS.spinDuration;
  hideDefaultCursor.value = DEFAULTS.hideDefaultCursor;
  hoverDuration.value = DEFAULTS.hoverDuration;
  parallaxOn.value = DEFAULTS.parallaxOn;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'targetSelector',
    type: 'string',
    default: '".cursor-target"',
    description: 'CSS selector for elements that should trigger the cursor targeting effect'
  },
  {
    name: 'spinDuration',
    type: 'number',
    default: '2',
    description: "Duration in seconds for the cursor's spinning animation when not targeting"
  },
  {
    name: 'hideDefaultCursor',
    type: 'boolean',
    default: 'true',
    description: 'Whether to hide the default browser cursor when the component is active'
  },
  {
    name: 'hoverDuration',
    type: 'number',
    default: '0.2',
    description: 'Duration in seconds for the transition when the cursor locks onto a target'
  },
  {
    name: 'parallaxOn',
    type: 'boolean',
    default: 'true',
    description: 'Enables a subtle parallax effect on the corners when moving over a target'
  }
];
</script>
