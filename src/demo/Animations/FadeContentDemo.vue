<template>
  <h1 class="sub-category">Fade Content</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="fadeContent.usage"
    :source="fadeContentSource"
    component-name="FadeContent"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] demo-container">
        <RefreshButton @click="forceRerender" />

        <FadeContent
          :key="rerenderKey"
          :blur="blur"
          :duration="duration"
          :delay="delay"
          :threshold="threshold"
          :initial-opacity="initialOpacity"
        >
          <div
            style="
              padding: 1.2em 2em;
              border-radius: 14px;
              border: 1px solid var(--border-primary);
              background: var(--bg-elevated);
              color: var(--text-primary);
              font-size: 1.1rem;
              font-weight: 600;
            "
          >
            Fade me in!
          </div>
        </FadeContent>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Enable Blur Effect" v-model="blur" />
        <PreviewSlider title="Duration" v-model="duration" :min="100" :max="3000" :step="100" value-unit="ms" />
        <PreviewSlider title="Delay" v-model="delay" :min="0" :max="2000" :step="50" value-unit="ms" />
        <PreviewSlider title="Threshold" v-model="threshold" :min="0" :max="1" :step="0.05" />
        <PreviewSlider title="Initial Opacity" v-model="initialOpacity" :min="0" :max="1" :step="0.05" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="fade-content" :usage="fadeContent.usage!" :source="fadeContentSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { fadeContent } from '@/constants/code/Animations/fadeContentCode';
import FadeContent from '@/content/Animations/FadeContent/FadeContent.vue';
import fadeContentSource from '@/content/Animations/FadeContent/FadeContent.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  blur: false,
  duration: 1000,
  delay: 0,
  threshold: 0.1,
  initialOpacity: 0
};

const blur = ref(DEFAULTS.blur);
const duration = ref(DEFAULTS.duration);
const delay = ref(DEFAULTS.delay);
const threshold = ref(DEFAULTS.threshold);
const initialOpacity = ref(DEFAULTS.initialOpacity);

const hasChanges = computed(
  () =>
    blur.value !== DEFAULTS.blur ||
    duration.value !== DEFAULTS.duration ||
    delay.value !== DEFAULTS.delay ||
    threshold.value !== DEFAULTS.threshold ||
    initialOpacity.value !== DEFAULTS.initialOpacity
);

function reset() {
  blur.value = DEFAULTS.blur;
  duration.value = DEFAULTS.duration;
  delay.value = DEFAULTS.delay;
  threshold.value = DEFAULTS.threshold;
  initialOpacity.value = DEFAULTS.initialOpacity;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'children', type: 'slot', default: '-', description: 'Content to fade in.' },
  { name: 'blur', type: 'boolean', default: 'false', description: 'Whether to also animate a 10px blur on entrance.' },
  {
    name: 'duration',
    type: 'number',
    default: '1000',
    description: 'Animation duration; values >10 are treated as ms, otherwise seconds.'
  },
  { name: 'ease', type: 'string', default: '"power2.out"', description: 'GSAP easing string.' },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Delay before animation starts; values >10 treated as ms.'
  },
  { name: 'threshold', type: 'number', default: '0.1', description: 'IntersectionObserver-style trigger threshold.' },
  { name: 'initialOpacity', type: 'number', default: '0', description: 'Starting opacity (0-1).' },
  {
    name: 'disappearAfter',
    type: 'number',
    default: '0',
    description: 'If >0, fades back out after this duration once entrance completes.'
  },
  { name: 'disappearDuration', type: 'number', default: '0.5', description: 'Duration of the disappear tween.' },
  {
    name: 'disappearEase',
    type: 'string',
    default: '"power2.in"',
    description: 'GSAP easing for the disappear tween.'
  },
  {
    name: 'onComplete',
    type: '() => void',
    default: 'undefined',
    description: 'Fires when the entrance animation completes.'
  },
  {
    name: 'onDisappearanceComplete',
    type: '() => void',
    default: 'undefined',
    description: 'Fires when the optional disappear animation completes.'
  },
  {
    name: 'container',
    type: 'Element | string | null',
    default: 'null',
    description: 'Optional scroller (selector or element) for ScrollTrigger.'
  },
  { name: 'class', type: 'string', default: '""', description: 'Extra classes for the wrapper.' }
];
</script>
