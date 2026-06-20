<template>
  <h1 class="sub-category">Shuffle</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="shuffle.usage"
    :source="shuffleSource"
    component-name="Shuffle"
    :props-table="props"
  >
    <template #preview>
      <div class="relative flex justify-center items-center w-full h-[400px] overflow-hidden demo-container">
        <RefreshButton @click="forceRerender" />
        <Shuffle
          :key="key"
          text="VUE BITS"
          :ease="ease"
          :duration="duration"
          :shuffle-times="shuffleTimes"
          :stagger="stagger"
          :shuffle-direction="shuffleDirection"
          :loop="loop"
          :loop-delay="loopDelay"
          :trigger-on-hover="triggerOnHover"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Direction" v-model="shuffleDirection" :options="['left', 'right', 'up', 'down']" />
        <PreviewSelect title="Ease" v-model="ease" :options="easeOptions" />
        <PreviewSlider title="Duration" v-model="duration" :min="0.1" :max="1.5" :step="0.05" value-unit="s" />
        <PreviewSlider title="Shuffle Times" v-model="shuffleTimes" :min="1" :max="8" :step="1" />
        <PreviewSlider title="Stagger" v-model="stagger" :min="0" :max="0.2" :step="0.01" value-unit="s" />
        <PreviewSwitch title="Hover Replay" v-model="triggerOnHover" />
        <PreviewSwitch title="Loop" v-model="loop" />
        <PreviewSlider
          title="Loop Delay"
          v-model="loopDelay"
          :min="0"
          :max="2"
          :step="0.1"
          :disabled="!loop"
          value-unit="s"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="shuffle" :usage="shuffle.usage!" :source="shuffleSource" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { shuffle } from '@/constants/code/TextAnimations/shuffleCode';
import Shuffle from '@/content/TextAnimations/Shuffle/Shuffle.vue';
import shuffleSource from '@/content/TextAnimations/Shuffle/Shuffle.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  duration: 0.35,
  shuffleTimes: 1,
  stagger: 0.03,
  shuffleDirection: 'right' as 'left' | 'right' | 'up' | 'down',
  ease: 'power3.out',
  loop: false,
  loopDelay: 0,
  triggerOnHover: true
};

const duration = ref(DEFAULTS.duration);
const shuffleTimes = ref(DEFAULTS.shuffleTimes);
const stagger = ref(DEFAULTS.stagger);
const shuffleDirection = ref(DEFAULTS.shuffleDirection);
const ease = ref(DEFAULTS.ease);
const loop = ref(DEFAULTS.loop);
const loopDelay = ref(DEFAULTS.loopDelay);
const triggerOnHover = ref(DEFAULTS.triggerOnHover);

const easeOptions = [
  { label: 'power2.out', value: 'power2.out' },
  { label: 'power3.out', value: 'power3.out' },
  { label: 'back.out(1.1)', value: 'back.out(1.1)' },
  { label: 'expo.out', value: 'expo.out' }
];

const hasChanges = computed(
  () =>
    duration.value !== DEFAULTS.duration ||
    shuffleTimes.value !== DEFAULTS.shuffleTimes ||
    stagger.value !== DEFAULTS.stagger ||
    shuffleDirection.value !== DEFAULTS.shuffleDirection ||
    ease.value !== DEFAULTS.ease ||
    loop.value !== DEFAULTS.loop ||
    loopDelay.value !== DEFAULTS.loopDelay ||
    triggerOnHover.value !== DEFAULTS.triggerOnHover
);

function reset() {
  duration.value = DEFAULTS.duration;
  shuffleTimes.value = DEFAULTS.shuffleTimes;
  stagger.value = DEFAULTS.stagger;
  shuffleDirection.value = DEFAULTS.shuffleDirection;
  ease.value = DEFAULTS.ease;
  loop.value = DEFAULTS.loop;
  loopDelay.value = DEFAULTS.loopDelay;
  triggerOnHover.value = DEFAULTS.triggerOnHover;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'text', type: 'string', default: '""', description: 'The text content to shuffle.' },
  { name: 'className', type: 'string', default: '""', description: 'Optional CSS class for the wrapper element.' },
  { name: 'style', type: 'object', default: '{}', description: 'Inline styles applied to the wrapper element.' },
  {
    name: 'shuffleDirection',
    type: '"left" | "right" | "up" | "down"',
    default: '"right"',
    description: 'Direction the per-letter strip slides to reveal the final character.'
  },
  { name: 'duration', type: 'number', default: '0.35', description: 'Duration (s) of the strip slide per letter.' },
  {
    name: 'maxDelay',
    type: 'number',
    default: '0',
    description: 'Max random delay per strip when animationMode = "random".'
  },
  {
    name: 'ease',
    type: 'string | Function',
    default: '"power3.out"',
    description: 'GSAP ease for sliding and color tween.'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Portion of the element that must enter view before starting.'
  },
  {
    name: 'rootMargin',
    type: 'string',
    default: '"-100px"',
    description: 'ScrollTrigger start offset (px, %, etc.).'
  },
  {
    name: 'tag',
    type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"',
    default: '"p"',
    description: 'HTML tag to render for the text container.'
  },
  {
    name: 'textAlign',
    type: 'CSS text-align',
    default: '"center"',
    description: 'Text alignment applied via inline style.'
  },
  {
    name: 'onShuffleComplete',
    type: '() => void',
    default: 'undefined',
    description: 'Called after a full run completes (and on each loop repeat).'
  },
  {
    name: 'shuffleTimes',
    type: 'number',
    default: '1',
    description: 'How many interim scrambled glyphs to scroll past before the final char.'
  },
  {
    name: 'animationMode',
    type: '"evenodd" | "random"',
    default: '"evenodd"',
    description: 'Odd/even staggered strips or random per-strip delays.'
  },
  { name: 'loop', type: 'boolean', default: 'false', description: 'Repeat the shuffle indefinitely.' },
  { name: 'loopDelay', type: 'number', default: '0', description: 'Delay (s) between loop repeats.' },
  { name: 'stagger', type: 'number', default: '0.03', description: 'Stagger (s) for strips in "evenodd" mode.' },
  {
    name: 'scrambleCharset',
    type: 'string',
    default: '""',
    description: 'Characters to use for interim scrambles; empty keeps original copies.'
  },
  {
    name: 'colorFrom',
    type: 'string',
    default: 'undefined',
    description: 'Optional starting text color while shuffling.'
  },
  { name: 'colorTo', type: 'string', default: 'undefined', description: 'Optional final text color to tween to.' },
  {
    name: 'triggerOnce',
    type: 'boolean',
    default: 'true',
    description: 'Auto-run only on first scroll into view.'
  },
  {
    name: 'respectReducedMotion',
    type: 'boolean',
    default: 'true',
    description: 'Skip animation if user prefers reduced motion.'
  },
  {
    name: 'triggerOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Allow re-playing the animation on hover after it completes.'
  }
];
</script>
