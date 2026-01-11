<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container py-6 overflow-hidden">
        <RefreshButton @click="forceRerender" />

        <div :key="key" class="w-full h-[400px] flex items-center justify-center">
          <Shuffle
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
      </div>

      <Customize>
        <PreviewSelect title="Direction" v-model="shuffleDirection" :options="directionOptions" />

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

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="shuffle" />
    </template>

    <template #cli>
      <CliInstallation :command="shuffle.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import Shuffle from '../../content/TextAnimations/Shuffle/Shuffle.vue';
import { shuffle } from '@/constants/code/TextAnimations/shuffleCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey: key, forceRerender } = useForceRerender();

const duration = ref(0.35);
const shuffleTimes = ref(1);
const stagger = ref(0.03);
const shuffleDirection = ref<'left' | 'right' | 'up' | 'down'>('right');
const ease = ref('power3.out');
const loop = ref(false);
const loopDelay = ref(0);
const triggerOnHover = ref(true);

const directionOptions = [
  { label: 'Right', value: 'right' },
  { label: 'Left', value: 'left' },
  { label: 'Up', value: 'up' },
  { label: 'Down', value: 'down' }
];

const easeOptions = [
  { label: 'power2.out', value: 'power2.out' },
  { label: 'power3.out', value: 'power3.out' },
  { label: 'back.out(1.1)', value: 'back.out(1.1)' },
  { label: 'expo.out', value: 'expo.out' }
];

const propData = [
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
  { name: 'triggerOnce', type: 'boolean', default: 'true', description: 'Auto-run only on first scroll into view.' },
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

watch(
  () => [shuffleDirection.value, ease.value, loop.value, triggerOnHover.value],
  () => {
    forceRerender();
  }
);
</script>
