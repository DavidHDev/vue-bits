<template>
  <h1 class="sub-category">Scramble Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="scrambleText.usage"
    :source="scrambleTextSource"
    component-name="ScrambleText"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] demo-container">
        <ScrambleText
          :className="'m-[6vw] max-w-[680px] font-mono font-medium text-[clamp(14px,4vw,28px)] text-white'"
          :radius="radius"
          :duration="duration"
          :speed="speed"
          :scrambleChars="scrambleChars"
        >
          Once you hover over me, you will see the effect in action! You can customize the radius, duration, and speed
          of the scramble effect.
        </ScrambleText>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Scramble Characters" v-model="scrambleChars" placeholder="Enter text..." :maxlength="5" />
        <PreviewSlider title="Radius" v-model="radius" :min="10" :max="300" :step="10" />
        <PreviewSlider title="Duration" v-model="duration" :min="0.1" :max="5" :step="0.1" />
        <PreviewSlider title="Speed" v-model="speed" :min="0.1" :max="2" :step="0.1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="scramble-text" :usage="scrambleText.usage!" :source="scrambleTextSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { scrambleText } from '@/constants/code/TextAnimations/scrambleTextCode';
import ScrambleText from '@/content/TextAnimations/ScrambleText/ScrambleText.vue';
import scrambleTextSource from '@/content/TextAnimations/ScrambleText/ScrambleText.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  radius: 100,
  duration: 1.2,
  speed: 0.5,
  scrambleChars: '.:'
};

const radius = ref(DEFAULTS.radius);
const duration = ref(DEFAULTS.duration);
const speed = ref(DEFAULTS.speed);
const scrambleChars = ref(DEFAULTS.scrambleChars);

const hasChanges = computed(
  () =>
    radius.value !== DEFAULTS.radius ||
    duration.value !== DEFAULTS.duration ||
    speed.value !== DEFAULTS.speed ||
    scrambleChars.value !== DEFAULTS.scrambleChars
);

function reset() {
  radius.value = DEFAULTS.radius;
  duration.value = DEFAULTS.duration;
  speed.value = DEFAULTS.speed;
  scrambleChars.value = DEFAULTS.scrambleChars;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'radius',
    type: 'number',
    default: '100',
    description: 'The radius around the mouse pointer within which characters will scramble.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '1.2',
    description: 'The duration of the scramble effect on a character.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'The speed of the scramble animation.'
  },
  {
    name: 'scrambleChars',
    type: 'string',
    default: "'.:'",
    description: 'The characters used for scrambling.'
  },
  {
    name: 'children',
    type: 'slot',
    default: '',
    description: 'The text content to be scrambled.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes for the component.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles for the component.'
  }
];
</script>
