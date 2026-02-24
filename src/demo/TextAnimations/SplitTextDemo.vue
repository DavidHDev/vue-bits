<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[400px] demo-container">
        <RefreshButton @refresh="forceRerender" />

        <SplitText
          :key="rerenderKey"
          text="Hello, Vue!"
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

      <Customize>
        <div class="flex flex-wrap gap-4">
          <button
            class="bg-[#0b0b0b] hover:bg-[#222] px-3 border border-[#333] rounded-[10px] h-8 text-white text-xs transition-colors cursor-pointer"
            @click="toggleSplitType"
          >
            Split Type:
            <span class="text-[#a1a1aa]">&nbsp;{{ splitType }}</span>
          </button>

          <button
            class="bg-[#0b0b0b] hover:bg-[#222] px-3 border border-[#333] rounded-[10px] h-8 text-white text-xs transition-colors cursor-pointer"
            @click="toggleEase"
          >
            Ease:
            <span class="text-[#a1a1aa]">&nbsp;{{ ease }}</span>
          </button>
        </div>

        <PreviewSlider title="Stagger Delay (ms)" v-model="delay" :min="10" :max="500" :step="10" />
        <PreviewSlider title="Duration (s)" v-model="duration" :min="0.1" :max="2" :step="0.1" />
        <PreviewSwitch title="Show Completion Toast" v-model="showCallback" />
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
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { splitText } from '@/constants/code/TextAnimations/splitTextCode';
import SplitText from '@/content/TextAnimations/SplitText/SplitText.vue';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();
const toast = useToast();

const delay = ref(50);
const duration = ref(1.25);
const ease = ref<'power3.out' | 'bounce.out' | 'elastic.out(1, 0.3)'>('power3.out');
const splitType = ref<'chars' | 'words' | 'lines'>('chars');
const showCallback = ref(true);

const toggleSplitType = () => {
  splitType.value = splitType.value === 'chars' ? 'words' : splitType.value === 'words' ? 'lines' : 'chars';
  forceRerender();
};

const toggleEase = () => {
  ease.value =
    ease.value === 'power3.out' ? 'bounce.out' : ease.value === 'bounce.out' ? 'elastic.out(1, 0.3)' : 'power3.out';
  forceRerender();
};

const showToast = () => {
  toast.add({
    severity: 'secondary',
    summary: 'Animation Finished!',
    life: 3000
  });
};

const propData = [
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

watch(
  () => showCallback.value,
  () => {
    forceRerender();
  }
);
</script>
