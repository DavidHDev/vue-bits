<template>
  <h1 class="sub-category">Animated Content</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="animatedContent.usage"
    :source="animatedContentSource"
    component-name="AnimatedContent"
    :props-table="props"
  >
    <template #preview>
      <div
        class="demo-container"
        style="position: relative; min-height: 400px; display: flex; align-items: center; justify-content: center"
      >
        <RefreshButton @click="forceRerender" />
        <AnimatedContent
          :key="key"
          :direction="direction"
          :distance="distance"
          :delay="delay"
          :reverse="reverse"
          :duration="duration"
          :ease="ease"
          :initial-opacity="initialOpacity"
          :animate-opacity="animateOpacity"
          :scale="scale"
          :threshold="threshold"
        >
          <div class="demo-tile">Animate me!</div>
        </AnimatedContent>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Direction" v-model="direction" :options="['vertical', 'horizontal']" />
        <PreviewSelect title="Ease" v-model="ease" :options="easeOptions" />
        <PreviewSlider title="Distance" v-model="distance" :min="50" :max="300" :step="10" value-unit="px" />
        <PreviewSlider title="Duration" v-model="duration" :min="0.1" :max="3" :step="0.1" value-unit="s" />
        <PreviewSlider title="Delay" v-model="delay" :min="0" :max="2" :step="0.1" value-unit="s" />
        <PreviewSlider title="Initial Opacity" v-model="initialOpacity" :min="0" :max="1" :step="0.1" />
        <PreviewSlider title="Scale" v-model="scale" :min="0.1" :max="2" :step="0.1" />
        <PreviewSlider title="Threshold" v-model="threshold" :min="0.1" :max="1" :step="0.1" />
        <PreviewSwitch title="Reverse" v-model="reverse" />
        <PreviewSwitch title="Animate Opacity" v-model="animateOpacity" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="animated-content" :usage="animatedContent.usage!" :source="animatedContentSource" />
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
import { animatedContent } from '@/constants/code/Animations/animatedContentCode';
import AnimatedContent from '@/content/Animations/AnimatedContent/AnimatedContent.vue';
import animatedContentSource from '@/content/Animations/AnimatedContent/AnimatedContent.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  direction: 'vertical' as 'vertical' | 'horizontal',
  distance: 100,
  delay: 0,
  reverse: false,
  duration: 0.8,
  ease: 'power3.out',
  initialOpacity: 0,
  animateOpacity: true,
  scale: 1,
  threshold: 0.1
};

const direction = ref(DEFAULTS.direction);
const distance = ref(DEFAULTS.distance);
const delay = ref(DEFAULTS.delay);
const reverse = ref(DEFAULTS.reverse);
const duration = ref(DEFAULTS.duration);
const ease = ref(DEFAULTS.ease);
const initialOpacity = ref(DEFAULTS.initialOpacity);
const animateOpacity = ref(DEFAULTS.animateOpacity);
const scale = ref(DEFAULTS.scale);
const threshold = ref(DEFAULTS.threshold);

const hasChanges = computed(
  () =>
    direction.value !== DEFAULTS.direction ||
    distance.value !== DEFAULTS.distance ||
    delay.value !== DEFAULTS.delay ||
    reverse.value !== DEFAULTS.reverse ||
    duration.value !== DEFAULTS.duration ||
    ease.value !== DEFAULTS.ease ||
    initialOpacity.value !== DEFAULTS.initialOpacity ||
    animateOpacity.value !== DEFAULTS.animateOpacity ||
    scale.value !== DEFAULTS.scale ||
    threshold.value !== DEFAULTS.threshold
);

function reset() {
  direction.value = DEFAULTS.direction;
  distance.value = DEFAULTS.distance;
  delay.value = DEFAULTS.delay;
  reverse.value = DEFAULTS.reverse;
  duration.value = DEFAULTS.duration;
  ease.value = DEFAULTS.ease;
  initialOpacity.value = DEFAULTS.initialOpacity;
  animateOpacity.value = DEFAULTS.animateOpacity;
  scale.value = DEFAULTS.scale;
  threshold.value = DEFAULTS.threshold;
  forceRerender();
}

const easeOptions = [
  { label: 'power3.out', value: 'power3.out' },
  { label: 'bounce.out', value: 'bounce.out' },
  { label: 'elastic.out', value: 'elastic.out(1, 0.3)' }
];

const props: PropRow[] = [
  {
    name: 'distance',
    type: 'number',
    default: '100',
    description: 'Distance (in pixels) the component moves during animation.'
  },
  { name: 'direction', type: '"vertical" | "horizontal"', default: '"vertical"', description: 'Animation direction.' },
  {
    name: 'reverse',
    type: 'boolean',
    default: 'false',
    description: 'Whether the animation moves in the reverse direction.'
  },
  { name: 'duration', type: 'number', default: '0.8', description: 'Duration of the animation in seconds.' },
  { name: 'ease', type: 'string', default: '"power3.out"', description: 'GSAP easing function for the animation.' },
  { name: 'initialOpacity', type: 'number', default: '0', description: 'Initial opacity before animation begins.' },
  {
    name: 'animateOpacity',
    type: 'boolean',
    default: 'true',
    description: 'Whether to animate opacity during transition.'
  },
  { name: 'scale', type: 'number', default: '1', description: 'Initial scale of the component.' },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Intersection threshold to trigger animation (0–1).'
  },
  { name: 'delay', type: 'number', default: '0', description: 'Delay before animation starts (in seconds).' }
];
</script>

<style scoped>
.demo-tile {
  padding: 1.2em 2em;
  border-radius: 14px;
  border: 1px solid var(--border-primary);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
