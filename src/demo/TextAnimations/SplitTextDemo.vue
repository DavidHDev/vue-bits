<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px]">
        <RefreshButton @refresh="forceRerender" />

        <SplitText
          :key="rerenderKey"
          text="Hello, Vue!"
          :delay="delay"
          :duration="duration"
          :ease="ease"
          :split-type="splitType"
          :threshold="threshold"
          class="split-text-demo"
          @animation-complete="
            () => {
              showCallback && showToast();
            }
          "
        />
      </div>

      <Customize>
        <PreviewSwitch title="Show Completion Toast" v-model="showCallback" />

        <PreviewSlider title="Stagger Delay (ms)" v-model="delay" :min="10" :max="500" :step="10" />

        <PreviewSlider title="Duration (s)" v-model="duration" :min="0.1" :max="3" :step="0.1" />

        <PreviewSlider title="Threshold" v-model="threshold" :min="0.1" :max="1" :step="0.1" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="splitText" />
    </template>

    <template #cli>
      <CliInstallation :command="splitText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import SplitText from '../../content/TextAnimations/SplitText/SplitText.vue';
import { splitText } from '@/constants/code/TextAnimations/splitTextCode';
import { useToast } from 'primevue/usetoast';
import { useForceRerender } from '@/composables/useForceRerender';

const delay = ref(10);
const duration = ref(3);
const ease = ref('elastic.out(1, 0.3)');
const splitType = ref<'chars' | 'words' | 'lines' | 'words, chars'>('chars');
const threshold = ref(0.1);
const showCallback = ref(true);
const toast = useToast();
const { rerenderKey, forceRerender } = useForceRerender();

const showToast = () => {
  toast.add({
    severity: 'secondary',
    summary: 'Animation Finished!',
    life: 3000
  });
};

const propData = [
  { name: 'text', type: 'string', default: '""', description: 'The text content to animate.' },
  { name: 'className', type: 'string', default: '""', description: 'Additional class names to style the component.' },
  { name: 'delay', type: 'number', default: '100', description: 'Delay between animations for each letter (in ms).' },
  { name: 'duration', type: 'number', default: '0.6', description: 'Duration of each letter animation (in seconds).' },
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
    description: 'Text alignment: "left", "center", "right", etc.'
  },
  {
    name: 'onLetterAnimationComplete',
    type: 'function',
    default: 'undefined',
    description: 'Callback function when all animations complete.'
  }
];

watch(
  () => showCallback.value,
  () => {
    forceRerender();
  }
);
</script>
