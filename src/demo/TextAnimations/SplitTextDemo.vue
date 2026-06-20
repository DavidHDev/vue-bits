<template>
  <h1 class="sub-category">Split Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="splitText.usage"
    :source="splitTextSource"
    component-name="SplitText"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] demo-container">
        <RefreshButton @click="forceRerender" />
        <SplitText
          :key="rerenderKey"
          :text="DEFAULTS.text"
          :delay="delay"
          :duration="duration"
          :ease="ease"
          :split-type="splitType"
          class-name="split-text-demo"
          @animation-complete="
            () => {
              showCallback && showToast();
            }
          "
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Split Type" v-model="splitType" :options="['chars', 'words', 'lines']" />
        <PreviewSelect title="Ease" v-model="ease" :options="easeOptions" />
        <PreviewSlider title="Stagger Delay (ms)" v-model="delay" :min="10" :max="500" :step="10" />
        <PreviewSlider title="Duration (s)" v-model="duration" :min="0.1" :max="2" :step="0.1" />
        <PreviewSwitch title="Show Completion Toast" v-model="showCallback" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="split-text" :usage="splitText.usage!" :source="splitTextSource" />
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
import { splitText } from '@/constants/code/TextAnimations/splitTextCode';
import SplitText from '@/content/TextAnimations/SplitText/SplitText.vue';
import splitTextSource from '@/content/TextAnimations/SplitText/SplitText.vue?raw';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();
const toast = useToast();

const DEFAULTS = {
  text: 'Hello, you!',
  delay: 50,
  duration: 1.25,
  ease: 'power3.out' as 'power3.out' | 'bounce.out' | 'elastic.out(1, 0.3)',
  splitType: 'chars' as 'chars' | 'words' | 'lines',
  showCallback: true
};

const delay = ref(DEFAULTS.delay);
const duration = ref(DEFAULTS.duration);
const ease = ref(DEFAULTS.ease);
const splitType = ref(DEFAULTS.splitType);
const showCallback = ref(DEFAULTS.showCallback);

const easeOptions = [
  { label: 'power3.out', value: 'power3.out' },
  { label: 'bounce.out', value: 'bounce.out' },
  { label: 'elastic.out', value: 'elastic.out(1, 0.3)' }
];

const showToast = () => {
  toast.add({
    severity: 'secondary',
    summary: '✅ Animation Finished!',
    life: 3000
  });
};

const hasChanges = computed(
  () =>
    delay.value !== DEFAULTS.delay ||
    duration.value !== DEFAULTS.duration ||
    ease.value !== DEFAULTS.ease ||
    splitType.value !== DEFAULTS.splitType ||
    showCallback.value !== DEFAULTS.showCallback
);

function reset() {
  delay.value = DEFAULTS.delay;
  duration.value = DEFAULTS.duration;
  ease.value = DEFAULTS.ease;
  splitType.value = DEFAULTS.splitType;
  showCallback.value = DEFAULTS.showCallback;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'tag',
    type: 'string',
    default: '"p"',
    description: 'HTML tag to render: "h1", "h2", "h3", "h4", "h5", "h6", "p",'
  },
  { name: 'text', type: 'string', default: '""', description: 'The text content to animate.' },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional class names to style the component.'
  },
  {
    name: 'delay',
    type: 'number',
    default: '50',
    description: 'Delay between animations for each letter (in ms).'
  },
  {
    name: 'duration',
    type: 'number',
    default: '1.25',
    description: 'Duration of each letter animation (in seconds).'
  },
  { name: 'ease', type: 'string', default: '"power3.out"', description: 'GSAP easing function for the animation.' },
  {
    name: 'splitType',
    type: 'string',
    default: '"chars"',
    description: 'Split type: "chars", "words", "lines", or "words, chars".'
  },
  {
    name: 'from',
    type: 'object',
    default: '{ opacity: 0, y: 40 }',
    description: 'Initial GSAP properties for each letter/word.'
  },
  {
    name: 'to',
    type: 'object',
    default: '{ opacity: 1, y: 0 }',
    description: 'Target GSAP properties for each letter/word.'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Intersection threshold to trigger the animation (0-1).'
  },
  { name: 'rootMargin', type: 'string', default: '"-100px"', description: 'Root margin for the ScrollTrigger.' },
  {
    name: 'textAlign',
    type: 'string',
    default: '"center"',
    description: "Text alignment: 'left', 'center', 'right', etc."
  },
  {
    name: 'onLetterAnimationComplete',
    type: 'function',
    default: 'undefined',
    description: 'Callback function when all animations complete.'
  }
];
</script>

<style scoped>
.split-text-demo {
  font-size: 5rem;
  font-weight: bolder;
}

@media only screen and (max-width: 967px) {
  .split-text-demo {
    font-size: 2rem;
    font-weight: bolder;
  }
}
</style>
