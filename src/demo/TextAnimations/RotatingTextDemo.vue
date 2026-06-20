<template>
  <h1 class="sub-category">Rotating Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="rotatingText.usage"
    :source="rotatingTextSource"
    component-name="RotatingText"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] demo-container">
        <div
          class="flex flex-row justify-center items-center p-12 sm:p-20 md:p-24 w-full h-full overflow-hidden font-light text-[1.5rem] text-white sm:text-[1.875rem] md:text-[3rem] dark:text-muted leading-8 sm:leading-9 md:leading-none"
        >
          <LayoutGroup>
            <motion.p :is="'p'" class="flex items-center gap-[0.2em] font-black" layout>
              <motion.span
                :is="'span'"
                class="pt-0.5 sm:pt-1 md:pt-2"
                layout
                :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
              >
                Creative{{ ' ' }}
              </motion.span>
              <RotatingText
                :key="rerenderKey"
                :texts="words"
                mainClassName="px-2 py-0.5 bg-[#27FF64] text-[#222] overflow-hidden flex justify-center rounded-lg sm:py-1 md:py-2 md:px-3"
                :stagger-from="staggerFrom"
                :initial="{ y: '100%' }"
                :animate="{ y: 0 }"
                :exit="{ y: '-120%' }"
                :stagger-duration="staggerDuration"
                :split-by="splitBy"
                split-level-class-name="overflow-hidden pb-0.5 sm:pb-1"
                :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
                :rotation-interval="rotationInterval"
                :auto="auto"
                :loop="loop"
              />
            </motion.p>
          </LayoutGroup>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider
          title="Rotation Interval"
          v-model="rotationInterval"
          :min="500"
          :max="5000"
          :step="100"
          value-unit="ms"
        />
        <PreviewSlider title="Stagger Duration" v-model="staggerDuration" :min="0" :max="0.1" :step="0.005" />
        <PreviewSelect title="Stagger From" v-model="staggerFrom" :options="['first', 'last', 'center', 'random']" />
        <PreviewSelect title="Split By" v-model="splitBy" :options="['characters', 'words', 'lines']" />
        <PreviewSwitch title="Auto" v-model="auto" />
        <PreviewSwitch title="Loop" v-model="loop" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="rotating-text" :usage="rotatingText.usage!" :source="rotatingTextSource" />
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
import { rotatingText } from '@/constants/code/TextAnimations/rotatingTextCode';
import RotatingText, { type SplitBy, type StaggerFrom } from '@/content/TextAnimations/RotatingText/RotatingText.vue';
import rotatingTextSource from '@/content/TextAnimations/RotatingText/RotatingText.vue?raw';
import { LayoutGroup, motion } from 'motion-v';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  rotationInterval: 2000,
  staggerDuration: 0.025,
  staggerFrom: 'last' as StaggerFrom,
  splitBy: 'characters' as SplitBy,
  auto: true,
  loop: true
};

const words = ref(['thinking', 'coding', 'components!']);
const rotationInterval = ref(DEFAULTS.rotationInterval);
const staggerDuration = ref(DEFAULTS.staggerDuration);
const staggerFrom = ref<StaggerFrom>(DEFAULTS.staggerFrom);
const splitBy = ref<SplitBy>(DEFAULTS.splitBy);
const auto = ref(DEFAULTS.auto);
const loop = ref(DEFAULTS.loop);

const hasChanges = computed(
  () =>
    rotationInterval.value !== DEFAULTS.rotationInterval ||
    staggerDuration.value !== DEFAULTS.staggerDuration ||
    staggerFrom.value !== DEFAULTS.staggerFrom ||
    splitBy.value !== DEFAULTS.splitBy ||
    auto.value !== DEFAULTS.auto ||
    loop.value !== DEFAULTS.loop
);

function reset() {
  rotationInterval.value = DEFAULTS.rotationInterval;
  staggerDuration.value = DEFAULTS.staggerDuration;
  staggerFrom.value = DEFAULTS.staggerFrom;
  splitBy.value = DEFAULTS.splitBy;
  auto.value = DEFAULTS.auto;
  loop.value = DEFAULTS.loop;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'texts',
    type: 'string[]',
    default: '[]',
    description: 'An array of text strings to be rotated.'
  },
  {
    name: 'rotationInterval',
    type: 'number',
    default: '2000',
    description: 'The interval (in milliseconds) between text rotations.'
  },
  {
    name: 'initial',
    type: 'object',
    default: '{ y: "100%", opacity: 0 }',
    description: 'Initial animation state for each element.'
  },
  {
    name: 'animate',
    type: 'object',
    default: '{ y: 0, opacity: 1 }',
    description: 'Animation state when elements enter.'
  },
  {
    name: 'exit',
    type: 'object',
    default: '{ y: "-120%", opacity: 0 }',
    description: 'Exit animation state for elements.'
  },
  {
    name: 'animatePresenceMode',
    type: 'string',
    default: '"wait"',
    description: "Mode for AnimatePresence; for example, 'wait' to finish exit animations before entering."
  },
  {
    name: 'animatePresenceInitial',
    type: 'boolean',
    default: 'false',
    description: 'Determines whether the AnimatePresence component should run its initial animation.'
  },
  {
    name: 'staggerDuration',
    type: 'number',
    default: '0',
    description: "Delay between each character's animation."
  },
  {
    name: 'staggerFrom',
    type: 'string',
    default: '"first"',
    description: 'Specifies the order from which the stagger starts.'
  },
  {
    name: 'transition',
    type: 'object',
    default: '',
    description: 'Transition settings for the animations.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Determines if the rotation should loop back to the first text after the last one.'
  },
  {
    name: 'auto',
    type: 'boolean',
    default: 'true',
    description: 'If true, the text rotation starts automatically.'
  },
  {
    name: 'splitBy',
    type: 'string',
    default: '"characters"',
    description: 'Determines how the text is split into animatable elements (e.g., by characters, words, or lines).'
  },
  {
    name: 'onNext',
    type: 'function',
    default: 'undefined',
    description: 'Callback function invoked when the text rotates to the next item.'
  },
  {
    name: 'mainClassName',
    type: 'string',
    default: "''",
    description: 'Additional class names for the main container element.'
  },
  {
    name: 'splitLevelClassName',
    type: 'string',
    default: "''",
    description: 'Additional class names for the container wrapping each split group (e.g., a word).'
  },
  {
    name: 'elementLevelClassName',
    type: 'string',
    default: "''",
    description: 'Additional class names for each individual animated element.'
  }
];
</script>
